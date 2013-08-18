<?php
class Inventory_Controller_Plugin_Acl extends Zend_Controller_Plugin_Abstract
{
	protected $_publicModules;
	protected $_publicControllers;
	protected $_publicActions;
	
	public function __construct()
	{
		$this->_publicModules = array();
		$this->_publicControllers = array('default:error');
		$this->_publicActions = array(
		          'default:index:index'
				, 'default:auth:login'
				, 'default:auth:forgot-password'
				, 'default:auth:reset-password'
				, 'default:auth:logout'
				, 'default:error:error');
	}
	
    public function dispatchLoopStartup(Zend_Controller_Request_Abstract $request)
	{
	    //If not dispatchable
		if(!(Zend_Controller_Front::getInstance()->getDispatcher()->isDispatchable($request))) {
            return false;
        }
	    
	    $reqModule = $this->getRequest()->getModuleName();  
		$reqController = $this->getRequest()->getControllerName();
		$reqAction = $this->getRequest()->getActionName();
		$reqModuleStr = $reqModule;
		$reqControllerStr = $reqModule.':'.$reqController;
		$reqActionStr = $reqModule.':'.$reqController.':'.$reqAction;

		if( in_array($reqControllerStr, $this->_publicControllers) ||
			in_array($reqActionStr, $this->_publicActions)) {
			//If module, controller, or action is publically open, don't run it through ACL
			return;
		}

	    $r = Zend_Controller_Action_HelperBroker::getStaticHelper('redirector');    
		if(!Zend_Auth::getInstance()->hasIdentity() || empty(Zend_Registry::get(SESSION)->token)) {			
    		if($request->isXMLHttpRequest()) {
    		    header('Cache-Control: no-cache, must-revalidate');
                header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
                header('Content-type: text/json');
                echo json_encode(array(
                	'sessionExpired'=>true, 
                	'url' => '/auth/login',
                    'message' => 'Your session has expired. Redirecting to the Login page.'
                ));     
    		} else {
    		    $r->gotoUrl('/auth/login')->redirectAndExist();
    		}
		    exit;
		}
	}
}
