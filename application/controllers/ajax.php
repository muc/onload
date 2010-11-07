<?php
/**
 * Ajax controller
 * Handles incoming ajax requests
 * 
 * @author Marc Hitscherich
 */
class Ajax extends Controller {
  
  function Ajax() {
    parent::Controller();
    $this->load->library('response');
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
  
  function currentuser() {
    if (!$this->auth->isLoggedIn()) {
      $this->response->success = false;
      $this->response->message = 'No logged in user found.';
    }
    else {
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
  
  function files($action = '') {
    $data2 = array(
      'data' => array(
        array('id' => 1, 'name' => 'Folder1', 'descr' => '', 'tags' => '', 'size' => '', 'perm' => 1, 'type' => 'folder', 'files' => 4),
        array('id' => 2, 'name' => 'Folder2', 'descr' => '', 'tags' => '', 'size' => '', 'perm' => 2, 'type' => 'folder', 'files' => 9),
        array('id' => 3, 'name' => 'Folder3', 'descr' => '', 'tags' => '', 'size' => '', 'perm' => 1, 'type' => 'folder', 'files' => 1),
        array('id' => 4, 'name' => 'file1.pdf', 'descr' => '', 'tags' => '', 'size' => '', 'perm' => 3, 'type' => 'file'),
        array('id' => 5, 'name' => 'file2.jpg', 'descr' => '', 'tags' => '', 'size' => '', 'perm' => 1, 'type' => 'file'),
      ),
      'total' => 5
    );
    echo json_encode($data2);
  }
  
  function users($action = 'view') {
    
    if (!$this->auth->isAdmin()) {
      $this->response->success = false;
      $this->response->message = 'Authentication failed.';
      echo $this->response->toJson();
      return;
    }
    
    switch ($action) {
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
        // INSERT
        $data = json_decode($this->input->post('data'), true);
        $user = new User();
        foreach ($data as $key => $value) {
          $user->$key = $value;
        }
        $user->save();
        $this->response->success = true;
        break;
        
      case 'update':
        // UPDATE
        $data = json_decode($this->input->post('data'), true);
        $id = $data['id'];
        unset($data['id']);
        $user = Doctrine::getTable('User')->find($id);
        foreach ($data as $key => $value) {
          $user->$key = $value;
        }
        $user->save();
        $this->response->success = true;
        break;
        
      case 'destroy':
        $id = (int)json_decode(stripslashes($this->input->post('data')));
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
