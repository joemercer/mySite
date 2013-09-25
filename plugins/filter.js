var _ = require('underscore');

module.exports = function(env, callback){

	env.helpers.filter = function(items, minItems, maxItems){

	  options = env.config.filter || {
	  	'tags': ['default'],
	  	'importance': 0
	  };

	  var filtered = [];
	  _.each(items, function(item){

	  	// Check tags.
	  	var tagCheck = false;
	  	var done = false;
	  	_.each(item.tags, function(tag){
	  		if( !done && _.contains(options.tags, tag) ){
	  			tagCheck = true;
	  			done = true;
	  		}
	  	});

	  	// Check importance.
	  	var importanceCheck = false;
	  	if (item.importance > options.importance){
	  		importanceCheck = true;
	  	}

	  	// Add to filtered.
	  	if (tagCheck && importanceCheck){
	  		filtered.push(item);
	  	}
	  });

	  if (filtered.length < minItems){
	  	return false;
	  }
	  else if (filtered.length > maxItems){
	  	return filtered.splice(0, maxItems);
	  }
	  else{
	  	return filtered;
	  }

	};

	return callback();
}