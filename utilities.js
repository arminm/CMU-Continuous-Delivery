module.exports = {

	// Replacer excludes unwanted keys from the copy of an object.
	// e.g. returning Users without exposing the password or the
	// id could user: replacer(user, ['id', 'password'])
	replacer: function(obj, keys) {
		var dup = {};
    	for (key in obj) {
        	if (keys.indexOf(key) == -1) {
            	dup[key] = obj[key];
        	}
    	}
    	return dup;
	},

	// areEqual compares simple 1-level objects with scalar values (Won't work
  // with arrays or nested objects!)
	areEqual: function(obj1, obj2) {
		if (!obj1 || !obj2 || Object.keys(obj1).length !== Object.keys(obj2).length) {
			return false;
		}

	  for (var key in obj1) {
	    if (obj1.key != obj2.key) {
	      return false;
	    }
	  }

	  return true;
	},

  // Merges objects by adding the items of obj2 to obj1.
	// WARNING: overlapping keys will be overwritten by obj2.
	mergeObjects: function(obj1, obj2) {
		if (!obj1) {
			return obj2;
		} else if (!obj2) {
			return obj1;
		}

		for (var key in obj2) { obj1[key] = obj2[key];};
		return obj1;
	}

}
