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
                if(result.success) {
                    methods.getLocations();
                    $('#location-form').modal('hide');
                } else {
                    base.displayFormErrors(
                        $('#location-form form'),
                        result.errors
                    );
                }

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

    methods.populateDropdown = function (locations) {
        var select = '<option value="">Select a Location</option>';
        $.each(locations, function (key, val) {
            select +=
                '<option value="' + val.locationId + '">' +
                    val.name +
                '</option>';
        });
        $('#location-search').html(select);
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

    methods.populateModules = function(modules, select, locationId) {
        var options = '';
        $.each(modules, function (key, val) {
            options +=
                '<option ' +
                'data-location-id="' + locationId + '" ' +
                'value="' + val.moduleId + '">'
                    + (val.name || val.moduleName) +
                '</option>';
        });
        select.html(options);
    };

    methods.getLocations = function () {
        base.makeApiCall('admin/location/view', {
                sort: sort,
                offset: offset,
                limit: limit,
                active: active
            }, function(result) {
                methods.populateTable(result.locations);
                methods.populateDropdown(result.locations);
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

    methods.getModules = function (locationId, available, select) {
        base.makeApiCall('admin/module/view-location-module', {
                locationId: locationId,
                available: available
            }, function(result) {
                methods.populateModules(
                    result.locationModules.locationModules,
                    select,
                    locationId
                );
            }
        );
    };

    methods.editModules = function (isAdd) {
        var to = isAdd ? $('#modules select[name="delete"]') : $('#modules select[name="add"]'),
            from = isAdd ? $('#modules select[name="add"]') : $('#modules select[name="delete"]'),
            options = from.find('option:selected').remove(),
            moduleIds = [],
            locationId = $(options.get(0)).data('location-id');

        $.each(options, function (key, val) {
            moduleIds.push($(val).val());
        });
        base.makeApiCall(
                isAdd ? 'admin/module/add-location-module' : 'admin/module/delete-location-module', {
                locationId: locationId,
                moduleId: moduleIds
            }, function(result) {
                if(result.success) {
                    options.appendTo(to);
                }
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
            $('.modal-header h4').html('Edit Location');
        } else {
            $('#location-form form').find('input[name="locationId"]').prop('disabled', true);
            $('.modal-header h4').html('Add Location');
        }
        $('#location-form').modal('show');
    };

    this.dispatch = function () {
        methods.form();
        methods.getLocations(1, 0, 20);

        $('.locations tbody').on('click', 'tr', function() {
            methods.showForm($(this).data('location-id'));
        });
        $('#location-tabs a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
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
        $('#location-search').change(function () {
            if($(this).val() === '') {
                $('#modules .manage-multiselect').html('');
                return;
            }
            methods.getModules(
                $(this).val(),
                true,
                $('#modules select[name="add"]')
            );
            methods.getModules(
                $(this).val(),
                false,
                $('#modules select[name="delete"]')
            );
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
        $('.modify-module').click(function (e) {
            e.preventDefault();
            methods.editModules($(this).data('toggle') == 'add');
        });
    };
};