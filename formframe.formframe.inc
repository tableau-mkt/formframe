<?php

/**
 * @file
 * Default implementations of formframe hooks.
 */

/**
 * Implements hook_formframe_query_params().
 */
function formframe_formframe_query_params() {
  return array(
    'bg-body' => array(
      'selector' => 'body',
      'style' => 'background-color',
      'filter' => 'formframe_safe_css_color_value'
    ),
    'bg-input' => array(
      'selector' => 'select,input.form-text,textarea',
      'style' => 'background-color',
      'filter' => 'formframe_safe_css_color_value'
    ),
    'bg-submit' => array(
      'selector' => 'button,input[type="submit"]',
      'style' => 'background-color',
      'filter' => 'formframe_safe_css_color_value'
    ),
    'c-cta' => array(
      'selector' => 'button,input[type="submit"]',
      'style' => 'color',
      'filter' => 'formframe_safe_css_color_value'
    ),
    'c-link' => array(
      'selector' => 'a',
      'style' => 'color',
      'filter' => 'formframe_safe_css_color_value'
    ),
  );
}

/**
 * Given an unstanitized string, validates and returns a sanitized string
 * representing a CSS color value.
 *
 * @param string $value
 *   The unsanitized string value to be validated and sanitized.
 *
 * @return string
 *   The sanitized CSS color value (or an empty string on failure).
 */
function formframe_safe_css_color_value($value) {
  $value = strtolower(trim($value));
  if (ctype_xdigit($value)) {
    return '#' . $value;
  }
  elseif ($value === 'transparent') {
    return 'transparent';
  }
  else {
    return '';
  }
}
