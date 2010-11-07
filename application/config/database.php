<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
| -------------------------------------------------------------------
| DATABASE CONNECTIVITY SETTINGS
| -------------------------------------------------------------------
| This file will contain the settings needed to access your database.
|
| For complete instructions please consult the "Database Connection"
| page of the User Guide.
|
| -------------------------------------------------------------------
| EXPLANATION OF VARIABLES
| -------------------------------------------------------------------
|
|	['hostname'] The hostname of your database server.
|	['username'] The username used to connect to the database
|	['password'] The password used to connect to the database
|	['database'] The name of the database you want to connect to
|	['dbdriver'] The database type. ie: mysql.  Currently supported:
				 mysql, mysqli, postgre, odbc, mssql, sqlite, oci8
|	['dbprefix'] You can add an optional prefix, which will be added
|				 to the table name when using the  Active Record class
|	['pconnect'] TRUE/FALSE - Whether to use a persistent connection
|	['db_debug'] TRUE/FALSE - Whether database errors should be displayed.
|	['cache_on'] TRUE/FALSE - Enables/disables query caching
|	['cachedir'] The path to the folder where cache files should be stored
|	['char_set'] The character set used in communicating with the database
|	['dbcollat'] The character collation used in communicating with the database
|
| The $active_group variable lets you choose which connection group to
| make active.  By default there is only one group (the "default" group).
|
| The $active_record variables lets you determine whether or not to load
| the active record class
*/

$active_group = "default";
$active_record = TRUE;

$db['default']['hostname'] = "localhost";
$db['default']['username'] = "root";
$db['default']['password'] = "";
$db['default']['database'] = "onload_db";
$db['default']['dbdriver'] = "mysql";
$db['default']['dbprefix'] = "";
$db['default']['pconnect'] = TRUE;
$db['default']['db_debug'] = TRUE;
$db['default']['cache_on'] = FALSE;
$db['default']['cachedir'] = "";

/***** Doctrine ******/
// Create dsn from the info above
$db['default']['dsn'] = 
  $db['default']['dbdriver'] .
  '://' . $db['default']['username'] .
  ':' . $db['default']['password'].
  '@' . $db['default']['hostname'] .
  '/' . $db['default']['database'];

// Require Doctrine.php
require_once(realpath(dirname(__FILE__) . '/../../system') . DIRECTORY_SEPARATOR . 'database/doctrine/Doctrine.php');

// Set the autoloader
spl_autoload_register(array('Doctrine', 'autoload'));
spl_autoload_register(array('Doctrine', 'modelsAutoload')); 

// Load the Doctrine connection
Doctrine_Manager::connection($db['default']['dsn'], $db['default']['database']);

// Set the model loading to conservative/lazy loading
Doctrine_Manager::getInstance()->setAttribute(Doctrine_Core::ATTR_MODEL_LOADING, Doctrine_Core::MODEL_LOADING_CONSERVATIVE);

// this will allow us to use "mutators"
Doctrine_Manager::getInstance()->setAttribute(Doctrine::ATTR_AUTO_ACCESSOR_OVERRIDE, true);

// this sets all table columns to notnull and unsigned (for ints) by default
Doctrine_Manager::getInstance()->setAttribute(Doctrine::ATTR_DEFAULT_COLUMN_OPTIONS, array('notnull' => true));

// Load the models for the autoloader
Doctrine_Core::loadModels(realpath(dirname(__FILE__) . '/..') . DIRECTORY_SEPARATOR . 'models');
/***** Doctrine End ******/

$db['default']['char_set'] = "utf8";
$db['default']['dbcollat'] = "utf8_general_ci";


/* End of file database.php */
/* Location: ./system/application/config/database.php */