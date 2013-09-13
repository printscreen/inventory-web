Inventory.prototype.modules.adminCustomer = function (base, index) {
    "use strict";
    var self = this,
        methods = {},
        sort = 2,
        offset = 0,
        limit = 20,
        active = true,
        locationId = null;
    
    methods.saveForm = function () {
        base.makeApiCall(
              'admin/unit/edit-unit'
            , $('#unit-form form').serializeObject()
            , function(result) {
                if(result.success) {
                    methods.getUnits();
                    $('#unit-form').modal('hide');
                } else {
                    base.displayFormErrors(
                        $('#unit-form form'),
                        result.errors
                    );
                }
            }
        );
    };
    
    methods.saveAssignForm = function (params) {
        base.makeApiCall(
              params.type === 'delete' ?
                  'admin/unit/delete-unit-user' :
                  'admin/unit/add-unit-user'
            , params
            , function(result) {
                if(result.success) {
                    $('#unit-search').trigger('change');
                    $('#assign-form').modal('hide');
                } else {
                    base.displayFormErrors(
                        $('#unit-form form'),
                        result.errors
                    );
                }
            }
        );
    };
    
    methods.getUnitUsers = function (unitId) {
        base.makeApiCall(
              'admin/unit/unit-users'
            , {
                unitId : unitId,
                sort: -7
            }, 
            function(result) {
                if(result.success) {
                    methods.populateUnitUsers(
                        result.users, 
                        unitId       
                    );
                } else {
                    base.displayFormErrors(
                        $('#unit-form form'),
                        result.errors
                    );
                }
            }
        );
        base.makeApiCall(
                'admin/unit/unit-available-users'
              , {
                  unitId : unitId
              }, 
              function(result) {
                  if(result.success) {
                      methods.populateAvailableUnitUsers(
                          result.users, 
                          unitId       
                      );
                  } else {
                      base.displayFormErrors(
                          $('#unit-form form'),
                          result.errors
                      );
                  }
              }
          );
    };
    
    methods.populateAvailableUnitUsers = function (users, unitId) {
        var options = '<option value="">Select a Customer</option>';
        $.each(users, function (key, val) {
            options += '<option value="' + val.userId + '">' +
                        val.lastName + ',' +
                        val.firstName + ': ' +
                        val.email +
                        '</option>';
        });
        $('#assign-form input[name="unitId"]').val(unitId);
        $('#assign-form select[name="userId"]').html(options);
    };
    
    methods.populateUnitUsers = function (users, unitId) {
        var body = '';
        $.each(users, function (key, val) {
            body += 
                '<tr ' + (val.active == '1' ? 'class="success"' : '') + 
                'data-unit-id="' + unitId + 
                '" data-user-id="' + val.userId + '">' +
                    '<td>'+ val.firstName + '</td>' +
                    '<td>'+ val.lastName + '</td>' +
                    '<td>'+ val.email + '</td>' +
                    '<td>'+ (val.active == '1' ? 'Yes' : 'No') + 
                        '<span class="edit-unit-users pull-right">' +
                            '<a href="#" data-action="delete" class="btn btn-danger"><span class="glyphicon glyphicon-minus"></span></a>' +
                            '<a href="#" data-action="add" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span></a>' +
                        '</span>' +
                    '</td>' +
                '</tr>';
        });
        $('table.users tbody').html(body);
    };
    
    methods.populate = function (users) {
        var body = '';
        var options = '<option value="">Select a Unit</option>';
        $.each(users, function (key, val) {
            body += 
                '<tr data-unit-id="' + val.unitId + '">' +
                    '<td>'+ val.name + '</td>' +
                    '<td>'+ (val.active == '1' ? 'Yes' : 'No') + '</td>' +
                '</tr>';
            options += 
                '<option value="'+val.unitId+'">' + val.name + '</option>';
        });
        $('table.units tbody').html(body);
        $('#unit-search').html(options);
    };
    
    methods.populateForm = function (unit) {
        var form = $('#unit-form form');
        form.find('input[name="unitId"]').val(unit.unitId);
        form.find('input[name="locationId"]').val(unit.locationId);
        form.find('input[name="name"]').val(unit.name);
        form.find('select[name="active"]').val((unit.active == '1' ? 'true' : 'false'));
    };
    
    methods.populateLocations = function(locations, select, defaultOption) {
        var options = defaultOption ? '<option value="">Select a Location</option>' : '';
        $.each(locations, function (key, val) {
            options += 
                '<option value="' + val.locationId + '">'
                    + val.name +
                '</option>';
        });
        select.html(options);
    };
    
    methods.getUnits = function () {
        base.makeApiCall('admin/unit/view-unit-by-location', {
                sort: sort,
                offset: offset,
                limit: limit,
                active: active,
                locationId: locationId
            }, function(result) {
                methods.populate(result.units);  
            }
        );
    };
    
    methods.getUnit = function (unitId) {
        base.makeApiCall('admin/unit/get', {
                unitId: unitId
            }, function(result) {
                methods.populateForm(result.unit);  
            }
        );
    };
    
    methods.form = function () {
        $('#unit-form form').validate({
            rules: {
                unitId : {
                    required: function(){ 
                        return $('#unit-form form')
                        .find('input[name="unitId"]')
                        .is(':disabled');
                    },
                    digits: true
                },
                name: 'required',
                active: 'required',
                locationId:  {
                    required: true,
                    digits: true
                }
            },
            messages : {
                name: 'Please enter a name',
                active: 'Please select an active state'
            },
            showErrors: function () {},
            invalidHandler: base.displayFormErrors,
            submitHandler: methods.saveForm
        });
        $('#assign-form form').validate({
            rules: {
                unitId : {
                    required: true,
                    digits: true
                },
                userId:  {
                    required: true,
                    digits: true
                }
            },
            messages : {
                unitId: 'No Unit Id supplied',
                userId: 'Please select a user'
            },
            showErrors: function () {},
            invalidHandler: base.displayFormErrors,
            submitHandler: function() {
                methods.saveAssignForm({
                    userId: $('#assign-form form select[name="userId"]').val(),
                    unitId: $('#assign-form form input[name="unitId"]').val(),
                    type: 'add'
                })
                return false;
            }
        });
    };
    
    methods.showForm = function (unitId, locationId) {
        $('#unit-form form').clearForm();
        if(!isNaN(parseInt(unitId))) {
            $('#unit-form form').find('input[name="unitId"]').prop('disabled', false);
            methods.getUnit(unitId);
            $('#unit-form .modal-header h4').html('Edit Unit');
        } else {
            $('#unit-form form').find('input[name="unitId"]').prop('disabled', true);
            $('#unit-form .modal-header h4').html('Add Unit');
            $('#unit-form form').find('input[name="locationId"]').val(locationId);
        }
        $('#unit-form').modal('show');
    };
    
    methods.showAssignForm = function (isAdd) {
        $('#assign-customer form').clearForm();
        $('#assign-form .modal-header h4').html(isAdd ? 'Assign New Customer' : 'Edit Customer Assignment');
        $('#delete-user-unit').toggle(!isAdd);
        $('#assign-form').modal('show');
    };
    
    methods.getLocations = function (userId, available, select, defaultOption) {
        base.makeApiCall('admin/user/view-user-location', {
                userId: userId,
                available: available
            }, function(result) {
                methods.populateLocations(
                    result.userLocations.userLocations, 
                    select, 
                    defaultOption
                );
            }
        );
    };
    
    this.dispatch = function () {
        methods.form();
        methods.getLocations(
            base.getUserId(),
            true,
            $('#filter-locations, #default-user-location select'),
            true
        );
        $('#filter-locations').change(function() {
           locationId = parseInt($(this).val()) || null;
           $('#add-unit, #customer-units-tab').toggle(locationId !== null);
           $('#locations table.users tbody').html('');
           $('#assign-customer').toggle(false);
           methods.getUnits();      
        }).trigger('change');
        $('#unit-search').change(function() {
            var unitId = $(this).val();
            $('#locations table.users tbody').html('');
            $('#assign-customer').toggle(unitId !== '');
            if(unitId !== '') {
                methods.getUnitUsers(unitId);
            }
        });
        $('.units tbody').on('click', 'tr', function() {
            methods.showForm($(this).data('unit-id'));
        });
        $('.users tbody').on('click', 'tr', function() {
           var span = $(this).find('.edit-unit-users'),
               visible = span.is(':visible');
           $('.edit-unit-users').hide();
           if(!visible) {
               span.fadeToggle(visible);
           }          
        });
        $('.users tbody').on('click', '.edit-unit-users a', function (e) {
            e.stopPropagation();
            methods.saveAssignForm({
                userId: $(this).closest('tr').data('user-id'),
                unitId: $(this).closest('tr').data('unit-id'),
                type: $(this).data('action')
            });
        });
        $('#add-unit').click(function(){
            methods.showForm('', $('#filter-locations').val());
        });
        $('#assign-customer').click(function () {
            methods.showAssignForm(true);
        });
        $('#submit-form').click(function(){
            $('#unit-form form').submit();
        });
        $('#submit-assign-form').click(function () {
           $('#assign-form form').submit();
        });
        $('#active-user').click(function(){
            if($(this).hasClass('active')) {
                active = true;
                $(this).html('Show: Active');
            } else {
                active = false;
                $(this).html('Show: Inactive');
            }
            $('#locations select').html('');
            methods.getUnits();
        });
        $('#unit-tabs a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });
    };
};