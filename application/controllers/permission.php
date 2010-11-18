<?php

class Permission extends Controller {
  
  function Permission() {
    parent::Controller();
  }
  
  function index() {
    redirect('/');
  }
  
  function permtype() {
    $pt = Doctrine_Core::getTable('PermissionType')->findAll();
    echo json_encode(array(
      'success' => true,
      'data' => $pt->toArray()
    ));
  }
  
  function fusers() {
    echo json_encode(array('success' => true));
  }
}
