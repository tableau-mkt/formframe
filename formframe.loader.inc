<?php

/**
 * @file
 * Form frame JavaScript loader callback and associated functions.
 */

/**
 * Primary page callback for serving the form frame JavaScript loader.
 */
function formframe_js_loader() {
  // Load the appropriate, raw JS file.
  $path = drupal_get_path('module', 'formframe');
  $file = variable_get('formframe_loader_unminified', FALSE) ? 'loader.js' : 'loader.min.js';
  $contents = file_get_contents($path . '/js/' . $file);

  // Load and format parameters as appropriate; replace drupalDynamicSettings.
  $parameters = formframe_parameters();
  foreach ($parameters as $name => &$parameter) {
    $query = isset($parameter['query']) ? $parameter['query'] : $name;
    $parameter = $query;
  }
  $parameters = drupal_json_encode($parameters);
  $contents = str_replace('FF.drupalDynamicSettings', $parameters, $contents);

  // Calculate and format the base path; replace drupalDynamicPrefix.
  $base_path = base_path();
  if ($GLOBALS['language']->prefix) {
    $base_path .= $GLOBALS['language']->prefix . '/';
  }
  $contents = str_replace('FF.drupalDynamicPrefix', '"' . $base_path . '"', $contents);

  // Print the JavaScript with the appropriate header and exit.
  drupal_add_http_header('Content-type', 'application/javascript');
  print $contents;
  drupal_exit();
}
