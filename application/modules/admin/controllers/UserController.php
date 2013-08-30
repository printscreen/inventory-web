<?php
class Admin_UserController extends Zend_Controller_Action
{
    public function employeeAction()
    {
        $this->view->headScript()
        ->prependFile( "/js/admin/employee.js", $type = 'text/javascript' );
    }
}