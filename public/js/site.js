var Inventory = function (parameters) {
    "use strict";
    var self = this,
    methods = {},
    options = {};

    $.extend(options, parameters);

    methods.init = function () {
        $.support.cors = true;
        if(typeof self.modules !== 'undefined') {
            $.each(self.modules, function (index, Module) {
                self.modules[index] = new Module(self, index);
                self.modules[index].dispatch();
            });
        }
    };

    this.displayFormErrors = function (form, errors) {
        $.each(errors.errorMap || errors, function (key, val) {
            $('[name=\"' + key + '\"]').closest('.form-group').find('.help-block').html(val);
            $('[name=\"' + key + '\"]').closest('.form-group').addClass('has-error');
        });
    };

    this.clearErrors = function(form) {
        $.each(form.find(':input'), function(key,val){
            $(val).closest('.form-group').removeClass('has-error');
            $(val).closest('.form-group').find('.help-block').html('');
        });
    };

    this.makeApiCall = function(url, data, success) {
        $.ajax({
            url: '/api',
            type: 'POST',
            dataType: 'json',
            data: $.extend(data, {url: url}),
            success: success,
            error: function (response, status) {
                console.log(response, status);
            }
        });
    };

    this.dispatch = function () {
        methods.init();
    };

};
Inventory.prototype.modules = {};


$(document).ready(function(){
    var inventory = new Inventory({
        token : function () {
            return $('body').data('token');
        },
        userId : function () {
            return $('body').data('user-id');
        }
    });
    inventory.dispatch();
});

//Extensions
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
$.fn.clearForm = function() {
    $(this)
    .trigger('reset')
    .find('input[type="hidden"], input[type="password"], input[type="file"], select, textarea')
    .val('')
    .end()
    .find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
    $(this).clearFormErrors();
    return $(this);
};
$.fn.clearFormErrors = function() {
    $.each($(this).find(':input'), function(key,val){
        $(val).closest('.form-group').removeClass('has-error');
        $(val).closest('.form-group').find('.help-block').html('');
    });
    return $(this);
};
