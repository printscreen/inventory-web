<?php

class Model_Base_Http extends Model_Base_Base
{
    private $_client;
    private $_domain;
    
    public function __construct()
    {
        $this->_client = new Zend_Http_Client();
        $this->_client
        ->setMethod('POST')
        ->setConfig(array(
            'timeout' => 30,
            'maxredirects' => 0 
        ));
        $this->_domain = Zend_Registry::get(API_URL);
    }
    
    protected function request($url, $parameters)
    {
        $response = $this->_client
            ->setUri($this->_domain.$url)
            ->setParameterPost($parameters)
            ->request();
        return Zend_Json::decode($response->getBody(), Zend_Json::TYPE_OBJECT);        
    }
}