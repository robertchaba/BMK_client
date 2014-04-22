<?php

define('APP_VERSION', '0.0.0.1');
// Permissions
define('FILE_DIR_MODE', 0775);
define('MODEL_DIR_MODE', 0775);
// Client paths
define('DOWNLOAD_URI', '/download');
define('DOWNLOAD_PATH', __DIR__ . DOWNLOAD_URI);


/**
 * This makes our life easier when dealing with paths. Everything is relative
 * to the application root now.
 */
chdir(__DIR__ . '/../private');

// Server paths
define('CERTS_PATH', __DIR__ . '/certs');

// Decline static file requests back to the PHP built-in webserver
if (php_sapi_name() === 'cli-server' && is_file(__DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH))) {
    return false;
}

// Setup autoloading
require 'init_autoloader.php';

// Run the application!
Zend\Mvc\Application::init(require 'config/application.config.php')->run();
