<?php
class Inventory_Controller_Plugin_Acl extends Zend_Controller_Plugin_Abstract
{
	protected $_publicModules;
	protected $_publicControllers;
	protected $_publicActions;
	private $_aclFile;

	public function __construct($aclFile)
	{
		$this->_aclFile = $aclFile;
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
		if(!Zend_Auth::getInstance()->hasIdentity() || empty(Zend_Registry::get(SESSION)->userId)) {
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
		} else {
			//Check if the module-controller-action is valid
			$dispatcher = Zend_Controller_Front::getInstance()->getDispatcher();
			if ($dispatcher->isDispatchable($request)) {
			    $userAcl = new Model_Acl(
    			    $this->_aclFile,
    			    array('userTypeId' => Zend_Registry::get(SESSION)->userTypeId),
                    $this->getRequest()->getParam('locationId')
    			);
    			$userAcl->initAcl();
                //Handle modules. Only load if module is requested
                if($reqModule != 'default' && $reqModule != 'admin') {
                    $userAcl->initModuleAcl(
                        Zend_Registry::get(SESSION)->token,
                        $this->getRequest()->getParam('locationId')
                    );
                }
    			$denied = true;
    			try {
    				if($userAcl->isAllowed($userAcl->getUserTypeId(), $reqActionStr, 'access')) {
    					$denied = false;
    				}
    			} catch(Zend_Exception $e) {
    				$denied = true;
    			}
    			if($denied) {
    				throw new Inventory_Acl_Exception('Resource Denied');
    			}
			}
		}
	}
}
