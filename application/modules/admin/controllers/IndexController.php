<?php

class Admin_IndexController extends Zend_Controller_Action
{
    public function indexAction()
    {
        $this->view->headLink()
        ->appendStylesheet('/css/admin/admin.css');

    }
}