<?php

class LocationController extends Inventory_Controller_Action
{   
    public function viewAction()
    {
        $success = false;
        $units = array();
        $form = new Form_AccessLocation($this->getRequesterUserId());
        if($form->isValid($this->getRequest()->getParams())) {
            $getUnits = new Model_UserUnits(array(
                'userId' => $this->getRequesterUserId()
            ));
            $getUnits->getUnitsByLocationId(
                $form->getElement('locationId')->getValue()
              , $this->getRequest()->getParam('active', true)
              , $this->getRequest()->getParam('sort')
              , $this->getRequest()->getParam('offset')
              , $this->getRequest()->getParam('limit')
            );
            $units = $getUnits->toArray();
            $success = true;
        }
        $this->_helper->json(array(
            'success' => $success,
            'units' => $units,
            'errors' => $form->getFormErrors()
        ), $this->getRequest()->getParam('callback'));
    }
}
