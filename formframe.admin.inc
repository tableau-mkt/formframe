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
    '#description' => t('A list of origins that are allowed to embed forms (e.g. %example), one origin per line. These values are used in an attempt to prevent malicious websites from embedding your forms and also to validate incoming JavaScript messages and events. You must whitelist every intended origin.', array(
      '%example' => $GLOBALS['base_url'],
    )),
    '#required' => TRUE,
    '#default_value' => variable_get('formframe_origin_whitelist', ''),
  );

  return system_settings_form($form);
}
