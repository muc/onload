<?php

class Browser extends Controller {
    
  public $root = '../files';
  
  function Browser() {
    parent::Controller();
    $this->load->library('response');
  }
  
  function get_dir() {
    $this->load->helper('directory');
    $this->load->helper('file');
    $this->load->helper('number');
    
    //fid = parent
    $fid = $this->input->post('fid');
    $fid = $fid ? $fid : 0;
    $path = '/';
    
    if ($fid) {
      $folder = Doctrine_Core::getTable('Folder')->find($fid);
      $path = $folder->path . $folder->name . '/';
    }
    
    $map = $this->_read_dir($path, $fid);
    $result = array_merge($map['folders'], $map['files']);
    
    $this->response->success = true;
    $this->response->data = $result;
    $this->response->total = count($result);
    echo json_encode(array(
      'success' => true,
      'total' => count($result),
      'data' => $result
    ));
    //echo $this->response->toJson();
    
  }
  
  function get_folder() {
    $fid = $this->input->post('fid');
    $folder = Doctrine_Core::getTable('Folder')->find($fid);
    $result = $folder ? array('fid' => $folder->id, 'parent' => $folder->parent) : array('fid' => 0, 'parent' => 0);
    echo json_encode($result);
  }

  function create_dir() {
    $data = json_decode($this->input->post('data'), true);
    $keys = array_keys($data);
    if (!is_numeric($keys)) {
      $data = $data[0];
    }
    // create new folder within folder.id = parent
    $path = '/';
    if ($data['parent']) {
      $parent = Doctrine_Core::getTable('Folder')->find($data['parent']);
      $path = $parent->path . $parent->name . '/';
    }
    if (mkdir($this->root . $path . $data['name'])) {
      $folder = new Folder();
      $folder->name = $data['name'];
      $folder->parent = $data['parent'];
      $folder->path = $path;
      $folder->description = $data['description'];
      $folder->save();
      $this->response->success = true;
      $this->response->data = array(
        'fid' => $folder->id, 
        'name' => $folder->name,
        'type' => 'folder',
        'path' => $folder->path,
        'parent' => $folder->parent,
        'description' => $folder->description,
        'icon' => 'folder-icon',
      );
    }
    else {
      $this->response->success = false;
      $this->response->message = 'Failed to create new folder ' . $name;
    }
    echo $this->response->toJson();
  }

  function update_dir() {
    $data = json_decode($this->input->post('data'), true);
    $id = $data['fid'];
    unset($data['fid']);
    $folder = Doctrine_Core::getTable('Folder')->find($id);
    
    if (array_key_exists('name', $data)) {
      rename($this->root . $folder->path . $folder->name, $this->root . $folder->path . $data['name']);
    }
    foreach ($data as $key => $value) {
      $folder->$key = $value;
    }
    $folder->save();
    $this->response->success = true;
    $this->response->data = array(
      'fid' => $folder->id, 
      'name' => $folder->name,
      'type' => 'folder',
      'path' => $folder->path,
      'parent' => $folder->parent,
      'description' => $folder->description,
      'icon' => 'folder-icon',
    );
    echo $this->response->toJson();
  }

  function delete_dir() {
    $id = json_decode($this->input->post('data'), true);
    $folder = Doctrine_Core::getTable('Folder')->find($id);
    if (rmdir($this->root . $folder->path . $folder->name)) {
      $folder->delete();
      $this->response->success = true;
    }
    echo $this->response->toJson();
  }
  
  function _read_dir($path = '/', $parent = 0) {
    $source_dir = $this->root . $path;
    if ($fp = @opendir($source_dir)) {
      $source_dir = rtrim($source_dir, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR;    
      $folderdata = array();
      $filedata = array();
      
      while (FALSE !== ($file = readdir($fp))) {
        if ((strncmp($file, '.', 1) == 0) OR ($file == '.' OR $file == '..')) {
          continue;
        }
        if (@is_dir($source_dir.$file)) {
          
          $q = Doctrine_Query::create()
            ->select('*')
            ->from('Folder')
            ->where('name = ?', $file)
            ->andWhere('path = ?', $path);
          $folder = $q->fetchOne();
          
          if (!$q->count()) {
            $folder = new Folder();
            $folder->name = $file;
            $folder->path = $path;
            $folder->parent = $parent;
            $folder->description = '';
            $folder->save();
          }
          $files = get_dir_file_info($source_dir.$file.'/');
          
          $folderdata[] = array(
            'name' => $file,
            'type' => 'folder',
            'path' => $path,
            'parent' => $parent,
            'description' => $folder->description,
            'fid' => $folder->id,
            'icon' => 'folder-icon',
            'folders' => $this->_count_dirs($source_dir.$file.'/'),
            'files' => count($files)
          );
        }
        else {
          $info = get_file_info($source_dir . $file, array('size'));
          $exts = explode('.', $file);
          $ext = $exts[count($exts) - 1];
          $filedata[] = array(
            'name' => $file,
            'type' => 'file',
            'ext' => $ext,
            'size' => byte_format($info['size']),
            'icon' => 'file-' . $ext,
          );
        }
      }
      closedir($fp);
      return array(
        'folders' => $folderdata,
        'files' => $filedata
      );
    }
    else {
      return FALSE;
    }
  }

  function _count_dirs($source_dir) {
    $count = 0;
    if ($fp = @opendir($source_dir)) {
      $source_dir = rtrim($source_dir, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR;
      while (FALSE !== ($file = readdir($fp))) {
        if ((strncmp($file, '.', 1) == 0) OR ($file == '.' OR $file == '..')) {
          continue;
        }
        if (@is_dir($source_dir.$file)) {
          $count++;
        }
      }
    }
    return $count;
  }
  
}
