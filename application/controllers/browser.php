<?php
/**
 * Browser Controller
 * 
 * Controller for all ajax request for the browser grid
 */
class Browser extends Controller {
    
  private $root = '../files';
  private $onload_cfg;
  
  function Browser() {
    // load needed libraries and configurations
    parent::Controller();
    $this->load->library('firephp');
    $this->load->library('response');
    $this->config->load('onload', TRUE);
    $this->onload_cfg = $this->config->item('onload');
    $this->root = $this->onload_cfg['root'];
  }
  
  /**
   * Returns an array of all folders and files in a given folder
   */
  function get_dir() {
    $this->load->helper('directory');
    $this->load->helper('file');
    $this->load->helper('number');
    
    $fid = $this->input->post('fid');
    $fid = $fid ? $fid : 0;
    
    // a small session hack for uploader function. codigniter dont want GET variables.
    $sdata = array('fid' => $fid);
    $this->session->set_userdata($sdata);
    
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
  }
  
  /**
   * Returns folder informations for a given folder id
   */
  function get_folder() {
    $fid = $this->input->post('fid');
    $folder = Doctrine_Core::getTable('Folder')->find($fid);
    $result = $folder ? array('fid' => $folder->id, 'parent' => $folder->parent) : array('fid' => 0, 'parent' => 0);
    echo json_encode($result);
  }

