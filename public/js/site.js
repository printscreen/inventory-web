var Inventory = {
    modules : {},
    init : function() {
        "use strict";
        $.ajaxSetup({
            cache: false
        });
        // Alert and redirect on session timeout
        $.ajaxPrefilter(function (options) {
            var originalSuccess = options.success,
                sessionHasExpired = function (data) {
                    var orgData = data;
                    if (typeof (orgData) === 'string') {
                        try {
                            orgData = $.parseJSON(orgData);
                        } catch (e) {
                            return false;
                        }
                    }
                    if (typeof (orgData) === 'undefined' || orgData === null || !orgData.sessionExpired) {
                        return false;
                    }
                    return true;
                },
                alertAndRedirect = function (response) {
                    var data = response;
                    if(typeof response !== "object") {
                        data = jQuery.parseJSON(response) || {}; 
                    }
                    if(data.url) {
                        if(data.message) {
                            alert(data.message);
                        }
                        window.location.href = data.url;
                    } else {
                        alert('Your session has expired.');
                        window.location.href = '/auth/login'; 
                    }          
                    return false;
                };
            options.success = function (data, textStatus, jqXHR) {
                if (sessionHasExpired(data)) {
                    jqXHR.isResolved = function () { return false; };
                    return alertAndRedirect(data);
                }
                if (typeof (originalSuccess) === 'function') {
                    return originalSuccess(data, textStatus, jqXHR);
                }
            };
        });
    }
};
$(document).ready(function(){
    Inventory.init();
});