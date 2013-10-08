'use strict';

var type = require('type')

module.exports = validateArray;

function validateArray(){
  var valid = true
  if (type(this.instance())!=='array') return (valid);
  valid = validateArrayLength.call(this) && valid;
  valid = validateArrayUniqueItems.call(this) && valid;
  valid = validateArrayItems.call(this) && valid;
  return (valid);
}

function validateArrayLength(){
  var min = this.property('minItems')
    , max = this.property('maxItems')
    , instance = this.instance()
    , valid = true

  if (min){
    valid = this.assert(instance.length >= min,
                        "has less than the minimum number of items",
                        "minItems"
                       ) && valid;
  }
  if (max){
    valid = this.assert(instance.length <= max,
                        "has greater than the maximum number of items",
                        "maxItems"
                       ) && valid;
  }
  return (valid);
}

function validateArrayUniqueItems(){
  var unique = this.get('uniqueItems')
    , valid = true
  
  //TODO
  return (valid);
}

function validateArrayItems(){
  var items = this.get('items')
    , additional = this.property('additionalItems')
    , additionalSchema = this.get('additionalItems')
    , instance = this.instance()
    , valid = true;
  if (!items) return (valid);
  if (items.nodeType == 'SchemaArray'){
    for (var i=0;i<instance.length;++i){
      var schema = items.get(i)
      if (schema){
        var ctx = this.subcontext(['items',i].join('/'),i)
        valid = ctx.validate() && valid;
      } else if (type(additional)=='boolean') {
        valid = this.assert(additional,
                            "contains additional items",
                            "additionalItems"
                           ) && valid;
      } else if (additionalSchema){
        var ctx = this.subcontext('additionalItems',i)
        valid = ctx.validate() && valid;
      }
    }
  } else if (items.nodeType == 'Schema') {
     for (var i=0;i<instance.length;++i){
       var ctx = this.subcontext('items',i)
       valid = ctx.validate() && valid
     }
  }
  return (valid);
}

/*
ValidatorContext.prototype.validateArrayUniqueItems = function validateArrayUniqueItems(data, schema) {
	if (schema.uniqueItems) {
		for (var i = 0; i < data.length; i++) {
			for (var j = i + 1; j < data.length; j++) {
				if (recursiveCompare(data[i], data[j])) {
					var error = (this.createError(ErrorCodes.ARRAY_UNIQUE, {match1: i, match2: j})).prefixWith(null, "uniqueItems");
					if (this.handleError(error)) {
						return error;
					}
				}
			}
		}
	}
	return null;
};
*/

