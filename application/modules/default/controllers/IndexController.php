<?php

class IndexController extends Zend_Controller_Action
{   
    public function indexAction()
    {
        Zend_Layout::getMvcInstance()->setLayout('index');
    }
}
