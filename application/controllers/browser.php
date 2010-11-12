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
            $folder->owner = 1;
            $folder->save();
          }
          $files = get_dir_file_info($source_dir.$file.'/');
          $folderdata[] = array(
            'name' => $file,
            'type' => 'folder',
            'path' => $path,
            'parent' => $parent,
            'description' => $folder->description,
            'id' => $folder->id,
            'icon' => 'folder-icon',
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
  
  function read_files($path = '/', $fid = 0) {
    static $_filedata = array();
    $source_dir = $this->root . $path;

    if ($fp = @opendir($source_dir)) {
      // reset the array and make sure $source_dir has a trailing slash on the initial call
      $_filedata = array();
      $source_dir = rtrim(realpath($source_dir), DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR;
      if ($_recursion === FALSE)
      {
      }

      while (FALSE !== ($file = readdir($fp)))
      {
        if (@is_dir($source_dir.$file) && strncmp($file, '.', 1) !== 0)
        {
           get_dir_file_info($source_dir.$file.DIRECTORY_SEPARATOR, $include_path, TRUE);
        }
        elseif (strncmp($file, '.', 1) !== 0)
        {
          $_filedata[$file] = get_file_info($source_dir.$file);
          $_filedata[$file]['relative_path'] = $relative_path;
        }
      }
      return $_filedata;
    }
    else
    {
      return FALSE;
    }
  }
}
