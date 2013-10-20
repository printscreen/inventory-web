Inventory.prototype.modules.adminItem = function (base, index) {
    "use strict";
    var self = this,
        methods = {},
        sort = 2,
        offset = 0,
        limit = 20,
        active = true,
        wasDragged = false;

    methods.saveItemTypeForm = function () {
        base.makeApiCall(
              'admin/item/edit-item-type'
            , $('#item-type-form form').serializeObject()
            , function(result) {
                if(result.success) {
                    methods.getItemTypes();
                    $('#item-type-form').modal('hide');
                } else {
                    base.displayFormErrors(
                        $('#item-type-form form'),
                        result.errors
                    );
                }
            }
        );
    };

    methods.form = function () {
        $('#item-type-form form').validate({
            rules: {
                itemTypeId : {
                    required: function(){
                        return $('#item-type-form form')
                        .find('input[name="itemTypeId"]')
                        .is(':disabled');
                    },
                    digits: true
                },
                name: 'required'
            },
            messages : {
                name: 'Please enter a name'
            },
            showErrors: function () {},
            invalidHandler: base.displayFormErrors,
            submitHandler: methods.saveItemTypeForm
        });
    };

    methods.getItemTypes = function () {
        base.makeApiCall('admin/item/view-item-type', {
            }, function(result) {
                methods.populateItemTypes(
                    result.itemTypes
                );
            }
        );
    };

    methods.getItemType = function (itemTypeId) {
        base.makeApiCall('admin/item/get-item-type', {
                itemTypeId: itemTypeId
            }, function(result) {
                methods.populateItemTypeForm(result.itemType, result.canDelete);
            }
        );
    };

    methods.deleteItemType = function (itemTypeId) {
        base.makeApiCall('admin/item/delete-item-type', {
                itemTypeId: itemTypeId
            }, function(result) {
                methods.getItemTypes();
            }
        );
    };

    methods.getItemAttributeTypes = function (itemTypeId) {
        base.makeApiCall('admin/item/view-item-attribute-type', {
            }, function(result) {
                methods.populateItemAttributeTypes(
                    result.itemAttributeTypes
                );
            }
        );
    };

    methods.getItemTypeAttributes = function (itemTypeId) {
        base.makeApiCall('admin/item/view-item-type-attribute', {
                itemTypeId: itemTypeId,
                sort: 7
            }, function(result) {
                methods.populateItemTypeAttributes(
                    result.itemTypeAttributes
                );
            }
        );
    };

    methods.getItemTypeAttribute = function (itemTypeAttributeId) {
        base.makeApiCall('admin/item/get-item-type-attribute', {
                itemTypeAttributeId : itemTypeAttributeId
            }, function(result) {
                methods.populateItemTypeAttribute(
                    result.itemTypeAttribute,
                    result.canDelete
                );
            }
        );
    };

    methods.getLocations = function () {
        base.makeApiCall('admin/location/view', {
            }, function(result) {
                methods.populateLocations(
                    result.locations
                );
            }
        );
    };

    methods.getLocationItemTypes = function (locationId) {
        base.makeApiCall('admin/item/location-item-type', {
                locationId : locationId
            }, function(result) {
                methods.populateLocationItemTypes(
                    result.itemTypeLocations
                );
            }
        );
    };

    methods.getLocationAvailableItemTypes = function (locationId) {
        base.makeApiCall('admin/item/location-available-item-type', {
                locationId : locationId
            }, function(result) {
                methods.populateLocationAvailableItemTypes(
                    result.itemTypes
                );
            }
        );
    };

    methods.deleteItemTypeAttribute = function (itemTypeAttributeId) {
        base.makeApiCall('admin/item/delete-item-type-attribute', {
                itemTypeAttributeId : itemTypeAttributeId
            }, function(result) {
                methods.getItemTypeAttributes(
                    $('#item-type-search').val()
                );
            }
        );
    };

    methods.populateLocationItemTypes = function (itemTypeLocations) {
        var select = '';
        $.each(itemTypeLocations || {}, function (key, val) {
            select += '<option value="' + val.itemTypeId + '">' +
                        val.itemTypeName + '</option>';
        });
        $('#locations select[name="delete"]').html(select);
    };

    methods.populateLocationAvailableItemTypes = function (itemTypes) {
        var select = '';
        $.each(itemTypes || {}, function (key, val) {
            select += '<option value="' + val.itemTypeId + '">' +
                        val.name + '</option>';
        });
        $('#locations select[name="add"]').html(select);
    };

    methods.populateItemTypeAttribute = function (itemTypeAttribute, canDelete) {
        $('#delete-item-type-attribute').toggleClass('hide', !canDelete);
        $('#submit-item-type-attribute-form').toggleClass('hide', true);
        $('#attribute-form').remove();
        $('#item-attribute-type-form form').append('<form class="form-horizontal" id="attribute-form"></form>');
        $('#delete-item-type-attribute').data('data-type-attribute-id', itemTypeAttribute.itemTypeAttributeId);
        var form = $('#item-attribute-type-form form');
        form.find('select[name="itemAttributeTypeId"]')
        .addClass('disable')
        .prop('disabled', true)
        .val(itemTypeAttribute.itemAttributeTypeId);

        var html =
            '<div class="form-group">' +
                '<label class="col-lg-3 control-label" for="name">Name</label>' +
                '<div class="controls col-lg-6">'+
                    '<input type="text" class="form-control disable" disabled="disabled" value="' + itemTypeAttribute.name + '" />' +
                '</div>' +
            '</div>' +
            '<div class="item-options" tabindex="-1">';
        $.each(itemTypeAttribute.value || {}, function (key, val) {
            html +=
            '<div class="form-group">' +
                '<label class="col-lg-3 control-label" for="name">Option</label>' +
                '<div class="controls col-lg-6">'+
                    '<input type="text" class="form-control disable" disabled="disabled" value="' + val + '" />' +
                '</div>' +
            '</div>';
        });
        html += '</div>';
        $('#attribute-form').html(html);
    };

    methods.populateItemTypeAttributes = function (itemTypeAttribtes) {
        var body = '';
        $.each(itemTypeAttribtes || {}, function (key, val) {
            body +=
                '<tr data-item-type-attribute-id="' + val.itemTypeAttributeId + '">' +
                    '<td>'+ val.name + '</td>' +
                    '<td>'+ val.itemAttributeTypeName + '</td>' +
                    '<td class="col-md-1"><span class="glyphicon glyphicon-sort"></span></td>' +
                '</tr>';
        });
        $('table.attributes tbody').html(body);
        $('table.attributes tbody').sortable({
            helper : function (event, ui) {
                    ui.children().each(function() {
                    $(this).width($(this).width());
                });
                return ui;
            },
            update : function (event, ui) {
                $(this).sortable('disable');
                methods.setOrderNumber(
                    $(ui.item).data('item-type-attribute-id'),
                    $(ui.item).index() + 1,
                    $(this)
                );
                self.wasDragged = true;
            }
        }).disableSelection();
    };

    methods.setOrderNumber = function (itemTypeAttributeId, newOrderNumber, tbody) {
        base.makeApiCall('admin/item/edit-item-type-attribute-order', {
                itemTypeAttributeId : itemTypeAttributeId,
                newOrderNumber : newOrderNumber
            }, function(result) {
                tbody.sortable('enable');
            }
        );
    };

    methods.populateItemTypes = function (itemTypes) {
        var body = '',
            select = '<option value="">Select an Item Type</option>';
        $.each(itemTypes || {}, function (key, val) {
            body +=
                '<tr data-item-type-id="' + val.itemTypeId + '">' +
                    '<td>'+ val.name + '</td>' +
                '</tr>';
            select += '<option value="' + val.itemTypeId + '">' +
                        val.name + '</option>';
        });
        $('table.types tbody').html(body);
        $('#item-type-search').html(select);
    };

    methods.populateLocations = function (locations) {
        var select = '<option value="">Select a Location</option>';
        $.each(locations || {}, function (key, val) {
            select += '<option value="' + val.locationId + '">' +
                        val.name + '</option>';
        });
        $('#location-search').html(select);
    };

    methods.populateItemAttributeTypes = function (itemAttributeTypes) {
        var select = '<option value="">Select an Attribute</option>';
        $.each(itemAttributeTypes || {}, function (key, val) {
            select += '<option value="' + val.itemAttributeTypeId + '">' +
                       val.name + '</option>';
        });
        $('#item-attribute-type-form select[name="itemAttributeTypeId"]').html(select);
    };

    methods.populateItemTypeForm = function (itemType, canDelete) {
        var form = $('#item-type-form form');
        form.find('input[name="itemTypeId"]').val(itemType.itemTypeId);
        form.find('input[name="name"]').val(itemType.name);
        $('#delete-item-type').toggleClass('hide', !canDelete);
    };

    methods.showItemTypeForm = function (itemTypeId) {
        $('#item-type-form form').clearForm();
        $('#delete-item-type').addClass('hide');
        if(!isNaN(parseInt(itemTypeId))) {
            $('#item-type-form form').find('input[name="itemTypeId"]').prop('disabled', false);
            methods.getItemType(itemTypeId);
            $('#item-type-form .modal-header h4').html('Edit Item Type');
        } else {
            $('#item-type-form form').find('input[name="itemTypeId"]').prop('disabled', true);
            $('#item-type-form .modal-header h4').html('Add Item Type');
        }
        $('#item-type-form').modal('show');
    };

    methods.showItemAttributeTypeForm = function (itemTypeAttributeId) {
        $('#item-attribute-type-form form').clearForm();
        $('#submit-item-type-attribute-form').toggleClass('hide', false);
        $('#item-attribute-type-form form :input').removeClass('disable').removeAttr('disabled');
        $('#delete-item-type-attribute').toggleClass('hide', true);
        if(!isNaN(parseInt(itemTypeAttributeId))) {
            $('#item-attribute-type-form form').find('input[name="itemTypeAttributeId"]').prop('disabled', false);
            methods.getItemTypeAttribute(itemTypeAttributeId);
            $('#item-attribute-type-form .modal-header h4').html('Edit Item Type Attribute');
        } else {
            $('#item-attribute-type-form form').find('input[name="itemTypeAttributeId"]').prop('disabled', true);
            $('#item-attribute-type-form .modal-header h4').html('Add Item Type Attribute');
        }
        $('#item-attribute-type-form').modal('show');
    };

    methods.editItemTypes = function (isAdd) {
        var to = isAdd ? $('#locations select[name="delete"]') : $('#locations select[name="add"]'),
            from = isAdd ? $('#locations select[name="add"]') : $('#locations select[name="delete"]'),
            options = from.find('option:selected').remove(),
            itemTypeIds = [];

        $.each(options, function (key, val) {
            itemTypeIds.push($(val).val());
        });
        base.makeApiCall(
                isAdd ? 'admin/item/add-location-item-type' : 'admin/item/delete-location-item-type', {
                locationId: $('#location-search').val(),
                itemTypeIds: itemTypeIds
            }, function(result) {
                if(result.success) {
                    options.appendTo(to);
                }
            }
        );
    };

    this.dispatch = function () {
        methods.form();
        methods.getItemTypes();
        methods.getItemAttributeTypes();
        methods.getLocations();
        $('#item-tabs a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });
        $('#location-search').change(function () {
            $('.manage-locations').html('');
            if($(this).val() !== '') {
                methods.getLocationItemTypes($(this).val());
                methods.getLocationAvailableItemTypes($(this).val());
            }
        });
        $('#add-item-type').click(function(){
            methods.showItemTypeForm(true);
        });
        $('#add-item-attribute-type').click(function(){
            methods.showItemAttributeTypeForm();
        });
        $('#submit-item-type-form').click(function(){
            $('#item-type-form form').submit();
        });
        $('#delete-item-type').click(function(){
            methods.deleteItemType(
                $('#item-type-form form').find('input[name="itemTypeId"]').val()
            );
            $('#item-type-form').modal('hide');
        });
        $('.types tbody').on('click', 'tr', function() {
            methods.showItemTypeForm($(this).data('item-type-id'));
        });
        $('.attributes tbody').on('click', 'tr', function(event) {
            if(!self.wasDragged) {
                methods.showItemAttributeTypeForm($(this).data('item-type-attribute-id'));
            } else {
                self.wasDragged = false;
            }
        });
        $('#item-type-search').change(function() {
            $('table.attributes tbody').html('');
            if($(this).val() !== '') {
                methods.getItemTypeAttributes($(this).val());
                $('#add-item-attribute-type').toggleClass('hide', false);
            } else {
                $('#add-item-attribute-type').toggleClass('hide', true);
            }
        });
        $('#item-attribute-type-form').on('hidden.bs.modal', function () {
            $('#attribute-form').remove();
        });
        $('#submit-item-type-attribute-form').click(function() {
            $('#attribute-form').submit();
        });
        $('.modify-location').click(function (e) {
            e.preventDefault();
            methods.editItemTypes($(this).data('toggle') == 'add');
        });
        $('#delete-item-type-attribute').click(function () {
            methods.deleteItemTypeAttribute(
                $(this).data('data-type-attribute-id')
            );
        });
        $('select[name="itemAttributeTypeId"]').change(function() {
            $('#attribute-form').remove();
            $('#item-attribute-type-form form').append('<form class="form-horizontal" id="attribute-form"></form>');
            if($(this).val() == '') {
                return false;
            }
            var factory = new ItemTypeAttributeFactory(
                'ItemTypeAttribute' + $(this).find('option:selected').text()
            ),
            attribute = factory.create({
                form : '#attribute-form',
                itemAttributeTypeId : $(this).val(),
                itemTypeId : $('#item-type-search').val(),
                displayFormErrors : base.displayFormErrors,
                makeApiCall : base.makeApiCall,
                deconstruct: function () {
                    $('#item-attribute-type-form').modal('hide');
                    $('#item-type-search').trigger('change');
                }
            });
            attribute.init();
        });
    };
};