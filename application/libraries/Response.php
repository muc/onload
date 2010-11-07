<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * @class Response
 * A simple JSON Response class.
 */
class Response {
  
  public $success;
  public $data;
  public $message;
  public $total;
  
  public function __construct($params = array()) {
    $this->success  = isset($params["success"]) ? $params["success"] : false;
    $this->message  = isset($params["message"]) ? $params["message"] : null;
    $this->total    = isset($params["total"])   ? $params["total"]   : null;
    $this->data     = isset($params["data"])    ? $params["data"]    : null;
  }
  
  public function toJson() {
    $response = array();
    $response['success'] = $this->success;
    if ($this->data != null) {
      $response['data'] = $this->data;
    }
    if ($this->message != null) {
      $response['message'] = $this->message;
    }
    if ($this->total != null) {
      $response['total'] = $this->total;
    }
    
    return json_encode($response);
  }
  
}
