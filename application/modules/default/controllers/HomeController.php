<?php
class HomeController extends Zend_Controller_Action
{
    public function indexAction()
    {
        $this->view->headScript()
        ->prependFile('/js/default/home.js', $type = 'text/javascript' );

        $this->view->headScript()
        ->prependFile('/js/default/item.js', $type = 'text/javascript' );

        $this->view->headLink()
        ->appendStylesheet('/css/default/home.css');
    }
}