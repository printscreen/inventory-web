Inventory.ItemType = function (itemId, itemTypeId, base, deconstruct) {
    var self = this,
        base = base,
        itemId = itemId,
        itemTypeId = itemTypeId,
        item = item || {},
        attributes = [],
        attributeValues = {},
        values = [],
        rules = {},
        methods = {};


    this.display = function (container) {
        var html = '';
        self.reset(container);
        container.html('<div class="row text-center"><p><img src="/img/loading.gif"></p><p>Loading...</p></div>');
        methods.loadAttributes(container);
    };

    this.reset = function (container) {
    	var form = container.closest('form');
        form.unbind('submit');
    	$.removeData(form.get(0), 'validator');
        container.html('');
        self.rules = {};
    };

    methods.loadAttributes = function (container) {
        base.makeApiCall('default/item/get-item-type-attribute', {
            itemTypeId: itemTypeId
        }, function(result) {
                self.attributes = result.itemTypeAttributes;
                methods.loadItem(container);
            }
        );
    };

    methods.loadItem = function (container) {
        if(!isNaN(parseInt(itemId))) {
            base.makeApiCall('default/item/get-item', {
                itemId : itemId
            }, function(result) {
                    self.item = result.item;
                    self.attributeValues = $.parseJSON(result.item.attribute);
                    methods.buildForm(container);
                }
            );
        } else {
            self.item = {};
            methods.buildForm(container);
        }
    };

    methods.buildForm = function (container) {
    	var element = {},
    		form = container.closest('form'),
    		validator = {
    			rules : {
                    itemTypeId: {
                        required: true,
                        digits: true
                    },
    				name: 'required',
    				count: {
    					required: true,
    					digits: true
    				},
    			},
    			messages : {
                    itemTypeId: {
                        required: 'You must provide an item type',
                        digits: 'Invalid Value'
                    },
    				name: 'A name is required',
    				count: {
    					required: 'You must provide a quantity',
    					digits: 'Can only be numbers'
    				}
    			},
                showErrors: function () {},
                invalidHandler: base.displayFormErrors,
                submitHandler: function() {
                	methods.saveForm(form);
                }
    		},
    		html = methods.getDefaultItemFormHtml();
    	$.each(self.attributes || [], function (key, val) {
    		element = new Inventory['ItemType' + val.itemAttributeTypeName](val, (self.attributeValues || {}));
    		html += element.build();
    		$.extend(true, validator, element.validator());
    	});
    	container.html(html);
    	form.validate(validator);
    	return validator;
    };

    methods.saveForm = function (form) {
        console.log('here!');
    	var formAttributes = {};
    	$.each(form.find('.attribute'), function(key,val) {
    	    formAttributes[$(val).attr('name')] = $(val).val();
    	});
    	base.makeApiCall('default/item/edit', {
            itemId: form.find('input[name="itemId"]').val(),
            itemTypeId: itemTypeId,
            unitId: $('#filter-units').val(),
            name: form.find('input[name="name"]').val(),
            description: form.find('input[name="description"]').val(),
            location: form.find('input[name="location"]').val(),
            attributes: JSON.stringify(formAttributes),
            count: form.find('input[name="count"]').val(),
        }, function(result) {
        	deconstruct();
            }
        );

    };

    methods.getDefaultItemFormHtml = function () {
        if(self.item.itemId) {
            $('#add-item-type').val(itemTypeId).prop('disabled', true);
        }
    	return '' +
    		'<div class="form-group item-form-hide">' +
				'<label for="name" class="col-lg-3 control-label input-lg">Name</label>' +
				'<div class="controls col-lg-6 input-group">' +
					'<input type="hidden" name="itemId" value="' +
                        (self.item.itemId || '') + '"/>' +
		  			'<input type="text" name="name" class="form-control input-lg" value="' +
                        (self.item.name || '') + '"/>' +
		  			'<span class="input-group-addon">required</span>' +
				'</div>' +
				'<p class="help-block"></p>' +
			'</div>' +
			'<div class="form-group item-form-hide">' +
				'<label for="count" class="col-lg-3 control-label input-lg">How many do you have?</label>' +
				'<div class="controls col-lg-6 input-group">' +
		  			'<input type="text" name="count" class="form-control input-lg" value="' +
                    (self.item.count || '1') + '"/>' +
		  			'<span class="input-group-addon">required</span>' +
				'</div>' +
	  			'<p class="help-block"></p>' +
			'</div>' +
			'<div class="form-group item-form-hide">' +
				'<label for="item-type" class="col-lg-3 control-label input-lg">Description</label>' +
				'<div class="controls col-lg-6">' +
		  			'<input type="text" name="description" class="form-control input-lg" value="' +
                    (self.item.description || '') + '"/>' +
				'</div>' +
	  			'<p class="help-block"></p>' +
			'</div>' +
			'<div class="form-group item-form-hide">' +
				'<label for="location" class="col-lg-3 control-label input-lg">Location</label>' +
				'<div class="controls col-lg-6">' +
		  			'<input type="text" name="location" class="form-control input-lg" value="' +
                    (self.item.location || '') + '"/>' +
				'</div>' +
				'<p class="help-block"></p>' +
			'</div>';
    };
};

