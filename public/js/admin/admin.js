Inventory.prototype.modules.admin = function (base, index) {
    "use strict";
    var self = this,
        methods = {};
    
    methods.listeners = function () {
        
    };
    
    this.dispatch = function () {
        methods.listeners();
    };
};