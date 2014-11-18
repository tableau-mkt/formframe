# Form Frame
Embed your Drupal forms anywhere on the internet.

### Enabling forms for embedding
@todo reasoning and instructions here.

### Embedding forms
@todo instructions for getting embed codes here.

#### Manually embedding
```html
<div class="formframe-container">
  <script src="https://example.com/form/frame/loader.js" async defer></script>
  <noscript><!-- fallback iframe goes here --></noscript>
  <object>
    <param name="formName" value="trial" />
    <param name="bodyBackgroundColor" value="fffff" />
    <param name="inputBackgroundColor" value="transparent" />
    <param name="width" value="378" />
  </object>
</div>
```

### JavaScript API
In some situations, you may wish to relay data between the iframe'd form and the
parent window (or vice versa). Some examples include: triggering actions in the
child iframe from the parent window, displaying text in the parent window from
the child iframe, etc.

If you're using this module, it's likely that you're embedding form frames
across different origins, which makes the aforementioned scenarios relatively
difficult.

In order to work within the confines of cross-origin security limitations, this
module provides a very simple API you can use to communicate between parent and
child frames.

Note: In order to support IE7 or older, you must install JSON2 or an equivalent
polyfill for JSON.

#### Sending data from child (Drupal) to parent
Sending data to the parent window is simple:

```javascript
$(document).framecomm.send({
  type: 'statusMessage',
  message: $('.form-message').val()
});
```

The above code will trigger an event against `document` in the parent window
called `formframe:message`. You'll want to add JavaScript in the parent to bind
to the event and do something useful with the given data. Something like this:

```javascript
$(document).bind('formframe:message', function(e) {
  if (e.detail.type === 'statusMessage') {
    $('.message').val(e.detail.message);
  }
});
```

#### Sending data from parent to child
Sending data to the child iframe is also possible; the frame loading script does
not include jQuery or presume it exists, so a separate method is provided:

```javascript
targetIframe = document.querySelector('.formframe-container iframe');

FF.messenger(targetIframe, {
  type: 'event',
  action: 'submitForm'
});
```

The above code will trigger a similar event in the child iframe. Again, you'll
want to add javaScript in the child to bind to the event and do something useful
with the given data. Something like this:

```javascript
$(document).bind('formframe:message', function(event, data) {
  if (data.type === 'event' && data.action === 'submitForm') {
    $('form').submit();
  }
});
```

For added security, you must explicitly enable which origins are allowed to
communicate with Drupal. You must configure those origins at the form frame
global configurations admin page: `/admin/config/services/form-frame`.

### Drupal API
For full details on the Drupal API, see [formframe.api.php](formframe.api.php).
