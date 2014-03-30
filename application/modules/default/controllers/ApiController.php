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

        if(is_array($_FILES) && count($_FILES) > 0) {
            foreach($_FILES as $name => $val) {
                $client->setFileUpload($val['tmp_name'], $name);
            }
        }

        $response = $client->request();
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender(TRUE);
        $ct = $this->getRequest()->getHeader('Content-Type');
        if($ct == 'application/json' || $ct == 'text/json') {
            header('Content-type: text/json');
        } else {
            header('Content-type: text/html');
        }

        echo $response->getBody();
    }
}