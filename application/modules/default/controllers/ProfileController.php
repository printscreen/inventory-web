<?php
class ProfileController extends Zend_Controller_Action
{
    public function indexAction()
    {
        $this->view->headScript()
        ->prependFile( "/js/default/profile.js", $type = 'text/javascript' );
    }

    public function clearTemporaryPasswordAction()
    {
        Zend_Registry::get(SESSION)->hasTemporaryPassword = false;
        $this->_helper->json(array(
            'success' => true
        ));
    }
}