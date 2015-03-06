var FF = window.FF || {};

(function(window, document) {
  var _FF = {};

  /**
   * Loops through all form frame containers, reads the settings associated with
   * the expected frame embed, creates the iframe, and appends it to the form
   * frame container.
   */
  FF.loader = function() {
    var forms = document.querySelectorAll('.formframe-container'),
        i,
        formAttributes,
        iframe;

    // Iterate through all forms on this page.
    for (i = 0; i < forms.length; i++) {
      formAttributes = FF.getSettings(forms[i]);
      iframe = document.createElement('iframe');
      iframe.src = FF.constructUrl(formAttributes);
      iframe.scrolling = 'no';
      iframe.frameBorder = '0';
      iframe.id = formAttributes['__ffid'];
      if (formAttributes.width) {
        iframe.width = formAttributes.width;
      }

      forms[i].appendChild(iframe);
    }
  };

  /**
   * Event listener. Listens for postmessage events that were specifically
   * triggered by formframe from this script's origin.
   *
   * Specifically handles the case of height data being passed, but passes along
   * all events and associated data via the formframe:message event triggered
   * against the document.
   *
   * @param event
   *   The postmessage event.
   */
  FF.listener = function(event) {
    var data = event[event.message ? 'message' : 'data'];

    // Only respond to events from our origin.
    if (FF.settings.baseUrl.substring(0, event.origin.length) === event.origin) {
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      if (data.triggeredBy && data.triggeredBy === 'formframe') {
        // Automatically apply the iframe's inner-height to the iframe.
        if (data.height) {
          document.getElementById(data['__ffid']).height = data.height;
        }

        // Trigger an event that anyone can listen to.
        _FF.triggerEvent(data);
      }
    }
  };

  /**
   * Triggers a postmessage event with the given payload against the given
   * iframe DOM object. Ensures that the target frame knows that formframe was
   * the trigger and that the message is only sent to our origin.
   * @param iframe
   *   The target iframe DOM element.
   *
   * @param payload
   *   An object containing arbitrary data to be sent to the iframe.
   */
  FF.messenger = function(iframe, payload) {
    payload.triggeredBy = 'formframe';
    iframe.contentWindow.postMessage(JSON.stringify(payload), FF.settings.baseUrl);
  };

  /**
   * Given a form frame container element, reads through all underlying params
   * and returns the specific settings.
   *
   * @param container
   *   A DOM element containing the <object> and associated <param> elements for
   *   a given form frame.
   *
   * @return
   *   An object representing the settings for a given form frame.
   */
  FF.getSettings = function(container) {
    var settings = FF.drupalDynamicSettings || {},
        returnSettings = {},
        setting,
        param;

    // Custom, hard-coded params we take care of internally.
    settings.width = 'width';
    settings.formName = 'formName';

    for (setting in settings)  {
      if (param = container.querySelector('param[name="' + setting + '"]')) {
        returnSettings[settings[setting]] = param.value || null;
      }
    }

    returnSettings['__ffid'] = 'ffid' + Math.random().toString().replace("0.", "");
    return returnSettings;
  };

  /**
   * Given a form frame settings object, generates the expected iframe URL,
   * including all query parameters, language negotiation, etc.
   *
   * @param formSettings
   *   The form frame configuration object, as returned by FF.getSettings(), for
   *   example.
   *
   * @return
   *   A string representing the iframe URL.
   */
  FF.constructUrl = function(formSettings) {
    var formName = formSettings.formName,
        queryString = '?',
        param;

    for (param in formSettings) {
      if (param !== 'width' && param !== 'formName' && formSettings[param] !== null) {
        queryString += param + '=' + encodeURI(formSettings[param]) + '&';
      }
    }

    return FF.settings.baseUrl + 'form/frame/' + formName + queryString.substr(0, queryString.length - 1);
  };

  /**
   * Initializes the Form Frame loader.
   */
  FF.initialize = function() {
    FF.settings = FF.settings || {};

    if (!FF.settings.initialized) {
      // Initialize the base URL for this script.
      _FF.initBaseUrl();

      // Initialize the event handler for this browser.
      _FF.initEventHandler();

      // Attach a listener for this frame with its attributes.
      window[FF.settings.handler](FF.settings.handleMessage, FF.listener, false);

      // Trigger loader.
      FF.loader();

      FF.settings.initialized = true;
    }
  };

  /**
   * Determines and sets the baseUrl for this script; used to validate that
   * cross-origin messages are done so securely.
   */
  _FF.initBaseUrl = function() {
    var scripts = document.getElementsByTagName('script'),
        scriptName = "loader.js",
        scriptBase = "/form/frame/",
        prefix = FF.drupalDynamicPrefix || '/',
        src,
        l,
        length,
        index;

    for (index = scripts.length - 1; index >= 0; --index) {
      src = scripts[index].src;
      l = src.length;
      length = scriptName.length;
      if (src.substr(l - length) === scriptName) {
        FF.settings.baseUrl = src.substr(0, l - length).replace(scriptBase, "") + prefix;
        break;
      }
    }
  };

  /**
   * Determines which event handlers and events to use for this browser.
   */
  _FF.initEventHandler = function() {
    FF.settings.handler = window.addEventListener ? 'addEventListener' : 'attachEvent';
    FF.settings.handleMessage = window.addEventListener ? 'message' : 'onmessage';
  };

  /**
   * Triggers a "formframe:message" event against the document with the provided
   * data.
   *
   * @param data
   *   The data associated with the postmessage event.
   */
  _FF.triggerEvent = function(data) {
    var eventName = 'formframe:message',
        event = new CustomEvent(eventName, {detail: data});

    if (document.createEvent) {
      document.dispatchEvent(event);
    }
    else {
      document.fireEvent("on" + eventName, event);
    }
  };

})(window, document);

/**
 * CustomEvent polyfill for old versions of IE.
 */
try{new CustomEvent('?')}catch(o_O){
  /*!(C) Andrea Giammarchi -- WTFPL License*/
  this.CustomEvent = function(
    eventName,
    defaultInitDict
    ){

    // the infamous substitute
    function CustomEvent(type, eventInitDict) {
      var event = document.createEvent(eventName);
      if (type != null) {
        initCustomEvent.call(
          event,
          type,
          (eventInitDict || (
            // if falsy we can just use defaults
            eventInitDict = defaultInitDict
          )).bubbles,
          eventInitDict.cancelable,
          eventInitDict.detail
        );
      } else {
        // no need to put the expando property otherwise
        // since an event cannot be initialized twice
        // previous case is the most common one anyway
        // but if we end up here ... there it goes
        event.initCustomEvent = initCustomEvent;
      }
      return event;
    }

    // borrowed or attached at runtime
    function initCustomEvent(
      type, bubbles, cancelable, detail
      ) {
      this['init' + eventName](type, bubbles, cancelable, detail);
      'detail' in this || (this.detail = detail);
    }

    // that's it
    return CustomEvent;
  }(
    // is this IE9 or IE10 ?
    // where CustomEvent is there
    // but not usable as construtor ?
    this.CustomEvent ?
      // use the CustomEvent interface in such case
      'CustomEvent' : 'Event',
    // otherwise the common compatible one
    {
      bubbles: false,
      cancelable: false,
      detail: null
    }
  );
}

/**
 * Main.
 */
(function() {
  // Attach and go!
  FF.initialize();
})();
