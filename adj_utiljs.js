/*
adj_utilJS
MIT X11 License
Copyright (C) 2012 Anders D. Johnson <AndersDJohnson@gmail.com>
*/

/*
 * Allow use as CommonJS module
 */
(function(){
  var define;
  if (typeof define !== 'function') {
    define = require('amdefine')(module);
  }
  /*
   * Define AMD module
   */
  define(function(){
    var module, types, typeOf, isObject, isArray, getName, isInt, array_random, clone, extend, setOptions, inherits;
    module = {
      exports: {}
    };
    types = {
      'undefined': 'undefined',
      'number': 'number',
      'boolean': 'boolean',
      'string': 'string',
      '[object Function]': 'function',
      '[object RegExp]': 'regexp',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object Error]': 'error'
    };
    /**
     * Returns the typeOf of a variable as a string.
     */
    module.exports.typeOf = typeOf = function(o){
      return types[typeof o] || types[Object.prototype.toString.call(o)] || (o ? 'object' : 'null');
    };
    /**
     *
     */
    module.exports.isObject = isObject = function(value){
      return typeof value === 'object' && typeof value.length !== 'undefined';
    };
    /**
     *
     */
    module.exports.isArray = isArray = function(value){
      return typeof value === 'object' && typeof value.length !== 'undefined';
    };
    /**
     *
     */
    module.exports.getName = getName = function(thing){
      var funcNameRegex, results;
      if (typeof this.name !== 'undefined') {
        return this.name;
      } else {
        funcNameRegex = /function (.{1,})\(/;
        results = funcNameRegex.exec(thing.constructor.toString());
        return results && results.length > 1 ? results[1] : "";
      }
    };
    /**
     *
     */
    module.exports.isInt = isInt = function(n){
      return module.exports.getName(n) === 'Number' && parseFloat(n) === parseInt(n) && !isNaN(n);
    };
    /**
     *
     */
    module.exports.array_random = array_random = function(array){
      return Math.round(Math.random() * array.length);
    };
    /**
     *
     */
    module.exports.clone = clone = function(src){
      var neu, k, v, _i, _len, _own = {}.hasOwnProperty;
      if (typeof src !== 'object' || src === null) {
        return src;
      }
      neu = new src.constructor();
      if (src instanceof Object) {
        for (k in src) if (_own.call(src, k)) {
          v = src[k];
          neu[k] = clone(v);
        }
      } else if (src instanceof Array) {
        neu = [];
        for (_i = 0, _len = src.length; _i < _len; ++_i) {
          v = src[_i];
          neu.push(clone(v));
        }
      }
      return neu;
    };
    /**
     * Recursively extend a destination object with a source object. 
     * Only set undefined properties in the destination object.
     * Merge objects and concat arrays defined in both by the same key.
     */
    module.exports.extend = extend = function(src, dest){
      var key, srcVal, destVal, _results = [];
      for (key in src) {
        srcVal = src[key];
        destVal = dest[key];
        if (isObject(srcVal) && isObject(destVal)) {
          _results.push(dest[key] = extend(srcVal, destVal));
        } else if (isArray(srcVal) && isArray(destVal)) {
          _results.push(dest[key] = srcVal.concat(destVal));
        } else if (typeof destVal === 'undefined') {
          _results.push(dest[key] = srcVal);
        }
      }
      return dest;
    };
    module.exports.setOptions = setOptions = function(options, defaults){
      if (typeof options === 'undefined') {
        options = {};
      }
      return extend(defaults, options);
    };
    /**
     * Multiple inheritance for class prototypes.
     * @param Child class to inherit into
     * @param Parents array of classes to inherit from, by descending precedence
     * @param options
     */
    module.exports.inherits = inherits = function(Child, Parents, options){
      var Parent, i, key, srcVal, destVal, _len, _results = [];
      setOptions(options, {
        concat: true,
        merge: true
      });
      for (Parent = 0, _len = Parents.length; Parent < _len; ++Parent) {
        i = Parents[Parent];
        for (key in Parent.prototype) {
          srcVal = Parent.prototype[key];
          destVal = Child.prototype[key];
          if (options.merge && isObject(srcVal) && isObject(destVal)) {
            _results.push(extend(srcVal, destVal));
          } else if (options.concat && isArray(srcVal) && isArray(destVal)) {
            _results.push(Child.prototype[key] = srcVal.concat(destVal));
          } else if (typeof Child.prototype[key] === 'undefined') {
            _results.push(Child.prototype[key] = srcVal);
          }
        }
      }
      return _results;
    };
    return module.exports;
  });
  /*
  module.exports.mkdirpSync = (dir) ->
  	path = require "path"
  	fs = require "fs"
  	
  	# normalize and resolve path to an absolute one:
  	# (path.resolve automatically uses the current directory if needed)
  	dir = path.resolve path.normalize dir
  
  	# try to create this directory:
  	try
  		# XXX hardcoding recommended file mode of 511 (0777 in octal)
  		# (note that octal numbers are disallowed in ES5 strict mode)
  		fs.mkdirSync dir, 511
  
  	# and if we fail, base action based on why we failed:
  	catch e
  		if e.code is 'EEXIST'
  		# base case: if the path already exists, we're good to go.
  		# TODO account for this path being a file, not a dir?
  			return
  
  		# recursive case: some directory in the path doesn't exist, so
  		# make this path's parent directory.
  		else if e.code is 'ENOENT'
  			mkdirpSync path.dirname dir
  			mkdirpSync dir
  
  		else
  			throw e
  */
}).call(this);
