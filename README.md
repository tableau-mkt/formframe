# Form Frame [![Build Status](https://travis-ci.org/tableau-mkt/formframe.svg?branch=7.x-1.x)](https://travis-ci.org/tableau-mkt/formframe) [![Test Coverage](https://codeclimate.com/github/tableau-mkt/formframe/badges/coverage.svg)](https://codeclimate.com/github/tableau-mkt/formframe) [![Code Climate](https://codeclimate.com/github/tableau-mkt/formframe/badges/gpa.svg)](https://codeclimate.com/github/tableau-mkt/formframe)
Embed your Drupal forms anywhere on the internet.

## Features
- Wire up any Drupal form as an embeddable iframe for use on any other website,
- Configure where the form directs users upon submission,
- Robust developer API to customize the form, frame, and the way it interacts
  with its parent window (and vice versa),
- Designed with security in mind: explicitly whitelist the origins that may
  embed form frames from your site.


## Usage (for site builders)

### Enabling forms for embedding
Form Frame does not expose any forms for embedding by default. To do so, you'll
need to log in to the main configuration page located at the path
`admin/structure/form-frames`, where you can add and configure new frames.

![screen_shot_2014-11-29_at_9 55 06_pm](https://cloud.githubusercontent.com/assets/3496491/5236758/bc264670-7812-11e4-8b2e-7b6cc60ef1c3.png)

Each frame you create consists of the following:
- A path part (all frames are available at a path like `form/frame/your-frame`)
- A title (displayed in the frame's `<title>`, but also for your convenience)
- The ID of the Drupal form you'll be framing (e.g. `user_register_form`)
- And optionally:
  - A target attribute (so form submissions target the `_parent` frame, or a
    `_blank` window.
  - A redirect location (in the event you wish to redirect to a specific thank
    you page or elsewhere)

This setup allows you to configure many different forms at many different URLs,
or conversely, set up many variations of a single form that serve different
purposes.

Additionally, the frame configurations you create are fully exportable, meaning
you can add them to your [Features](https://drupal.org/project/features) and
deploy them like you deploy other configurations on your site.

### Embedding forms
Once you've created a frame, you can generate its embed code by visiting the
"embed" tab for the frame.

![screen_shot_2014-11-29_at_9 58 54_pm](https://cloud.githubusercontent.com/assets/3496491/5236761/fadb9960-7812-11e4-91da-124814e2980f.png)

In addition to the configurations you specified for the frame itself, you can
also customize the form for the specific context in which it will be embedded
through a concept called "parameters."

Out of the box, this module provides a number of parameters that allow you to
override styles for common form components (like input background color, submit
button color, etc). On the embed tab, you can specify these parameter overrides,
which will dynamically alter the embed code.

Once you've made any necessary configuration changes, you can copy the given
embed code and paste it into your target site's markup.

![screen_shot_2014-11-29_at_10 02 27_pm](https://cloud.githubusercontent.com/assets/3496491/5236767/805f5324-7813-11e4-9073-6dba74a78f0e.png)

#### Manually embedding
If all of the relevant details for embedding the form are already known, you can
also manually write out the embed script using the following markup as a guide:

```html
<div class="formframe-container">
  <script src="https://example.com/form/frame/loader.js" async defer></script>
  <noscript><!-- fallback iframe goes here --></noscript>
  <object>
    <param name="formName" value="your-frame" />
    <param name="bodyBackgroundColor" value="fffff" />
    <param name="inputBackgroundColor" value="transparent" />
    <param name="width" value="378" />
  </object>
</div>
```


## Usage (for themers)
This module will render each form exactly as it would normally be rendered in
your site's default theme (including all the usual CSS and JS assets), except on
a page with none of the standard regions provided by Drupal. Below are some tips
on how best to alter the look or feel of a form in a frame.

#### Altering the template
The form frame is rendered using a custom `formframe.tpl.php`, the default of
which is provided in the theme folder of this module. Copy this file to your
theme and modify the template as desired.

#### Adding formframe specific CSS or JS
There are many ways to add customized CSS or JS assets to form frames. The
recommended way is to add those files via Drupal `#attached` render array keys
on the form itself. Otherwise, calls to `drupal_add_css()` or `drupal_add_js()`
in the formframe preprocessor or otherwise should behave as expected.

#### Adding content above or below the form
You may wish to add content above or below the form; though it's possible to do
so by overriding the default template, it's recommended to do so by adding the
desired content to the form's `#prefix` and/or `#suffix` render array keys.


## Usage (for developers)

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
want to add JavaScript in the child to bind to the event and do something useful
with the given data. Something like this:

```javascript
$(document).bind('formframe:message', function(event, data) {
  if (data.type === 'event' && data.action === 'submitForm') {
    $('form').submit();
  }
});
```

For added security, __you must explicitly enable which origins are allowed to
communicate with Drupal__. You must configure those origins at the form frame
global configurations admin page: `/admin/config/services/form-frame`.

### Drupal API
This module also provides a Drupal API. Common use-cases of this API include:
- Providing custom "parameters" beyond the CSS overrides provided by this
module (including parameters that are completely unrelated to style),
- Attaching custom JavaScript that, using the API above, performs custom actions
  based on messages from the parent window,
- Altering forms specifically in the context of the form frame.

For full details on the Drupal API, see [formframe.api.php](formframe.api.php).
