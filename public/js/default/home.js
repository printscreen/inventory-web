Inventory.prototype.modules.home = function (base, index) {
    "use strict";
    var self = this,
        methods = {},
        sort = 3,
        offset = 0,
        limit = 20,
        active = true,
        locationId = null,
        pictureUploader = {};

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

    methods.getPictures = function (itemId) {
        base.makeApiCall('default/image/view', {
            itemId: itemId,
            isThumbnail: true
        },
        function(result) {
            var html = '',
                chunk = [];
            while (result.images && result.images.length > 0) {
                chunk = result.images.splice(0,3);
                html += methods.buildItemPictureRowHtml(chunk);
            }
            $('#item-images').html(html);
        });
    };

    methods.deletePicture = function(itemImageId, itemId) {
        base.makeApiCall('default/image/delete', {
            itemImageId: itemImageId
        },
        function(result) {
            methods.getPictures(itemId);
            $('#edit-picture-modal').modal('hide');
        });
    };

    methods.makeDefaultPicture = function(itemImageId, itemId) {
        base.makeApiCall('default/image/make-default', {
            itemImageId: itemImageId
        },
        function(result) {
            if(result.success) {
               $('#make-default-picture').html('<span class="badge">default image</span>');
               methods.getPictures(itemId);
               $('a[data-item-id="'+ itemId +'"]')
               .closest('.caption')
               .prev()
               .prop('src', '/image/index/image/' +  itemImageId);
            }
        });
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
                           '<img src="/' + ( val.itemImageId ?
                                ('image/index/image/' + val.itemImageId) :
                                'img/default/default-item.png'
                            ) +
                            '">' +
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

    methods.buildItemPictureRowHtml = function (images) {
        var html = '<div class="row">';
        $.each(images || [], function (key, val) {
            html += '<div class="col-sm-6 col-md-4 item">' +
                        '<div class="thumbnail">' +
                            '<img src="/image/index/image/' + val.itemImageId + '" '+
                            'class="item-image" ' +
                            'data-item-image-id="' + val.itemImageId + '" '+
                            'data-item-id="' + val.itemId + '" '+
                            'data-is-default="' + val.defaultImage + '" '+
                            '>' +
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

    methods.uplaodPicture = function(itemId) {
        self.pictureUploader = new AjaxUpload($('#add-picture'), {
            action: '/api',
            name: 'image',
            data: {
                url: 'default/image/add',
                itemId: itemId
            },
            onChange: function(file, extension) {
                var infoArea = $('#add-picture').next();
                if(methods.isValidImage(extension)) {
                    infoArea.removeClass('hide').html(
                        '<strong>Image Selected: </strong>' + file
                    );
                    $('#save-picture').removeClass('disabled').prop('disabled', false);
                } else {
                    infoArea.removeClass('hide').html(
                        '<p class="text-danger">' +
                            file + ' is not a valid image' +
                        '</p>'
                    );
                    $('#save-picture').addClass('disabled').prop('disabled', true);
                }
            },
            onSubmit: function(file, extension) {
                var infoArea = $('#add-picture').next();
                if(!methods.isValidImage(extension)) {
                    infoArea.removeClass('hide').html(
                        '<p class="text-danger">' +
                            file + ' is not a valid image' +
                        '</p>'
                    );
                    $('#save-picture').addClass('disabled').prop('disabled', true);
                    return false;
                }
                return true;
            },
            autoSubmit: false,
            responseType: 'json',
            timeout: 300,
            onComplete: function(file, response) {
                if(response.success) {
                    $('#picture-modal').modal('hide');
                    methods.getPictures(itemId);
                    if(response.thumbnail.defaultImage) {
                        $('a[data-item-id="'+ response.thumbnail.itemId +'"]')
                           .closest('.caption')
                           .prev()
                           .prop('src', '/image/index/image/' +  response.thumbnail.itemImageId);
                    }
                }
            }
        });
    };

    methods.isValidImage = function(extension) {
        var validExtensions = ['jpg', 'gif', 'png'];
         return validExtensions.indexOf(
                    extension.trim()
                    .toLowerCase()
                ) > -1;
    };

    this.dispatch = function () {
        methods.getLocations($('#filter-locations'), '');
        $('#save-picture').click(function(){
            self.pictureUploader.submit();
        });

        $('#filter-locations').on('change select', function() {
            methods.getUnits($(this).val(), $('#filter-units'), false);
            methods.getItemTypes($(this).val(),$('#filter-item-type'), true);
            methods.setLocationText();
        });

        $('#display-item').on('click', '.thumbnail img', function() {
            var itemId = $(this).next().find('.edit-item').data('item-id');
            methods.getPictures(itemId);
            methods.uplaodPicture(itemId);

            $('#display-item').addClass('hide');
            $('#picture-item')
                .removeClass('hide')
                .find('h1 span').html(
                    $(this).next().find('h3').html()
                );
        });
        $('#picture-item').on('click', '.thumbnail img', function() {
            var html = '';
            $('#edit-picture-form input[name="itemImageId"]').val($(this).data('item-image-id'));
            $('#edit-picture-form input[name="itemId"]').val($(this).data('item-id'));
            $('#edit-picture-form img').prop('src', '/image/index/image/' + $(this).data('item-image-id'));
            if($(this).data('is-default') == '1') {
                html = '<span class="badge">default image</span>'
            } else {
                html = '<button type="button" class="btn btn-info">Make Default Image</button>'
            }
            $('#make-default-picture').html(html);
            $('#edit-picture-modal').modal('show');
        });

        $('#edit-picture-form').on('click', '#delete-picture', function() {
            methods.deletePicture (
                $('#edit-picture-form input[name="itemImageId"]').val(),
                $('#edit-picture-form input[name="itemId"]').val()
            );
        });

        $('#make-default-picture').on('click', 'button', function() {
            methods.makeDefaultPicture (
                $('#edit-picture-form input[name="itemImageId"]').val(),
                $('#edit-picture-form input[name="itemId"]').val()
            );
        });

        $('#cancel-add-item-picture').click(function() {
            $('#picture-item').addClass('hide');
            $('#display-item').removeClass('hide');
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

        $('#picture-modal').on('hidden.bs.modal', function (e) {
            $('#add-picture').next().addClass('hide').html('');
            $('#save-picture').addClass('disabled').prop('disabled', true);
        });

    };

};