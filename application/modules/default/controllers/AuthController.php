<?php

class AuthController extends Zend_Controller_Action
{
    public function loginAction()
    {
        Zend_Layout::getMvcInstance()->setLayout('auth');
        $form = new Form_Login();
    	$success = false;
    	$message = '';
        if ($this->getRequest()->isPost() && $form->isValid($this->getRequest()->getParams())) {
 			$auth = Zend_Auth::getInstance();
    		// Set up the authentication adapter
 			$authAdapter = new Model_Auth(array(
 			      'email' => $form->getElement('email')->getValue()
 			    , 'password' => $form->getElement('password')->getValue()
 			));
			$result = $auth->authenticate($authAdapter);
            if($result->isValid()) {
                $session = Zend_Registry::get(SESSION);
                $user = new Model_User();
            	$user->loadRecord($authAdapter->getUser())
            	     ->loadUserIntoSession($session);
            	$session->token = $authAdapter->getToken();
                $session->hasTemporaryPassword = $authAdapter->hasTemporaryPassword();
                if($user->getUserTypeId() == Model_User::USER_TYPE_ADMIN ||
                   $user->getUserTypeId() == Model_User::USER_TYPE_EMPLOYEE) {
                    $this->_redirect('/admin');
                } else {
                    $this->_redirect('/home');
                }
            } else {
            	$message = 'Wrong Email/Password';
            }
        } else {
            $errors = $form->getMessages();
            if(is_array($errors) && count($errors) > 0) {
                foreach($errors as $error) {
                    $reason = $error[0];
                    break;
                }
            }
        }
        $this->view->form = $form;
        $this->view->message = $message;
    }

    public function logoutAction()
    {
        Zend_Auth::getInstance()->clearIdentity();
        Zend_Session::destroy();
        $this->_redirect('/');
    }

    public function forgotPasswordAction()
    {
        Zend_Layout::getMvcInstance()->setLayout('auth');
        if ($this->getRequest()->isPost()) {
            $auth = new Model_Auth(array(
                'email' => $this->getRequest()->getParam('email')
            ));
            $response = $auth->forgotPassword(
                Zend_Registry::get(APPLICATION_URL) . 'auth/reset-password'
            );
            $this->view->success = $response->success;
            $this->view->message = $response->message;
        }
    }

    public function resetPasswordAction()
    {
        Zend_Layout::getMvcInstance()->setLayout('auth');
        $this->view->email = $this->getRequest()->getParam('email');
        $this->view->token = $this->getRequest()->getParam('token');
        if ($this->getRequest()->isPost()) {
            $auth = new Model_Auth(array(
                'email' => $this->getRequest()->getParam('email')
            ));
            $response = $auth->resetPassword(
                  $this->getRequest()->getParam('token')
                , $this->getRequest()->getParam('password')
                , $this->getRequest()->getParam('repeatPassword')
            );
            $this->view->success = $response->success;
            $this->view->message = $response->message;
        }
    }
}
