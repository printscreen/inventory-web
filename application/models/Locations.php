<?php
class Model_Locations extends Model_Base_Http
{
    private $_locations;

    public function __construct(array $options = array())
    {

    }
    
    public function get()
    {
        $response = $this->request('locations/view', array(
            'sort' => $this->_,
            'password' => $this->_password
        ));

    }
}