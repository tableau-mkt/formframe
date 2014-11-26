(function($, window) {
  var settings = {};

  $.fn.framecomm = function(options) {
    // Initialize settings.
    settings = $.extend({}, $.fn.framecomm.defaults, options);

    // Add the listener to handle inbound communications.
    window[settings.listener](settings.event, $.fn.framecomm.receive, false);

    return this;
  };

  $.fn.framecomm.defaults = {
    frameUniqueId: '__ffid',
    triggeredBy: 'formframe',
    targetFrame: window.parent,
    contextual: $.deparam.querystring(),
    listener: window.addEventListener ? 'addEventListener' : 'attachEvent',
    event: window.addEventListener ? 'message' : 'onmessage',
    whitelist: []
  };

  /**
   * Sends a packet of data to the parent frame.
   * @param data
   */
  $.fn.framecomm.send = function(payload) {
    var required = {
          triggeredBy: settings.triggeredBy
        },
        sendData;

    // Provide a unique frameID value
    required[settings.frameUniqueId] = settings.contextual[settings.frameUniqueId] || "";

    // Merge in the payload with required values.
    sendData = $.extend(required, payload);

    // Send the message.
    settings.targetFrame.postMessage(JSON.stringify(sendData), '*');
  };

  $.fn.framecomm.receive = function(event) {
    var data = event[event.message ? 'message' : 'data'];

    // Only respond to whitelisted origins.
    if (settings.whitelist.indexOf(event.origin) !== -1) {
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }

      // Only trigger the event if we're sure the event is targeted at us.
      if (data.triggeredBy && data.triggeredBy === settings.triggeredBy) {
        $(document).trigger('formframe:message', data);
      }
    }
  };

}(jQuery, window));
