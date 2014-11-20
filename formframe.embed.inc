<?php

/**
 * @file
 * Callbacks and functions related to generating form frame embed codes.
 */

/**
 * Primary callback for handling embed code generation.
 */
function formframe_embed_code($form, $form_state) {
  $config = $form_state['build_info']['args'][0];
  $options = formframe_get_forms();
  foreach ($options as $path => &$option) {
    $option = t($option->title) . ' (' . $path . ')';
  }
  $form['param_formName'] = array(
    '#title' => t('Form'),
    '#type' => 'select',
    '#default_value' => $config->path,
    '#options' => $options,
    '#required' => TRUE,
  );

  // Add options here.
  formframe_embed_code_add_parameters($form, $form_state);

  $form['embed_code'] = array(
    '#title' => t('Embed code'),
    '#description' => t('Copy/paste this code on your target site!'),
    '#type' => 'textarea',
    '#rows' => 13,
    '#default_value' => formframe_embed_code_default($config->path),
    '#weight' => 10,
    '#attached' => array(
      'js' => array(
        drupal_get_path('module', 'formframe') . '/js/embed-generator.js',
      ),
    ),
  );

  return $form;
}

/**
 * Reads through custom parameters and adds fields for each.
 * @param $form
 * @param $form_state
 */
function formframe_embed_code_add_parameters(&$form, &$form_state) {
  $params = formframe_parameters();
  foreach ($params as $name => $param) {
    if (isset($param['#form'])) {
      $form['param_' . $name] = $param['#form'];
    }
    else {
      $form['param_' . $name] = array(
        '#type' => 'textfield',
        '#title' => $name,
      );
    }
  }
}

/**
 * Returns the default form frame embed code
 * @param $name
 * @return string
 */
function formframe_embed_code_default($name) {
  $script_url = $GLOBALS['base_url'] . base_path() . 'form/frame/loader.js';
  $noscript_src = $GLOBALS['base_url'] . base_path() . 'form/frame/' . $name;
  return <<<CODE
<div class="formframe-container">
  <object>
    <param name="formName" value="$name" />
  </object>
  <noscript><iframe src="$noscript_src"></iframe></noscript>
  <script src="$script_url" async defer></script>
</div>
CODE;
}
