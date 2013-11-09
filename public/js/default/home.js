Inventory.prototype.modules.home = function (base, index) {
    "use strict";
    var self = this,
        methods = {},
        sort = 3,
        offset = 0,
        limit = 20,
        active = true,
        locationId = null;

    methods.populateLocations = function(locations, select, defaultOption) {
        var options = defaultOption ? '<option value="">Select a Location</option>' : '';
        $.each(locations || {}, function (key, val) {
            options +=
                '<option value="' + val.locationId + '">'
                    + val.name +
                '</option>';
        });
        select.html(options);
    };

    methods.populateUnits = function(units, select, defaultOption) {
        var options = defaultOption ? '<option value="">Select a Unit</option>' : '';
        $.each(locations || {}, function (key, val) {
            options +=
                '<option value="' + val.unitId + '">'
                    + val.name +
                '</option>';
        });
        select.html(options);
    };

    methods.getItemTypes = function (locationId, select) {
        base.makeApiCall('default/item/get-location-item-type', {
            locationId : locationId
        }, function(result) {
                methods.populateItemTypes(
                    result.itemTypes,
                    select,
                    'All'
                );
                methods.populateItemTypes(
                    result.itemTypes,
                    $('.item-type'),
                    'Select an item type'
                );
                $(select).trigger('change');
            }
        );
    };

    methods.populateItemTypes = function (itemTypes, select, defaultOption) {
        var options = defaultOption ? '<option value="">' + defaultOption +' </option>' : '';
        $.each(itemTypes || {}, function (key, val) {
            options +=
                '<option value="' + val.itemTypeId + '">'
                    + val.name +
                '</option>';
        });
        select.html(options);
    };

    methods.getLocations = function (select, defaultOption) {
        base.makeApiCall('default/location/view', {
        }, function(result) {
                methods.populateLocations(
                    result.userLocations.userLocations,
                    select,
                    defaultOption
                );
                methods.setLocationText();
                $(select).trigger('change');
            }
        );
    };

    methods.getUnits = function (locationId, select, defaultOption) {
        base.makeApiCall('default/unit/view', {
            locationId: locationId
        }, function(result) {
                methods.populateLocations(
                    result.units,
                    select,
                    defaultOption
                );
                methods.setUnitText();
                $(select).trigger('change');

                methods.displayInventory(
                    $(select).val()
                );
            }
        );
    };

    methods.displayInventory = function (unitId) {
        base.makeApiCall('default/item/view-by-unit', {
            unitId: unitId
        }, function(result) {
                methods.populateInventory(result);
            }
        );
    };

    methods.setLocationText = function (text) {
        $('#change-location span.location').html(
            text || $('#filter-locations option:selected').text()
        );
    };

    methods.setUnitText = function (text) {
        $('#change-location span.unit').html(
            text || $('#filter-units option:selected').text()
        );
    };

    methods.getItems = function (itemTypeId, unitId) {
        base.makeApiCall('default/item/view-by-unit', {
            itemTypeId: itemTypeId
        }, function(result) {

            }
        );
    };

    methods.populateInventory = function (items) {

    };

    this.dispatch = function () {
        $('#filter-locations').on('change select', function(){
            methods.getUnits($(this).val(), $('#filter-units'), false);
            methods.getItemTypes($(this).val(),$('#filter-item-type'), true);
        });
        $('#filter-item-type').change(function () {
            $('.page-header small:first').text(
                ':' + $(this).find('option:selected').text()
            );
        });
        $('#add-item').click(function() {
            $('#edit-item-modal').modal('show');
        });
        methods.getLocations($('#filter-locations'), '');

        $('#add-item-type').change(function() {
            var item = new ItemType(null, $(this).val(), base);
            if($(this).val() != '') {
                item.display($('#item-form-body'));
            } else {
                item.reset($('#item-form-body'));
            }

        });
    };
};