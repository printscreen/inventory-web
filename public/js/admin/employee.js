Inventory.prototype.modules.adminEmployee = function (base, index) {
    "use strict";
    var self = this,
        methods = {},
        sort = 2,
        offset = 0,
        limit = 20,
        active = true;

    methods.saveForm = function () {
        base.makeApiCall(
              'admin/user/edit-employee'
            , $('#user-form form').serializeObject()
            , function(result) {
                if(result.success) {
                    methods.getEmployees();
                    $('#user-form').modal('hide');
                } else {
                    base.displayFormErrors(
                        $('#user-form form'),
                        result.errors
                    );
                }
            }
        );
    };

    methods.populate = function (users) {
        var body = '';
        var options = '<option value="">Select an Employee</option>';
        $.each(users, function (key, val) {
            body +=
                '<tr data-user-id="' + val.userId + '">' +
                    '<td>'+ val.firstName + '</td>' +
                    '<td>'+ val.lastName + '</td>' +
                    '<td>'+ val.email + '</td>' +
                    '<td>'+ (val.active == '1' ? 'Yes' : 'No') + '</td>' +
                '</tr>';
            options +=
                '<option value="'+val.userId+'">'
                    + val.lastName + ', ' + val.firstName +
                '</option>';
        });
        $('table.users tbody').html(body);
        $('#employee-search').html(options);
    };

    methods.populateForm = function (user) {
        var form = $('#user-form form');
        form.find('input[name="userId"]').val(user.userId);
        form.find('input[name="firstName"]').val(user.firstName);
        form.find('input[name="lastName"]').val(user.lastName);
        form.find('input[name="email"]').val(user.email);
        form.find('select[name="active"]').val((user.active == '1' ? 'true' : 'false'));
    };

    methods.populateLocations = function(locations, select, userId) {
        var options = '';
        $.each(locations, function (key, val) {
            options +=
                '<option ' +
                'data-user-id="' + userId + '" ' +
                'value="' + val.locationId + '">'
                    + val.name +
                '</option>';
        });
        select.html(options);
    };

    methods.getEmployees = function () {
        base.makeApiCall('admin/user/view-employee', {
                sort: sort,
                offset: offset,
                limit: limit,
                active: active
            }, function(result) {
                methods.populate(result.users);
            }
        );
    };

    methods.getEmployee = function (userId) {
        base.makeApiCall('admin/user/get', {
                userId: userId
            }, function(result) {
                methods.populateForm(result.user);
            }
        );
    };

    methods.form = function () {
        $('#user-form form').validate({
            rules: {
                userId : {
                    required: function(){
                        return $('#user-form form')
                        .find('input[name="userId"]')
                        .is(':disabled');
                    },
                    digits: true
                },
                firstName: 'required',
                lastName: 'required',
                email: {
                    required: true,
                    email: true
                },
                active: 'required'
            },
            messages : {
                firstName: 'Please enter a first name',
                lastName: 'Please enter a last name',
                email: 'Please enter a valid email address',
                active: 'Please select an active state'
            },
            showErrors: function () {},
            invalidHandler: base.displayFormErrors,
            submitHandler: methods.saveForm
        });
    };

    methods.showForm = function (userId) {
        $('#user-form form').clearForm();
        if(!isNaN(parseInt(userId))) {
            $('#temp-password').hide();
            $('#user-form form').find('input[name="userId"]').prop('disabled', false);
            methods.getEmployee(userId);
            $('.modal-header h4').html('Edit Employee');
        } else {
            $('#user-form form').find('input[name="userId"]').prop('disabled', true);
            $('.modal-header h4').html('Add Employee');
            $('#temp-password').show();
        }
        $('#user-form').modal('show');
    };

    methods.getLocations = function (userId, available, select) {
        base.makeApiCall('admin/user/view-user-location', {
                userId: userId,
                available: available
            }, function(result) {
                methods.populateLocations(
                    result.userLocations.userLocations,
                    select,
                    userId
                );
            }
        );
    };

    methods.editLocations = function (isAdd) {
        var to = isAdd ? $('#locations select[name="delete"]') : $('#locations select[name="add"]'),
            from = isAdd ? $('#locations select[name="add"]') : $('#locations select[name="delete"]'),
            options = from.find('option:selected').remove(),
            locationIds = [],
            userId = $(options.get(0)).data('user-id');

        $.each(options, function (key, val) {
            locationIds.push($(val).val());
        });
        base.makeApiCall(
                isAdd ? 'admin/user/add-user-location' : 'admin/user/delete-user-location', {
                userId: userId,
                locationId: locationIds
            }, function(result) {
                if(result.success) {
                    options.appendTo(to);
                }
            }
        );
    };

    this.dispatch = function () {
        methods.form();
        methods.getEmployees();
        $('.users tbody').on('click', 'tr', function() {
            methods.showForm($(this).data('user-id'));
        });
        $('#add-user').click(function(){
            methods.showForm('');
        });
        $('#submit-form').click(function(){
            $('#user-form form').submit();
        });
        $('#user-form').on('hide', function() {
            $(this).clearForm();
            $('#temp-password span').html('');
        });
        $('#active-user').click(function(){
            if($(this).hasClass('active')) {
                active = true;
                $(this).html('Show: Active');
            } else {
                active = false;
                $(this).html('Show: Inactive');
            }
            methods.getEmployees();
        });
        $('#employee-tabs a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });
        $('a[href="#locations"]').on('show', function (e) {
            $('#locations .manage-multiselect').html('');
            $('#locations form').clearForm();
        });
        $('#employee-search').change(function () {
            if($(this).val() === '') {
                $('#locations .manage-multiselect').html('');
                return;
            }
            methods.getLocations(
                $(this).val(),
                true,
                $('#locations select[name="add"]')
            );
            methods.getLocations(
                $(this).val(),
                false,
                $('#locations select[name="delete"]')
            );
        });
        $('.modify-location').click(function (e) {
            e.preventDefault();
            methods.editLocations($(this).data('toggle') == 'add');
        });
        $('input[name="firstName"], input[name="lastName"]').keyup(function() {
            var password = $('input[name="firstName"]').val().toLowerCase() +
                           $('input[name="lastName"]').val().toLowerCase();
            $('#temp-password')
                .toggleClass('hide', password.length === 0)
                .find('span')
                .html(password);
        });
    };
};