<?php

/**
 * @file
 * Plugin definition for Ctools export ui integration.
 */

$plugin = array(
  'schema' => 'formframes',
  'access' => 'administer form frame',
  'handler' => 'formframe_ui',
  'menu' => array(
    'menu item' => 'form-frames',
    'menu title' => 'Form frames',
    'menu description' => 'Administer form frames.',
  ),
  'title singular' => t('form frame'),
  'title plural' => t('form frames'),
  'title singular proper' => t('Form frame'),
  'title plural proper' => t('Form frames'),
);
