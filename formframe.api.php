<?php

/**
 * @file
 * This file contains no working PHP code; it exists to provide additional
 * documentation for doxygen as well as to document hooks in the standard
 * Drupal manner.
 */


/**
 * @defgroup formframe Form Frame module integrations.
 *
 * Module integrations with the Form Frame module.
 */

/**
 * @defgroup formframe_hooks Form Frame's hooks
 * @{
 * Hooks that can be implemented by other modules in order to extend the Form
 * Frame module. Note that any and all such hooks can be placed in a file at
 * your module's root of the form MODULE.formframe.inc.
 */

/**
 * Returns an array of CSS override configurations keyed by their associated
 * query parameters, as described below. Note that this module already provides
 * some basic CSS overrides. See formframe.formframe.inc for details.
 *
 * @return array
 *   Returns an associative array of CSS override configurations (described
 *   below), keyed by the query parameter name associated with the config. CSS
 *   override configurations are arrays with the following keys:
 *   - selector: The CSS selector that the override targets (e.g. "#some-id").
 *   - style: The CSS style that the query parameter value will override (for
 *     example, "background-color" to alter background color.
 *   - filter: (Optional) A custom function to filter query parameter values. If
 *     no filter is provided, this defaults to check_plain() for security
 *     reasons. You may wish to provide custom filtering, however.
 *     The filter function should take a single string argument (the unfiltered
 *     query parameter value) and return the filtered value of the string (or
 *     empty on error).
 */
function hook_formframe_query_params() {
  $overrides = array();

  // Allow the font-family to be overridden. This would make something like this
  // possible: http://example.com/form/frame/my-form?font=Helvetica
  $overrides['font'] = array(
    'selector' => '*',
    'style' => 'font-family',
    'my_module_filter_down_to_just_some_fonts',
  );

  return $overrides;
}

/**
 * Alter form details prior to the form being handed off to the form builder.
 *
 * This hook can be useful for adding additional build information or other
 * details to the form state prior to the form being built.
 *
 * @param string $form_id
 *   The ID of the form about to be built.
 *
 * @param array $form_state
 *   The form state array just prior to the form being built. Note that the
 *   form state build_info details will include the configuration for the form
 *   frame at $form_state['build_info']['formframe'].
 */
function hook_formframe_prebuild_alter($form_id, &$form_state) {
  // Add custom build info args.
  $form_state['build_info']['args'][] = 'my_custom_info';
}

/**
 * Alter form details after the form has been built (and all form alters have
 * fired), but before the form is rendered.
 *
 * This hook can be useful for making final alterations to the form after all
 * other form API hooks have fired during the form build process.
 *
 * @param array $form
 *   The fully built form render array after having been through all hooks.
 */
function hook_formframe_prerender_alter(&$form) {
  // Guarantee that the form action is as you wish.
  $form['#action'] = 'my/custom/form/action/location';
}

/**
 * @}
 */
