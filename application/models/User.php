<?php
class Model_User extends Model_Base_Http
{
	const USER_TYPE_ADMIN = 1;
	const USER_TYPE_EMPLOYEE = 2;
	const USER_TYPE_CUSTOMER = 3;
    
    protected $_userId;
	protected $_firstName;
	protected $_lastName;
	protected $_email;
	protected $_userTypeId;
	protected $_active;
	protected $_total;
	
	public function __construct(array $options = array())
	{
	    $settings = array_merge(array(
	        'userId' => null,
	        'firstName' => null,
	        'lastName' => null,
            'email' => null,
            'password' => null,
	        'userTypeId' => null,
	        'active' => null,
            'db' => null,
            ), $options);
	    parent::__construct($settings['db']);
		$this->_userId = $settings['userId'];
		$this->_firstName = $settings['firstName'];
		$this->_lastName = $settings['lastName'];;
		$this->_email = $settings['email'];;
		$this->_userTypeId = $settings['userTypeId'];;
		$this->_active = $settings['active'];;
	}
	
	public function isActive()
	{
		return $this->_active;
	}
	
	public function loadRecord($record)
	{		
		$this->_userId = $record->userId;
		$this->_firstName = $record->firstName;
		$this->_lastName = $record->lastName;
		$this->_email = $record->email;
		$this->_userTypeId = intval($record->userTypeId);
		$this->_active = $record->active;
		$this->_total = $record->total;

		return $this;
	}
	
	public function loadUserIntoSession(&$session)
	{
	    $session->userId = $this->_userId;
        $session->email = $this->_email;
        $session->firstName = $this->_firstName;
        $session->lastName = $this->_lastName;
        $session->userTypeId = $this->_userTypeId;
        
        return $this;
	}
		
	public function load()
	{

	}
		
	public function save()
	{

	}
	
	//Setters
	public function setUserId($userId){$this->_userId = $userId; return $this;}
	public function setFirstName($firstName){$this->_firstName = $firstName; return $this;}
	public function setLastName($lastName){$this->_lastName = $lastName; return $this;}
	public function setEmail($email){$this->_email = $email; return $this;}
	public function setUserTypeId($userTypeId){$this->_userTypeId = $userTypeId; return $this;}
	public function setActive($active){$this->_active = $active; return $this;}
	
	//Getters
	public function getUserId(){return $this->_userId;}
	public function getFirstName(){return $this->_firstName;}
	public function getLastName(){return $this->_lastName;}
	public function getEmail(){return $this->_email;}
	public function getUserTypeId(){return $this->_userTypeId;}
	public function getActive(){return $this->_active;}
	public function getTotal(){return $this->_total;}
}