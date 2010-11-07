<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Authentication library
 * 
 * @author: Marc Hitscherich
 */
class Auth {
    
  protected $ci;
  
  public function __construct() {
    $this->ci =& get_instance();
  }
  
  /**
   * Tries to login the given user.
   * @param string $username
   * @param string $password
   * @return boolean if login was successfull
   */
  function login($username, $password) {
    if ($user = Doctrine_Core::getTable('User')->findOneByUsername($username)) {
      $checkUser = new User();
      $checkUser->password = $password;
      if ($user->password == $checkUser->password) {
        $this->_setSession($user);
        unset($checkUser);
        return TRUE;
      }
      unset($checkUser);
    }
    return FALSE;
  }
  
  /**
   * logout current user
   */
  function logout() {
    $this->ci->session->sess_destroy();
  }
  
  /**
   * Get the logged in user.
   * @return mixed    User object or FALSE if no result.
   */
  function currentUser() {
    if ($this->isLoggedIn()) {
      return Doctrine_Core::getTable('User')->find($this->getUserId());
    }
    return FALSE;
  }
  
  /**
   * Get the logged_in state from session
   * @return boolean
   */
  function isLoggedIn() {
    return $this->ci->session->userdata('auth_logged_in');
  }
  
  /**
   * Get user id from session
   * @return mixed    user id as int, or FALSE if no result.
   */
  function getUserId() {
    return $this->ci->session->userdata('auth_id');
  }
  
  /**
   * Get user name from session
   * @return mixed    username as strin, or FALSE if no result.
   */
  function getUserName() {
    return $this->ci->session->userdata('auth_username');
  }
  
  /**
   * Checks, if current logged in user is admin.
   * @return boolean
   */
  function isAdmin() {
    if ($user = $this->currentUser()) {
      return $user->admin;
    }
    return FALSE;
  }
  
  /**
   * Private function to set the seesion variable
   * @param User class
   */
  function _setSession($user) {
    $data = array(            
      'auth_id' => $user->id,
      'auth_username' => $user->username,
      'auth_logged_in' => TRUE
    );
    $this->ci->session->set_userdata($data);
  }
}
