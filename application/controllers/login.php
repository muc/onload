<?php

/**
 * Login controller
 * 
 * @author Marc Hitscherich
 */
class Login extends Controller {
  
  function Login() {
    parent::Controller();
  }
  
  function index() {
    // if user is already logged in, redirect to start page.
    if ($this->auth->isLoggedIn()) {
      redirect('/');
    }
    $data = array(
      'title' => 'ON.load | Login'
    );
    $this->load->view('login', $data);
  }
  
}
