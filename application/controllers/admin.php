<?php

class Admin extends Controller {
  
  function Admin() {
    parent::Controller();
    if (!$this->auth->isLoggedIn()) {
      redirect('login');
    }
    if (!$this->auth->isAdmin()) {
      redirect('/');
    }
    
    $this->load->library('response');
  }
  
  function index() {
    $this->load->view('admin');
  }
}
