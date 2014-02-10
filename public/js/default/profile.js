Inventory.prototype.modules.profile = function (base, index) {
    "use strict";
    var self = this,
        methods = {};

    methods.form = function () {
        $('#password-form').validate({
            rules: {
                currentPassword: 'required',
                password: 'required',
                repeatPassword: {
                    required: true,
                    equalTo: "#password"
                }
            },
            messages : {
                currentPassword: 'Please enter your current password',
                password: 'Please enter a new password',
                repeatPassword: {
                    required: 'Please re-enter your password',
                    equalTo: 'Not the same password as above'
                }
            },
            showErrors: function () {},
            invalidHandler: base.displayFormErrors,
            submitHandler: methods.saveForm
        });
    };

    methods.saveToast = function () {
        $('#saved').removeClass('hide').show();
        $('#saved').fadeOut(4000);
    };

    methods.saveForm = function () {
        base.makeApiCall('default/profile/reset-password', {
            currentPassword : $('#password-form input[name="currentPassword"]').val(),
            password : $('#password-form input[name="password"]').val(),
            repeatPassword : $('#password-form input[name="repeatPassword"]').val()
        }, function(result) {
            if(result.success) {
                $('#password-form').clearForm();
                base.clearErrors($('#password-form'));
                methods.saveToast();
                $('#hasTemporaryPassword').remove();
                $.getJSON('/default/profile/clear-temporary-password', function(){});
            } else {
                base.displayFormErrors($('#password-form'), result.errors);
            }
        });
    };

    this.dispatch = function () {
        methods.form();
    };
};