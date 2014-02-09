Inventory.prototype.modules.admin = function (base, index) {
    "use strict";
    var self = this,
        methods = {};

    methods.populateLocations = function(locations, select, defaultOption) {
        var options = defaultOption ? '<option value="">Select a location</option>' : '';
        $.each(locations || {}, function (key, val) {
            options +=
                '<option value="' + val.locationId + '">'
                    + val.name +
                '</option>';
        });
        console.log('hERE!');
        select.html(options);
    };

    methods.populateModules = function(modules, select, locationId) {
        var options = '';
        if(modules.length === 0) {
            select.html('<option value="">No modules available</option>');
            return;
        }
        options += '<option value="">Select a module</option>';
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

    methods.getLocations = function (select, defaultOption) {
        base.makeApiCall('default/location/view', {
        }, function(result) {
                methods.populateLocations(
                    result.userLocations.userLocations,
                    select,
                    defaultOption
                );
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

    this.dispatch = function () {
        $('#modules-dropdown').on('show.bs.dropdown', function () {
            methods.getLocations(
                $('#modules-dropdown select[name="location"]'),
                'Please select a location'
            );
        });

        $('#modules-dropdown').on('hide.bs.dropdown', function () {
            $('#modules-dropdown select[name="module"]')
            .prop('disabled', true)
            .html('<option value="">Select a module</option>');
        });

        $('#modules-dropdown select[name="location"]').change(function() {
            var moduleSelect = $('#modules-dropdown select[name="module"]');
            moduleSelect.prop('disabled', true);
            if($(this).val() == '') {
                return;
            }
            methods.getModules(
                $(this).val(),
                false,
                moduleSelect
            );
            moduleSelect.prop('disabled', false);
        });

        $('#modules-dropdown select[name="module"]').change(function() {
            if($(this).val() != '') {
                window.location = '/'
                    + $(this).find('option:selected').text().toLowerCase()
                    + '/admin?locationId='
                    + $('#modules-dropdown select[name="location"]').val();
            }
        });
    };
};