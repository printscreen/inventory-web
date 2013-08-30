var Inventory = function (parameters) {
    "use strict";
    var self = this,
    methods = {},
    options = {
       appUrl : 'http://mystoragepal.com/',
       apiUrl : 'http://api.mystoragepal.com/',
       token : function () {}
    };
    
    $.extend(options, parameters);
    
    methods.init = function () {
        if(typeof self.modules !== 'undefined') {
            $.each(self.modules, function (index, Module) {
                self.modules[index] = new Module(self, index);
                self.modules[index].dispatch();
            });  
        }
    };
    
    this.displayFormErrors = function (form, errors) {
        $.each(errors.errorMap || errors, function (key, val) {
            $('[name=\"' + key + '\"]').closest('.control-group').find('.help-block').html(val);
            $('[name=\"' + key + '\"]').closest('.control-group').addClass('error');
        });
    };
    
    this.clearErrors = function(form) {
        $.each(form.find(':input'), function(key,val){
            $(val).closest('.control-group').removeClass('error');
            $(val).closest('.control-group').find('.help-block').html('');
        });
    };
    
    this.makeApiCall = function(url, data, success) {
        $.ajax({
            url: options.apiUrl + url,
            async: true,
            type: 'GET',
            dataType: 'jsonp',
            data: $.extend(data, {token: self.getToken()}),
            success: success,
            error: function (a,b,c) {
                console.log(a,b,c);
            }
        });
    };
    
    this.getToken = function () {
        return options.token();
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
    return $(this);
};