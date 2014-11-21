<?php

/**
 * @file
 * Default implementations of formframe hooks.
 */

/**
 * Implements hook_formframe_parameters().
 */
function formframe_formframe_parameters() {
  return array(
    'bodyBackgroundColor' => array(
      'type' => 'css_override',
      'filter' => 'formframe_safe_css_color_value',
      'query' => 'bg-body',
      'selector' => 'body',
      'style' => 'background-color',
    ),
    'inputBackgroundColor' => array(
      'type' => 'css_override',
      'filter' => 'formframe_safe_css_color_value',
      'query' => 'bg-input',
      'selector' => 'select,input.form-text,textarea',
      'style' => 'background-color',
    ),
    'inputBorderColor' => array(
      'type' => 'css_override',
      'filter' => 'formframe_safe_css_color_value',
      'query' => 'bc-input',
      'selector' => 'select,input.form-text,textarea',
      'style' => 'border-color',
    ),
    'inputColor' => array(
      'type' => 'css_override',
      'filter' => 'formframe_safe_css_color_value',
      'query' => 'c-input',
      'selector' => 'select,input.form-text,textarea',
      'style' => 'color',
    ),
    'submitBackgroundColor' => array(
      'type' => 'css_override',
      'filter' => 'formframe_safe_css_color_value',
      'query' => 'bg-submit',
      'selector' => 'button,input[type="submit"]',
      'style' => 'background-color',
    ),
    'submitColor' => array(
      'type' => 'css_override',
      'filter' => 'formframe_safe_css_color_value',
      'query' => 'c-cta',
      'selector' => 'button,input[type="submit"]',
      'style' => 'color',
    ),
    'labelColor' => array(
      'type' => 'css_override',
      'filter' => 'formframe_safe_css_color_value',
      'query' => 'c-label',
      'selector' => 'label',
      'style' => 'color',
    ),
    'linkColor' => array(
      'type' => 'css_override',
      'filter' => 'formframe_safe_css_color_value',
      'query' => 'c-link',
      'selector' => 'a',
      'style' => 'color',
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
