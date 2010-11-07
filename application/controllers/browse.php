<?php

class Browse extends Controller {
  
  public $root = '../files/';
  
  function Browse() {
    parent::Controller();
  }
  
  function index() {
    
    $this->load->view('browse');
  }
  
  function getall() {
    $this->load->helper('directory');
    $this->load->helper('file');
    $this->load->helper('number');
    
    $map = directory_map($this->root);
    $result = $this->_dir_to_array($map);
    
    echo json_encode($result);
  }
  
  function _dir_to_array($map, $path = '') {
    $result = array();
    foreach ($map as $key => $value) {
      if (is_array($value)) {
        $result[] = array(
          'name' => $key,
          'type' => 'folder',
          'path' => $path,
          'iconCls' => 'folder',
          'children' => $this->_dir_to_array($value, $path . $key . '/')
        );
      }
      else {
        $info = get_file_info($this->root . $path . $value, array('size'));
        $exts = explode('.', $value);
        $result[] = array(
          'name' => $value,
          'type' => 'file',
          'ext' => $exts[count($exts) - 1],
          'size' => byte_format($info['size']),
          'iconCls' => 'file-' . $exts[count($exts) - 1],
          'leaf' => true,
          'checked' => true
        );
      } 
    }
    return $result;
  }
}
