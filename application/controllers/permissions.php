<?php
/**
 * Permissions controller
 * 
 * handles ajax request for permissions
 */
class Permissions extends Controller {
  
  function Permissions() {
    parent::Controller();
    $this->load->library('firephp');
  }
  
  function index() {
    redirect('/');
  }
  
  /**
   * Returns an array of all available permission types
   */
  function permtype() {
    $pt = Doctrine_Core::getTable('PermissionType')->findAll();
    echo json_encode(array(
      'success' => true,
      'data' => $pt->toArray()
    ));
  }
  
  /**
   * Returns an array of all users for a given folder id, that have NO permission to it
   */
  function fusers() {
    $fid = $this->input->post('fid');
    
    // get users for a folder, that have permission to it
    $qp = Doctrine_Query::create()
      ->from('User u')
      ->leftJoin('u.Permissions p')
      ->where('p.folder_id = ?', $fid);
    $r_pu = $qp->execute();
    
    $perm_users = array();
    foreach ($r_pu as $pu) {
      $perm_users[] = array(
        'uid' => $pu->id,
        'username' => $pu->username,
        'upload' => $pu->Permissions[0]->upload,
      );
    }

    // get all users for a folder, that have NO permission to it
    $qa = Doctrine_Query::create()
      ->from('User u')
      ->where('u.admin = false');
    $r_au = $qa->execute();
    $all_users = array();
    
    // only add users to the array, that are not in the permitted user array
    foreach ($r_au as $au) {
      $add = true;
      foreach ($perm_users as $pu) {
        if ($pu['uid'] == $au->id) {
          $add = false;
          break;
        }
      }
      if ($add) {
        $all_users[] = array(
          'uid' => $au->id,
          'username' => $au->username,
          'upload' => false
        );
      }
    }
    echo json_encode(array(
      'success' => true,
      'data' => $all_users
    ));
  }

  /**
   * Returns an array of all users for a given folder id, that have permission to it
   */
  function pusers() {
    $fid = $this->input->post('fid');

    $qp = Doctrine_Query::create()
      ->from('User u')
      ->leftJoin('u.Permissions p')
      ->where('p.folder_id = ?', $fid);
    $r_pu = $qp->execute();
    
    $perm_users = array();
    foreach ($r_pu as $pu) {
      $perm_users[] = array(
        'uid' => $pu->id,
        'username' => $pu->username,
        'upload' => $pu->Permissions[0]->upload,
      );
    }

    echo json_encode(array(
      'success' => true,
      'data' => $perm_users
    ));
  }
  
  /**
   * Updates user permissions to a folder
   */
  function update() {
    $fid = $this->input->post('fid');
    $data = json_decode($this->input->post('data'), true);
    
    $folder = Doctrine_Core::getTable('Folder')->find($fid);
    
    // first, delete all existing permission for this folder
    $q = Doctrine_Query::create()
      ->delete('Permission p')
      ->where('p.folder_id = ?', $fid);
    $q->execute();
    
    // if new permission type is "shared", add user permissions
    if ($folder->ptid == 2) {
      foreach ($data as $user) {
        $perm = new Permission();
        $perm->user_id = $user['uid'];
        $perm->folder_id = $fid;
        $perm->upload = $user['upload'];
        $perm->save();
      }
    }
    
    echo json_encode(array('success' => true));
  }
}
