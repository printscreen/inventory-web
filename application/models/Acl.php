<?php

class Model_Acl extends Zend_Acl
{
    protected $_userTypeIdResources;
	protected $_userTypeId;
	private $_acl;
	private $_role;

	public function __construct($file, array $options = array())
	{
		$settings = array_merge(array(
            'userTypeId' => null,
            'locationId' => null,
            ), $options);
	    $this->_userTypeId = $settings['userTypeId'];
	    $this->_acl = simplexml_load_file($file);
	    $this->_role = new Zend_Acl_Role($this->_userTypeId);
		if(!$this->hasRole($this->_role)) {
			$this->addRole($this->_role);
		}
	}

	public function initAcl()
	{
		foreach($this->_acl as $userType) {
		    if(intval($userType->attributes()->id) == $this->_userTypeId) {
		        foreach($userType->resource as $resource) {
		            if(!$this->has(strval($resource))) {
				        $this->addResource(strval($resource));
			        }
		            $this->allow($this->_role, strval($resource), 'access');
		        }
		        break;
		    }
		}
	}

	public function initModuleAcl($token, $locationId)
	{
		$user = new Model_User();
		$userLocationModules = $user->getUserLocationModules($token);
        $modules = $userLocationModules->modules;
        if(is_array($modules) && count($modules) > 0) {
        	foreach($modules as $module) {
        		//Only add modules to the location requested
        		if($module->locationId != $locationId) {
        			continue;
        		}
        		$resource = sprintf('%s:index:index', strtolower($module->moduleName));
        		if(!$this->has(strval($resource))) {
					$this->addResource(strval($resource));
			    }
		        $this->allow($this->_role, strval($resource), 'access');
        	}
        }
	}

	public function setuserTypeId($userTypeId){$this->_userTypeId = $userTypeId;}
    public function getuserTypeId(){return $this->_userTypeId;}
}