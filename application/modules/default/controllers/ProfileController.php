<?php
class ProfileController extends Zend_Controller_Action
{
    public function indexAction()
    {
        $this->view->headScript()
        ->prependFile( "/js/default/profile.js", $type = 'text/javascript' );
    }
}