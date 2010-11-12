<?php

class Browse extends Controller {
  
  public $root = '../files';
  
  function Browse() {
    parent::Controller();
    $this->load->library('response');
  }
  
  function index() {
    
    $this->load->view('browse');
  }
  
  function getall() {
    $this->load->helper('directory');
    $this->load->helper('file');
    $this->load->helper('number');
    
    $map = directory_map($this->root . '/');
    $result = $this->_dir_to_array($map);
    
    echo json_encode($result);
  }
  
  function createfolder() {
    $name = $this->input->post('name');
    $parent_id = $this->input->post('parent');

    if ($parent_id == 0) {
      $path = '/';
      $fullpath = $this->root . $path;
    }
    else {
      $parent = Doctrine_Core::getTable('Folder')->find($parent_id);
      $path = $parent->path . $parent->name . '/';
      $fullpath = $this->root . $path;
    }
    
    if(mkdir($fullpath . $name)) {
      $folder = new Folder();
      $folder->name = $name;
      $folder->parent = $parent_id;
      $folder->path = $path;
      $folder->description = '';
      $folder->owner = $this->auth->currentUser()->id;
      $folder->save();
      $this->response->success = true;
      $this->response->data = array('id' => $folder->id, 'parent' => $folder->parent);
    }
    else {
      $this->response->success = false;
      $this->response->message = 'Failed to create new folder ' . $name;
    }
    echo $this->response->toJson();
  }
  
  function deletefolder() {
    $id = $this->input->post('id');
    $folder = Doctrine_Core::getTable('Folder')->find($id);
    if (rmdir($this->root . $folder->path . $folder->name)) {
      $folder->delete();
      $this->response->success = true;
    }
    echo $this->response->toJson();
  }
  
  function _dir_to_array($map, $path = '/', $parent = 0) {
    $result = array();
    foreach ($map as $key => $value) {
      if (is_array($value)) {
        $q = Doctrine_Query::create()
            ->select('*')
            ->from('Folder')
            ->where('name = ?', $key)
            ->andWhere('path = ?', $path);
        $folder = $q->fetchOne();
        if (!$q->count()) {
          $folder = new Folder();
          $folder->name = $key;
          $folder->path = $path;
          $folder->parent = $parent;
          $folder->description = '';
          $folder->owner = 1;
          $folder->save();
        }
        $result[] = array(
          'text' => $key,
          'name' => $key,
          'type' => 'folder',
          'path' => $path,
          'parent' => $folder->parent,
          'description' => $folder->description,
          'id' => $folder->id,
          'iconCls' => 'folder-icon',
          'leaf' => false,
          'children' => $this->_dir_to_array($value, $folder->path . $folder->name . '/', $folder->id)
        );
      }
      else {
        $info = get_file_info($this->root . '/' . $path . $value, array('size'));
        $exts = explode('.', $value);
        $result[] = array(
          'name' => $value,
          'type' => 'file',
          'ext' => $exts[count($exts) - 1],
          'size' => byte_format($info['size']),
          'iconCls' => 'file-' . $exts[count($exts) - 1],
          'leaf' => true
        );
      } 
    }
    return $result;
  }
}
