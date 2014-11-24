<?php

/**
 * Implements hook_default_formframes().
 */
function formframe_test_defaults_default_formframes() {
  $export = array();

  $frame = new stdClass();
  $frame->disabled = FALSE; /* Edit this to true to make a default frame disabled initially */
  $frame->api_version = 1;
  $frame->path = 'test-login';
  $frame->title = 'Sign in now';
  $frame->form = 'user_login';
  $frame->data = array(
    'target' => '_blank',
    'redirect' => '<front>',
  );

  $export['test-login'] = $frame;

  $frame = new stdClass();
  $frame->disabled = FALSE; /* Edit this to true to make a default frame disabled initially */
  $frame->api_version = 1;
  $frame->path = 'test-register';
  $frame->title = 'Register now';
  $frame->form = 'user_register_form';
  $frame->data = array(
    'target' => '_parent',
    'redirect' => 'user',
  );

  $export['test-register'] = $frame;

  return $export;
}
