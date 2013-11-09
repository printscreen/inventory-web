ItemType = function (itemId, itemTypeId, base) {
    var self = this,
        base = base,
        itemId = itemId,
        itemTypeId = itemTypeId,
        item = item,
        attributes = [],
        values = [],
        rules = {},
        methods = {};


    this.display = function (container) {
        var html = '';
        self.reset(container);
        container.html('<div class="row text-center"><p><img src="/img/loading.gif"></p><p>Loading...</p></div>');
        methods.loadAttributes();
        html += '<input type="hidden"';
        console.log(methods.getAttributes());
        $.each(attributes, function (key, val) {
            console.log(val);
        });
    };

    this.reset = function (container) {
        container.find('form').remove();
        container.html('');
        self.rules = {};
    };

    methods.loadAttributes = function () {
        base.makeApiCall('default/item/get-item-type-attribute', {
            itemTypeId : itemTypeId
        }, function(result) {
                methods.setAttributes(result.itemTypeAttributes);
                methods.loadItem();
            }
        , false
        );
    };

    methods.loadItem = function () {
        if(!isNaN(parseInt(itemId))) {
            base.makeApiCall('default/item/get-item', {
                itemId : itemId
            }, function(result) {
                    self.item = result.item;
                }
            , false
            );
        } else {
            self.item = {};
        }
    };

    methods.setAttributes = function (attr) {
        console.log(attr);
        attributes = attr;
    };

    methods.getAttributes = function (attributes) {
        return attributes;
    };

};



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

ItemTypeAttributeGeneral = ItemTypeAttributeAlphanumeric;
ItemTypeAttributeNumbers = ItemTypeAttributeAlphanumeric;
ItemTypeAttributeText = ItemTypeAttributeAlphanumeric;