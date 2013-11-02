var
ItemTypeAttributeFactory = function (type) {
    var self = this,
        type = type;
    this.create = function (options) {
        try {
            return new window[type](options);
        } catch (err) {
            console.log(err.message);x
        }
    };
},

ItemTypeAttributeAlphanumeric = function (options) {
    var self = this,
        methods = {};

    this.init = function () {
        methods.build();
        methods.form();
    };

    methods.build = function () {
        $(options.form).html(
            '<div class="form-group">' +
                '<label class="col-lg-3 control-label" for="name">Field Name</label>' +
                '<div class="controls col-lg-6">' +
                    '<input type="text" class="form-control" name="name" />' +
                    '<p class="help-block"></p>' +
                '</div>' +
            '</div>'
        );
    };

    methods.form = function () {
        $(options.form).validate({
            rules: {
                name: 'required'
            },
            messages : {
                name: 'Please enter a name'
            },
            showErrors: function () {},
            invalidHandler: options.displayFormErrors,
            submitHandler: methods.save
        });
    };

    methods.save = function () {
        options.makeApiCall('admin/item/edit-item-type-attribute'
            , $.extend({
                itemTypeId : options.itemTypeId,
                itemAttributeTypeId : options.itemAttributeTypeId
            }, $(options.form).serializeObject())
            , function(result) {
                options.deconstruct();
            }
        );
    };
};

ItemTypeAttributeText = ItemTypeAttributeAlphanumeric;
ItemTypeAttributeNumbers = ItemTypeAttributeAlphanumeric;
ItemTypeAttributeTextArea = ItemTypeAttributeAlphanumeric;

ItemTypeAttributeOptional = function (options) {
    var self = this,
        methods = {};

    this.init = function () {
        methods.build();
        methods.form();
        methods.listeners();
    };

    methods.build = function () {
        $(options.form).html(
            '<div class="form-group">' +
                '<label class="col-lg-3 control-label" for="name">Name</label>' +
                '<div class="controls col-lg-6">' +
                    '<input type="text" class="form-control" name="name" />' +
                    '<p class="help-block"></p>' +
                '</div>' +
            '</div>' +
            '<div class="item-options" tabindex="-1">' +
                '<div class="form-group">' +
                    '<label class="col-lg-3 control-label" for="name">Option</label>' +
                    '<div class="controls col-lg-6">' +
                        '<div class="input-group">' +
                            '<input type="text" class="form-control" name="value[]" />' +
                            '<span class="input-group-addon"><span class="glyphicon glyphicon-plus"></span></span>' +
                        '</div>' +
                        '<p class="help-block"></p>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    };

    methods.listeners = function () {
        $(options.form).on('click', '.input-group-addon', function () {
            if($(this).find('.glyphicon').hasClass('glyphicon-plus')) {
                $(this).closest('.form-group')
                .clone()
                .insertAfter(options.form+' .form-group:last')
                .find('input')
                .val('');

                $(this).closest('.item-options').scrollTop(
                    $(this).closest('.item-options')
                    .get(0)
                    .scrollHeight
                );

                $(this).find('.glyphicon')
                .removeClass('glyphicon-plus')
                .addClass('glyphicon-trash');
            } else {
                $(this).closest('.form-group').remove();
            }
        });
    };

    methods.form = function () {
        $(options.form).validate({
            rules: {
                name: 'required',
                'value[]': {
                    required: true
                }
            },
            messages : {
                name: 'Please enter a name',
                'value[]' : 'You must enter an option'
            },
            showErrors: function () {},
            invalidHandler: options.displayFormErrors,
            submitHandler: methods.save
        });
    };

    methods.save = function () {
        options.makeApiCall('admin/item/edit-item-type-attribute'
            , $.extend({
                itemTypeId : options.itemTypeId,
                itemAttributeTypeId : options.itemAttributeTypeId
            }, $(options.form).serializeObject())
            , function(result) {
                options.deconstruct();
            }
        );
    };
};

ItemTypeAttributeSelect = ItemTypeAttributeOptional;
ItemTypeAttributeMultiSelect = ItemTypeAttributeOptional;

ItemTypeAttributeRange = function (options) {
    var self = this,
        methods = {};

    this.init = function () {
        methods.build();
        methods.form();
    };

    methods.build = function () {
        $(options.form).html(
            '<div class="form-group">' +
                '<label class="col-lg-3 control-label" for="name">Field Name</label>' +
                '<div class="controls col-lg-6">' +
                    '<input type="text" class="form-control" name="name" />' +
                    '<p class="help-block"></p>' +
                '</div>' +
            '</div>'+
            '<div class="form-group">' +
                '<label class="col-lg-3 control-label" for="name">Minimum</label>' +
                '<div class="controls col-lg-6">' +
                    '<input type="text" class="form-control" name="min" />' +
                    '<p class="help-block"></p>' +
                '</div>' +
            '</div>'+
            '<div class="form-group">' +
                '<label class="col-lg-3 control-label" for="name">Maximum</label>' +
                '<div class="controls col-lg-6">' +
                    '<input type="text" class="form-control" name="max" />' +
                    '<p class="help-block"></p>' +
                '</div>' +
            '</div>'
        );
    };

    methods.form = function () {
        $(options.form).validate({
            rules: {
                name: 'required',
                min: {
                    required: true,
                    digits: true,
                    min: 0
                },
                max : {
                    required: true,
                    digits: true,
                    min: function () {
                        return parseInt(
                            $(options.form).find('input[name="min"]').val()
                        ) + 1;
                    }
                }
            },
            messages : {
                name: 'Please enter a name',
                'value[]' : 'You must enter an option'
            },
            showErrors: function () {},
            invalidHandler: options.displayFormErrors,
            submitHandler: methods.save
        });
    };

    methods.save = function () {
        var formValues = $(options.form).serializeObject();
        options.makeApiCall('admin/item/edit-item-type-attribute', {
                itemTypeId : options.itemTypeId,
                itemAttributeTypeId : options.itemAttributeTypeId,
                name: formValues.name,
                'value[]': Array(formValues.min, formValues.max)
            } , function(result) {
                options.deconstruct();
            }
        );
    };
};