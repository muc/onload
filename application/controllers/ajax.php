<?php
/**
 * Ajax controller
 * Handles incoming ajax requests
 * 
 */
class Ajax extends Controller {
  
  function Ajax() {
    parent::Controller();
    $this->load->library('response');
    $this->load->library('firephp');
  }
  
  function index() {
    redirect('/');
  }
  
  function login() {
    // if no post data found, redirect to start page
    if (!($this->input->post('username') && $this->input->post('password'))) {
      $this->response->success = false;
      return json_encode(array('success' => false));
    }
    // login user and return success
    $this->response->success = $this->auth->login($this->input->post('username'), $this->input->post('password'));
    echo $this->response->toJson();
  }
  
  function forgotpassword() {
    // if no post data found, redirect to start page
    if (!($this->input->post('username') && $this->input->post('email'))) {
      $this->response->success = false;
      return json_encode(array('success' => false));
    }
    $user = Doctrine_Core::getTable('User')->findByUsername($this->input->post('username'));
    
    // only create new password, if emails are equal
    if (!empty($user) && $user[0]->email == $this->input->post('email')) {
      $this->load->helper('password_helper');
      $this->response->success = true;
      $this->response->data = array('newpass' => generate_password(10, 7));
    }
    echo $this->response->toJson();
  }
  
  function changepassword() {
    // if no post data found, redirect to start page
    if (!($this->input->post('new_password') && $this->input->post('cnew_password'))) {
      $this->response->success = false;
      return json_encode(array('success' => false));
    }
    // check, if an user is logged in
    if (!$this->auth->isLoggedIn()) {
      $this->response->success = false;
      $this->response->message = 'No logged in user found.';
    }
    // check if password and confirmed passward are equal
    if (($this->input->post('new_password') != $this->input->post('cnew_password'))) {
      $this->response->success = false;
    }
    
    // save new password
    $user = $this->auth->currentUser();
    $user->password = $this->input->post('new_password');
    $user->save();
    $this->response->success = true;
    echo $this->response->toJson();
  }
  
  function currentuser() {
    // check, if an user is logged in
    if (!$this->auth->isLoggedIn()) {
      $this->response->success = false;
      $this->response->message = 'No logged in user found.';
    }
    else {
      // return current logged in user
      $user = $this->auth->currentUser();
      $this->response->success = true;
      $this->response->data = array(
        'id' => $user->id,
        'username' => $user->username,
        'email' => $user->email,
        'admin' => $user->admin
      );
    }
    echo $this->response->toJson();
  }
  
  function users($action = 'view') {
    // only admin is allowed
    if (!$this->auth->isAdmin()) {
      $this->response->success = false;
      $this->response->message = 'Authentication failed.';
      echo $this->response->toJson();
      return;
    }
    
    switch ($action) {
      // Get all users
      case 'view':
        $start = $this->input->post('start') ? $this->input->post('start') : 0;
        $limit = $this->input->post('limit') ? $this->input->post('limit') : 0;
        $sort = $this->input->post('sort') ? $this->input->post('sort') : 'id';
        $dir = $this->input->post('dir') ? $this->input->post('dir') : 'asc';
        $q = Doctrine_Query::create()
          ->select('u.id, u.username, u.email, u.admin')
          ->from('User u')
          ->offset($start)
          ->limit($limit)
          ->orderBy($sort . ' ' . $dir);
        $users = $q->fetchArray();
        $this->response->success = true;
        $this->response->total = Doctrine_Core::getTable('User')->count();
        $this->response->data = $users;
        break;
        
      case 'create':
        // Create a new user
        $data = json_decode($this->input->post('data'), true);
        $user = new User();
        foreach ($data as $key => $value) {
          $user->$key = $value;
        }
        $user->save();
        $this->response->success = true;
        break;
        
      case 'update':
        // Update an user
        $data = json_decode($this->input->post('data'), true);
        $id = $data['id'];
        unset($data['id']);
        $user = Doctrine::getTable('User')->find($id);
        
        //loop throu all changes
        foreach ($data as $key => $value) {
          $user->$key = $value;
        }
        $user->save();
        $this->response->success = true;
        break;
        
      case 'destroy':
        // Delete an user
        $id = (int)json_decode(stripslashes($this->input->post('data')));
        
        // prevent delete the user himself
        if ($this->auth->currentUser()->id != $id) {
          $user = Doctrine::getTable('User')->find($id);
          $user->delete();
          $this->response->success = true;
        }
        else {
          $this->response->success = false;
          $this->response->message = 'Nice try, buddy. Deleting yourself isn\'t that good.';
        }
        break;
    }
    echo $this->response->toJson();
  }

}