Inventory.ItemTypeAlphanumeric = function (options, values) {
    var self = this,
    	options = options;
    this.build = function () {
    	var html =
            '<div class="form-group">' +
                '<label class="col-lg-3 control-label input-lg" for="name">'+ options.name + '</label>' +
                '<div class="controls col-lg-6">' +
                    '<input type="text" class="form-control input-lg attribute" name="'+ options.name + '" '+
                    'value="'+ (values[options.name] || '') + '"/>' +
                    '<p class="help-block"></p>' +
                '</div>' +
            '</div>'
        ;
    	return html;
    };

    this.validator = function () {
    	var ruleValue = {},
    		messageValue = {};

    	ruleValue[options.name] = {
    		required: false,
    		digits: (options.itemAttributeTypeName === 'Numbers')
    	};

    	messageValue[options.name] = {
    		digits: 'You can only enter numbers'
    	};

    	return {
    		rules: ruleValue,
    		messages: messageValue
    	};
    };
};

Inventory.ItemTypeText = Inventory.ItemTypeAlphanumeric;
Inventory.ItemTypeNumbers = Inventory.ItemTypeAlphanumeric;

Inventory.ItemTypeTextArea = function (options, values) {
    var self = this,
	options = options;

	this.build = function () {
		var html =
	        '<div class="form-group">' +
	            '<label class="col-lg-3 control-label input-lg" for="name">'+ options.name + '</label>' +
	            '<div class="controls col-lg-6">' +
	                '<textarea class="form-control input-lg attribute" name="'+ options.name + '" >'+
                    (values[options.name] || '') +'</textarea>' +
	                '<p class="help-block"></p>' +
	            '</div>' +
	        '</div>'
	    ;
		return html;
	};

	this.validator = function () {
		var ruleValue = {},
			messageValue = {};

		ruleValue[options.name] = {
			required: false
		};

		messageValue[options.name] = {
			required: ''
		};

		return {
			rules: ruleValue,
			messages: messageValue,
		};
	};
};

Inventory.ItemTypeSelect = function (options, values) {
    var self = this,
	options = options;

	this.build = function () {
		var select = '',
			html = '';

		$.each(options.value, function (key, val) {
			select += '<option value="' + val + '" '+
            (values[options.name] === val ? ' selected="selected"' : '')
            +'>' + val + '</option>';
		});

		html =
	        '<div class="form-group">' +
	            '<label class="col-lg-3 control-label input-lg" for="name">'+ options.name + '</label>' +
	            '<div class="controls col-lg-6">' +
	                '<select class="form-control input-lg attribute" name="'+ options.name + '" ' +
	                	(options.itemAttributeTypeName === 'MultiSelect' ? 'multipule ' : '')  + '>' +
	                	select +
	                '</select>' +
	                '<p class="help-block"></p>' +
	            '</div>' +
	        '</div>'
	    ;
		return html;
	};

	this.validator = function () {
		var ruleValue = {},
			messageValue = {};

		ruleValue[options.name] = {
			required: false
		};

		messageValue[options.name] = {
			required: ''
		};

		return {
			rules: ruleValue,
			messages: messageValue,
		};
	};
};
Inventory.ItemTypeMultiSelect = Inventory.ItemTypeSelect;