  /**
   * Creates a new folder
   */
  function create_dir() {
    $data = json_decode($this->input->post('data'), true);
    
    // check, if $data contains more than one folder
    $keys = array_keys($data);
    if (!is_numeric($keys)) {
      $data = $data[0];
    }
    $path = '/';
    if ($data['parent']) {
      $parent = Doctrine_Core::getTable('Folder')->find($data['parent']);
      $path = $parent->path . $parent->name . '/';
    }
    
    // create the folder in the file system
    if (mkdir($this->root . $path . $data['name'])) {
      // and add created folder to the database
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
        'icon' => 'folder',
      );
    }
    else {
      $this->response->success = false;
      $this->response->message = 'Failed to create new folder ' . $name;
    }
    echo $this->response->toJson();
  }

  /**
   * Update an existing folder or file
   */
  function update() {
    $data = json_decode($this->input->post('data'), true);
    $id = $data['fid'];
    unset($data['fid']);
    
    // ugly id hack, to check if it is a folder or a file
    if ($id < 1000000000) {
      
      // it's a folder
      $folder = Doctrine_Core::getTable('Folder')->find($id);
      
      // if folder name has changed, rename it in the filesystem
      if (array_key_exists('name', $data)) {
        rename($this->root . $folder->path . $folder->name, $this->root . $folder->path . $data['name']);
      }
      
      if (array_key_exists('perm', $data)) {
        $data['ptid'] = $data['perm'];
        unset($data['perm']);
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
        'perm' => $folder->ptid,
        'description' => $folder->description,
        'icon' => 'folder',
      );
    }
    else {
      // it's a file to update
      $this->load->helper('file');
      $this->load->helper('number');
      $id = $id / 1000000000;
      $q = Doctrine_Query::create()
        ->select('d.path, f.name')
        ->from('Folder d')
        ->leftJoin('d.Files f')
        ->where('f.id = ?', $id);
      $f = $q->fetchOne();
      
      $path = $this->root . $f->path . ( $f->id == 0 ? '' : $f->name . '/');
      
       // if file name has changed, rename it in the filesystem
      if (array_key_exists('name', $data)) {
        rename($path . $f->Files[0]->name, $path . $data['name']);
      }
      foreach ($data as $key => $value) {
        $f->Files[0]->$key = $value;
        $f->Files[0]->save();
        
        $info = get_file_info($path . $f->Files[0]->name, array('size'));
        $exts = explode('.', $f->Files[0]->name);
        $ext = $exts[count($exts) - 1];
        $icon = array_key_exists($ext, $this->onload_cfg['file_icons']) 
              ? $this->onload_cfg['file_icons'][$ext] 
              : $this->onload_cfg['file_icons']['default'];
        
        $this->response->success = true;
        $this->response->data = array(
          'fid' => $f->Files[0]->id * 1000000000,
          'name' => $f->Files[0]->name,
          'ext' => $ext,
          'type' => 'file',
          'description' => $f->Files[0]->description,
          'parent' => $f->id,
          'size' => byte_format($info['size']),
          'icon' => $icon, 
        );
      }
    }
    echo $this->response->toJson();
  }

  /**
   * Delete a folder or file
   */
  function delete() {
    $id = json_decode($this->input->post('data'), true);
    
    // ugly id hack, to check if it is a folder or a file
    if ($id < 1000000000) {
      // delete folder
      echo 'folder';
      $folder = Doctrine_Core::getTable('Folder')->find($id);
      if (rmdir($this->root . $folder->path . $folder->name)) {
        $folder->delete();
        $this->response->success = true;
      }
    }
    else {
      // delete file
      $id = $id / 1000000000;
      $q = Doctrine_Query::create()
        ->select('d.path, f.name')
        ->from('Folder d')
        ->leftJoin('d.Files f')
        ->where('f.id = ?', $id);
      $f = $q->fetchOne();
      if (unlink($this->root . $f->path . ( $f->id == 0 ? '' : $f->name . '/') . $f->Files[0]->name)) {
        $f->Files[0]->delete();
        $this->response->success = true;
      }
    }
    echo $this->response->toJson();
  }
  
  /**
   * Download folder(s) and/or file(s)
   */
  function download() {
    $this->load->helper('download');
    $this->load->library('zip');
    
    $count = $this->input->post('count');
    $data = json_decode($this->input->post('data'), true);
    
    // check how many files/folders should be downloaded
    if ($count == 1) {
      
      $fid = $data['fid'];
      $type = $data['type'];
      $parent = $data['parent'];
      
      // if it's only one file
      if ($type == 'file') {
        
        // get the path to that file
        $fid = $fid / 1000000000;
        $q = Doctrine_Query::create()
          ->from('Folder d')
          ->leftJoin('d.Files f')
          ->where('f.id = ?', $fid);
        $f = $q->fetchOne();
        
        $path = $this->root . $f->path . ( $f->id == 0 ? '' : $f->name . '/') . $f->Files[0]->name;
        
        // and start download
        force_download($f->Files[0]->name, file_get_contents($path));
      }
      else if ($type == 'folder') {
        
        // if it's only one folder, create a zip and start download
        $folder = Doctrine_Core::getTable('Folder')->find($fid);
        $this->_zip_dir($folder->path, $folder->name);
        $this->zip->download($folder->name);
      }
    }
    else if ($count > 1) {
      // it's more than one folder/file
      // first get parent folder.
      // should be the same on every $data entity, so grab it from $data[0]
      $parent = Doctrine_Core::getTable('Folder')->find($data[0]['parent']);
      $source_path = $this->root . $parent->path. ( $parent->id == 0 ? '' : $parent->name . '/');
      
      // loop throu all files/folders and add them to the zip file
      foreach ($data as $rec) {
        $fid = $rec['fid'];
        $type = $rec['type'];
        if ($type == 'file') {
          $fid = $fid / 1000000000;
          $file = Doctrine_Core::getTable('File')->find($fid);
          $file_content = file_get_contents($source_path . $file->name);
          $this->zip->add_data($file->name, $file_content);
        }
        else if ($type == 'folder') {
          $folder = Doctrine_Core::getTable('Folder')->find($fid);
          $this->_zip_dir($folder->path, $folder->name);
        }
      }
      // start the download
      $this->zip->download($parent->id == 0 ? 'onload' : $parent->name);
    }
  }

  /**
   * Upload a file
   */
  function upload() {
    // get the folder id, to where the file should be uploaded
    $fid = $this->session->userdata('fid');
    $folder = Doctrine_Core::getTable('Folder')->find($fid);
    $path = $this->root . $folder->path . ( $folder->id == 0 ? '' : $folder->name . '/');
    // get file information from header
    if ($this->input->server('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest') {
      $name =       $_SERVER['HTTP_X_FILE_NAME'];
      $size = (int) $_SERVER['HTTP_X_FILE_SIZE'];
      $type =       $_SERVER['HTTP_X_FILE_TYPE'];
      // and start upload
      $success = copy("php://input", $path.$name);
      $this->response->success = $success;
    }
    echo $this->response->toJson();
  }
  
  /**
   * Private function to read a directory
   * Returns an array with folders and files
   */
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
        
        // check if it's a folder
        if (@is_dir($source_dir.$file)) {
          
          // check if the folder already is in the database
          $q = Doctrine_Query::create()
            ->select('*')
            ->from('Folder')
            ->where('name = ?', $file)
            ->andWhere('path = ?', $path);
          $folder = $q->fetchOne();
          
          // create a new database entry, if the folder isn't found
          if (!$q->count()) {
            $folder = new Folder();
            $folder->name = $file;
            $folder->path = $path;
            $folder->parent = $parent;
            $folder->description = '';
            $folder->save();
          }
          
          // check permissions
          $user = $this->auth->currentUser();
          $allowed =  false;
          $upload = $user->admin;
          if ($folder->id == 0) {
            $allowed = true;
          }
          else {
            if ($user->admin === true) {
              $allowed = true;
            }
            else {
              if ($folder->ptid == 3) {
                $allowed = true;
                $upload = true;
              } 
              if ($folder->ptid == 2) {
                $q = Doctrine_Query::create()
                  ->from('Permission p')
                  ->where('p.folder_id = ?', $folder->id)
                  ->andWhere('p.user_id = ?', $user->id);
                $p = $q->fetchOne();
                if ($p) {
                  $allowed = true;
                  $upload = $p->upload;
                }
              }
            }
            
          }
          
          if ($allowed) {
            $files = get_dir_file_info($source_dir.$file.'/');
            $folderdata[] = array(
              'name' => $file,
              'type' => 'folder',
              'path' => $path,
              'parent' => $parent,
              'description' => $folder->description,
              'fid' => $folder->id,
              'perm' => $folder->ptid,
              'icon' => 'folder',
              'upload' => $upload,
              'folders' => $this->_count_dirs($source_dir.$file.'/'),
              'files' => count($files)
            );
          }
        }
        else {
          // its a file
          // check if the file already is in the database
          $q = Doctrine_Query::create()
            ->select('d.*, f.*')
            ->from('Folder d')
            ->leftJoin('d.Files f')
            ->where('d.id = ?', $parent)
            ->andWhere('f.name = ?', $file);
          $result = $q->fetchOne();
          
          $f = null;
          if (count($result['Files'])) {
            $f = $result['Files'][0];
          }
          else {
            // create a new database entry, if the file isn't found
            $folder = Doctrine_Core::getTable('Folder')->find($parent);
            $f = new File();
            $f->name = $file;
            $f->fid = $parent;
            $f->description = '';
            $f->save();
            $folder->Files[] = $f;
            $folder->save();
          }
          
          // grab some file informations
          $info = get_file_info($source_dir . $file, array('size'));
          $exts = explode('.', $file);
          $ext = $exts[count($exts) - 1];

          $icon = array_key_exists($ext, $this->onload_cfg['file_icons']) 
              ? $this->onload_cfg['file_icons'][$ext] 
              : $this->onload_cfg['file_icons']['default'];
          
          $filedata[] = array(
            'fid' => $f->id * 1000000000,
            'name' => $file,
            'ext' => $ext,
            'type' => 'file',
            'description' => $f->description,
            'parent' => $parent,
            'size' => byte_format($info['size']),
            'icon' => $icon,
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

  // Private function that returns the number of subfolders
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
  
  // Private funhction to build a zip file
  function _zip_dir($path, $name) {
    $source_path = $this->root . $path . $name . '/';
    $this->zip->add_dir($name);
    
    if ($fp = @opendir($source_path)) {
      while (FALSE !== ($file = readdir($fp))) {
        if (@is_dir($source_path.$file) && substr($file, 0, 1) != '.') {
          $this->_zip_dir($path.$name.'/', $name.'/'.$file);
        }
        elseif (substr($file, 0, 1) != ".") {
          if (FALSE !== ($data = file_get_contents($source_path.$file))) {
            $this->zip->add_data(str_replace("\\", "/", $name.'/').$file, $data);
          }
        }
      }
    return TRUE;
    }
  }
  
}
