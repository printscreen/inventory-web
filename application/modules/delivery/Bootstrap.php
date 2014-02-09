<?php
class Delivery_Bootstrap extends Zend_Application_Module_Bootstrap
{
    public function _initAdmin()
    {
        if(Inventory_Utils_Request::isModuleRequested('delivery')) {
            $this->initDefines();
            $this->initAutoload();
        }
    }

    public function initDefines()
    {

    }

    protected function initAutoload()
    {
        $moduleLoader = new Zend_Loader_Autoloader_Resource(array(
            'basePath'=>APPLICATION_PATH . '/modules/delivery',
            'namespace'=>'Delivery',
            'resourceTypes'=>array(
                'model' => array(
                    'path'      => 'models/',
                    'namespace' => 'Model_'
                ),
                'form'  => array(
                    'path'      => 'views/forms/',
                    'namespace' => 'Form_'
                ),
                'plugin'=>array(
                    'path'=>'plugins/',
                    'namespace'=>'Plugin_'
                )
            )
        ));
    }
}