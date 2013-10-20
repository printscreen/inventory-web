var Inventory = function (parameters) {
    "use strict";
    var self = this,
    methods = {},
    options = {
       appUrl : 'http://mystoragepal.com/',
       apiUrl : 'http://api.mystoragepal.com/',
       token : function () {},
       userId : function () {}
    };

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
            console.log(key, val);
            $('[name=\"' + key + '\"]').closest('.form-group').find('.help-block').html(val);
            $('[name=\"' + key + '\"]').closest('.form-group').addClass('has-error');
        });
    };

    this.clearErrors = function(form) {
        $.each(form.find(':input, :select'), function(key,val){
            $(val).closest('.form-group').removeClass('has-error');
            $(val).closest('.form-group').find('.help-block').html('');
        });
    };

    this.makeApiCall = function(url, data, success) {
        $.ajax({
            url: options.apiUrl + url,
            async: true,
            type: 'POST',
            dataType: 'jsonp',
            data: $.extend(data, {token: self.getToken()}),
            success: success,
            complete: function(response, moo, meow){
                //console.log(response, moo, meow);
            },
            error: function (response, status) {
                console.log(response, status);
            },
            statusCode: {
                401: function () {
                    console.log('IM HERE!');
                }
            }
        });
    };

    this.getToken = function () {
        return options.token();
    };

    this.getUserId = function () {
        return options.userId();
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