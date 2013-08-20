<?php

class Model_Acl extends Zend_Acl
{
    protected $_userTypeIdResources;
	protected $_userTypeId;
	private $_acl;

	public function __construct($file, array $options = array())
	{
		$settings = array_merge(array(
            'userTypeId' => null
            ), $options);
	    $this->_userTypeId = $settings['userTypeId'];
	    $this->_acl = simplexml_load_file($file);
	}
	
	public function initAcl()
	{
		$role = new Zend_Acl_Role($this->_userTypeId);
		if(!$this->hasRole($role)) {
			$this->addRole($role);
		}
		foreach($this->_acl as $userType) {
		    if(intval($userType->attributes()->id) == $this->_userTypeId) {
		        foreach($userType->resource as $resource) {
		            if(!$this->has(strval($resource))) {
				        $this->addResource(strval($resource));
			        }
		            $this->allow($role, strval($resource), 'access');
		        }
		        break;
		    }
		}
	}
	
	public function setuserTypeId($userTypeId){$this->_userTypeId = $userTypeId;}
    public function getuserTypeId(){return $this->_userTypeId;}
}