<?php
class ImageController extends Zend_Controller_Action
{
    public function indexAction()
    {
        $client = new Zend_Http_Client();
        $client->setUri(
            Zend_Registry::get(API_URL).'/default/image/get'
        );

        $client->setConfig(array(
            'maxredirects' => 0,
            'timeout'      => 30
        ));

        $client->setMethod(Zend_Http_Client::POST);
        $client->setParameterPost(
            array (
                'token' => Zend_Registry::get(SESSION)->token,
                'itemImageId' => $this->getRequest()->getParam('image')
            )
        );

        $response = $client->request();
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender(TRUE);
        header('Content-type: image/jpeg');
        echo $response->getBody();
    }
}