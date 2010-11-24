<?php

/**
 * Logout controller
 * 
 */
class Logout extends Controller {
  
  function Logout() {
    parent::Controller();
  }
  
  function index() {
    // only logout, if user is logged in
    if ($this->auth->isLoggedIn()) {
      $this->auth->logout();
    }
    redirect('login');
  }
  
}
