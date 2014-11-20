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
 * Returns an array of form frame configuration parameters, keyed by their
 * associated object parameter name (visible in the embed code) and whose
 * definition is described below. Note that this module already provides
 * some basic parameters for CSS overrides.
 *
 * Generally, this hook is useful for creating user-configurable properties
 * associated with your forms. The form loader will search for these parameters
 * in the form embed configuration and pass them back in the iframe as query
 * parameters.
 *
 * It's your responsibility to hook into those query parameters and provide the
 * custom functionality you desire based on them.
 *
 * See formframe.formframe.inc for a basic example.
 *
 * @return array
 *   Returns an associative array of form frame parameter definitions (described
 *   below), keyed by the parameter name associated with the config. Parameter
 *   configurations are arrays with the following keys:
 *   - type: (Required) A string representing theT "type" of parameter this
 *     configuration represents. This module provides one type out of the box:
 *     "css_override," but you can declare as many as you need. You can load
 *     parameter values using the formframe_parameter_values() function.
 *   - query: (Optional) The name of the query parameter to use when a form
 *     frame parameter is passed back via the iframe URL. If none is provided,
 *     the name of the parameter (the array key) will be used.
 *   - filter: (Optional) A custom function to filter query parameter values. If
 *     no filter is provided, this defaults to check_plain() for security
 *     reasons. You may wish to provide custom filtering, however.
 *     The filter function should take a single string argument (the unfiltered
 *     query parameter value) and return the filtered value of the string (or
 *     empty on error).
 *   - #form: (Optional) A form API element array. When provided, this is used
 *     in place of the default form element displayed on the form frame embed
 *     code generator page. Useful for adding, for example, select options or
 *     more custom behavior.
 */
function hook_formframe_parameters() {
  $parameters = array();

  // A basic custom parameter definition:
  // In a form alter (or one of the form frame hooks below), you could load the
  // values for attributes of this type with formframe_parameter_values('my_type');
  $parameters['myCustomAttribute'] = array(
    'type' => 'my_type',
    'query' => 'mca',
  );

  // Allow the font-family to be overridden. This would make something like this
  // possible: http://example.com/form/frame/my-form?font=Helvetica
  // Via a form frame embed param like this:
  // <param name="frameFont" value="Helvetica" />
  $parameters['frameFont'] = array(
    'type' => 'css_override',
    'query' => 'font',
    'filter' => 'my_module_filter_down_to_just_some_fonts',
    // These are specific to the way css_override type parameters work.
    'selector' => '*',
    'style' => 'font-family',
    // Provide a custom form to simplify the form frame embed code page.
    '#form' => array(
      '#type' => 'select',
      '#title' => t('Font override'),
      '#description' => t('Some description text for site admins'),
      '#options' => array(
        '' => ' --- ',
        'Helvetica' => t('Helvetica'),
        'Arial' => t('Arial'),
        'sans-serif' => t('Sans-serif'),
      ),
    ),
  );

  return $parameters;
}

/**
 * Alter form frame parameter configurations before they're used throughout the
 * form frame system.
 *
 * @param array $parameters
 *   An associative array of form frame parameter configurations keyed by their
 *   respective names; basically the result of invoking all implementations of
 *   hook_formframe_parameters().
 */
function hook_formframe_parameters_alter(&$parameters) {
  // Use vanity query param names.
  $parameters['inputBackgroundColor']['query'] = 'bg';
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
