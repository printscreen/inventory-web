Inventory.prototype.modules.adminLocations = function (base, index) {
    "use strict";
    var self = this,
        methods = {},
        sort = 2,
        offset = 0,
        limit = 20,
        active = true;
    
    methods.saveForm = function () {
        base.makeApiCall(
              'admin/location/edit'
            , $('#location-form form').serializeObject()
            , function(result) {
                methods.getLocations();
                $('#location-form').modal('hide');
            }
        );
    };
    
    methods.populateTable = function (locations) {
        var body = '';
        $.each(locations, function (key, val) {
            body += 
                '<tr data-location-id="' + val.locationId + '">' +
                    '<td>'+ val.name + '</td>' +
                    '<td>'+ val.street + '</td>' +
                    '<td>'+ val.city + '</td>' +
                    '<td>'+ val.state + '</td>' +
                    '<td>'+ val.zip + '</td>' +
                    '<td>'+ val.phoneNumber + '</td>' +
                    '<td>'+ (val.active == '1' ? 'Yes' : 'No') + '</td>' +
                '</tr>';
        });
        $('table.locations tbody').html(body);
    };
    
    methods.populateForm = function (location) {
        var form = $('#location-form form');
        form.find('input[name="locationId"]').val(location.locationId);
        form.find('input[name="name"]').val(location.name);
        form.find('input[name="street"]').val(location.street);
        form.find('input[name="city"]').val(location.city);
        form.find('select[name="state"]').val(location.state);
        form.find('input[name="zip"]').val(location.zip);
        form.find('input[name="phoneNumber"]').val(location.phoneNumber);
        form.find('select[name="active"]').val((location.active == '1' ? 'true' : 'false'));
    };
    
    methods.getLocations = function () {
        base.makeApiCall('admin/location/view', {
                sort: sort,
                offset: offset,
                limit: limit,
                active: active
            }, function(result) {
                methods.populateTable(result.locations);  
            }
        );
    };
    
    methods.getLocation = function (locationId) {
        base.makeApiCall('admin/location/get', {
                locationId: locationId
            }, function(result) {
                methods.populateForm(result.location);  
            }
        );
    };
    
    methods.form = function () {
        $('#location-form form').validate({
            rules: {
                locationId : {
                    required: function(){ 
                        return $('#location-form form')
                        .find('input[name="locationId"]')
                        .is(':disabled');
                    },
                    digits: true
                },
                name: 'required',
                street: 'required',
                city: 'required',
                state: 'required',
                zip: 'required',
                phoneNumber: 'required',
                active: 'required'
            },
            messages : {
                name: 'Please enter a name',
                street: 'Please enter a street',
                city: 'Please enter a city',
                state: 'Please select a state',
                zip : 'Please enter a zip',
                phoneNumber: 'Please enter a phone number',
                active: 'Please select an active state'
            },
            showErrors: function () {},
            invalidHandler: base.displayFormErrors,
            submitHandler: methods.saveForm
        });
    };
    
    methods.showForm = function (locationId) {
        $('#location-form form').clearForm();
        if(!isNaN(parseInt(locationId))) {
            $('#location-form form').find('input[name="locationId"]').prop('disabled', false);
            methods.getLocation(locationId);
            $('.modal-header h3').html('Edit Location');
        } else {
            $('#location-form form').find('input[name="locationId"]').prop('disabled', true);
            $('.modal-header h3').html('Add Location');
        }
        $('#location-form').modal('show');
    };
    
    this.dispatch = function () {
        methods.form();
        methods.getLocations(1, 0, 20);

        $('.locations tbody').on('click', 'tr', function() {
            methods.showForm($(this).data('location-id'));
        });
        $('#add-location').click(function(){
            methods.showForm('');
        });
        $('#submit-form').click(function(){
            $('#location-form form').submit();
        });
        
        $('#location-form').on('hide', function() {
            base.clearErrors($('#location-form form'));
        });
        $('#active-location').click(function(){
            if($(this).hasClass('active')) {
                active = true;
                $(this).html('Show: Active');
            } else {
                active = false;
                $(this).html('Show: Inactive');
            }
            //active = !active;
            methods.getLocations();
        });
    };
};