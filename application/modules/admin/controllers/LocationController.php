<?php
class Admin_LocationController extends Zend_Controller_Action
{
    public function indexAction()
    {
        $this->view->headScript()
        ->prependFile( "/js/admin/location.js", $type = 'text/javascript' );
    }
}