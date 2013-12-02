<?php
class ApiController extends Zend_Controller_Action
{
    public function indexAction()
    {
        $client = new Zend_Http_Client();
        $client->setUri(
            Zend_Registry::get(API_URL).$this->getRequest()->getParam('url')
        );
        $client->setConfig(array(
            'maxredirects' => 0,
            'timeout'      => 30
        ));
        $client->setMethod(Zend_Http_Client::POST);
        $client->setParameterPost(array_merge(
            $this->getRequest()->getParams(),
            array (
                'token' => Zend_Registry::get(SESSION)->token
            )
        ));
        $response = $client->request();
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender(TRUE);
        header('Content-type: text/json');
        echo $response->getBody();
    }
}