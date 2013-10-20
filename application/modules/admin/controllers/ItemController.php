<?php
class Admin_ItemController extends Zend_Controller_Action
{
    public function indexAction()
    {
        $this->view->headScript()
        ->prependFile( "/js/admin/item.js", $type = 'text/javascript' );

        $this->view->headScript()
        ->prependFile( "/js/admin/item-type-attribute.js", $type = 'text/javascript' );
    }
}