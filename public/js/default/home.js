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
                    $(select).val(),
                    $('#filter-item-type').val(),
                    false
                );
            }
        );
    };

    methods.displayInventory = function (unitId, itemTypeId, showToast) {
        base.makeApiCall('default/item/view-by-unit', {
            unitId: unitId,
            itemTypeId: itemTypeId
        }, function(result) {
                methods.populateInventory(
                    result.filteredItems,
                    result.recentlyModified
                );
                if(showToast) {
                    methods.saveToast();
                }
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

    methods.populateInventory = function (filteredItems, recentlyModified) {
        var html = '',
            chunk = [];
        while (filteredItems && filteredItems.length > 0) {
            chunk = filteredItems.splice(0,3);
            html += methods.buildItemRowHtml(chunk);
        }
        $('#items').html(html);
        $('#recent-items').html(methods.buildItemRowHtml(recentlyModified));
    };

    methods.buildItemRowHtml = function (items) {
        var html = '<div class="row">';
        $.each(items || [], function (key, val) {
            html += '<div class="col-sm-6 col-md-4 item">' +
                        '<div class="thumbnail">' +
                            '<img src="/img/default/default-item.png">' +
                            '<div class="caption">' +
                                '<h3>' + val.name + '</h3>' +
                                '<p>Description: ' + val.description + '</p>' +
                                '<p>Location: ' + val.location + '</p>' +
                                '<div class="item-controls">' +
                                    '<a href="#" class="btn btn-default">Quantity ' + val.count + '</a> ' +
                                    '<a href="#" class="btn btn-primary edit-item" data-item-type-id="' + val.itemTypeId +'"' +
                                        'data-item-id="' + val.itemId +'">&nbsp;Edit&nbsp;</a>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
        });
        html += '</div>';
        return html;
    };

    methods.saveToast = function () {
        var parent = $('#recent-items .thumbnail:first');
        parent.css([{
            'border-color': '#66afe9',
            'outline': '0',
            '-webkit-box-shadow': 'inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6)',
            'box-shadow': 'inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6)'
        }][0])
        .find('.item-controls').hide(1, function() {
            var element = $(this);
            element.after('<div class="alert alert-success">Saved</div>');
            element.next().fadeOut(4000, function () {
                element.show();
                parent.css([{
                    'border-color': '#dddddd',
                    'outline': '0',
                    '-webkit-box-shadow': 'none',
                    'box-shadow': 'none'
                }][0]);
            });
        });
    };

    methods.showForm = function (showForm) {
    	$('#display-item').toggleClass('hide', showForm);
        $('#modify-item').toggleClass('hide', !showForm);
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
            methods.displayInventory(
                $('#filter-units').val(),
                $('#filter-item-type').val(),
                false
            );
        });
        $('#add-item').click(function() {
            $('#add-item-type').prop('disabled', false);
            $('#item-form').get(0).reset();
            $('#item-form-body').html('');
        	methods.showForm(true);
            $('#modify-item h1').html('Add an item');
        });
        methods.getLocations($('#filter-locations'), '');

        $('#cancel-save-item').click(function () {
        	methods.showForm(false);
        });

        $('#items, #recent-items').on('hide.bs.collapse', function () {
            $(this).prev()
            .find('span[data-toggle="collapse"]')
            .removeClass('glyphicon-chevron-down')
            .addClass('glyphicon-chevron-up');
        });

        $('#items, #recent-items').on('show.bs.collapse', function () {
            $(this).prev()
            .find('span[data-toggle="collapse"]')
            .removeClass('glyphicon-chevron-up')
            .addClass('glyphicon-chevron-down');
        });

        $('#add-item-type').change(function() {
            var item = new Inventory.ItemType(
        		null,
        		$(this).val(),
        		base,
        		function() {
        			methods.showForm(false);
        			methods.displayInventory(
        				$('#filter-units').val(),
                        $('#filter-item-type').val(),
                        true
        			);
        		}
            );
            if($(this).val() != '') {
                item.display($('#item-form-body'));
                $('.item-form-hide').toggleClass('hide', false);
            } else {
                item.reset($('#item-form-body'));
                $('.item-form-hide').toggleClass('hide', true);
            }

        });
        $('#display-item').on('click', '.edit-item', function() {
            var item = new Inventory.ItemType(
                $(this).data('item-id'),
                $(this).data('item-type-id'),
                base,
                function() {
                    methods.showForm(false);
                    methods.displayInventory(
                        $('#filter-units').val(),
                        $('#filter-item-type').val(),
                        true
                    );
                }
            );
            item.display($('#item-form-body'));
            $('.item-form-hide').toggleClass('hide', false);
            methods.showForm(true);
        });
    };
};