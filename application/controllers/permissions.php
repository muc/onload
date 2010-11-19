<?php

class Permissions extends Controller {
  
  function Permissions() {
    parent::Controller();
    $this->load->library('firephp');
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

    $qa = Doctrine_Query::create()
      ->from('User u')
      ->where('u.admin = false');
    $r_au = $qa->execute();
    $all_users = array();
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
  
  function update() {
    $fid = $this->input->post('fid');
    $data = json_decode($this->input->post('data'), true);
    
    $folder = Doctrine_Core::getTable('Folder')->find($fid);
    
    $q = Doctrine_Query::create()
      ->delete('Permission p')
      ->where('p.folder_id = ?', $fid);
    $q->execute();
    
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
