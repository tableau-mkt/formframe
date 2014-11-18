<?php

/**
 * @file
 * Admin callbacks and methos for the Form Frame module.
 */

/**
 * Callback for the primary admin form for this module.
 */
function formframe_global_admin($form = array()) {
  $form['formframe_origin_whitelist'] = array(
    '#type' => 'textarea',
    '#title' => t('Origin whitelist'),
    '#description' => t('A newline separated list of origins from which we will allow custom messages.'),
    '#required' => TRUE,
    '#default_value' => variable_get('formframe_origin_whitelist', ''),
  );

  return system_settings_form($form);
}
