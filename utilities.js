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
	}
} 