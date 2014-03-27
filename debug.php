<?php

/**
 * Version check the environment, check required file and directories and there permissions.
 */
define('REQUIRED_PHP_VERSION', '5.3.0');
define('REQUIRED_MYSQL_VERSION', '5.6.0');
$bugfree = true;

initErrorHandler();

try {
    // Check PHP version.
    if (version_compare(PHP_VERSION, REQUIRED_PHP_VERSION) <= 0) {
        required('PHP ');
    }
    
    // Setup autoloading.
    require '../private/init_autoloader.php';

    // Check if Zend is loaded.
    if (!class_exists('Zend\Mvc\Application')) {
        required('Zend ');
    }

    // Check for a MySQL connection.
    // TODO get DB info from the prject config and connect to the db.
//    if (!mysql_ping()) {
//        required('MySQL ');
//    }
//
//    // Check MySQL version.
//    $info = mysql_get_server_info();
//    preg_match('@[0-9]+\.[0-9]+\.[0-9]+@', $info, $db_version);
//    if ((is_array($db_version) && (count($db_version) > 0)) && version_compare($db_version[0], REQUIRED_MYSQL_VERSION) <= 0) {
//        notice('MySQL version');
//    }

    // Check directory permissions.
    $directories = array(
        '../private/data/DoctrineORMModule/Proxy',
        '../private/data/cache',
        '../private/data/log',
        '../public/download'
    );

    foreach ($directories as $dir) {
        if (!is_dir($dir)) {
            required('Directory %s is required but do not exists. Create the directory and test again.', $dir);
        } elseif (!substr(sprintf('%o', fileperms($dir)), -4)) {
            required('Dir %s need to be writable, Update the directory permissions and test again.', $dir);
        }
    }
    
    bugfree();
} catch (\Exception $e) {
    error($e->getMessage(), $e->getCode(), $e->getFile(), $e->getLine());
}

function initErrorHandler()
{
    set_error_handler(function($errno, $errstr, $errfile, $errline) {
        if (error_reporting() === 0) {
            // End.
            return false;
        }

        throw new \ErrorException($errstr, $errno, 0, $errfile, $errline);
        // End.
    });
}

function bugfree()
{
    global $bugfree;
    if (!$bugfree) {
        // End.
        return false;
    }
    $args = array('Tests passed without error\'s.');
    array_unshift($args, 'Bug free');
    print call_user_func_array('msg', $args);
}

function required($msg, $args)
{
    $args = func_get_args();
    array_unshift($args, 'Required');
    print call_user_func_array('msg', $args);
}

function error($msg, $args)
{
    $args = func_get_args();
    array_unshift($args, 'Error while testing the enviourment');
    print call_user_func_array('msg', $args);
}

/**
 * Just give it some arguments and see what happens.
 * Created to confuse you :)
 * 
 * @private
 * @return string %s will be replaced with the first found argument(s).
 */
function msg()
{
    global $bugfree;
    $bugfree = false;
    $args    = func_get_args();
    $type    = array_shift($args);
    $msg     = array_shift($args);
    $argLeng = func_num_args();
    $dirLeng = substr_count($msg, '%s');
    $dirArgs = array_slice($args, 0, $dirLeng);
    $args    = array_unshift($dirArgs, $msg);
    $string  = call_user_func_array('sprintf', $dirArgs);
    $strLeng = (strlen($string)+3);
    $strLeng = ($strLeng>=50) ? $strLeng : 50;
    $line    = str_repeat('-', $strLeng);
    $sline   = str_repeat('*', $strLeng);
    $eline   = str_pad('*', $strLeng+1);
    $tline   = str_pad($type, $strLeng, ' ', 2);
    $mline   = str_pad($string, $strLeng-1);
    // End.
    return sprintf('<pre>*%s*<br>%s*<br>*%s*<br>*%s*<br>%s*<br>* %s*<br>%s*<br>*%s*</pre>',
        $sline,
        $eline,
        $tline,
        $line,
        $eline,
        $mline,
        $eline,
        $sline
    );
}