<?php
class Admin_UnitController extends Zend_Controller_Action
{
    public function indexAction()
    {
        $this->view->headScript()
        ->prependFile( "/js/admin/unit.js", $type = 'text/javascript' );
    }
}