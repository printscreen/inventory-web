<?php
class Model_Auth extends Model_Base_Http implements Zend_Auth_Adapter_Interface 
{
    private $_email;
    private $_password;
    private $_token;
    private $_user;
    /**
     * Sets username and password for authentication
     *http://framework.zend.com/manual/en/zend.auth.html
     * @return void
     */
    public function __construct(array $options = array())
    {
        $settings = array_merge(array(
            'email' => null,
            'password' => null
            ), $options);
            
        parent::__construct();
        $this->_email = $settings['email'];
        $this->_password = $settings['password'];
    }
    /**
     * Performs an authentication attempt
     *
     * @throws Zend_Auth_Adapter_Exception If authentication cannot
     *                                     be performed
     * @return Zend_Auth_Result
     */
    public function authenticate()
    {
        $response = $this->request('auth/login', array(
            'email' => $this->_email,
            'password' => $this->_password
        ));

		if($response->success) {
			$atype = Zend_Auth_Result::SUCCESS;
			$identity = $this->_email;
			$this->_token = $response->token;
			$this->_user = $response->user;
		} else {
			$atype = Zend_Auth_Result::FAILURE;
			$identity = null;
		}
		$myresult = new Zend_Auth_Result($atype, $identity);
		return $myresult;
    }
    
    public function getToken()
    {
        return $this->_token;
    }
    
    public function getUser()
    {
        return $this->_user;
    }
}