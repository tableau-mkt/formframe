<?php

/**
 * @file
 * Default theme implementation for displaying a form within an iframe.
 *
 * This template renders a form within a bare-bones HTML skeleton. Think of it
 * as an html.tpl.php file, but where the content is just a form.
 *
 * @see template_preprocess_formframe()
 * @see formframe.tpl.php
 */
//dsm($variables);
?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML+RDFa 1.0//EN"
"http://www.w3.org/MarkUp/DTD/xhtml-rdfa-1.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php print $language->language; ?>" version="XHTML+RDFa 1.0" dir="<?php print $language->dir; ?>"<?php print $rdf_namespaces; ?>>
<head profile="<?php print $grddl_profile; ?>">
  <?php print $head; ?>
  <title><?php print $head_title; ?></title>
  <?php print $styles; ?>
  <?php print $scripts; ?>
</head>
<body class="<?php print $classes; ?>" <?php print $attributes;?>>
<?php print $form; ?>
</body>
</html>
