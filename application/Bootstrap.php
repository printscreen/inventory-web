<?php
class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
    protected function _initDefines()
    {
        defined('SESSION') || define('SESSION', 'User_Session');
        defined('TOKEN') || define('TOKEN', 'User_Token');
        defined('API_URL') || define('API_URL', 'Api_Url');
    }

    protected function _initAutoload()
    {
        $autoLoader = Zend_Loader_Autoloader::getInstance();
        $autoLoader->registerNamespace('Inventory_');
        $resourceLoader = new Zend_Loader_Autoloader_Resource(array(
                            'basePath'        => APPLICATION_PATH,
                            'namespace'     => '',
                            'resourceTypes'    => array(
                                                'form'    => array(
                                                            'path'        => '/modules/default/views/forms/',
                                                            'namespace'    => 'Form_'
                                                        ),
                                                'model'    => array(
                                                            'path'        => '/models/',
                                                            'namespace'    => 'Model_'
                                                        )
                                                )
                            ));
        return $autoLoader;
    }

    protected function _initApplication()
    {
        date_default_timezone_set($this->getOption('default_time_zone'));
        Zend_Registry::set(API_URL, $this->getOption('api_url'));
    }

    protected function _initSession()
    {
        $session = new Zend_Session_Namespace(SESSION);
        Zend_Registry::set(SESSION, $session);
    }

    protected function _initPlugins()
    {
        $frontController = Zend_Controller_Front::getInstance();
        $frontController->registerPlugin(new Inventory_Controller_Plugin_Init());
        $frontController->registerPlugin(new Inventory_Controller_Plugin_Acl($this->getOption('acl')));
    }
}
