<?php

/**
 * Home controller
 * The main page
 * 
 * @author Marc Hitscherich
 */
class Home extends Controller {
  
  function Home() {
    parent::Controller();
    //always check if user is logged in.
    if (!$this->auth->isLoggedIn()) {
      redirect('login');
    }
  }
  
  function index() {
    $data = array(
      'title' => 'ON.load',
      'user' => $this->auth->currentUser()
    );
    $this->load->view('home', $data);
  }

}
