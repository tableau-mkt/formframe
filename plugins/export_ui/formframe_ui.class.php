<?php

/**
 * @file
 * Contains the form frame UI class.
 */

class formframe_ui extends ctools_export_ui {

  /**
   * @param $plugin
   */
  public function init($plugin) {
    // Add "embed" capabilities. Normally should be taken care of higher up in
    // the ctools chain, but this is UI-only functionality anyway, so OK here.
    $plugin['allowed operations']['embed'] = array(
      'title' => t('Embed'),
    );
    $plugin['menu']['items']['embed'] = array(
      'path' => 'list/%ctools_export_ui/embed',
      'title' => t('Embed'),
      'page callback' => 'ctools_export_ui_switcher_page',
      'page arguments' => array(
        'formframes_ctools_export_ui',
        'embed',
      ),
      'access callback' => 'ctools_export_ui_task_access',
      'access arguments' => array(
        'formframes_ctools_export_ui',
        'embed',
      ),
      'type' => MENU_LOCAL_TASK,
    );
    parent::init($plugin);
  }

  /**
   * {@inheritdoc}
   *
   * Here we add menu items for form frame embed pages.
   */
  public function hook_menu(&$items) {
    parent::hook_menu($items);
    $items['admin/structure/form-frames/list/%ctools_export_ui/embed'] = array(
      'title' => 'Embed',
      'type' => MENU_LOCAL_TASK,
      'page callback' => 'ctools_export_ui_switcher_page',
      'page arguments' => array(
        'formframes_ctools_export_ui',
        'embed',
        4,
      ),
      'access callback' => 'ctools_export_ui_task_access',
      'access arguments' => array(
        'formframes_ctools_export_ui',
        'embed',
        4,
      ),
      'file' => 'export-ui.inc',
      'file path' => drupal_get_path('module', 'ctools') . '/includes',
    );
  }

  /**
   * {@inheritdoc}
   *
   * Provides custom access checking based on our permission for "embed" ops.
   */
  public function access($op, $item) {
    if ($op === 'embed') {
      return user_access('generate form frame codes');
    }
    else {
      return parent::access($op, $item);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function edit_form(&$form, &$form_state) {
    parent::edit_form($form, $form_state);
    $preset = $form_state['item'];

    // Create a vertical tab set.
    $form['tabs'] = array('#type' => 'vertical_tabs');

    // Modify the "info" key to be a fieldset.
    $form['info']['#title'] = t('Form frame details');
    $form['info']['#type'] = 'fieldset';
    $form['info']['#group'] = 'tabs';

    // Provide a fieldset to contain all "data" customization attributes.
    $form['data'] = array(
      '#type' => 'fieldset',
      '#title' => t('Customizations'),
      '#collapsible' => TRUE,
      '#collapsed' => FALSE,
      '#group' => 'tabs',
      '#tree' => TRUE,
    );

    // Borrow the machine name form element type to make things a bit friendlier.
    $form['info']['path']['#type'] = 'machine_name';
    $form['info']['path']['#maxlength'] = 50;
    $form['info']['path']['#size'] = 50;
    $form['info']['path']['#description'] = t('The unique URL path part for this collection. Once saved, this cannot be changed.');
    $form['info']['path']['#machine_name'] = array(
      'source' => array('info', 'title'),
      'exists' => 'node_type_load',
      'label' => '<strong>' . t('Form Frame URL') . '</strong>',
      'field_prefix' => $GLOBALS['base_url'] . base_path() . 'form/frame/',
      'replace_pattern' => '[^a-z0-9_-]+',
      'replace' => '-',
    );
    $form['info']['path']['#id'] = 'edit-path';

    // Form frame title (also the initial source of the form frame path part/name.
    $form['info']['title'] = array(
      '#type' => 'textfield',
      '#title' => t('Frame title'),
      '#description' => t('The title for this form frame, displayed in the title bar to end-users.'),
      '#default_value' => $preset->title,
      '#required' => TRUE,
      '#id' => 'edit-title',
      '#weight' => -1,
    );

    // Form frame drupal form (used by drupal_get_form).
    $form['info']['form'] = array(
      '#type' => 'textfield',
      '#title' => t('Drupal form'),
      '#description' => t('The name of the Drupal form that this form frame will render. This value will be passed to drupal_get_form (e.g. %form_example for user registration).', array(
        '%form_example' => 'user_register_form',
      )),
      '#default_value' => $preset->form,
      '#required' => TRUE,
      '#maxlength' => 128,
    );

    // Module.
    $form['data']['target'] = array(
      '#type' => 'textfield',
      '#title' => t('Form element target attribute'),
      '#description' => t('The value of the target attribute on the iframe form (e.g. %blank, %parent, etc).', array(
        '%blank' => '_blank',
        '%parent' => '_parent',
      )),
      '#default_value' => isset($preset->data['target']) ? $preset->data['target'] : '',
    );

    // Query terms.
    $form['data']['redirect'] = array(
      '#type' => 'textfield',
      '#title' => t('Form redirect location'),
      '#description' => t('An internal Drupal path or external URL to redirect to after successful form submission.'),
      '#default_value' => isset($preset->data['redirect']) ? $preset->data['redirect'] : '',
    );
  }

  /**
   * {@inheritdoc}
   *
   * Here, we update the column header for "name" to read "Path part."
   */
  public function list_table_header() {
    $header = parent::list_table_header();
    $header[1]['data'] = t('Path part');
    return $header;
  }


  /**
   * Returns a page representing the default embed page for a given form frame
   * configuration.
   * @return string
   */
  public function embed_page($js, $input, $config) {
    require_once(drupal_get_path('module', 'formframe') . '/formframe.embed.inc');
    return drupal_get_form('formframe_embed_code', $config);
  }

}
