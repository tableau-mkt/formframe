(function($) {
  $(document).ready(function bindEmbedGeneratorListeners() {
    var $embed = $('textarea[name="embed_code"]');

    $('[name^="param_"]').bind('change blur keyup', function onParamValueChange() {
      var $this = $(this),
          embedText = $embed.val(),
          paramName = $this.attr('name').replace('param_', ''),
          paramValue = $this.val(),
          paramStrPos = embedText.indexOf('<param name="' + paramName + '"'),
          paramAlreadyWritten = paramStrPos > -1,
          objClosePos = embedText.indexOf('</object>'),
          paramClosePos,
          paramFull,
          newParam;

      // Don't proceed if nothing's been typed and the param isn't yet written.
      if (!paramValue && !paramAlreadyWritten) {
        return false;
      }
      else {
        // If the parameter already exists, just update it.
        if (paramAlreadyWritten) {
          paramClosePos = embedText.indexOf(' />', paramStrPos);
          paramFull = embedText.substring(paramStrPos, paramClosePos + 3);

          // If the value has been erased, remove the parameter altogether.
          if (!paramValue) {
            $embed.val(embedText.replace("\n    " + paramFull, ''));
          }
          // Otherwise, update the value.
          else {
            newParam = '<param name="' + paramName + '" value="' + paramValue + '" />';
            $embed.val(embedText.replace(paramFull, newParam));
          }
        }
        // If the parameter hasn't been created yet, create it.
        else {
          newParam = '  <param name="' + paramName + '" value="' + paramValue + '" />' + "\n  ";
          $embed.val([embedText.slice(0, objClosePos), newParam, embedText.slice(objClosePos)].join(''));
        }
      }
    });
  });
})(jQuery);
