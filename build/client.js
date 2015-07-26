/**
 * @license
 * lodash 3.10.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern -o ./lodash.js`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '3.10.0';

  /** Used to compose bitmasks for wrapper metadata. */
  var BIND_FLAG = 1,
      BIND_KEY_FLAG = 2,
      CURRY_BOUND_FLAG = 4,
      CURRY_FLAG = 8,
      CURRY_RIGHT_FLAG = 16,
      PARTIAL_FLAG = 32,
      PARTIAL_RIGHT_FLAG = 64,
      ARY_FLAG = 128,
      REARG_FLAG = 256;

  /** Used as default options for `_.trunc`. */
  var DEFAULT_TRUNC_LENGTH = 30,
      DEFAULT_TRUNC_OMISSION = '...';

  /** Used to detect when a function becomes hot. */
  var HOT_COUNT = 150,
      HOT_SPAN = 16;

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Used to indicate the type of lazy iteratees. */
  var LAZY_FILTER_FLAG = 1,
      LAZY_MAP_FLAG = 2;

  /** Used as the `TypeError` message for "Functions" methods. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag = '[object ArrayBuffer]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match empty string literals in compiled template source. */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match HTML entities and HTML characters. */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
      reUnescapedHtml = /[&<>"'`]/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source),
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to match template delimiters. */
  var reEscape = /<%-([\s\S]+?)%>/g,
      reEvaluate = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

  /**
   * Used to match `RegExp` [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns)
   * and those outlined by [`EscapeRegExpPattern`](http://ecma-international.org/ecma-262/6.0/#sec-escaperegexppattern).
   */
  var reRegExpChars = /^[:!,]|[\\^$.*+?()[\]{}|\/]|(^[0-9a-fA-Fnrtuvx])|([\n\r\u2028\u2029])/g,
      reHasRegExpChars = RegExp(reRegExpChars.source);

  /** Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks). */
  var reComboMark = /[\u0300-\u036f\ufe20-\ufe23]/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /** Used to match [ES template delimiters](http://ecma-international.org/ecma-262/6.0/#sec-template-literal-lexical-components). */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect hexadecimal string values. */
  var reHasHexPrefix = /^0[xX]/;

  /** Used to detect host constructors (Safari > 5). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^\d+$/;

  /** Used to match latin-1 supplementary letters (excluding mathematical operators). */
  var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;

  /** Used to ensure capturing order of template delimiters. */
  var reNoMatch = /($^)/;

  /** Used to match unescaped characters in compiled string literals. */
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

  /** Used to match words to create compound words. */
  var reWords = (function() {
    var upper = '[A-Z\\xc0-\\xd6\\xd8-\\xde]',
        lower = '[a-z\\xdf-\\xf6\\xf8-\\xff]+';

    return RegExp(upper + '+(?=' + upper + lower + ')|' + upper + '?' + lower + '|' + upper + '+|[0-9]+', 'g');
  }());

  /** Used to assign default `context` object properties. */
  var contextProps = [
    'Array', 'ArrayBuffer', 'Date', 'Error', 'Float32Array', 'Float64Array',
    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Math', 'Number',
    'Object', 'RegExp', 'Set', 'String', '_', 'clearTimeout', 'isFinite',
    'parseFloat', 'parseInt', 'setTimeout', 'TypeError', 'Uint8Array',
    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap'
  ];

  /** Used to make template sourceURLs easier to identify. */
  var templateCounter = -1;

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dateTag] = typedArrayTags[errorTag] =
  typedArrayTags[funcTag] = typedArrayTags[mapTag] =
  typedArrayTags[numberTag] = typedArrayTags[objectTag] =
  typedArrayTags[regexpTag] = typedArrayTags[setTag] =
  typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
  cloneableTags[dateTag] = cloneableTags[float32Tag] =
  cloneableTags[float64Tag] = cloneableTags[int8Tag] =
  cloneableTags[int16Tag] = cloneableTags[int32Tag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[stringTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[mapTag] = cloneableTags[setTag] =
  cloneableTags[weakMapTag] = false;

  /** Used to map latin-1 supplementary letters to basic latin letters. */
  var deburredLetters = {
    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
    '\xc7': 'C',  '\xe7': 'c',
    '\xd0': 'D',  '\xf0': 'd',
    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
    '\xcC': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
    '\xeC': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
    '\xd1': 'N',  '\xf1': 'n',
    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
    '\xc6': 'Ae', '\xe6': 'ae',
    '\xde': 'Th', '\xfe': 'th',
    '\xdf': 'ss'
  };

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
  };

  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#96;': '`'
  };

  /** Used to determine if values are of the language type `Object`. */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Used to escape characters for inclusion in compiled regexes. */
  var regexpEscapes = {
    '0': 'x30', '1': 'x31', '2': 'x32', '3': 'x33', '4': 'x34',
    '5': 'x35', '6': 'x36', '7': 'x37', '8': 'x38', '9': 'x39',
    'A': 'x41', 'B': 'x42', 'C': 'x43', 'D': 'x44', 'E': 'x45', 'F': 'x46',
    'a': 'x61', 'b': 'x62', 'c': 'x63', 'd': 'x64', 'e': 'x65', 'f': 'x66',
    'n': 'x6e', 'r': 'x72', 't': 'x74', 'u': 'x75', 'v': 'x76', 'x': 'x78'
  };

  /** Used to escape characters for inclusion in compiled string literals. */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Detect free variable `exports`. */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global && global.Object && global;

  /** Detect free variable `self`. */
  var freeSelf = objectTypes[typeof self] && self && self.Object && self;

  /** Detect free variable `window`. */
  var freeWindow = objectTypes[typeof window] && window && window.Object && window;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it's the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root = freeGlobal || ((freeWindow !== (this && this.window)) && freeWindow) || freeSelf || this;

  /*--------------------------------------------------------------------------*/

  /**
   * The base implementation of `compareAscending` which compares values and
   * sorts them in ascending order without guaranteeing a stable sort.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {number} Returns the sort order indicator for `value`.
   */
  function baseCompareAscending(value, other) {
    if (value !== other) {
      var valIsNull = value === null,
          valIsUndef = value === undefined,
          valIsReflexive = value === value;

      var othIsNull = other === null,
          othIsUndef = other === undefined,
          othIsReflexive = other === other;

      if ((value > other && !othIsNull) || !valIsReflexive ||
          (valIsNull && !othIsUndef && othIsReflexive) ||
          (valIsUndef && othIsReflexive)) {
        return 1;
      }
      if ((value < other && !valIsNull) || !othIsReflexive ||
          (othIsNull && !valIsUndef && valIsReflexive) ||
          (othIsUndef && valIsReflexive)) {
        return -1;
      }
    }
    return 0;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for callback shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {Function} predicate The function invoked per iteration.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromRight) {
    var length = array.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without support for binary searches.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    if (value !== value) {
      return indexOfNaN(array, fromIndex);
    }
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.isFunction` without support for environments
   * with incorrect `typeof` results.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   */
  function baseIsFunction(value) {
    // Avoid a Chakra JIT bug in compatibility modes of IE 11.
    // See https://github.com/jashkenas/underscore/issues/1621 for more details.
    return typeof value == 'function' || false;
  }

  /**
   * Converts `value` to a string if it's not one. An empty string is returned
   * for `null` or `undefined` values.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    return value == null ? '' : (value + '');
  }

  /**
   * Used by `_.trim` and `_.trimLeft` to get the index of the first character
   * of `string` that is not found in `chars`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @param {string} chars The characters to find.
   * @returns {number} Returns the index of the first character not found in `chars`.
   */
  function charsLeftIndex(string, chars) {
    var index = -1,
        length = string.length;

    while (++index < length && chars.indexOf(string.charAt(index)) > -1) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimRight` to get the index of the last character
   * of `string` that is not found in `chars`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @param {string} chars The characters to find.
   * @returns {number} Returns the index of the last character not found in `chars`.
   */
  function charsRightIndex(string, chars) {
    var index = string.length;

    while (index-- && chars.indexOf(string.charAt(index)) > -1) {}
    return index;
  }

  /**
   * Used by `_.sortBy` to compare transformed elements of a collection and stable
   * sort them in ascending order.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @returns {number} Returns the sort order indicator for `object`.
   */
  function compareAscending(object, other) {
    return baseCompareAscending(object.criteria, other.criteria) || (object.index - other.index);
  }

  /**
   * Used by `_.sortByOrder` to compare multiple properties of a value to another
   * and stable sort them.
   *
   * If `orders` is unspecified, all valuess are sorted in ascending order. Otherwise,
   * a value is sorted in ascending order if its corresponding order is "asc", and
   * descending if "desc".
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {boolean[]} orders The order to sort by for each property.
   * @returns {number} Returns the sort order indicator for `object`.
   */
  function compareMultiple(object, other, orders) {
    var index = -1,
        objCriteria = object.criteria,
        othCriteria = other.criteria,
        length = objCriteria.length,
        ordersLength = orders.length;

    while (++index < length) {
      var result = baseCompareAscending(objCriteria[index], othCriteria[index]);
      if (result) {
        if (index >= ordersLength) {
          return result;
        }
        var order = orders[index];
        return result * ((order === 'asc' || order === true) ? 1 : -1);
      }
    }
    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
    // that causes it, under certain circumstances, to provide the same value for
    // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
    // for more details.
    //
    // This also ensures a stable sort in V8 and other engines.
    // See https://code.google.com/p/v8/issues/detail?id=90 for more details.
    return object.index - other.index;
  }

  /**
   * Used by `_.deburr` to convert latin-1 supplementary letters to basic latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */
  function deburrLetter(letter) {
    return deburredLetters[letter];
  }

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeHtmlChar(chr) {
    return htmlEscapes[chr];
  }

  /**
   * Used by `_.escapeRegExp` to escape characters for inclusion in compiled regexes.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @param {string} leadingChar The capture group for a leading character.
   * @param {string} whitespaceChar The capture group for a whitespace character.
   * @returns {string} Returns the escaped character.
   */
  function escapeRegExpChar(chr, leadingChar, whitespaceChar) {
    if (leadingChar) {
      chr = regexpEscapes[chr];
    } else if (whitespaceChar) {
      chr = stringEscapes[chr];
    }
    return '\\' + chr;
  }

  /**
   * Used by `_.template` to escape characters for inclusion in compiled string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(chr) {
    return '\\' + stringEscapes[chr];
  }

  /**
   * Gets the index at which the first occurrence of `NaN` is found in `array`.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched `NaN`, else `-1`.
   */
  function indexOfNaN(array, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 0 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      var other = array[index];
      if (other !== other) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Checks if `value` is object-like.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   */
  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }

  /**
   * Used by `trimmedLeftIndex` and `trimmedRightIndex` to determine if a
   * character code is whitespace.
   *
   * @private
   * @param {number} charCode The character code to inspect.
   * @returns {boolean} Returns `true` if `charCode` is whitespace, else `false`.
   */
  function isSpace(charCode) {
    return ((charCode <= 160 && (charCode >= 9 && charCode <= 13) || charCode == 32 || charCode == 160) || charCode == 5760 || charCode == 6158 ||
      (charCode >= 8192 && (charCode <= 8202 || charCode == 8232 || charCode == 8233 || charCode == 8239 || charCode == 8287 || charCode == 12288 || charCode == 65279)));
  }

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = -1,
        result = [];

    while (++index < length) {
      if (array[index] === placeholder) {
        array[index] = PLACEHOLDER;
        result[++resIndex] = index;
      }
    }
    return result;
  }

  /**
   * An implementation of `_.uniq` optimized for sorted arrays without support
   * for callback shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} [iteratee] The function invoked per iteration.
   * @returns {Array} Returns the new duplicate-value-free array.
   */
  function sortedUniq(array, iteratee) {
    var seen,
        index = -1,
        length = array.length,
        resIndex = -1,
        result = [];

    while (++index < length) {
      var value = array[index],
          computed = iteratee ? iteratee(value, index, array) : value;

      if (!index || seen !== computed) {
        seen = computed;
        result[++resIndex] = value;
      }
    }
    return result;
  }

  /**
   * Used by `_.trim` and `_.trimLeft` to get the index of the first non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the first non-whitespace character.
   */
  function trimmedLeftIndex(string) {
    var index = -1,
        length = string.length;

    while (++index < length && isSpace(string.charCodeAt(index))) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimRight` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */
  function trimmedRightIndex(string) {
    var index = string.length;

    while (index-- && isSpace(string.charCodeAt(index))) {}
    return index;
  }

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  function unescapeHtmlChar(chr) {
    return htmlUnescapes[chr];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new pristine `lodash` function using the given `context` object.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'foo': _.constant('foo') });
   *
   * var lodash = _.runInContext();
   * lodash.mixin({ 'bar': lodash.constant('bar') });
   *
   * _.isFunction(_.foo);
   * // => true
   * _.isFunction(_.bar);
   * // => false
   *
   * lodash.isFunction(lodash.foo);
   * // => false
   * lodash.isFunction(lodash.bar);
   * // => true
   *
   * // using `context` to mock `Date#getTime` use in `_.now`
   * var mock = _.runInContext({
   *   'Date': function() {
   *     return { 'getTime': getTimeMock };
   *   }
   * });
   *
   * // or creating a suped-up `defer` in Node.js
   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
   */
  function runInContext(context) {
    // Avoid issues with some ES3 environments that attempt to use values, named
    // after built-in constructors like `Object`, for the creation of literals.
    // ES5 clears this up by stating that literals must use built-in constructors.
    // See https://es5.github.io/#x11.1.5 for more details.
    context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;

    /** Native constructor references. */
    var Array = context.Array,
        Date = context.Date,
        Error = context.Error,
        Function = context.Function,
        Math = context.Math,
        Number = context.Number,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /** Used for native method references. */
    var arrayProto = Array.prototype,
        objectProto = Object.prototype,
        stringProto = String.prototype;

    /** Used to resolve the decompiled source of functions. */
    var fnToString = Function.prototype.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to generate unique IDs. */
    var idCounter = 0;

    /**
     * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objToString = objectProto.toString;

    /** Used to restore the original `_` reference in `_.noConflict`. */
    var oldDash = root._;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Native method references. */
    var ArrayBuffer = context.ArrayBuffer,
        clearTimeout = context.clearTimeout,
        parseFloat = context.parseFloat,
        pow = Math.pow,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        Set = getNative(context, 'Set'),
        setTimeout = context.setTimeout,
        splice = arrayProto.splice,
        Uint8Array = context.Uint8Array,
        WeakMap = getNative(context, 'WeakMap');

    /* Native method references for those with the same name as other `lodash` methods. */
    var nativeCeil = Math.ceil,
        nativeCreate = getNative(Object, 'create'),
        nativeFloor = Math.floor,
        nativeIsArray = getNative(Array, 'isArray'),
        nativeIsFinite = context.isFinite,
        nativeKeys = getNative(Object, 'keys'),
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeNow = getNative(Date, 'now'),
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random;

    /** Used as references for `-Infinity` and `Infinity`. */
    var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY,
        POSITIVE_INFINITY = Number.POSITIVE_INFINITY;

    /** Used as references for the maximum length and index of an array. */
    var MAX_ARRAY_LENGTH = 4294967295,
        MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
        HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

    /**
     * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
     * of an array-like value.
     */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /** Used to store function metadata. */
    var metaMap = WeakMap && new WeakMap;

    /** Used to lookup unminified function names. */
    var realNames = {};

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps `value` to enable implicit chaining.
     * Methods that operate on and return arrays, collections, and functions can
     * be chained together. Methods that retrieve a single value or may return a
     * primitive value will automatically end the chain returning the unwrapped
     * value. Explicit chaining may be enabled using `_.chain`. The execution of
     * chained methods is lazy, that is, execution is deferred until `_#value`
     * is implicitly or explicitly called.
     *
     * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
     * fusion is an optimization strategy which merge iteratee calls; this can help
     * to avoid the creation of intermediate data structures and greatly reduce the
     * number of iteratee executions.
     *
     * Chaining is supported in custom builds as long as the `_#value` method is
     * directly or indirectly included in the build.
     *
     * In addition to lodash methods, wrappers have `Array` and `String` methods.
     *
     * The wrapper `Array` methods are:
     * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`,
     * `splice`, and `unshift`
     *
     * The wrapper `String` methods are:
     * `replace` and `split`
     *
     * The wrapper methods that support shortcut fusion are:
     * `compact`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `filter`,
     * `first`, `initial`, `last`, `map`, `pluck`, `reject`, `rest`, `reverse`,
     * `slice`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `toArray`,
     * and `where`
     *
     * The chainable wrapper methods are:
     * `after`, `ary`, `assign`, `at`, `before`, `bind`, `bindAll`, `bindKey`,
     * `callback`, `chain`, `chunk`, `commit`, `compact`, `concat`, `constant`,
     * `countBy`, `create`, `curry`, `debounce`, `defaults`, `defaultsDeep`,
     * `defer`, `delay`, `difference`, `drop`, `dropRight`, `dropRightWhile`,
     * `dropWhile`, `fill`, `filter`, `flatten`, `flattenDeep`, `flow`, `flowRight`,
     * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
     * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
     * `invoke`, `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`,
     * `matchesProperty`, `memoize`, `merge`, `method`, `methodOf`, `mixin`,
     * `modArgs`, `negate`, `omit`, `once`, `pairs`, `partial`, `partialRight`,
     * `partition`, `pick`, `plant`, `pluck`, `property`, `propertyOf`, `pull`,
     * `pullAt`, `push`, `range`, `rearg`, `reject`, `remove`, `rest`, `restParam`,
     * `reverse`, `set`, `shuffle`, `slice`, `sort`, `sortBy`, `sortByAll`,
     * `sortByOrder`, `splice`, `spread`, `take`, `takeRight`, `takeRightWhile`,
     * `takeWhile`, `tap`, `throttle`, `thru`, `times`, `toArray`, `toPlainObject`,
     * `transform`, `union`, `uniq`, `unshift`, `unzip`, `unzipWith`, `values`,
     * `valuesIn`, `where`, `without`, `wrap`, `xor`, `zip`, `zipObject`, `zipWith`
     *
     * The wrapper methods that are **not** chainable by default are:
     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clone`, `cloneDeep`,
     * `deburr`, `endsWith`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`,
     * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `findWhere`, `first`,
     * `floor`, `get`, `gt`, `gte`, `has`, `identity`, `includes`, `indexOf`,
     * `inRange`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
     * `isEmpty`, `isEqual`, `isError`, `isFinite` `isFunction`, `isMatch`,
     * `isNative`, `isNaN`, `isNull`, `isNumber`, `isObject`, `isPlainObject`,
     * `isRegExp`, `isString`, `isUndefined`, `isTypedArray`, `join`, `kebabCase`,
     * `last`, `lastIndexOf`, `lt`, `lte`, `max`, `min`, `noConflict`, `noop`,
     * `now`, `pad`, `padLeft`, `padRight`, `parseInt`, `pop`, `random`, `reduce`,
     * `reduceRight`, `repeat`, `result`, `round`, `runInContext`, `shift`, `size`,
     * `snakeCase`, `some`, `sortedIndex`, `sortedLastIndex`, `startCase`,
     * `startsWith`, `sum`, `template`, `trim`, `trimLeft`, `trimRight`, `trunc`,
     * `unescape`, `uniqueId`, `value`, and `words`
     *
     * The wrapper method `sample` will return a wrapped value when `n` is provided,
     * otherwise an unwrapped value is returned.
     *
     * @name _
     * @constructor
     * @category Chain
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // returns an unwrapped value
     * wrapped.reduce(function(total, n) {
     *   return total + n;
     * });
     * // => 6
     *
     * // returns a wrapped value
     * var squares = wrapped.map(function(n) {
     *   return n * n;
     * });
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
        if (value instanceof LodashWrapper) {
          return value;
        }
        if (hasOwnProperty.call(value, '__chain__') && hasOwnProperty.call(value, '__wrapped__')) {
          return wrapperClone(value);
        }
      }
      return new LodashWrapper(value);
    }

    /**
     * The function whose prototype all chaining wrappers inherit from.
     *
     * @private
     */
    function baseLodash() {
      // No operation performed.
    }

    /**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable chaining for all wrapper methods.
     * @param {Array} [actions=[]] Actions to peform to resolve the unwrapped value.
     */
    function LodashWrapper(value, chainAll, actions) {
      this.__wrapped__ = value;
      this.__actions__ = actions || [];
      this.__chain__ = !!chainAll;
    }

    /**
     * An object environment feature flags.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    var support = lodash.support = {};

    /**
     * By default, the template delimiters used by lodash are like those in
     * embedded Ruby (ERB). Change the following template settings to use
     * alternative delimiters.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'escape': reEscape,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'evaluate': reEvaluate,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type string
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type Object
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type Function
         */
        '_': lodash
      }
    };

    /*------------------------------------------------------------------------*/

    /**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @param {*} value The value to wrap.
     */
    function LazyWrapper(value) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__dir__ = 1;
      this.__filtered__ = false;
      this.__iteratees__ = [];
      this.__takeCount__ = POSITIVE_INFINITY;
      this.__views__ = [];
    }

    /**
     * Creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberOf LazyWrapper
     * @returns {Object} Returns the cloned `LazyWrapper` object.
     */
    function lazyClone() {
      var result = new LazyWrapper(this.__wrapped__);
      result.__actions__ = arrayCopy(this.__actions__);
      result.__dir__ = this.__dir__;
      result.__filtered__ = this.__filtered__;
      result.__iteratees__ = arrayCopy(this.__iteratees__);
      result.__takeCount__ = this.__takeCount__;
      result.__views__ = arrayCopy(this.__views__);
      return result;
    }

    /**
     * Reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberOf LazyWrapper
     * @returns {Object} Returns the new reversed `LazyWrapper` object.
     */
    function lazyReverse() {
      if (this.__filtered__) {
        var result = new LazyWrapper(this);
        result.__dir__ = -1;
        result.__filtered__ = true;
      } else {
        result = this.clone();
        result.__dir__ *= -1;
      }
      return result;
    }

    /**
     * Extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberOf LazyWrapper
     * @returns {*} Returns the unwrapped value.
     */
    function lazyValue() {
      var array = this.__wrapped__.value(),
          dir = this.__dir__,
          isArr = isArray(array),
          isRight = dir < 0,
          arrLength = isArr ? array.length : 0,
          view = getView(0, arrLength, this.__views__),
          start = view.start,
          end = view.end,
          length = end - start,
          index = isRight ? end : (start - 1),
          iteratees = this.__iteratees__,
          iterLength = iteratees.length,
          resIndex = 0,
          takeCount = nativeMin(length, this.__takeCount__);

      if (!isArr || arrLength < LARGE_ARRAY_SIZE || (arrLength == length && takeCount == length)) {
        return baseWrapperValue((isRight && isArr) ? array.reverse() : array, this.__actions__);
      }
      var result = [];

      outer:
      while (length-- && resIndex < takeCount) {
        index += dir;

        var iterIndex = -1,
            value = array[index];

        while (++iterIndex < iterLength) {
          var data = iteratees[iterIndex],
              iteratee = data.iteratee,
              type = data.type,
              computed = iteratee(value);

          if (type == LAZY_MAP_FLAG) {
            value = computed;
          } else if (!computed) {
            if (type == LAZY_FILTER_FLAG) {
              continue outer;
            } else {
              break outer;
            }
          }
        }
        result[resIndex++] = value;
      }
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a cache object to store key/value pairs.
     *
     * @private
     * @static
     * @name Cache
     * @memberOf _.memoize
     */
    function MapCache() {
      this.__data__ = {};
    }

    /**
     * Removes `key` and its value from the cache.
     *
     * @private
     * @name delete
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed successfully, else `false`.
     */
    function mapDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }

    /**
     * Gets the cached value for `key`.
     *
     * @private
     * @name get
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the cached value.
     */
    function mapGet(key) {
      return key == '__proto__' ? undefined : this.__data__[key];
    }

    /**
     * Checks if a cached value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapHas(key) {
      return key != '__proto__' && hasOwnProperty.call(this.__data__, key);
    }

    /**
     * Sets `value` to `key` of the cache.
     *
     * @private
     * @name set
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to cache.
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache object.
     */
    function mapSet(key, value) {
      if (key != '__proto__') {
        this.__data__[key] = value;
      }
      return this;
    }

    /*------------------------------------------------------------------------*/

    /**
     *
     * Creates a cache object to store unique values.
     *
     * @private
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var length = values ? values.length : 0;

      this.data = { 'hash': nativeCreate(null), 'set': new Set };
      while (length--) {
        this.push(values[length]);
      }
    }

    /**
     * Checks if `value` is in `cache` mimicking the return signature of
     * `_.indexOf` by returning `0` if the value is found, else `-1`.
     *
     * @private
     * @param {Object} cache The cache to search.
     * @param {*} value The value to search for.
     * @returns {number} Returns `0` if `value` is found, else `-1`.
     */
    function cacheIndexOf(cache, value) {
      var data = cache.data,
          result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];

      return result ? 0 : -1;
    }

    /**
     * Adds `value` to the cache.
     *
     * @private
     * @name push
     * @memberOf SetCache
     * @param {*} value The value to cache.
     */
    function cachePush(value) {
      var data = this.data;
      if (typeof value == 'string' || isObject(value)) {
        data.set.add(value);
      } else {
        data.hash[value] = true;
      }
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a new array joining `array` with `other`.
     *
     * @private
     * @param {Array} array The array to join.
     * @param {Array} other The other array to join.
     * @returns {Array} Returns the new concatenated array.
     */
    function arrayConcat(array, other) {
      var index = -1,
          length = array.length,
          othIndex = -1,
          othLength = other.length,
          result = Array(length + othLength);

      while (++index < length) {
        result[index] = array[index];
      }
      while (++othIndex < othLength) {
        result[index++] = other[othIndex];
      }
      return result;
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function arrayCopy(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * A specialized version of `_.forEach` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEach(array, iteratee) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }

    /**
     * A specialized version of `_.forEachRight` for arrays without support for
     * callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEachRight(array, iteratee) {
      var length = array.length;

      while (length--) {
        if (iteratee(array[length], length, array) === false) {
          break;
        }
      }
      return array;
    }

    /**
     * A specialized version of `_.every` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     */
    function arrayEvery(array, predicate) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        if (!predicate(array[index], index, array)) {
          return false;
        }
      }
      return true;
    }

    /**
     * A specialized version of `baseExtremum` for arrays which invokes `iteratee`
     * with one argument: (value).
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {*} Returns the extremum value.
     */
    function arrayExtremum(array, iteratee, comparator, exValue) {
      var index = -1,
          length = array.length,
          computed = exValue,
          result = computed;

      while (++index < length) {
        var value = array[index],
            current = +iteratee(value);

        if (comparator(current, computed)) {
          computed = current;
          result = value;
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.filter` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function arrayFilter(array, predicate) {
      var index = -1,
          length = array.length,
          resIndex = -1,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[++resIndex] = value;
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.map` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function arrayMap(array, iteratee) {
      var index = -1,
          length = array.length,
          result = Array(length);

      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */
    function arrayPush(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    /**
     * A specialized version of `_.reduce` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initFromArray] Specify using the first element of `array`
     *  as the initial value.
     * @returns {*} Returns the accumulated value.
     */
    function arrayReduce(array, iteratee, accumulator, initFromArray) {
      var index = -1,
          length = array.length;

      if (initFromArray && length) {
        accumulator = array[++index];
      }
      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }
      return accumulator;
    }

    /**
     * A specialized version of `_.reduceRight` for arrays without support for
     * callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initFromArray] Specify using the last element of `array`
     *  as the initial value.
     * @returns {*} Returns the accumulated value.
     */
    function arrayReduceRight(array, iteratee, accumulator, initFromArray) {
      var length = array.length;
      if (initFromArray && length) {
        accumulator = array[--length];
      }
      while (length--) {
        accumulator = iteratee(accumulator, array[length], length, array);
      }
      return accumulator;
    }

    /**
     * A specialized version of `_.some` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function arraySome(array, predicate) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }

    /**
     * A specialized version of `_.sum` for arrays without support for callback
     * shorthands and `this` binding..
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {number} Returns the sum.
     */
    function arraySum(array, iteratee) {
      var length = array.length,
          result = 0;

      while (length--) {
        result += +iteratee(array[length]) || 0;
      }
      return result;
    }

    /**
     * Used by `_.defaults` to customize its `_.assign` use.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @returns {*} Returns the value to assign to the destination object.
     */
    function assignDefaults(objectValue, sourceValue) {
      return objectValue === undefined ? sourceValue : objectValue;
    }

    /**
     * Used by `_.template` to customize its `_.assign` use.
     *
     * **Note:** This function is like `assignDefaults` except that it ignores
     * inherited property values when checking if a property is `undefined`.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @param {string} key The key associated with the object and source values.
     * @param {Object} object The destination object.
     * @returns {*} Returns the value to assign to the destination object.
     */
    function assignOwnDefaults(objectValue, sourceValue, key, object) {
      return (objectValue === undefined || !hasOwnProperty.call(object, key))
        ? sourceValue
        : objectValue;
    }

    /**
     * A specialized version of `_.assign` for customizing assigned values without
     * support for argument juggling, multiple sources, and `this` binding `customizer`
     * functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Object} Returns `object`.
     */
    function assignWith(object, source, customizer) {
      var index = -1,
          props = keys(source),
          length = props.length;

      while (++index < length) {
        var key = props[index],
            value = object[key],
            result = customizer(value, source[key], key, object, source);

        if ((result === result ? (result !== value) : (value === value)) ||
            (value === undefined && !(key in object))) {
          object[key] = result;
        }
      }
      return object;
    }

    /**
     * The base implementation of `_.assign` without support for argument juggling,
     * multiple sources, and `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return source == null
        ? object
        : baseCopy(source, keys(source), object);
    }

    /**
     * The base implementation of `_.at` without support for string collections
     * and individual key arguments.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {number[]|string[]} props The property names or indexes of elements to pick.
     * @returns {Array} Returns the new array of picked elements.
     */
    function baseAt(collection, props) {
      var index = -1,
          isNil = collection == null,
          isArr = !isNil && isArrayLike(collection),
          length = isArr ? collection.length : 0,
          propsLength = props.length,
          result = Array(propsLength);

      while(++index < propsLength) {
        var key = props[index];
        if (isArr) {
          result[index] = isIndex(key, length) ? collection[key] : undefined;
        } else {
          result[index] = isNil ? undefined : collection[key];
        }
      }
      return result;
    }

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property names to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @returns {Object} Returns `object`.
     */
    function baseCopy(source, props, object) {
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];
        object[key] = source[key];
      }
      return object;
    }

    /**
     * The base implementation of `_.callback` which supports specifying the
     * number of arguments to provide to `func`.
     *
     * @private
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {number} [argCount] The number of arguments to provide to `func`.
     * @returns {Function} Returns the callback.
     */
    function baseCallback(func, thisArg, argCount) {
      var type = typeof func;
      if (type == 'function') {
        return thisArg === undefined
          ? func
          : bindCallback(func, thisArg, argCount);
      }
      if (func == null) {
        return identity;
      }
      if (type == 'object') {
        return baseMatches(func);
      }
      return thisArg === undefined
        ? property(func)
        : baseMatchesProperty(func, thisArg);
    }

    /**
     * The base implementation of `_.clone` without support for argument juggling
     * and `this` binding `customizer` functions.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The object `value` belongs to.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates clones with source counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
      var result;
      if (customizer) {
        result = object ? customizer(value, key, object) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return arrayCopy(value, result);
        }
      } else {
        var tag = objToString.call(value),
            isFunc = tag == funcTag;

        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          result = initCloneObject(isFunc ? {} : value);
          if (!isDeep) {
            return baseAssign(result, value);
          }
        } else {
          return cloneableTags[tag]
            ? initCloneByTag(value, tag, isDeep)
            : (object ? value : {});
        }
      }
      // Check for circular references and return its corresponding clone.
      stackA || (stackA = []);
      stackB || (stackB = []);

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == value) {
          return stackB[length];
        }
      }
      // Add the source value to the stack of traversed objects and associate it with its clone.
      stackA.push(value);
      stackB.push(result);

      // Recursively populate clone (susceptible to call stack limits).
      (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
        result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
      });
      return result;
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    var baseCreate = (function() {
      function object() {}
      return function(prototype) {
        if (isObject(prototype)) {
          object.prototype = prototype;
          var result = new object;
          object.prototype = undefined;
        }
        return result || {};
      };
    }());

    /**
     * The base implementation of `_.delay` and `_.defer` which accepts an index
     * of where to slice the arguments to provide to `func`.
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {Object} args The arguments provide to `func`.
     * @returns {number} Returns the timer id.
     */
    function baseDelay(func, wait, args) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * The base implementation of `_.difference` which accepts a single array
     * of values to exclude.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference(array, values) {
      var length = array ? array.length : 0,
          result = [];

      if (!length) {
        return result;
      }
      var index = -1,
          indexOf = getIndexOf(),
          isCommon = indexOf == baseIndexOf,
          cache = (isCommon && values.length >= LARGE_ARRAY_SIZE) ? createCache(values) : null,
          valuesLength = values.length;

      if (cache) {
        indexOf = cacheIndexOf;
        isCommon = false;
        values = cache;
      }
      outer:
      while (++index < length) {
        var value = array[index];

        if (isCommon && value === value) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === value) {
              continue outer;
            }
          }
          result.push(value);
        }
        else if (indexOf(values, value, 0) < 0) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.forEach` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object|string} Returns `collection`.
     */
    var baseEach = createBaseEach(baseForOwn);

    /**
     * The base implementation of `_.forEachRight` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object|string} Returns `collection`.
     */
    var baseEachRight = createBaseEach(baseForOwnRight, true);

    /**
     * The base implementation of `_.every` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`
     */
    function baseEvery(collection, predicate) {
      var result = true;
      baseEach(collection, function(value, index, collection) {
        result = !!predicate(value, index, collection);
        return result;
      });
      return result;
    }

    /**
     * Gets the extremum value of `collection` invoking `iteratee` for each value
     * in `collection` to generate the criterion by which the value is ranked.
     * The `iteratee` is invoked with three arguments: (value, index|key, collection).
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {*} Returns the extremum value.
     */
    function baseExtremum(collection, iteratee, comparator, exValue) {
      var computed = exValue,
          result = computed;

      baseEach(collection, function(value, index, collection) {
        var current = +iteratee(value, index, collection);
        if (comparator(current, computed) || (current === exValue && current === result)) {
          computed = current;
          result = value;
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.fill` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     */
    function baseFill(array, value, start, end) {
      var length = array.length;

      start = start == null ? 0 : (+start || 0);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : (+end || 0);
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : (end >>> 0);
      start >>>= 0;

      while (start < length) {
        array[start++] = value;
      }
      return array;
    }

    /**
     * The base implementation of `_.filter` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function baseFilter(collection, predicate) {
      var result = [];
      baseEach(collection, function(value, index, collection) {
        if (predicate(value, index, collection)) {
          result.push(value);
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
     * without support for callback shorthands and `this` binding, which iterates
     * over `collection` using the provided `eachFunc`.
     *
     * @private
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function} predicate The function invoked per iteration.
     * @param {Function} eachFunc The function to iterate over `collection`.
     * @param {boolean} [retKey] Specify returning the key of the found element
     *  instead of the element itself.
     * @returns {*} Returns the found element or its key, else `undefined`.
     */
    function baseFind(collection, predicate, eachFunc, retKey) {
      var result;
      eachFunc(collection, function(value, key, collection) {
        if (predicate(value, key, collection)) {
          result = retKey ? key : value;
          return false;
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.flatten` with added support for restricting
     * flattening and specifying the start index.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {boolean} [isDeep] Specify a deep flatten.
     * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, isDeep, isStrict, result) {
      result || (result = []);

      var index = -1,
          length = array.length;

      while (++index < length) {
        var value = array[index];
        if (isObjectLike(value) && isArrayLike(value) &&
            (isStrict || isArray(value) || isArguments(value))) {
          if (isDeep) {
            // Recursively flatten arrays (susceptible to call stack limits).
            baseFlatten(value, isDeep, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `baseForIn` and `baseForOwn` which iterates
     * over `object` properties returned by `keysFunc` invoking `iteratee` for
     * each property. Iteratee functions may exit iteration early by explicitly
     * returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseFor = createBaseFor();

    /**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseForRight = createBaseFor(true);

    /**
     * The base implementation of `_.forIn` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForIn(object, iteratee) {
      return baseFor(object, iteratee, keysIn);
    }

    /**
     * The base implementation of `_.forOwn` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, iteratee) {
      return baseFor(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.forOwnRight` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwnRight(object, iteratee) {
      return baseForRight(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.functions` which creates an array of
     * `object` function property names filtered from those provided.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} props The property names to filter.
     * @returns {Array} Returns the new array of filtered property names.
     */
    function baseFunctions(object, props) {
      var index = -1,
          length = props.length,
          resIndex = -1,
          result = [];

      while (++index < length) {
        var key = props[index];
        if (isFunction(object[key])) {
          result[++resIndex] = key;
        }
      }
      return result;
    }

    /**
     * The base implementation of `get` without support for string paths
     * and default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} path The path of the property to get.
     * @param {string} [pathKey] The key representation of path.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path, pathKey) {
      if (object == null) {
        return;
      }
      if (pathKey !== undefined && pathKey in toObject(object)) {
        path = [pathKey];
      }
      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[path[index++]];
      }
      return (index && index == length) ? object : undefined;
    }

    /**
     * The base implementation of `_.isEqual` without support for `this` binding
     * `customizer` functions.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparing values.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
    }

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing objects.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA=[]] Tracks traversed `value` objects.
     * @param {Array} [stackB=[]] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = arrayTag,
          othTag = arrayTag;

      if (!objIsArr) {
        objTag = objToString.call(object);
        if (objTag == argsTag) {
          objTag = objectTag;
        } else if (objTag != objectTag) {
          objIsArr = isTypedArray(object);
        }
      }
      if (!othIsArr) {
        othTag = objToString.call(other);
        if (othTag == argsTag) {
          othTag = objectTag;
        } else if (othTag != objectTag) {
          othIsArr = isTypedArray(other);
        }
      }
      var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;

      if (isSameTag && !(objIsArr || objIsObj)) {
        return equalByTag(object, other, objTag);
      }
      if (!isLoose) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
        }
      }
      if (!isSameTag) {
        return false;
      }
      // Assume cyclic values are equal.
      // For more information on detecting circular references see https://es5.github.io/#JO.
      stackA || (stackA = []);
      stackB || (stackB = []);

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == object) {
          return stackB[length] == other;
        }
      }
      // Add `object` and `other` to the stack of traversed objects.
      stackA.push(object);
      stackB.push(other);

      var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

      stackA.pop();
      stackB.pop();

      return result;
    }

    /**
     * The base implementation of `_.isMatch` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} matchData The propery names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparing objects.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */
    function baseIsMatch(object, matchData, customizer) {
      var index = matchData.length,
          length = index,
          noCustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = toObject(object);
      while (index--) {
        var data = matchData[index];
        if ((noCustomizer && data[2])
              ? data[1] !== object[data[0]]
              : !(data[0] in object)
            ) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0],
            objValue = object[key],
            srcValue = data[1];

        if (noCustomizer && data[2]) {
          if (objValue === undefined && !(key in object)) {
            return false;
          }
        } else {
          var result = customizer ? customizer(objValue, srcValue, key) : undefined;
          if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
            return false;
          }
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.map` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function baseMap(collection, iteratee) {
      var index = -1,
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value, key, collection) {
        result[++index] = iteratee(value, key, collection);
      });
      return result;
    }

    /**
     * The base implementation of `_.matches` which does not clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     */
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        var key = matchData[0][0],
            value = matchData[0][1];

        return function(object) {
          if (object == null) {
            return false;
          }
          return object[key] === value && (value !== undefined || (key in toObject(object)));
        };
      }
      return function(object) {
        return baseIsMatch(object, matchData);
      };
    }

    /**
     * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to compare.
     * @returns {Function} Returns the new function.
     */
    function baseMatchesProperty(path, srcValue) {
      var isArr = isArray(path),
          isCommon = isKey(path) && isStrictComparable(srcValue),
          pathKey = (path + '');

      path = toPath(path);
      return function(object) {
        if (object == null) {
          return false;
        }
        var key = pathKey;
        object = toObject(object);
        if ((isArr || !isCommon) && !(key in object)) {
          object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
          if (object == null) {
            return false;
          }
          key = last(path);
          object = toObject(object);
        }
        return object[key] === srcValue
          ? (srcValue !== undefined || (key in object))
          : baseIsEqual(srcValue, object[key], undefined, true);
      };
    }

    /**
     * The base implementation of `_.merge` without support for argument juggling,
     * multiple sources, and `this` binding `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     * @returns {Object} Returns `object`.
     */
    function baseMerge(object, source, customizer, stackA, stackB) {
      if (!isObject(object)) {
        return object;
      }
      var isSrcArr = isArrayLike(source) && (isArray(source) || isTypedArray(source)),
          props = isSrcArr ? undefined : keys(source);

      arrayEach(props || source, function(srcValue, key) {
        if (props) {
          key = srcValue;
          srcValue = source[key];
        }
        if (isObjectLike(srcValue)) {
          stackA || (stackA = []);
          stackB || (stackB = []);
          baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB);
        }
        else {
          var value = object[key],
              result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
              isCommon = result === undefined;

          if (isCommon) {
            result = srcValue;
          }
          if ((result !== undefined || (isSrcArr && !(key in object))) &&
              (isCommon || (result === result ? (result !== value) : (value === value)))) {
            object[key] = result;
          }
        }
      });
      return object;
    }

    /**
     * A specialized version of `baseMerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {string} key The key of the value to merge.
     * @param {Function} mergeFunc The function to merge values.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
      var length = stackA.length,
          srcValue = source[key];

      while (length--) {
        if (stackA[length] == srcValue) {
          object[key] = stackB[length];
          return;
        }
      }
      var value = object[key],
          result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
          isCommon = result === undefined;

      if (isCommon) {
        result = srcValue;
        if (isArrayLike(srcValue) && (isArray(srcValue) || isTypedArray(srcValue))) {
          result = isArray(value)
            ? value
            : (isArrayLike(value) ? arrayCopy(value) : []);
        }
        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          result = isArguments(value)
            ? toPlainObject(value)
            : (isPlainObject(value) ? value : {});
        }
        else {
          isCommon = false;
        }
      }
      // Add the source value to the stack of traversed objects and associate
      // it with its merged value.
      stackA.push(srcValue);
      stackB.push(result);

      if (isCommon) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB);
      } else if (result === result ? (result !== value) : (value === value)) {
        object[key] = result;
      }
    }

    /**
     * The base implementation of `_.property` without support for deep paths.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @returns {Function} Returns the new function.
     */
    function baseProperty(key) {
      return function(object) {
        return object == null ? undefined : object[key];
      };
    }

    /**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     */
    function basePropertyDeep(path) {
      var pathKey = (path + '');
      path = toPath(path);
      return function(object) {
        return baseGet(object, path, pathKey);
      };
    }

    /**
     * The base implementation of `_.pullAt` without support for individual
     * index arguments and capturing the removed elements.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {number[]} indexes The indexes of elements to remove.
     * @returns {Array} Returns `array`.
     */
    function basePullAt(array, indexes) {
      var length = array ? indexes.length : 0;
      while (length--) {
        var index = indexes[length];
        if (index != previous && isIndex(index)) {
          var previous = index;
          splice.call(array, index, 1);
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.random` without support for argument juggling
     * and returning floating-point numbers.
     *
     * @private
     * @param {number} min The minimum possible value.
     * @param {number} max The maximum possible value.
     * @returns {number} Returns the random number.
     */
    function baseRandom(min, max) {
      return min + nativeFloor(nativeRandom() * (max - min + 1));
    }

    /**
     * The base implementation of `_.reduce` and `_.reduceRight` without support
     * for callback shorthands and `this` binding, which iterates over `collection`
     * using the provided `eachFunc`.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} accumulator The initial value.
     * @param {boolean} initFromCollection Specify using the first or last element
     *  of `collection` as the initial value.
     * @param {Function} eachFunc The function to iterate over `collection`.
     * @returns {*} Returns the accumulated value.
     */
    function baseReduce(collection, iteratee, accumulator, initFromCollection, eachFunc) {
      eachFunc(collection, function(value, index, collection) {
        accumulator = initFromCollection
          ? (initFromCollection = false, value)
          : iteratee(accumulator, value, index, collection);
      });
      return accumulator;
    }

    /**
     * The base implementation of `setData` without support for hot loop detection.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var baseSetData = !metaMap ? identity : function(func, data) {
      metaMap.set(func, data);
      return func;
    };

    /**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseSlice(array, start, end) {
      var index = -1,
          length = array.length;

      start = start == null ? 0 : (+start || 0);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : (+end || 0);
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : ((end - start) >>> 0);
      start >>>= 0;

      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }

    /**
     * The base implementation of `_.some` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function baseSome(collection, predicate) {
      var result;

      baseEach(collection, function(value, index, collection) {
        result = predicate(value, index, collection);
        return !result;
      });
      return !!result;
    }

    /**
     * The base implementation of `_.sortBy` which uses `comparer` to define
     * the sort order of `array` and replaces criteria objects with their
     * corresponding values.
     *
     * @private
     * @param {Array} array The array to sort.
     * @param {Function} comparer The function to define sort order.
     * @returns {Array} Returns `array`.
     */
    function baseSortBy(array, comparer) {
      var length = array.length;

      array.sort(comparer);
      while (length--) {
        array[length] = array[length].value;
      }
      return array;
    }

    /**
     * The base implementation of `_.sortByOrder` without param guards.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {boolean[]} orders The sort orders of `iteratees`.
     * @returns {Array} Returns the new sorted array.
     */
    function baseSortByOrder(collection, iteratees, orders) {
      var callback = getCallback(),
          index = -1;

      iteratees = arrayMap(iteratees, function(iteratee) { return callback(iteratee); });

      var result = baseMap(collection, function(value) {
        var criteria = arrayMap(iteratees, function(iteratee) { return iteratee(value); });
        return { 'criteria': criteria, 'index': ++index, 'value': value };
      });

      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }

    /**
     * The base implementation of `_.sum` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {number} Returns the sum.
     */
    function baseSum(collection, iteratee) {
      var result = 0;
      baseEach(collection, function(value, index, collection) {
        result += +iteratee(value, index, collection) || 0;
      });
      return result;
    }

    /**
     * The base implementation of `_.uniq` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The function invoked per iteration.
     * @returns {Array} Returns the new duplicate-value-free array.
     */
    function baseUniq(array, iteratee) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array.length,
          isCommon = indexOf == baseIndexOf,
          isLarge = isCommon && length >= LARGE_ARRAY_SIZE,
          seen = isLarge ? createCache() : null,
          result = [];

      if (seen) {
        indexOf = cacheIndexOf;
        isCommon = false;
      } else {
        isLarge = false;
        seen = iteratee ? [] : result;
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value, index, array) : value;

        if (isCommon && value === value) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        }
        else if (indexOf(seen, computed, 0) < 0) {
          if (iteratee || isLarge) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.values` and `_.valuesIn` which creates an
     * array of `object` property values corresponding to the property names
     * of `props`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} props The property names to get values for.
     * @returns {Object} Returns the array of property values.
     */
    function baseValues(object, props) {
      var index = -1,
          length = props.length,
          result = Array(length);

      while (++index < length) {
        result[index] = object[props[index]];
      }
      return result;
    }

    /**
     * The base implementation of `_.dropRightWhile`, `_.dropWhile`, `_.takeRightWhile`,
     * and `_.takeWhile` without support for callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {Function} predicate The function invoked per iteration.
     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseWhile(array, predicate, isDrop, fromRight) {
      var length = array.length,
          index = fromRight ? length : -1;

      while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {}
      return isDrop
        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
    }

    /**
     * The base implementation of `wrapperValue` which returns the result of
     * performing a sequence of actions on the unwrapped `value`, where each
     * successive action is supplied the return value of the previous.
     *
     * @private
     * @param {*} value The unwrapped value.
     * @param {Array} actions Actions to peform to resolve the unwrapped value.
     * @returns {*} Returns the resolved value.
     */
    function baseWrapperValue(value, actions) {
      var result = value;
      if (result instanceof LazyWrapper) {
        result = result.value();
      }
      var index = -1,
          length = actions.length;

      while (++index < length) {
        var action = actions[index];
        result = action.func.apply(action.thisArg, arrayPush([result], action.args));
      }
      return result;
    }

    /**
     * Performs a binary search of `array` to determine the index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function binaryIndex(array, value, retHighest) {
      var low = 0,
          high = array ? array.length : low;

      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
        while (low < high) {
          var mid = (low + high) >>> 1,
              computed = array[mid];

          if ((retHighest ? (computed <= value) : (computed < value)) && computed !== null) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return high;
      }
      return binaryIndexBy(array, value, identity, retHighest);
    }

    /**
     * This function is like `binaryIndex` except that it invokes `iteratee` for
     * `value` and each element of `array` to compute their sort ranking. The
     * iteratee is invoked with one argument; (value).
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function binaryIndexBy(array, value, iteratee, retHighest) {
      value = iteratee(value);

      var low = 0,
          high = array ? array.length : 0,
          valIsNaN = value !== value,
          valIsNull = value === null,
          valIsUndef = value === undefined;

      while (low < high) {
        var mid = nativeFloor((low + high) / 2),
            computed = iteratee(array[mid]),
            isDef = computed !== undefined,
            isReflexive = computed === computed;

        if (valIsNaN) {
          var setLow = isReflexive || retHighest;
        } else if (valIsNull) {
          setLow = isReflexive && isDef && (retHighest || computed != null);
        } else if (valIsUndef) {
          setLow = isReflexive && (retHighest || isDef);
        } else if (computed == null) {
          setLow = false;
        } else {
          setLow = retHighest ? (computed <= value) : (computed < value);
        }
        if (setLow) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return nativeMin(high, MAX_ARRAY_INDEX);
    }

    /**
     * A specialized version of `baseCallback` which only supports `this` binding
     * and specifying the number of arguments to provide to `func`.
     *
     * @private
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {number} [argCount] The number of arguments to provide to `func`.
     * @returns {Function} Returns the callback.
     */
    function bindCallback(func, thisArg, argCount) {
      if (typeof func != 'function') {
        return identity;
      }
      if (thisArg === undefined) {
        return func;
      }
      switch (argCount) {
        case 1: return function(value) {
          return func.call(thisArg, value);
        };
        case 3: return function(value, index, collection) {
          return func.call(thisArg, value, index, collection);
        };
        case 4: return function(accumulator, value, index, collection) {
          return func.call(thisArg, accumulator, value, index, collection);
        };
        case 5: return function(value, other, key, object, source) {
          return func.call(thisArg, value, other, key, object, source);
        };
      }
      return function() {
        return func.apply(thisArg, arguments);
      };
    }

    /**
     * Creates a clone of the given array buffer.
     *
     * @private
     * @param {ArrayBuffer} buffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function bufferClone(buffer) {
      var result = new ArrayBuffer(buffer.byteLength),
          view = new Uint8Array(result);

      view.set(new Uint8Array(buffer));
      return result;
    }

    /**
     * Creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to prepend to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgs(args, partials, holders) {
      var holdersLength = holders.length,
          argsIndex = -1,
          argsLength = nativeMax(args.length - holdersLength, 0),
          leftIndex = -1,
          leftLength = partials.length,
          result = Array(leftLength + argsLength);

      while (++leftIndex < leftLength) {
        result[leftIndex] = partials[leftIndex];
      }
      while (++argsIndex < holdersLength) {
        result[holders[argsIndex]] = args[argsIndex];
      }
      while (argsLength--) {
        result[leftIndex++] = args[argsIndex++];
      }
      return result;
    }

    /**
     * This function is like `composeArgs` except that the arguments composition
     * is tailored for `_.partialRight`.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to append to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgsRight(args, partials, holders) {
      var holdersIndex = -1,
          holdersLength = holders.length,
          argsIndex = -1,
          argsLength = nativeMax(args.length - holdersLength, 0),
          rightIndex = -1,
          rightLength = partials.length,
          result = Array(argsLength + rightLength);

      while (++argsIndex < argsLength) {
        result[argsIndex] = args[argsIndex];
      }
      var offset = argsIndex;
      while (++rightIndex < rightLength) {
        result[offset + rightIndex] = partials[rightIndex];
      }
      while (++holdersIndex < holdersLength) {
        result[offset + holders[holdersIndex]] = args[argsIndex++];
      }
      return result;
    }

    /**
     * Creates a `_.countBy`, `_.groupBy`, `_.indexBy`, or `_.partition` function.
     *
     * @private
     * @param {Function} setter The function to set keys and values of the accumulator object.
     * @param {Function} [initializer] The function to initialize the accumulator object.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter, initializer) {
      return function(collection, iteratee, thisArg) {
        var result = initializer ? initializer() : {};
        iteratee = getCallback(iteratee, thisArg, 3);

        if (isArray(collection)) {
          var index = -1,
              length = collection.length;

          while (++index < length) {
            var value = collection[index];
            setter(result, value, iteratee(value, index, collection), collection);
          }
        } else {
          baseEach(collection, function(value, key, collection) {
            setter(result, value, iteratee(value, key, collection), collection);
          });
        }
        return result;
      };
    }

    /**
     * Creates a `_.assign`, `_.defaults`, or `_.merge` function.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */
    function createAssigner(assigner) {
      return restParam(function(object, sources) {
        var index = -1,
            length = object == null ? 0 : sources.length,
            customizer = length > 2 ? sources[length - 2] : undefined,
            guard = length > 2 ? sources[2] : undefined,
            thisArg = length > 1 ? sources[length - 1] : undefined;

        if (typeof customizer == 'function') {
          customizer = bindCallback(customizer, thisArg, 5);
          length -= 2;
        } else {
          customizer = typeof thisArg == 'function' ? thisArg : undefined;
          length -= (customizer ? 1 : 0);
        }
        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? undefined : customizer;
          length = 1;
        }
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, customizer);
          }
        }
        return object;
      });
    }

    /**
     * Creates a `baseEach` or `baseEachRight` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        var length = collection ? getLength(collection) : 0;
        if (!isLength(length)) {
          return eachFunc(collection, iteratee);
        }
        var index = fromRight ? length : -1,
            iterable = toObject(collection);

        while ((fromRight ? index-- : ++index < length)) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }

    /**
     * Creates a base function for `_.forIn` or `_.forInRight`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var iterable = toObject(object),
            props = keysFunc(object),
            length = props.length,
            index = fromRight ? length : -1;

        while ((fromRight ? index-- : ++index < length)) {
          var key = props[index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    /**
     * Creates a function that wraps `func` and invokes it with the `this`
     * binding of `thisArg`.
     *
     * @private
     * @param {Function} func The function to bind.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @returns {Function} Returns the new bound function.
     */
    function createBindWrapper(func, thisArg) {
      var Ctor = createCtorWrapper(func);

      function wrapper() {
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(thisArg, arguments);
      }
      return wrapper;
    }

    /**
     * Creates a `Set` cache object to optimize linear searches of large arrays.
     *
     * @private
     * @param {Array} [values] The values to cache.
     * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
     */
    function createCache(values) {
      return (nativeCreate && Set) ? new SetCache(values) : null;
    }

    /**
     * Creates a function that produces compound words out of the words in a
     * given string.
     *
     * @private
     * @param {Function} callback The function to combine each word.
     * @returns {Function} Returns the new compounder function.
     */
    function createCompounder(callback) {
      return function(string) {
        var index = -1,
            array = words(deburr(string)),
            length = array.length,
            result = '';

        while (++index < length) {
          result = callback(result, array[index], index);
        }
        return result;
      };
    }

    /**
     * Creates a function that produces an instance of `Ctor` regardless of
     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
     *
     * @private
     * @param {Function} Ctor The constructor to wrap.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCtorWrapper(Ctor) {
      return function() {
        // Use a `switch` statement to work with class constructors.
        // See http://ecma-international.org/ecma-262/6.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
        // for more details.
        var args = arguments;
        switch (args.length) {
          case 0: return new Ctor;
          case 1: return new Ctor(args[0]);
          case 2: return new Ctor(args[0], args[1]);
          case 3: return new Ctor(args[0], args[1], args[2]);
          case 4: return new Ctor(args[0], args[1], args[2], args[3]);
          case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
          case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
          case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
        var thisBinding = baseCreate(Ctor.prototype),
            result = Ctor.apply(thisBinding, args);

        // Mimic the constructor's `return` behavior.
        // See https://es5.github.io/#x13.2.2 for more details.
        return isObject(result) ? result : thisBinding;
      };
    }

    /**
     * Creates a `_.curry` or `_.curryRight` function.
     *
     * @private
     * @param {boolean} flag The curry bit flag.
     * @returns {Function} Returns the new curry function.
     */
    function createCurry(flag) {
      function curryFunc(func, arity, guard) {
        if (guard && isIterateeCall(func, arity, guard)) {
          arity = undefined;
        }
        var result = createWrapper(func, flag, undefined, undefined, undefined, undefined, undefined, arity);
        result.placeholder = curryFunc.placeholder;
        return result;
      }
      return curryFunc;
    }

    /**
     * Creates a `_.defaults` or `_.defaultsDeep` function.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Function} Returns the new defaults function.
     */
    function createDefaults(assigner, customizer) {
      return restParam(function(args) {
        var object = args[0];
        if (object == null) {
          return object;
        }
        args.push(customizer);
        return assigner.apply(undefined, args);
      });
    }

    /**
     * Creates a `_.max` or `_.min` function.
     *
     * @private
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {Function} Returns the new extremum function.
     */
    function createExtremum(comparator, exValue) {
      return function(collection, iteratee, thisArg) {
        if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
          iteratee = undefined;
        }
        iteratee = getCallback(iteratee, thisArg, 3);
        if (iteratee.length == 1) {
          collection = isArray(collection) ? collection : toIterable(collection);
          var result = arrayExtremum(collection, iteratee, comparator, exValue);
          if (!(collection.length && result === exValue)) {
            return result;
          }
        }
        return baseExtremum(collection, iteratee, comparator, exValue);
      };
    }

    /**
     * Creates a `_.find` or `_.findLast` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new find function.
     */
    function createFind(eachFunc, fromRight) {
      return function(collection, predicate, thisArg) {
        predicate = getCallback(predicate, thisArg, 3);
        if (isArray(collection)) {
          var index = baseFindIndex(collection, predicate, fromRight);
          return index > -1 ? collection[index] : undefined;
        }
        return baseFind(collection, predicate, eachFunc);
      };
    }

    /**
     * Creates a `_.findIndex` or `_.findLastIndex` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new find function.
     */
    function createFindIndex(fromRight) {
      return function(array, predicate, thisArg) {
        if (!(array && array.length)) {
          return -1;
        }
        predicate = getCallback(predicate, thisArg, 3);
        return baseFindIndex(array, predicate, fromRight);
      };
    }

    /**
     * Creates a `_.findKey` or `_.findLastKey` function.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new find function.
     */
    function createFindKey(objectFunc) {
      return function(object, predicate, thisArg) {
        predicate = getCallback(predicate, thisArg, 3);
        return baseFind(object, predicate, objectFunc, true);
      };
    }

    /**
     * Creates a `_.flow` or `_.flowRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new flow function.
     */
    function createFlow(fromRight) {
      return function() {
        var wrapper,
            length = arguments.length,
            index = fromRight ? length : -1,
            leftIndex = 0,
            funcs = Array(length);

        while ((fromRight ? index-- : ++index < length)) {
          var func = funcs[leftIndex++] = arguments[index];
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          if (!wrapper && LodashWrapper.prototype.thru && getFuncName(func) == 'wrapper') {
            wrapper = new LodashWrapper([], true);
          }
        }
        index = wrapper ? -1 : length;
        while (++index < length) {
          func = funcs[index];

          var funcName = getFuncName(func),
              data = funcName == 'wrapper' ? getData(func) : undefined;

          if (data && isLaziable(data[0]) && data[1] == (ARY_FLAG | CURRY_FLAG | PARTIAL_FLAG | REARG_FLAG) && !data[4].length && data[9] == 1) {
            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
          } else {
            wrapper = (func.length == 1 && isLaziable(func)) ? wrapper[funcName]() : wrapper.thru(func);
          }
        }
        return function() {
          var args = arguments,
              value = args[0];

          if (wrapper && args.length == 1 && isArray(value) && value.length >= LARGE_ARRAY_SIZE) {
            return wrapper.plant(value).value();
          }
          var index = 0,
              result = length ? funcs[index].apply(this, args) : value;

          while (++index < length) {
            result = funcs[index].call(this, result);
          }
          return result;
        };
      };
    }

    /**
     * Creates a function for `_.forEach` or `_.forEachRight`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over an array.
     * @param {Function} eachFunc The function to iterate over a collection.
     * @returns {Function} Returns the new each function.
     */
    function createForEach(arrayFunc, eachFunc) {
      return function(collection, iteratee, thisArg) {
        return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
          ? arrayFunc(collection, iteratee)
          : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
      };
    }

    /**
     * Creates a function for `_.forIn` or `_.forInRight`.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new each function.
     */
    function createForIn(objectFunc) {
      return function(object, iteratee, thisArg) {
        if (typeof iteratee != 'function' || thisArg !== undefined) {
          iteratee = bindCallback(iteratee, thisArg, 3);
        }
        return objectFunc(object, iteratee, keysIn);
      };
    }

    /**
     * Creates a function for `_.forOwn` or `_.forOwnRight`.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new each function.
     */
    function createForOwn(objectFunc) {
      return function(object, iteratee, thisArg) {
        if (typeof iteratee != 'function' || thisArg !== undefined) {
          iteratee = bindCallback(iteratee, thisArg, 3);
        }
        return objectFunc(object, iteratee);
      };
    }

    /**
     * Creates a function for `_.mapKeys` or `_.mapValues`.
     *
     * @private
     * @param {boolean} [isMapKeys] Specify mapping keys instead of values.
     * @returns {Function} Returns the new map function.
     */
    function createObjectMapper(isMapKeys) {
      return function(object, iteratee, thisArg) {
        var result = {};
        iteratee = getCallback(iteratee, thisArg, 3);

        baseForOwn(object, function(value, key, object) {
          var mapped = iteratee(value, key, object);
          key = isMapKeys ? mapped : key;
          value = isMapKeys ? value : mapped;
          result[key] = value;
        });
        return result;
      };
    }

    /**
     * Creates a function for `_.padLeft` or `_.padRight`.
     *
     * @private
     * @param {boolean} [fromRight] Specify padding from the right.
     * @returns {Function} Returns the new pad function.
     */
    function createPadDir(fromRight) {
      return function(string, length, chars) {
        string = baseToString(string);
        return (fromRight ? string : '') + createPadding(string, length, chars) + (fromRight ? '' : string);
      };
    }

    /**
     * Creates a `_.partial` or `_.partialRight` function.
     *
     * @private
     * @param {boolean} flag The partial bit flag.
     * @returns {Function} Returns the new partial function.
     */
    function createPartial(flag) {
      var partialFunc = restParam(function(func, partials) {
        var holders = replaceHolders(partials, partialFunc.placeholder);
        return createWrapper(func, flag, undefined, partials, holders);
      });
      return partialFunc;
    }

    /**
     * Creates a function for `_.reduce` or `_.reduceRight`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over an array.
     * @param {Function} eachFunc The function to iterate over a collection.
     * @returns {Function} Returns the new each function.
     */
    function createReduce(arrayFunc, eachFunc) {
      return function(collection, iteratee, accumulator, thisArg) {
        var initFromArray = arguments.length < 3;
        return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
          ? arrayFunc(collection, iteratee, accumulator, initFromArray)
          : baseReduce(collection, getCallback(iteratee, thisArg, 4), accumulator, initFromArray, eachFunc);
      };
    }

    /**
     * Creates a function that wraps `func` and invokes it with optional `this`
     * binding of, partial application, and currying.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [partialsRight] The arguments to append to those provided to the new function.
     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
      var isAry = bitmask & ARY_FLAG,
          isBind = bitmask & BIND_FLAG,
          isBindKey = bitmask & BIND_KEY_FLAG,
          isCurry = bitmask & CURRY_FLAG,
          isCurryBound = bitmask & CURRY_BOUND_FLAG,
          isCurryRight = bitmask & CURRY_RIGHT_FLAG,
          Ctor = isBindKey ? undefined : createCtorWrapper(func);

      function wrapper() {
        // Avoid `arguments` object use disqualifying optimizations by
        // converting it to an array before providing it to other functions.
        var length = arguments.length,
            index = length,
            args = Array(length);

        while (index--) {
          args[index] = arguments[index];
        }
        if (partials) {
          args = composeArgs(args, partials, holders);
        }
        if (partialsRight) {
          args = composeArgsRight(args, partialsRight, holdersRight);
        }
        if (isCurry || isCurryRight) {
          var placeholder = wrapper.placeholder,
              argsHolders = replaceHolders(args, placeholder);

          length -= argsHolders.length;
          if (length < arity) {
            var newArgPos = argPos ? arrayCopy(argPos) : undefined,
                newArity = nativeMax(arity - length, 0),
                newsHolders = isCurry ? argsHolders : undefined,
                newHoldersRight = isCurry ? undefined : argsHolders,
                newPartials = isCurry ? args : undefined,
                newPartialsRight = isCurry ? undefined : args;

            bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
            bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);

            if (!isCurryBound) {
              bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
            }
            var newData = [func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, newArity],
                result = createHybridWrapper.apply(undefined, newData);

            if (isLaziable(func)) {
              setData(result, newData);
            }
            result.placeholder = placeholder;
            return result;
          }
        }
        var thisBinding = isBind ? thisArg : this,
            fn = isBindKey ? thisBinding[func] : func;

        if (argPos) {
          args = reorder(args, argPos);
        }
        if (isAry && ary < args.length) {
          args.length = ary;
        }
        if (this && this !== root && this instanceof wrapper) {
          fn = Ctor || createCtorWrapper(func);
        }
        return fn.apply(thisBinding, args);
      }
      return wrapper;
    }

    /**
     * Creates the padding required for `string` based on the given `length`.
     * The `chars` string is truncated if the number of characters exceeds `length`.
     *
     * @private
     * @param {string} string The string to create padding for.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the pad for `string`.
     */
    function createPadding(string, length, chars) {
      var strLength = string.length;
      length = +length;

      if (strLength >= length || !nativeIsFinite(length)) {
        return '';
      }
      var padLength = length - strLength;
      chars = chars == null ? ' ' : (chars + '');
      return repeat(chars, nativeCeil(padLength / chars.length)).slice(0, padLength);
    }

    /**
     * Creates a function that wraps `func` and invokes it with the optional `this`
     * binding of `thisArg` and the `partials` prepended to those provided to
     * the wrapper.
     *
     * @private
     * @param {Function} func The function to partially apply arguments to.
     * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} partials The arguments to prepend to those provided to the new function.
     * @returns {Function} Returns the new bound function.
     */
    function createPartialWrapper(func, bitmask, thisArg, partials) {
      var isBind = bitmask & BIND_FLAG,
          Ctor = createCtorWrapper(func);

      function wrapper() {
        // Avoid `arguments` object use disqualifying optimizations by
        // converting it to an array before providing it `func`.
        var argsIndex = -1,
            argsLength = arguments.length,
            leftIndex = -1,
            leftLength = partials.length,
            args = Array(leftLength + argsLength);

        while (++leftIndex < leftLength) {
          args[leftIndex] = partials[leftIndex];
        }
        while (argsLength--) {
          args[leftIndex++] = arguments[++argsIndex];
        }
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(isBind ? thisArg : this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.ceil`, `_.floor`, or `_.round` function.
     *
     * @private
     * @param {string} methodName The name of the `Math` method to use when rounding.
     * @returns {Function} Returns the new round function.
     */
    function createRound(methodName) {
      var func = Math[methodName];
      return function(number, precision) {
        precision = precision === undefined ? 0 : (+precision || 0);
        if (precision) {
          precision = pow(10, precision);
          return func(number * precision) / precision;
        }
        return func(number);
      };
    }

    /**
     * Creates a `_.sortedIndex` or `_.sortedLastIndex` function.
     *
     * @private
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {Function} Returns the new index function.
     */
    function createSortedIndex(retHighest) {
      return function(array, value, iteratee, thisArg) {
        var callback = getCallback(iteratee);
        return (iteratee == null && callback === baseCallback)
          ? binaryIndex(array, value, retHighest)
          : binaryIndexBy(array, value, callback(iteratee, thisArg, 1), retHighest);
      };
    }

    /**
     * Creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of flags.
     *  The bitmask may be composed of the following flags:
     *     1 - `_.bind`
     *     2 - `_.bindKey`
     *     4 - `_.curry` or `_.curryRight` of a bound function
     *     8 - `_.curry`
     *    16 - `_.curryRight`
     *    32 - `_.partial`
     *    64 - `_.partialRight`
     *   128 - `_.rearg`
     *   256 - `_.ary`
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to be partially applied.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
      var isBindKey = bitmask & BIND_KEY_FLAG;
      if (!isBindKey && typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = partials ? partials.length : 0;
      if (!length) {
        bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
        partials = holders = undefined;
      }
      length -= (holders ? holders.length : 0);
      if (bitmask & PARTIAL_RIGHT_FLAG) {
        var partialsRight = partials,
            holdersRight = holders;

        partials = holders = undefined;
      }
      var data = isBindKey ? undefined : getData(func),
          newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];

      if (data) {
        mergeData(newData, data);
        bitmask = newData[1];
        arity = newData[9];
      }
      newData[9] = arity == null
        ? (isBindKey ? 0 : func.length)
        : (nativeMax(arity - length, 0) || 0);

      if (bitmask == BIND_FLAG) {
        var result = createBindWrapper(newData[0], newData[2]);
      } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !newData[4].length) {
        result = createPartialWrapper.apply(undefined, newData);
      } else {
        result = createHybridWrapper.apply(undefined, newData);
      }
      var setter = data ? baseSetData : setData;
      return setter(result, newData);
    }

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing arrays.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
      var index = -1,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
        return false;
      }
      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index],
            result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;

        if (result !== undefined) {
          if (result) {
            continue;
          }
          return false;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (isLoose) {
          if (!arraySome(other, function(othValue) {
                return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
              })) {
            return false;
          }
        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
          return false;
        }
      }
      return true;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag) {
      switch (tag) {
        case boolTag:
        case dateTag:
          // Coerce dates and booleans to numbers, dates to milliseconds and booleans
          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
          return +object == +other;

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case numberTag:
          // Treat `NaN` vs. `NaN` as equal.
          return (object != +object)
            ? other != +other
            : object == +other;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings primitives and string
          // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
          return object == (other + '');
      }
      return false;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing values.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
      var objProps = keys(object),
          objLength = objProps.length,
          othProps = keys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isLoose) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      var skipCtor = isLoose;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key],
            result = customizer ? customizer(isLoose ? othValue : objValue, isLoose? objValue : othValue, key) : undefined;

        // Recursively compare objects (susceptible to call stack limits).
        if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
          return false;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (!skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          return false;
        }
      }
      return true;
    }

    /**
     * Gets the appropriate "callback" function. If the `_.callback` method is
     * customized this function returns the custom method, otherwise it returns
     * the `baseCallback` function. If arguments are provided the chosen function
     * is invoked with them and its result is returned.
     *
     * @private
     * @returns {Function} Returns the chosen function or its result.
     */
    function getCallback(func, thisArg, argCount) {
      var result = lodash.callback || callback;
      result = result === callback ? baseCallback : result;
      return argCount ? result(func, thisArg, argCount) : result;
    }

    /**
     * Gets metadata for `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {*} Returns the metadata for `func`.
     */
    var getData = !metaMap ? noop : function(func) {
      return metaMap.get(func);
    };

    /**
     * Gets the name of `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {string} Returns the function name.
     */
    function getFuncName(func) {
      var result = func.name,
          array = realNames[result],
          length = array ? array.length : 0;

      while (length--) {
        var data = array[length],
            otherFunc = data.func;
        if (otherFunc == null || otherFunc == func) {
          return data.name;
        }
      }
      return result;
    }

    /**
     * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
     * customized this function returns the custom method, otherwise it returns
     * the `baseIndexOf` function. If arguments are provided the chosen function
     * is invoked with them and its result is returned.
     *
     * @private
     * @returns {Function|number} Returns the chosen function or its result.
     */
    function getIndexOf(collection, target, fromIndex) {
      var result = lodash.indexOf || indexOf;
      result = result === indexOf ? baseIndexOf : result;
      return collection ? result(collection, target, fromIndex) : result;
    }

    /**
     * Gets the "length" property value of `object`.
     *
     * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
     * that affects Safari on at least iOS 8.1-8.3 ARM64.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {*} Returns the "length" value.
     */
    var getLength = baseProperty('length');

    /**
     * Gets the propery names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */
    function getMatchData(object) {
      var result = pairs(object),
          length = result.length;

      while (length--) {
        result[length][2] = isStrictComparable(result[length][1]);
      }
      return result;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = object == null ? undefined : object[key];
      return isNative(value) ? value : undefined;
    }

    /**
     * Gets the view, applying any `transforms` to the `start` and `end` positions.
     *
     * @private
     * @param {number} start The start of the view.
     * @param {number} end The end of the view.
     * @param {Array} transforms The transformations to apply to the view.
     * @returns {Object} Returns an object containing the `start` and `end`
     *  positions of the view.
     */
    function getView(start, end, transforms) {
      var index = -1,
          length = transforms.length;

      while (++index < length) {
        var data = transforms[index],
            size = data.size;

        switch (data.type) {
          case 'drop':      start += size; break;
          case 'dropRight': end -= size; break;
          case 'take':      end = nativeMin(end, start + size); break;
          case 'takeRight': start = nativeMax(start, end - size); break;
        }
      }
      return { 'start': start, 'end': end };
    }

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = new array.constructor(length);

      // Add array properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      var Ctor = object.constructor;
      if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
        Ctor = Object;
      }
      return new Ctor;
    }

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return bufferClone(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case float32Tag: case float64Tag:
        case int8Tag: case int16Tag: case int32Tag:
        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
          var buffer = object.buffer;
          return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          var result = new Ctor(object.source, reFlags.exec(object));
          result.lastIndex = object.lastIndex;
      }
      return result;
    }

    /**
     * Invokes the method at `path` on `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {Array} args The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     */
    function invokePath(object, path, args) {
      if (object != null && !isKey(path, object)) {
        path = toPath(path);
        object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
        path = last(path);
      }
      var func = object == null ? object : object[path];
      return func == null ? undefined : func.apply(object, args);
    }

    /**
     * Checks if `value` is array-like.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     */
    function isArrayLike(value) {
      return value != null && isLength(getLength(value));
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
      length = length == null ? MAX_SAFE_INTEGER : length;
      return value > -1 && value % 1 == 0 && value < length;
    }

    /**
     * Checks if the provided arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
     */
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
          ? (isArrayLike(object) && isIndex(index, object.length))
          : (type == 'string' && index in object)) {
        var other = object[index];
        return value === value ? (value === other) : (other !== other);
      }
      return false;
    }

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      var type = typeof value;
      if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
        return true;
      }
      if (isArray(value)) {
        return false;
      }
      var result = !reIsDeepProp.test(value);
      return result || (object != null && value in toObject(object));
    }

    /**
     * Checks if `func` has a lazy counterpart.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` has a lazy counterpart, else `false`.
     */
    function isLaziable(func) {
      var funcName = getFuncName(func);
      if (!(funcName in LazyWrapper.prototype)) {
        return false;
      }
      var other = lodash[funcName];
      if (func === other) {
        return true;
      }
      var data = getData(other);
      return !!data && func === data[0];
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     */
    function isLength(value) {
      return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }

    /**
     * Merges the function metadata of `source` into `data`.
     *
     * Merging metadata reduces the number of wrappers required to invoke a function.
     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
     * may be applied regardless of execution order. Methods like `_.ary` and `_.rearg`
     * augment function arguments, making the order in which they are executed important,
     * preventing the merging of metadata. However, we make an exception for a safe
     * common case where curried functions have `_.ary` and or `_.rearg` applied.
     *
     * @private
     * @param {Array} data The destination metadata.
     * @param {Array} source The source metadata.
     * @returns {Array} Returns `data`.
     */
    function mergeData(data, source) {
      var bitmask = data[1],
          srcBitmask = source[1],
          newBitmask = bitmask | srcBitmask,
          isCommon = newBitmask < ARY_FLAG;

      var isCombo =
        (srcBitmask == ARY_FLAG && bitmask == CURRY_FLAG) ||
        (srcBitmask == ARY_FLAG && bitmask == REARG_FLAG && data[7].length <= source[8]) ||
        (srcBitmask == (ARY_FLAG | REARG_FLAG) && bitmask == CURRY_FLAG);

      // Exit early if metadata can't be merged.
      if (!(isCommon || isCombo)) {
        return data;
      }
      // Use source `thisArg` if available.
      if (srcBitmask & BIND_FLAG) {
        data[2] = source[2];
        // Set when currying a bound function.
        newBitmask |= (bitmask & BIND_FLAG) ? 0 : CURRY_BOUND_FLAG;
      }
      // Compose partial arguments.
      var value = source[3];
      if (value) {
        var partials = data[3];
        data[3] = partials ? composeArgs(partials, value, source[4]) : arrayCopy(value);
        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : arrayCopy(source[4]);
      }
      // Compose partial right arguments.
      value = source[5];
      if (value) {
        partials = data[5];
        data[5] = partials ? composeArgsRight(partials, value, source[6]) : arrayCopy(value);
        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : arrayCopy(source[6]);
      }
      // Use source `argPos` if available.
      value = source[7];
      if (value) {
        data[7] = arrayCopy(value);
      }
      // Use source `ary` if it's smaller.
      if (srcBitmask & ARY_FLAG) {
        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
      }
      // Use source `arity` if one is not provided.
      if (data[9] == null) {
        data[9] = source[9];
      }
      // Use source `func` and merge bitmasks.
      data[0] = source[0];
      data[1] = newBitmask;

      return data;
    }

    /**
     * Used by `_.defaultsDeep` to customize its `_.merge` use.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @returns {*} Returns the value to assign to the destination object.
     */
    function mergeDefaults(objectValue, sourceValue) {
      return objectValue === undefined ? sourceValue : merge(objectValue, sourceValue, mergeDefaults);
    }

    /**
     * A specialized version of `_.pick` which picks `object` properties specified
     * by `props`.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} props The property names to pick.
     * @returns {Object} Returns the new object.
     */
    function pickByArray(object, props) {
      object = toObject(object);

      var index = -1,
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index];
        if (key in object) {
          result[key] = object[key];
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.pick` which picks `object` properties `predicate`
     * returns truthy for.
     *
     * @private
     * @param {Object} object The source object.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Object} Returns the new object.
     */
    function pickByCallback(object, predicate) {
      var result = {};
      baseForIn(object, function(value, key, object) {
        if (predicate(value, key, object)) {
          result[key] = value;
        }
      });
      return result;
    }

    /**
     * Reorder `array` according to the specified indexes where the element at
     * the first index is assigned as the first element, the element at
     * the second index is assigned as the second element, and so on.
     *
     * @private
     * @param {Array} array The array to reorder.
     * @param {Array} indexes The arranged array indexes.
     * @returns {Array} Returns `array`.
     */
    function reorder(array, indexes) {
      var arrLength = array.length,
          length = nativeMin(indexes.length, arrLength),
          oldArray = arrayCopy(array);

      while (length--) {
        var index = indexes[length];
        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
      }
      return array;
    }

    /**
     * Sets metadata for `func`.
     *
     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
     * period of time, it will trip its breaker and transition to an identity function
     * to avoid garbage collection pauses in V8. See [V8 issue 2070](https://code.google.com/p/v8/issues/detail?id=2070)
     * for more details.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var setData = (function() {
      var count = 0,
          lastCalled = 0;

      return function(key, value) {
        var stamp = now(),
            remaining = HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return key;
          }
        } else {
          count = 0;
        }
        return baseSetData(key, value);
      };
    }());

    /**
     * A fallback implementation of `Object.keys` which creates an array of the
     * own enumerable property names of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function shimKeys(object) {
      var props = keysIn(object),
          propsLength = props.length,
          length = propsLength && object.length;

      var allowIndexes = !!length && isLength(length) &&
        (isArray(object) || isArguments(object));

      var index = -1,
          result = [];

      while (++index < propsLength) {
        var key = props[index];
        if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Converts `value` to an array-like object if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Array|Object} Returns the array-like object.
     */
    function toIterable(value) {
      if (value == null) {
        return [];
      }
      if (!isArrayLike(value)) {
        return values(value);
      }
      return isObject(value) ? value : Object(value);
    }

    /**
     * Converts `value` to an object if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Object} Returns the object.
     */
    function toObject(value) {
      return isObject(value) ? value : Object(value);
    }

    /**
     * Converts `value` to property path array if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Array} Returns the property path array.
     */
    function toPath(value) {
      if (isArray(value)) {
        return value;
      }
      var result = [];
      baseToString(value).replace(rePropName, function(match, number, quote, string) {
        result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    }

    /**
     * Creates a clone of `wrapper`.
     *
     * @private
     * @param {Object} wrapper The wrapper to clone.
     * @returns {Object} Returns the cloned wrapper.
     */
    function wrapperClone(wrapper) {
      return wrapper instanceof LazyWrapper
        ? wrapper.clone()
        : new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__, arrayCopy(wrapper.__actions__));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements split into groups the length of `size`.
     * If `collection` can't be split evenly, the final chunk will be the remaining
     * elements.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to process.
     * @param {number} [size=1] The length of each chunk.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the new array containing chunks.
     * @example
     *
     * _.chunk(['a', 'b', 'c', 'd'], 2);
     * // => [['a', 'b'], ['c', 'd']]
     *
     * _.chunk(['a', 'b', 'c', 'd'], 3);
     * // => [['a', 'b', 'c'], ['d']]
     */
    function chunk(array, size, guard) {
      if (guard ? isIterateeCall(array, size, guard) : size == null) {
        size = 1;
      } else {
        size = nativeMax(nativeFloor(size) || 1, 1);
      }
      var index = 0,
          length = array ? array.length : 0,
          resIndex = -1,
          result = Array(nativeCeil(length / size));

      while (index < length) {
        result[++resIndex] = baseSlice(array, index, (index += size));
      }
      return result;
    }

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are falsey.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to compact.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array ? array.length : 0,
          resIndex = -1,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[++resIndex] = value;
        }
      }
      return result;
    }

    /**
     * Creates an array of unique `array` values not included in the other
     * provided arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The arrays of values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.difference([1, 2, 3], [4, 2]);
     * // => [1, 3]
     */
    var difference = restParam(function(array, values) {
      return (isObjectLike(array) && isArrayLike(array))
        ? baseDifference(array, baseFlatten(values, false, true))
        : [];
    });

    /**
     * Creates a slice of `array` with `n` elements dropped from the beginning.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.drop([1, 2, 3]);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function drop(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      return baseSlice(array, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements dropped from the end.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRight([1, 2, 3]);
     * // => [1, 2]
     *
     * _.dropRight([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropRight([1, 2, 3], 5);
     * // => []
     *
     * _.dropRight([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function dropRight(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      n = length - (+n || 0);
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the end.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that match the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRightWhile([1, 2, 3], function(n) {
     *   return n > 1;
     * });
     * // => [1]
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.dropRightWhile(users, { 'user': 'pebbles', 'active': false }), 'user');
     * // => ['barney', 'fred']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.dropRightWhile(users, 'active', false), 'user');
     * // => ['barney']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.dropRightWhile(users, 'active'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */
    function dropRightWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3), true, true)
        : [];
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the beginning.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropWhile([1, 2, 3], function(n) {
     *   return n < 3;
     * });
     * // => [3]
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.dropWhile(users, { 'user': 'barney', 'active': false }), 'user');
     * // => ['fred', 'pebbles']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.dropWhile(users, 'active', false), 'user');
     * // => ['pebbles']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.dropWhile(users, 'active'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */
    function dropWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3), true)
        : [];
    }

    /**
     * Fills elements of `array` with `value` from `start` up to, but not
     * including, `end`.
     *
     * **Note:** This method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.fill(array, 'a');
     * console.log(array);
     * // => ['a', 'a', 'a']
     *
     * _.fill(Array(3), 2);
     * // => [2, 2, 2]
     *
     * _.fill([4, 6, 8], '*', 1, 2);
     * // => [4, '*', 8]
     */
    function fill(array, value, start, end) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
        start = 0;
        end = length;
      }
      return baseFill(array, value, start, end);
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.findIndex(users, function(chr) {
     *   return chr.user == 'barney';
     * });
     * // => 0
     *
     * // using the `_.matches` callback shorthand
     * _.findIndex(users, { 'user': 'fred', 'active': false });
     * // => 1
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findIndex(users, 'active', false);
     * // => 0
     *
     * // using the `_.property` callback shorthand
     * _.findIndex(users, 'active');
     * // => 2
     */
    var findIndex = createFindIndex();

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of `collection` from right to left.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.findLastIndex(users, function(chr) {
     *   return chr.user == 'pebbles';
     * });
     * // => 2
     *
     * // using the `_.matches` callback shorthand
     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
     * // => 0
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findLastIndex(users, 'active', false);
     * // => 2
     *
     * // using the `_.property` callback shorthand
     * _.findLastIndex(users, 'active');
     * // => 0
     */
    var findLastIndex = createFindIndex(true);

    /**
     * Gets the first element of `array`.
     *
     * @static
     * @memberOf _
     * @alias head
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the first element of `array`.
     * @example
     *
     * _.first([1, 2, 3]);
     * // => 1
     *
     * _.first([]);
     * // => undefined
     */
    function first(array) {
      return array ? array[0] : undefined;
    }

    /**
     * Flattens a nested array. If `isDeep` is `true` the array is recursively
     * flattened, otherwise it is only flattened a single level.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to flatten.
     * @param {boolean} [isDeep] Specify a deep flatten.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2, 3, [4]]]);
     * // => [1, 2, 3, [4]]
     *
     * // using `isDeep`
     * _.flatten([1, [2, 3, [4]]], true);
     * // => [1, 2, 3, 4]
     */
    function flatten(array, isDeep, guard) {
      var length = array ? array.length : 0;
      if (guard && isIterateeCall(array, isDeep, guard)) {
        isDeep = false;
      }
      return length ? baseFlatten(array, isDeep) : [];
    }

    /**
     * Recursively flattens a nested array.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to recursively flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flattenDeep([1, [2, 3, [4]]]);
     * // => [1, 2, 3, 4]
     */
    function flattenDeep(array) {
      var length = array ? array.length : 0;
      return length ? baseFlatten(array, true) : [];
    }

    /**
     * Gets the index at which the first occurrence of `value` is found in `array`
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it is used as the offset
     * from the end of `array`. If `array` is sorted providing `true` for `fromIndex`
     * performs a faster binary search.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=0] The index to search from or `true`
     *  to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.indexOf([1, 2, 1, 2], 2);
     * // => 1
     *
     * // using `fromIndex`
     * _.indexOf([1, 2, 1, 2], 2, 2);
     * // => 3
     *
     * // performing a binary search
     * _.indexOf([1, 1, 2, 2], 2, true);
     * // => 2
     */
    function indexOf(array, value, fromIndex) {
      var length = array ? array.length : 0;
      if (!length) {
        return -1;
      }
      if (typeof fromIndex == 'number') {
        fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : fromIndex;
      } else if (fromIndex) {
        var index = binaryIndex(array, value);
        if (index < length &&
            (value === value ? (value === array[index]) : (array[index] !== array[index]))) {
          return index;
        }
        return -1;
      }
      return baseIndexOf(array, value, fromIndex || 0);
    }

    /**
     * Gets all but the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */
    function initial(array) {
      return dropRight(array, 1);
    }

    /**
     * Creates an array of unique values that are included in all of the provided
     * arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of shared values.
     * @example
     * _.intersection([1, 2], [4, 2], [2, 1]);
     * // => [2]
     */
    var intersection = restParam(function(arrays) {
      var othLength = arrays.length,
          othIndex = othLength,
          caches = Array(length),
          indexOf = getIndexOf(),
          isCommon = indexOf == baseIndexOf,
          result = [];

      while (othIndex--) {
        var value = arrays[othIndex] = isArrayLike(value = arrays[othIndex]) ? value : [];
        caches[othIndex] = (isCommon && value.length >= 120) ? createCache(othIndex && value) : null;
      }
      var array = arrays[0],
          index = -1,
          length = array ? array.length : 0,
          seen = caches[0];

      outer:
      while (++index < length) {
        value = array[index];
        if ((seen ? cacheIndexOf(seen, value) : indexOf(result, value, 0)) < 0) {
          var othIndex = othLength;
          while (--othIndex) {
            var cache = caches[othIndex];
            if ((cache ? cacheIndexOf(cache, value) : indexOf(arrays[othIndex], value, 0)) < 0) {
              continue outer;
            }
          }
          if (seen) {
            seen.push(value);
          }
          result.push(value);
        }
      }
      return result;
    });

    /**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last(array) {
      var length = array ? array.length : 0;
      return length ? array[length - 1] : undefined;
    }

    /**
     * This method is like `_.indexOf` except that it iterates over elements of
     * `array` from right to left.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=array.length-1] The index to search from
     *  or `true` to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 1, 2], 2);
     * // => 3
     *
     * // using `fromIndex`
     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
     * // => 1
     *
     * // performing a binary search
     * _.lastIndexOf([1, 1, 2, 2], 2, true);
     * // => 3
     */
    function lastIndexOf(array, value, fromIndex) {
      var length = array ? array.length : 0;
      if (!length) {
        return -1;
      }
      var index = length;
      if (typeof fromIndex == 'number') {
        index = (fromIndex < 0 ? nativeMax(length + fromIndex, 0) : nativeMin(fromIndex || 0, length - 1)) + 1;
      } else if (fromIndex) {
        index = binaryIndex(array, value, true) - 1;
        var other = array[index];
        if (value === value ? (value === other) : (other !== other)) {
          return index;
        }
        return -1;
      }
      if (value !== value) {
        return indexOfNaN(array, index, true);
      }
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * Removes all provided values from `array` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.without`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...*} [values] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     *
     * _.pull(array, 2, 3);
     * console.log(array);
     * // => [1, 1]
     */
    function pull() {
      var args = arguments,
          array = args[0];

      if (!(array && array.length)) {
        return array;
      }
      var index = 0,
          indexOf = getIndexOf(),
          length = args.length;

      while (++index < length) {
        var fromIndex = 0,
            value = args[index];

        while ((fromIndex = indexOf(array, value, fromIndex)) > -1) {
          splice.call(array, fromIndex, 1);
        }
      }
      return array;
    }

    /**
     * Removes elements from `array` corresponding to the given indexes and returns
     * an array of the removed elements. Indexes may be specified as an array of
     * indexes or as individual arguments.
     *
     * **Note:** Unlike `_.at`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...(number|number[])} [indexes] The indexes of elements to remove,
     *  specified as individual indexes or arrays of indexes.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [5, 10, 15, 20];
     * var evens = _.pullAt(array, 1, 3);
     *
     * console.log(array);
     * // => [5, 15]
     *
     * console.log(evens);
     * // => [10, 20]
     */
    var pullAt = restParam(function(array, indexes) {
      indexes = baseFlatten(indexes);

      var result = baseAt(array, indexes);
      basePullAt(array, indexes.sort(baseCompareAscending));
      return result;
    });

    /**
     * Removes all elements from `array` that `predicate` returns truthy for
     * and returns an array of the removed elements. The predicate is bound to
     * `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * **Note:** Unlike `_.filter`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) {
     *   return n % 2 == 0;
     * });
     *
     * console.log(array);
     * // => [1, 3]
     *
     * console.log(evens);
     * // => [2, 4]
     */
    function remove(array, predicate, thisArg) {
      var result = [];
      if (!(array && array.length)) {
        return result;
      }
      var index = -1,
          indexes = [],
          length = array.length;

      predicate = getCallback(predicate, thisArg, 3);
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result.push(value);
          indexes.push(index);
        }
      }
      basePullAt(array, indexes);
      return result;
    }

    /**
     * Gets all but the first element of `array`.
     *
     * @static
     * @memberOf _
     * @alias tail
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.rest([1, 2, 3]);
     * // => [2, 3]
     */
    function rest(array) {
      return drop(array, 1);
    }

    /**
     * Creates a slice of `array` from `start` up to, but not including, `end`.
     *
     * **Note:** This method is used instead of `Array#slice` to support node
     * lists in IE < 9 and to ensure dense arrays are returned.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function slice(array, start, end) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
        start = 0;
        end = length;
      }
      return baseSlice(array, start, end);
    }

    /**
     * Uses a binary search to determine the lowest index at which `value` should
     * be inserted into `array` in order to maintain its sort order. If an iteratee
     * function is provided it is invoked for `value` and each element of `array`
     * to compute their sort ranking. The iteratee is bound to `thisArg` and
     * invoked with one argument; (value).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([30, 50], 40);
     * // => 1
     *
     * _.sortedIndex([4, 4, 5, 5], 5);
     * // => 2
     *
     * var dict = { 'data': { 'thirty': 30, 'forty': 40, 'fifty': 50 } };
     *
     * // using an iteratee function
     * _.sortedIndex(['thirty', 'fifty'], 'forty', function(word) {
     *   return this.data[word];
     * }, dict);
     * // => 1
     *
     * // using the `_.property` callback shorthand
     * _.sortedIndex([{ 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
     * // => 1
     */
    var sortedIndex = createSortedIndex();

    /**
     * This method is like `_.sortedIndex` except that it returns the highest
     * index at which `value` should be inserted into `array` in order to
     * maintain its sort order.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedLastIndex([4, 4, 5, 5], 5);
     * // => 4
     */
    var sortedLastIndex = createSortedIndex(true);

    /**
     * Creates a slice of `array` with `n` elements taken from the beginning.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.take([1, 2, 3]);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */
    function take(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the end.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRight([1, 2, 3]);
     * // => [3]
     *
     * _.takeRight([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeRight([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeRight([1, 2, 3], 0);
     * // => []
     */
    function takeRight(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      n = length - (+n || 0);
      return baseSlice(array, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with elements taken from the end. Elements are
     * taken until `predicate` returns falsey. The predicate is bound to `thisArg`
     * and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRightWhile([1, 2, 3], function(n) {
     *   return n > 1;
     * });
     * // => [2, 3]
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.takeRightWhile(users, { 'user': 'pebbles', 'active': false }), 'user');
     * // => ['pebbles']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.takeRightWhile(users, 'active', false), 'user');
     * // => ['fred', 'pebbles']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.takeRightWhile(users, 'active'), 'user');
     * // => []
     */
    function takeRightWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3), false, true)
        : [];
    }

    /**
     * Creates a slice of `array` with elements taken from the beginning. Elements
     * are taken until `predicate` returns falsey. The predicate is bound to
     * `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeWhile([1, 2, 3], function(n) {
     *   return n < 3;
     * });
     * // => [1, 2]
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false},
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.takeWhile(users, { 'user': 'barney', 'active': false }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.takeWhile(users, 'active', false), 'user');
     * // => ['barney', 'fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.takeWhile(users, 'active'), 'user');
     * // => []
     */
    function takeWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3))
        : [];
    }

    /**
     * Creates an array of unique values, in order, from all of the provided arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.union([1, 2], [4, 2], [2, 1]);
     * // => [1, 2, 4]
     */
    var union = restParam(function(arrays) {
      return baseUniq(baseFlatten(arrays, false, true));
    });

    /**
     * Creates a duplicate-free version of an array, using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons, in which only the first occurence of each element
     * is kept. Providing `true` for `isSorted` performs a faster search algorithm
     * for sorted arrays. If an iteratee function is provided it is invoked for
     * each element in the array to generate the criterion by which uniqueness
     * is computed. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, array).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias unique
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {boolean} [isSorted] Specify the array is sorted.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new duplicate-value-free array.
     * @example
     *
     * _.uniq([2, 1, 2]);
     * // => [2, 1]
     *
     * // using `isSorted`
     * _.uniq([1, 1, 2], true);
     * // => [1, 2]
     *
     * // using an iteratee function
     * _.uniq([1, 2.5, 1.5, 2], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => [1, 2.5]
     *
     * // using the `_.property` callback shorthand
     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniq(array, isSorted, iteratee, thisArg) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (isSorted != null && typeof isSorted != 'boolean') {
        thisArg = iteratee;
        iteratee = isIterateeCall(array, isSorted, thisArg) ? undefined : isSorted;
        isSorted = false;
      }
      var callback = getCallback();
      if (!(iteratee == null && callback === baseCallback)) {
        iteratee = callback(iteratee, thisArg, 3);
      }
      return (isSorted && getIndexOf() == baseIndexOf)
        ? sortedUniq(array, iteratee)
        : baseUniq(array, iteratee);
    }

    /**
     * This method is like `_.zip` except that it accepts an array of grouped
     * elements and creates an array regrouping the elements to their pre-zip
     * configuration.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     *
     * _.unzip(zipped);
     * // => [['fred', 'barney'], [30, 40], [true, false]]
     */
    function unzip(array) {
      if (!(array && array.length)) {
        return [];
      }
      var index = -1,
          length = 0;

      array = arrayFilter(array, function(group) {
        if (isArrayLike(group)) {
          length = nativeMax(group.length, length);
          return true;
        }
      });
      var result = Array(length);
      while (++index < length) {
        result[index] = arrayMap(array, baseProperty(index));
      }
      return result;
    }

    /**
     * This method is like `_.unzip` except that it accepts an iteratee to specify
     * how regrouped values should be combined. The `iteratee` is bound to `thisArg`
     * and invoked with four arguments: (accumulator, value, index, group).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @param {Function} [iteratee] The function to combine regrouped values.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
     * // => [[1, 10, 100], [2, 20, 200]]
     *
     * _.unzipWith(zipped, _.add);
     * // => [3, 30, 300]
     */
    function unzipWith(array, iteratee, thisArg) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      var result = unzip(array);
      if (iteratee == null) {
        return result;
      }
      iteratee = bindCallback(iteratee, thisArg, 4);
      return arrayMap(result, function(group) {
        return arrayReduce(group, iteratee, undefined, true);
      });
    }

    /**
     * Creates an array excluding all provided values using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to filter.
     * @param {...*} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.without([1, 2, 1, 3], 1, 2);
     * // => [3]
     */
    var without = restParam(function(array, values) {
      return isArrayLike(array)
        ? baseDifference(array, values)
        : [];
    });

    /**
     * Creates an array of unique values that is the [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
     * of the provided arrays.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of values.
     * @example
     *
     * _.xor([1, 2], [4, 2]);
     * // => [1, 4]
     */
    function xor() {
      var index = -1,
          length = arguments.length;

      while (++index < length) {
        var array = arguments[index];
        if (isArrayLike(array)) {
          var result = result
            ? arrayPush(baseDifference(result, array), baseDifference(array, result))
            : array;
        }
      }
      return result ? baseUniq(result) : [];
    }

    /**
     * Creates an array of grouped elements, the first of which contains the first
     * elements of the given arrays, the second of which contains the second elements
     * of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     */
    var zip = restParam(unzip);

    /**
     * The inverse of `_.pairs`; this method returns an object composed from arrays
     * of property names and values. Provide either a single two dimensional array,
     * e.g. `[[key1, value1], [key2, value2]]` or two arrays, one of property names
     * and one of corresponding values.
     *
     * @static
     * @memberOf _
     * @alias object
     * @category Array
     * @param {Array} props The property names.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObject([['fred', 30], ['barney', 40]]);
     * // => { 'fred': 30, 'barney': 40 }
     *
     * _.zipObject(['fred', 'barney'], [30, 40]);
     * // => { 'fred': 30, 'barney': 40 }
     */
    function zipObject(props, values) {
      var index = -1,
          length = props ? props.length : 0,
          result = {};

      if (length && !values && !isArray(props[0])) {
        values = [];
      }
      while (++index < length) {
        var key = props[index];
        if (values) {
          result[key] = values[index];
        } else if (key) {
          result[key[0]] = key[1];
        }
      }
      return result;
    }

    /**
     * This method is like `_.zip` except that it accepts an iteratee to specify
     * how grouped values should be combined. The `iteratee` is bound to `thisArg`
     * and invoked with four arguments: (accumulator, value, index, group).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @param {Function} [iteratee] The function to combine grouped values.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zipWith([1, 2], [10, 20], [100, 200], _.add);
     * // => [111, 222]
     */
    var zipWith = restParam(function(arrays) {
      var length = arrays.length,
          iteratee = length > 2 ? arrays[length - 2] : undefined,
          thisArg = length > 1 ? arrays[length - 1] : undefined;

      if (length > 2 && typeof iteratee == 'function') {
        length -= 2;
      } else {
        iteratee = (length > 1 && typeof thisArg == 'function') ? (--length, thisArg) : undefined;
        thisArg = undefined;
      }
      arrays.length = length;
      return unzipWith(arrays, iteratee, thisArg);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object that wraps `value` with explicit method
     * chaining enabled.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36 },
     *   { 'user': 'fred',    'age': 40 },
     *   { 'user': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _.chain(users)
     *   .sortBy('age')
     *   .map(function(chr) {
     *     return chr.user + ' is ' + chr.age;
     *   })
     *   .first()
     *   .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      var result = lodash(value);
      result.__chain__ = true;
      return result;
    }

    /**
     * This method invokes `interceptor` and returns `value`. The interceptor is
     * bound to `thisArg` and invoked with one argument; (value). The purpose of
     * this method is to "tap into" a method chain in order to perform operations
     * on intermediate results within the chain.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @param {*} [thisArg] The `this` binding of `interceptor`.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3])
     *  .tap(function(array) {
     *    array.pop();
     *  })
     *  .reverse()
     *  .value();
     * // => [2, 1]
     */
    function tap(value, interceptor, thisArg) {
      interceptor.call(thisArg, value);
      return value;
    }

    /**
     * This method is like `_.tap` except that it returns the result of `interceptor`.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @param {*} [thisArg] The `this` binding of `interceptor`.
     * @returns {*} Returns the result of `interceptor`.
     * @example
     *
     * _('  abc  ')
     *  .chain()
     *  .trim()
     *  .thru(function(value) {
     *    return [value];
     *  })
     *  .value();
     * // => ['abc']
     */
    function thru(value, interceptor, thisArg) {
      return interceptor.call(thisArg, value);
    }

    /**
     * Enables explicit method chaining on the wrapper object.
     *
     * @name chain
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // without explicit chaining
     * _(users).first();
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // with explicit chaining
     * _(users).chain()
     *   .first()
     *   .pick('user')
     *   .value();
     * // => { 'user': 'barney' }
     */
    function wrapperChain() {
      return chain(this);
    }

    /**
     * Executes the chained sequence and returns the wrapped result.
     *
     * @name commit
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).push(3);
     *
     * console.log(array);
     * // => [1, 2]
     *
     * wrapped = wrapped.commit();
     * console.log(array);
     * // => [1, 2, 3]
     *
     * wrapped.last();
     * // => 3
     *
     * console.log(array);
     * // => [1, 2, 3]
     */
    function wrapperCommit() {
      return new LodashWrapper(this.value(), this.__chain__);
    }

    /**
     * Creates a new array joining a wrapped array with any additional arrays
     * and/or values.
     *
     * @name concat
     * @memberOf _
     * @category Chain
     * @param {...*} [values] The values to concatenate.
     * @returns {Array} Returns the new concatenated array.
     * @example
     *
     * var array = [1];
     * var wrapped = _(array).concat(2, [3], [[4]]);
     *
     * console.log(wrapped.value());
     * // => [1, 2, 3, [4]]
     *
     * console.log(array);
     * // => [1]
     */
    var wrapperConcat = restParam(function(values) {
      values = baseFlatten(values);
      return this.thru(function(array) {
        return arrayConcat(isArray(array) ? array : [toObject(array)], values);
      });
    });

    /**
     * Creates a clone of the chained sequence planting `value` as the wrapped value.
     *
     * @name plant
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).map(function(value) {
     *   return Math.pow(value, 2);
     * });
     *
     * var other = [3, 4];
     * var otherWrapped = wrapped.plant(other);
     *
     * otherWrapped.value();
     * // => [9, 16]
     *
     * wrapped.value();
     * // => [1, 4]
     */
    function wrapperPlant(value) {
      var result,
          parent = this;

      while (parent instanceof baseLodash) {
        var clone = wrapperClone(parent);
        if (result) {
          previous.__wrapped__ = clone;
        } else {
          result = clone;
        }
        var previous = clone;
        parent = parent.__wrapped__;
      }
      previous.__wrapped__ = value;
      return result;
    }

    /**
     * Reverses the wrapped array so the first element becomes the last, the
     * second element becomes the second to last, and so on.
     *
     * **Note:** This method mutates the wrapped array.
     *
     * @name reverse
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new reversed `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _(array).reverse().value()
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function wrapperReverse() {
      var value = this.__wrapped__;

      var interceptor = function(value) {
        return (wrapped && wrapped.__dir__ < 0) ? value : value.reverse();
      };
      if (value instanceof LazyWrapper) {
        var wrapped = value;
        if (this.__actions__.length) {
          wrapped = new LazyWrapper(this);
        }
        wrapped = wrapped.reverse();
        wrapped.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });
        return new LodashWrapper(wrapped, this.__chain__);
      }
      return this.thru(interceptor);
    }

    /**
     * Produces the result of coercing the unwrapped value to a string.
     *
     * @name toString
     * @memberOf _
     * @category Chain
     * @returns {string} Returns the coerced string value.
     * @example
     *
     * _([1, 2, 3]).toString();
     * // => '1,2,3'
     */
    function wrapperToString() {
      return (this.value() + '');
    }

    /**
     * Executes the chained sequence to extract the unwrapped value.
     *
     * @name value
     * @memberOf _
     * @alias run, toJSON, valueOf
     * @category Chain
     * @returns {*} Returns the resolved unwrapped value.
     * @example
     *
     * _([1, 2, 3]).value();
     * // => [1, 2, 3]
     */
    function wrapperValue() {
      return baseWrapperValue(this.__wrapped__, this.__actions__);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements corresponding to the given keys, or indexes,
     * of `collection`. Keys may be specified as individual arguments or as arrays
     * of keys.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(number|number[]|string|string[])} [props] The property names
     *  or indexes of elements to pick, specified individually or in arrays.
     * @returns {Array} Returns the new array of picked elements.
     * @example
     *
     * _.at(['a', 'b', 'c'], [0, 2]);
     * // => ['a', 'c']
     *
     * _.at(['barney', 'fred', 'pebbles'], 0, 2);
     * // => ['barney', 'pebbles']
     */
    var at = restParam(function(collection, props) {
      return baseAt(collection, baseFlatten(props));
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is the number of times the key was returned by `iteratee`.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([4.3, 6.1, 6.4], function(n) {
     *   return Math.floor(n);
     * });
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy([4.3, 6.1, 6.4], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      hasOwnProperty.call(result, key) ? ++result[key] : (result[key] = 1);
    });

    /**
     * Checks if `predicate` returns truthy for **all** elements of `collection`.
     * The predicate is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias all
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'active': false },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.every(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.every(users, 'active', false);
     * // => true
     *
     * // using the `_.property` callback shorthand
     * _.every(users, 'active');
     * // => false
     */
    function every(collection, predicate, thisArg) {
      var func = isArray(collection) ? arrayEvery : baseEvery;
      if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
        predicate = undefined;
      }
      if (typeof predicate != 'function' || thisArg !== undefined) {
        predicate = getCallback(predicate, thisArg, 3);
      }
      return func(collection, predicate);
    }

    /**
     * Iterates over elements of `collection`, returning an array of all elements
     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
     * invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias select
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * _.filter([4, 5, 6], function(n) {
     *   return n % 2 == 0;
     * });
     * // => [4, 6]
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.filter(users, { 'age': 36, 'active': true }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.filter(users, 'active', false), 'user');
     * // => ['fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.filter(users, 'active'), 'user');
     * // => ['barney']
     */
    function filter(collection, predicate, thisArg) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      predicate = getCallback(predicate, thisArg, 3);
      return func(collection, predicate);
    }

    /**
     * Iterates over elements of `collection`, returning the first element
     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
     * invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias detect
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': true }
     * ];
     *
     * _.result(_.find(users, function(chr) {
     *   return chr.age < 40;
     * }), 'user');
     * // => 'barney'
     *
     * // using the `_.matches` callback shorthand
     * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
     * // => 'pebbles'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.result(_.find(users, 'active', false), 'user');
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.result(_.find(users, 'active'), 'user');
     * // => 'barney'
     */
    var find = createFind(baseEach);

    /**
     * This method is like `_.find` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(n) {
     *   return n % 2 == 1;
     * });
     * // => 3
     */
    var findLast = createFind(baseEachRight, true);

    /**
     * Performs a deep comparison between each element in `collection` and the
     * source object, returning the first element that has equivalent property
     * values.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Object} source The object of property values to match.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.result(_.findWhere(users, { 'age': 36, 'active': true }), 'user');
     * // => 'barney'
     *
     * _.result(_.findWhere(users, { 'age': 40, 'active': false }), 'user');
     * // => 'fred'
     */
    function findWhere(collection, source) {
      return find(collection, baseMatches(source));
    }

    /**
     * Iterates over elements of `collection` invoking `iteratee` for each element.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection). Iteratee functions may exit iteration early
     * by explicitly returning `false`.
     *
     * **Note:** As with other "Collections" methods, objects with a "length" property
     * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
     * may be used for object iteration.
     *
     * @static
     * @memberOf _
     * @alias each
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2]).forEach(function(n) {
     *   console.log(n);
     * }).value();
     * // => logs each value from left to right and returns the array
     *
     * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
     *   console.log(n, key);
     * });
     * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
     */
    var forEach = createForEach(arrayEach, baseEach);

    /**
     * This method is like `_.forEach` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias eachRight
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2]).forEachRight(function(n) {
     *   console.log(n);
     * }).value();
     * // => logs each value from right to left and returns the array
     */
    var forEachRight = createForEach(arrayEachRight, baseEachRight);

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is an array of the elements responsible for generating the key.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([4.2, 6.1, 6.4], function(n) {
     *   return Math.floor(n);
     * });
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * _.groupBy([4.2, 6.1, 6.4], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * // using the `_.property` callback shorthand
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        result[key].push(value);
      } else {
        result[key] = [value];
      }
    });

    /**
     * Checks if `value` is in `collection` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it is used as the offset
     * from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @alias contains, include
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {*} target The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
     * @returns {boolean} Returns `true` if a matching element is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
     * // => true
     *
     * _.includes('pebbles', 'eb');
     * // => true
     */
    function includes(collection, target, fromIndex, guard) {
      var length = collection ? getLength(collection) : 0;
      if (!isLength(length)) {
        collection = values(collection);
        length = collection.length;
      }
      if (typeof fromIndex != 'number' || (guard && isIterateeCall(target, fromIndex, guard))) {
        fromIndex = 0;
      } else {
        fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : (fromIndex || 0);
      }
      return (typeof collection == 'string' || !isArray(collection) && isString(collection))
        ? (fromIndex <= length && collection.indexOf(target, fromIndex) > -1)
        : (!!length && getIndexOf(collection, target, fromIndex) > -1);
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is the last element responsible for generating the key. The
     * iteratee function is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var keyData = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.indexBy(keyData, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keyData, function(object) {
     *   return String.fromCharCode(object.code);
     * });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keyData, function(object) {
     *   return this.fromCharCode(object.code);
     * }, String);
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     */
    var indexBy = createAggregator(function(result, value, key) {
      result[key] = value;
    });

    /**
     * Invokes the method at `path` of each element in `collection`, returning
     * an array of the results of each invoked method. Any additional arguments
     * are provided to each invoked method. If `methodName` is a function it is
     * invoked for, and `this` bound to, each element in `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|Function|string} path The path of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invoke([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    var invoke = restParam(function(collection, path, args) {
      var index = -1,
          isFunc = typeof path == 'function',
          isProp = isKey(path),
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value) {
        var func = isFunc ? path : ((isProp && value != null) ? value[path] : undefined);
        result[++index] = func ? func.apply(value, args) : invokePath(value, path, args);
      });
      return result;
    });

    /**
     * Creates an array of values by running each element in `collection` through
     * `iteratee`. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
     *
     * The guarded methods are:
     * `ary`, `callback`, `chunk`, `clone`, `create`, `curry`, `curryRight`,
     * `drop`, `dropRight`, `every`, `fill`, `flatten`, `invert`, `max`, `min`,
     * `parseInt`, `slice`, `sortBy`, `take`, `takeRight`, `template`, `trim`,
     * `trimLeft`, `trimRight`, `trunc`, `random`, `range`, `sample`, `some`,
     * `sum`, `uniq`, and `words`
     *
     * @static
     * @memberOf _
     * @alias collect
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new mapped array.
     * @example
     *
     * function timesThree(n) {
     *   return n * 3;
     * }
     *
     * _.map([1, 2], timesThree);
     * // => [3, 6]
     *
     * _.map({ 'a': 1, 'b': 2 }, timesThree);
     * // => [3, 6] (iteration order is not guaranteed)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // using the `_.property` callback shorthand
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */
    function map(collection, iteratee, thisArg) {
      var func = isArray(collection) ? arrayMap : baseMap;
      iteratee = getCallback(iteratee, thisArg, 3);
      return func(collection, iteratee);
    }

    /**
     * Creates an array of elements split into two groups, the first of which
     * contains elements `predicate` returns truthy for, while the second of which
     * contains elements `predicate` returns falsey for. The predicate is bound
     * to `thisArg` and invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the array of grouped elements.
     * @example
     *
     * _.partition([1, 2, 3], function(n) {
     *   return n % 2;
     * });
     * // => [[1, 3], [2]]
     *
     * _.partition([1.2, 2.3, 3.4], function(n) {
     *   return this.floor(n) % 2;
     * }, Math);
     * // => [[1.2, 3.4], [2.3]]
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * var mapper = function(array) {
     *   return _.pluck(array, 'user');
     * };
     *
     * // using the `_.matches` callback shorthand
     * _.map(_.partition(users, { 'age': 1, 'active': false }), mapper);
     * // => [['pebbles'], ['barney', 'fred']]
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.map(_.partition(users, 'active', false), mapper);
     * // => [['barney', 'pebbles'], ['fred']]
     *
     * // using the `_.property` callback shorthand
     * _.map(_.partition(users, 'active'), mapper);
     * // => [['fred'], ['barney', 'pebbles']]
     */
    var partition = createAggregator(function(result, value, key) {
      result[key ? 0 : 1].push(value);
    }, function() { return [[], []]; });

    /**
     * Gets the property value of `path` from all elements in `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|string} path The path of the property to pluck.
     * @returns {Array} Returns the property values.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.pluck(users, 'user');
     * // => ['barney', 'fred']
     *
     * var userIndex = _.indexBy(users, 'user');
     * _.pluck(userIndex, 'age');
     * // => [36, 40] (iteration order is not guaranteed)
     */
    function pluck(collection, path) {
      return map(collection, property(path));
    }

    /**
     * Reduces `collection` to a value which is the accumulated result of running
     * each element in `collection` through `iteratee`, where each successive
     * invocation is supplied the return value of the previous. If `accumulator`
     * is not provided the first element of `collection` is used as the initial
     * value. The `iteratee` is bound to `thisArg` and invoked with four arguments:
     * (accumulator, value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.reduce`, `_.reduceRight`, and `_.transform`.
     *
     * The guarded methods are:
     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `sortByAll`,
     * and `sortByOrder`
     *
     * @static
     * @memberOf _
     * @alias foldl, inject
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.reduce([1, 2], function(total, n) {
     *   return total + n;
     * });
     * // => 3
     *
     * _.reduce({ 'a': 1, 'b': 2 }, function(result, n, key) {
     *   result[key] = n * 3;
     *   return result;
     * }, {});
     * // => { 'a': 3, 'b': 6 } (iteration order is not guaranteed)
     */
    var reduce = createReduce(arrayReduce, baseEach);

    /**
     * This method is like `_.reduce` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias foldr
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var array = [[0, 1], [2, 3], [4, 5]];
     *
     * _.reduceRight(array, function(flattened, other) {
     *   return flattened.concat(other);
     * }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    var reduceRight = createReduce(arrayReduceRight, baseEachRight);

    /**
     * The opposite of `_.filter`; this method returns the elements of `collection`
     * that `predicate` does **not** return truthy for.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * _.reject([1, 2, 3, 4], function(n) {
     *   return n % 2 == 0;
     * });
     * // => [1, 3]
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.reject(users, { 'age': 40, 'active': true }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.reject(users, 'active', false), 'user');
     * // => ['fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.reject(users, 'active'), 'user');
     * // => ['barney']
     */
    function reject(collection, predicate, thisArg) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      predicate = getCallback(predicate, thisArg, 3);
      return func(collection, function(value, index, collection) {
        return !predicate(value, index, collection);
      });
    }

    /**
     * Gets a random element or `n` random elements from a collection.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to sample.
     * @param {number} [n] The number of elements to sample.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {*} Returns the random sample(s).
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     *
     * _.sample([1, 2, 3, 4], 2);
     * // => [3, 1]
     */
    function sample(collection, n, guard) {
      if (guard ? isIterateeCall(collection, n, guard) : n == null) {
        collection = toIterable(collection);
        var length = collection.length;
        return length > 0 ? collection[baseRandom(0, length - 1)] : undefined;
      }
      var index = -1,
          result = toArray(collection),
          length = result.length,
          lastIndex = length - 1;

      n = nativeMin(n < 0 ? 0 : (+n || 0), length);
      while (++index < n) {
        var rand = baseRandom(index, lastIndex),
            value = result[rand];

        result[rand] = result[index];
        result[index] = value;
      }
      result.length = n;
      return result;
    }

    /**
     * Creates an array of shuffled values, using a version of the
     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */
    function shuffle(collection) {
      return sample(collection, POSITIVE_INFINITY);
    }

    /**
     * Gets the size of `collection` by returning its length for array-like
     * values or the number of own enumerable properties for objects.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns the size of `collection`.
     * @example
     *
     * _.size([1, 2, 3]);
     * // => 3
     *
     * _.size({ 'a': 1, 'b': 2 });
     * // => 2
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      var length = collection ? getLength(collection) : 0;
      return isLength(length) ? length : keys(collection).length;
    }

    /**
     * Checks if `predicate` returns truthy for **any** element of `collection`.
     * The function returns as soon as it finds a passing value and does not iterate
     * over the entire collection. The predicate is bound to `thisArg` and invoked
     * with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias any
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var users = [
     *   { 'user': 'barney', 'active': true },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.some(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.some(users, 'active', false);
     * // => true
     *
     * // using the `_.property` callback shorthand
     * _.some(users, 'active');
     * // => true
     */
    function some(collection, predicate, thisArg) {
      var func = isArray(collection) ? arraySome : baseSome;
      if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
        predicate = undefined;
      }
      if (typeof predicate != 'function' || thisArg !== undefined) {
        predicate = getCallback(predicate, thisArg, 3);
      }
      return func(collection, predicate);
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection through `iteratee`. This method performs
     * a stable sort, that is, it preserves the original sort order of equal elements.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * _.sortBy([1, 2, 3], function(n) {
     *   return Math.sin(n);
     * });
     * // => [3, 1, 2]
     *
     * _.sortBy([1, 2, 3], function(n) {
     *   return this.sin(n);
     * }, Math);
     * // => [3, 1, 2]
     *
     * var users = [
     *   { 'user': 'fred' },
     *   { 'user': 'pebbles' },
     *   { 'user': 'barney' }
     * ];
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.sortBy(users, 'user'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */
    function sortBy(collection, iteratee, thisArg) {
      if (collection == null) {
        return [];
      }
      if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
        iteratee = undefined;
      }
      var index = -1;
      iteratee = getCallback(iteratee, thisArg, 3);

      var result = baseMap(collection, function(value, key, collection) {
        return { 'criteria': iteratee(value, key, collection), 'index': ++index, 'value': value };
      });
      return baseSortBy(result, compareAscending);
    }

    /**
     * This method is like `_.sortBy` except that it can sort by multiple iteratees
     * or property names.
     *
     * If a property name is provided for an iteratee the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If an object is provided for an iteratee the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(Function|Function[]|Object|Object[]|string|string[])} iteratees
     *  The iteratees to sort by, specified as individual values or arrays of values.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 42 },
     *   { 'user': 'barney', 'age': 34 }
     * ];
     *
     * _.map(_.sortByAll(users, ['user', 'age']), _.values);
     * // => [['barney', 34], ['barney', 36], ['fred', 42], ['fred', 48]]
     *
     * _.map(_.sortByAll(users, 'user', function(chr) {
     *   return Math.floor(chr.age / 10);
     * }), _.values);
     * // => [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     */
    var sortByAll = restParam(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var guard = iteratees[2];
      if (guard && isIterateeCall(iteratees[0], iteratees[1], guard)) {
        iteratees.length = 1;
      }
      return baseSortByOrder(collection, baseFlatten(iteratees), []);
    });

    /**
     * This method is like `_.sortByAll` except that it allows specifying the
     * sort orders of the iteratees to sort by. If `orders` is unspecified, all
     * values are sorted in ascending order. Otherwise, a value is sorted in
     * ascending order if its corresponding order is "asc", and descending if "desc".
     *
     * If a property name is provided for an iteratee the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If an object is provided for an iteratee the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {boolean[]} [orders] The sort orders of `iteratees`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 34 },
     *   { 'user': 'fred',   'age': 42 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * // sort by `user` in ascending order and by `age` in descending order
     * _.map(_.sortByOrder(users, ['user', 'age'], ['asc', 'desc']), _.values);
     * // => [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     */
    function sortByOrder(collection, iteratees, orders, guard) {
      if (collection == null) {
        return [];
      }
      if (guard && isIterateeCall(iteratees, orders, guard)) {
        orders = undefined;
      }
      if (!isArray(iteratees)) {
        iteratees = iteratees == null ? [] : [iteratees];
      }
      if (!isArray(orders)) {
        orders = orders == null ? [] : [orders];
      }
      return baseSortByOrder(collection, iteratees, orders);
    }

    /**
     * Performs a deep comparison between each element in `collection` and the
     * source object, returning an array of all elements that have equivalent
     * property values.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Object} source The object of property values to match.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false, 'pets': ['hoppy'] },
     *   { 'user': 'fred',   'age': 40, 'active': true, 'pets': ['baby puss', 'dino'] }
     * ];
     *
     * _.pluck(_.where(users, { 'age': 36, 'active': false }), 'user');
     * // => ['barney']
     *
     * _.pluck(_.where(users, { 'pets': ['dino'] }), 'user');
     * // => ['fred']
     */
    function where(collection, source) {
      return filter(collection, baseMatches(source));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Gets the number of milliseconds that have elapsed since the Unix epoch
     * (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @category Date
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => logs the number of milliseconds it took for the deferred function to be invoked
     */
    var now = nativeNow || function() {
      return new Date().getTime();
    };

    /*------------------------------------------------------------------------*/

    /**
     * The opposite of `_.before`; this method creates a function that invokes
     * `func` once it is called `n` or more times.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n The number of calls before `func` is invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => logs 'done saving!' after the two async saves have completed
     */
    function after(n, func) {
      if (typeof func != 'function') {
        if (typeof n == 'function') {
          var temp = n;
          n = func;
          func = temp;
        } else {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
      }
      n = nativeIsFinite(n = +n) ? n : 0;
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that accepts up to `n` arguments ignoring any
     * additional arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @param {number} [n=func.length] The arity cap.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new function.
     * @example
     *
     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
     * // => [6, 8, 10]
     */
    function ary(func, n, guard) {
      if (guard && isIterateeCall(func, n, guard)) {
        n = undefined;
      }
      n = (func && n == null) ? func.length : nativeMax(+n || 0, 0);
      return createWrapper(func, ARY_FLAG, undefined, undefined, undefined, undefined, n);
    }

    /**
     * Creates a function that invokes `func`, with the `this` binding and arguments
     * of the created function, while it is called less than `n` times. Subsequent
     * calls to the created function return the result of the last `func` invocation.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n The number of calls at which `func` is no longer invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * jQuery('#add').on('click', _.before(5, addContactToList));
     * // => allows adding up to 4 contacts to the list
     */
    function before(n, func) {
      var result;
      if (typeof func != 'function') {
        if (typeof n == 'function') {
          var temp = n;
          n = func;
          func = temp;
        } else {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
      }
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = undefined;
        }
        return result;
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and prepends any additional `_.bind` arguments to those provided to the
     * bound function.
     *
     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for partially applied arguments.
     *
     * **Note:** Unlike native `Function#bind` this method does not set the "length"
     * property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var greet = function(greeting, punctuation) {
     *   return greeting + ' ' + this.user + punctuation;
     * };
     *
     * var object = { 'user': 'fred' };
     *
     * var bound = _.bind(greet, object, 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * // using placeholders
     * var bound = _.bind(greet, object, _, '!');
     * bound('hi');
     * // => 'hi fred!'
     */
    var bind = restParam(function(func, thisArg, partials) {
      var bitmask = BIND_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, bind.placeholder);
        bitmask |= PARTIAL_FLAG;
      }
      return createWrapper(func, bitmask, thisArg, partials, holders);
    });

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method. Method names may be specified as individual arguments or as arrays
     * of method names. If no method names are provided all enumerable function
     * properties, own and inherited, of `object` are bound.
     *
     * **Note:** This method does not set the "length" property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...(string|string[])} [methodNames] The object method names to bind,
     *  specified as individual method names or arrays of method names.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'onClick': function() {
     *     console.log('clicked ' + this.label);
     *   }
     * };
     *
     * _.bindAll(view);
     * jQuery('#docs').on('click', view.onClick);
     * // => logs 'clicked docs' when the element is clicked
     */
    var bindAll = restParam(function(object, methodNames) {
      methodNames = methodNames.length ? baseFlatten(methodNames) : functions(object);

      var index = -1,
          length = methodNames.length;

      while (++index < length) {
        var key = methodNames[index];
        object[key] = createWrapper(object[key], BIND_FLAG, object);
      }
      return object;
    });

    /**
     * Creates a function that invokes the method at `object[key]` and prepends
     * any additional `_.bindKey` arguments to those provided to the bound function.
     *
     * This method differs from `_.bind` by allowing bound functions to reference
     * methods that may be redefined or don't yet exist.
     * See [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
     * for more details.
     *
     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Object} object The object the method belongs to.
     * @param {string} key The key of the method.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'user': 'fred',
     *   'greet': function(greeting, punctuation) {
     *     return greeting + ' ' + this.user + punctuation;
     *   }
     * };
     *
     * var bound = _.bindKey(object, 'greet', 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * object.greet = function(greeting, punctuation) {
     *   return greeting + 'ya ' + this.user + punctuation;
     * };
     *
     * bound('!');
     * // => 'hiya fred!'
     *
     * // using placeholders
     * var bound = _.bindKey(object, 'greet', _, '!');
     * bound('hi');
     * // => 'hiya fred!'
     */
    var bindKey = restParam(function(object, key, partials) {
      var bitmask = BIND_FLAG | BIND_KEY_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, bindKey.placeholder);
        bitmask |= PARTIAL_FLAG;
      }
      return createWrapper(key, bitmask, object, partials, holders);
    });

    /**
     * Creates a function that accepts one or more arguments of `func` that when
     * called either invokes `func` returning its result, if all `func` arguments
     * have been provided, or returns a function that accepts one or more of the
     * remaining `func` arguments, and so on. The arity of `func` may be specified
     * if `func.length` is not sufficient.
     *
     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for provided arguments.
     *
     * **Note:** This method does not set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curry(abc);
     *
     * curried(1)(2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // using placeholders
     * curried(1)(_, 3)(2);
     * // => [1, 2, 3]
     */
    var curry = createCurry(CURRY_FLAG);

    /**
     * This method is like `_.curry` except that arguments are applied to `func`
     * in the manner of `_.partialRight` instead of `_.partial`.
     *
     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for provided arguments.
     *
     * **Note:** This method does not set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curryRight(abc);
     *
     * curried(3)(2)(1);
     * // => [1, 2, 3]
     *
     * curried(2, 3)(1);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // using placeholders
     * curried(3)(1, _)(2);
     * // => [1, 2, 3]
     */
    var curryRight = createCurry(CURRY_RIGHT_FLAG);

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed invocations. Provide an options object to indicate that `func`
     * should be invoked on the leading and/or trailing edge of the `wait` timeout.
     * Subsequent calls to the debounced function return the result of the last
     * `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the the debounced function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=false] Specify invoking on the leading
     *  edge of the timeout.
     * @param {number} [options.maxWait] The maximum time `func` is allowed to be
     *  delayed before it is invoked.
     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
     *  edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // avoid costly calculations while the window size is in flux
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
     * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // ensure `batchLog` is invoked once after 1 second of debounced calls
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', _.debounce(batchLog, 250, {
     *   'maxWait': 1000
     * }));
     *
     * // cancel a debounced call
     * var todoChanges = _.debounce(batchLog, 1000);
     * Object.observe(models.todo, todoChanges);
     *
     * Object.observe(models, function(changes) {
     *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
     *     todoChanges.cancel();
     *   }
     * }, ['delete']);
     *
     * // ...at some point `models.todo` is changed
     * models.todo.completed = true;
     *
     * // ...before 1 second has passed `models.todo` is deleted
     * // which cancels the debounced `todoChanges` call
     * delete models.todo;
     */
    function debounce(func, wait, options) {
      var args,
          maxTimeoutId,
          result,
          stamp,
          thisArg,
          timeoutId,
          trailingCall,
          lastCalled = 0,
          maxWait = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = wait < 0 ? 0 : (+wait || 0);
      if (options === true) {
        var leading = true;
        trailing = false;
      } else if (isObject(options)) {
        leading = !!options.leading;
        maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function cancel() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (maxTimeoutId) {
          clearTimeout(maxTimeoutId);
        }
        lastCalled = 0;
        maxTimeoutId = timeoutId = trailingCall = undefined;
      }

      function complete(isCalled, id) {
        if (id) {
          clearTimeout(id);
        }
        maxTimeoutId = timeoutId = trailingCall = undefined;
        if (isCalled) {
          lastCalled = now();
          result = func.apply(thisArg, args);
          if (!timeoutId && !maxTimeoutId) {
            args = thisArg = undefined;
          }
        }
      }

      function delayed() {
        var remaining = wait - (now() - stamp);
        if (remaining <= 0 || remaining > wait) {
          complete(trailingCall, maxTimeoutId);
        } else {
          timeoutId = setTimeout(delayed, remaining);
        }
      }

      function maxDelayed() {
        complete(trailing, timeoutId);
      }

      function debounced() {
        args = arguments;
        stamp = now();
        thisArg = this;
        trailingCall = trailing && (timeoutId || !leading);

        if (maxWait === false) {
          var leadingCall = leading && !timeoutId;
        } else {
          if (!maxTimeoutId && !leading) {
            lastCalled = stamp;
          }
          var remaining = maxWait - (stamp - lastCalled),
              isCalled = remaining <= 0 || remaining > maxWait;

          if (isCalled) {
            if (maxTimeoutId) {
              maxTimeoutId = clearTimeout(maxTimeoutId);
            }
            lastCalled = stamp;
            result = func.apply(thisArg, args);
          }
          else if (!maxTimeoutId) {
            maxTimeoutId = setTimeout(maxDelayed, remaining);
          }
        }
        if (isCalled && timeoutId) {
          timeoutId = clearTimeout(timeoutId);
        }
        else if (!timeoutId && wait !== maxWait) {
          timeoutId = setTimeout(delayed, wait);
        }
        if (leadingCall) {
          isCalled = true;
          result = func.apply(thisArg, args);
        }
        if (isCalled && !timeoutId && !maxTimeoutId) {
          args = thisArg = undefined;
        }
        return result;
      }
      debounced.cancel = cancel;
      return debounced;
    }

    /**
     * Defers invoking the `func` until the current call stack has cleared. Any
     * additional arguments are provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to defer.
     * @param {...*} [args] The arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) {
     *   console.log(text);
     * }, 'deferred');
     * // logs 'deferred' after one or more milliseconds
     */
    var defer = restParam(function(func, args) {
      return baseDelay(func, 1, args);
    });

    /**
     * Invokes `func` after `wait` milliseconds. Any additional arguments are
     * provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {...*} [args] The arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) {
     *   console.log(text);
     * }, 1000, 'later');
     * // => logs 'later' after one second
     */
    var delay = restParam(function(func, wait, args) {
      return baseDelay(func, wait, args);
    });

    /**
     * Creates a function that returns the result of invoking the provided
     * functions with the `this` binding of the created function, where each
     * successive invocation is supplied the return value of the previous.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {...Function} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flow(_.add, square);
     * addSquare(1, 2);
     * // => 9
     */
    var flow = createFlow();

    /**
     * This method is like `_.flow` except that it creates a function that
     * invokes the provided functions from right to left.
     *
     * @static
     * @memberOf _
     * @alias backflow, compose
     * @category Function
     * @param {...Function} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flowRight(square, _.add);
     * addSquare(1, 2);
     * // => 9
     */
    var flowRight = createFlow(true);

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is coerced to a string and used as the
     * cache key. The `func` is invoked with the `this` binding of the memoized
     * function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoizing function.
     * @example
     *
     * var upperCase = _.memoize(function(string) {
     *   return string.toUpperCase();
     * });
     *
     * upperCase('fred');
     * // => 'FRED'
     *
     * // modifying the result cache
     * upperCase.cache.set('fred', 'BARNEY');
     * upperCase('fred');
     * // => 'BARNEY'
     *
     * // replacing `_.memoize.Cache`
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'barney' };
     * var identity = _.memoize(_.identity);
     *
     * identity(object);
     * // => { 'user': 'fred' }
     * identity(other);
     * // => { 'user': 'fred' }
     *
     * _.memoize.Cache = WeakMap;
     * var identity = _.memoize(_.identity);
     *
     * identity(object);
     * // => { 'user': 'fred' }
     * identity(other);
     * // => { 'user': 'barney' }
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result);
        return result;
      };
      memoized.cache = new memoize.Cache;
      return memoized;
    }

    /**
     * Creates a function that runs each argument through a corresponding
     * transform function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to wrap.
     * @param {...(Function|Function[])} [transforms] The functions to transform
     * arguments, specified as individual functions or arrays of functions.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function doubled(n) {
     *   return n * 2;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var modded = _.modArgs(function(x, y) {
     *   return [x, y];
     * }, square, doubled);
     *
     * modded(1, 2);
     * // => [1, 4]
     *
     * modded(5, 10);
     * // => [25, 20]
     */
    var modArgs = restParam(function(func, transforms) {
      transforms = baseFlatten(transforms);
      if (typeof func != 'function' || !arrayEvery(transforms, baseIsFunction)) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = transforms.length;
      return restParam(function(args) {
        var index = nativeMin(args.length, length);
        while (index--) {
          args[index] = transforms[index](args[index]);
        }
        return func.apply(this, args);
      });
    });

    /**
     * Creates a function that negates the result of the predicate `func`. The
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
     * // => [1, 3, 5]
     */
    function negate(predicate) {
      if (typeof predicate != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function() {
        return !predicate.apply(this, arguments);
      };
    }

    /**
     * Creates a function that is restricted to invoking `func` once. Repeat calls
     * to the function return the value of the first call. The `func` is invoked
     * with the `this` binding and arguments of the created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // `initialize` invokes `createApplication` once
     */
    function once(func) {
      return before(2, func);
    }

    /**
     * Creates a function that invokes `func` with `partial` arguments prepended
     * to those provided to the new function. This method is like `_.bind` except
     * it does **not** alter the `this` binding.
     *
     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method does not set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var sayHelloTo = _.partial(greet, 'hello');
     * sayHelloTo('fred');
     * // => 'hello fred'
     *
     * // using placeholders
     * var greetFred = _.partial(greet, _, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     */
    var partial = createPartial(PARTIAL_FLAG);

    /**
     * This method is like `_.partial` except that partially applied arguments
     * are appended to those provided to the new function.
     *
     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method does not set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var greetFred = _.partialRight(greet, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     *
     * // using placeholders
     * var sayHelloTo = _.partialRight(greet, 'hello', _);
     * sayHelloTo('fred');
     * // => 'hello fred'
     */
    var partialRight = createPartial(PARTIAL_RIGHT_FLAG);

    /**
     * Creates a function that invokes `func` with arguments arranged according
     * to the specified indexes where the argument value at the first index is
     * provided as the first argument, the argument value at the second index is
     * provided as the second argument, and so on.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to rearrange arguments for.
     * @param {...(number|number[])} indexes The arranged argument indexes,
     *  specified as individual indexes or arrays of indexes.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var rearged = _.rearg(function(a, b, c) {
     *   return [a, b, c];
     * }, 2, 0, 1);
     *
     * rearged('b', 'c', 'a')
     * // => ['a', 'b', 'c']
     *
     * var map = _.rearg(_.map, [1, 0]);
     * map(function(n) {
     *   return n * 3;
     * }, [1, 2, 3]);
     * // => [3, 6, 9]
     */
    var rearg = restParam(function(func, indexes) {
      return createWrapper(func, REARG_FLAG, undefined, undefined, undefined, baseFlatten(indexes));
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * created function and arguments from `start` and beyond provided as an array.
     *
     * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.restParam(function(what, names) {
     *   return what + ' ' + _.initial(names).join(', ') +
     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
     * });
     *
     * say('hello', 'fred', 'barney', 'pebbles');
     * // => 'hello fred, barney, & pebbles'
     */
    function restParam(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
      return function() {
        var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            rest = Array(length);

        while (++index < length) {
          rest[index] = args[start + index];
        }
        switch (start) {
          case 0: return func.call(this, rest);
          case 1: return func.call(this, args[0], rest);
          case 2: return func.call(this, args[0], args[1], rest);
        }
        var otherArgs = Array(start + 1);
        index = -1;
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = rest;
        return func.apply(this, otherArgs);
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of the created
     * function and an array of arguments much like [`Function#apply`](https://es5.github.io/#x15.3.4.3).
     *
     * **Note:** This method is based on the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator).
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to spread arguments over.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.spread(function(who, what) {
     *   return who + ' says ' + what;
     * });
     *
     * say(['fred', 'hello']);
     * // => 'fred says hello'
     *
     * // with a Promise
     * var numbers = Promise.all([
     *   Promise.resolve(40),
     *   Promise.resolve(36)
     * ]);
     *
     * numbers.then(_.spread(function(x, y) {
     *   return x + y;
     * }));
     * // => a Promise of 76
     */
    function spread(func) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function(array) {
        return func.apply(this, array);
      };
    }

    /**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed invocations. Provide an options object to indicate
     * that `func` should be invoked on the leading and/or trailing edge of the
     * `wait` timeout. Subsequent calls to the throttled function return the
     * result of the last `func` call.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the the throttled function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=true] Specify invoking on the leading
     *  edge of the timeout.
     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
     *  edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // avoid excessively updating the position while scrolling
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // invoke `renewToken` when the click event is fired, but not more than once every 5 minutes
     * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
     *   'trailing': false
     * }));
     *
     * // cancel a trailing throttled call
     * jQuery(window).on('popstate', throttled.cancel);
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (options === false) {
        leading = false;
      } else if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return debounce(func, wait, { 'leading': leading, 'maxWait': +wait, 'trailing': trailing });
    }

    /**
     * Creates a function that provides `value` to the wrapper function as its
     * first argument. Any additional arguments provided to the function are
     * appended to those provided to the wrapper function. The wrapper is invoked
     * with the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {*} value The value to wrap.
     * @param {Function} wrapper The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */
    function wrap(value, wrapper) {
      wrapper = wrapper == null ? identity : wrapper;
      return createWrapper(wrapper, PARTIAL_FLAG, undefined, [value], []);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a clone of `value`. If `isDeep` is `true` nested objects are cloned,
     * otherwise they are assigned by reference. If `customizer` is provided it is
     * invoked to produce the cloned values. If `customizer` returns `undefined`
     * cloning is handled by the method instead. The `customizer` is bound to
     * `thisArg` and invoked with two argument; (value [, index|key, object]).
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
     * The enumerable properties of `arguments` objects and objects created by
     * constructors other than `Object` are cloned to plain `Object` objects. An
     * empty object is returned for uncloneable values such as functions, DOM nodes,
     * Maps, Sets, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {*} Returns the cloned value.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * var shallow = _.clone(users);
     * shallow[0] === users[0];
     * // => true
     *
     * var deep = _.clone(users, true);
     * deep[0] === users[0];
     * // => false
     *
     * // using a customizer callback
     * var el = _.clone(document.body, function(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(false);
     *   }
     * });
     *
     * el === document.body
     * // => false
     * el.nodeName
     * // => BODY
     * el.childNodes.length;
     * // => 0
     */
    function clone(value, isDeep, customizer, thisArg) {
      if (isDeep && typeof isDeep != 'boolean' && isIterateeCall(value, isDeep, customizer)) {
        isDeep = false;
      }
      else if (typeof isDeep == 'function') {
        thisArg = customizer;
        customizer = isDeep;
        isDeep = false;
      }
      return typeof customizer == 'function'
        ? baseClone(value, isDeep, bindCallback(customizer, thisArg, 1))
        : baseClone(value, isDeep);
    }

    /**
     * Creates a deep clone of `value`. If `customizer` is provided it is invoked
     * to produce the cloned values. If `customizer` returns `undefined` cloning
     * is handled by the method instead. The `customizer` is bound to `thisArg`
     * and invoked with two argument; (value [, index|key, object]).
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
     * The enumerable properties of `arguments` objects and objects created by
     * constructors other than `Object` are cloned to plain `Object` objects. An
     * empty object is returned for uncloneable values such as functions, DOM nodes,
     * Maps, Sets, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {*} Returns the deep cloned value.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * var deep = _.cloneDeep(users);
     * deep[0] === users[0];
     * // => false
     *
     * // using a customizer callback
     * var el = _.cloneDeep(document.body, function(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(true);
     *   }
     * });
     *
     * el === document.body
     * // => false
     * el.nodeName
     * // => BODY
     * el.childNodes.length;
     * // => 20
     */
    function cloneDeep(value, customizer, thisArg) {
      return typeof customizer == 'function'
        ? baseClone(value, true, bindCallback(customizer, thisArg, 1))
        : baseClone(value, true);
    }

    /**
     * Checks if `value` is greater than `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`, else `false`.
     * @example
     *
     * _.gt(3, 1);
     * // => true
     *
     * _.gt(3, 3);
     * // => false
     *
     * _.gt(1, 3);
     * // => false
     */
    function gt(value, other) {
      return value > other;
    }

    /**
     * Checks if `value` is greater than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than or equal to `other`, else `false`.
     * @example
     *
     * _.gte(3, 1);
     * // => true
     *
     * _.gte(3, 3);
     * // => true
     *
     * _.gte(1, 3);
     * // => false
     */
    function gte(value, other) {
      return value >= other;
    }

    /**
     * Checks if `value` is classified as an `arguments` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments(value) {
      return isObjectLike(value) && isArrayLike(value) &&
        hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
    }

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(function() { return arguments; }());
     * // => false
     */
    var isArray = nativeIsArray || function(value) {
      return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
    };

    /**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isBoolean(false);
     * // => true
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false || (isObjectLike(value) && objToString.call(value) == boolTag);
    }

    /**
     * Checks if `value` is classified as a `Date` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     *
     * _.isDate('Mon April 23 2012');
     * // => false
     */
    function isDate(value) {
      return isObjectLike(value) && objToString.call(value) == dateTag;
    }

    /**
     * Checks if `value` is a DOM element.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */
    function isElement(value) {
      return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
    }

    /**
     * Checks if `value` is empty. A value is considered empty unless it is an
     * `arguments` object, array, string, or jQuery-like collection with a length
     * greater than `0` or an object with own enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Array|Object|string} value The value to inspect.
     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty(null);
     * // => true
     *
     * _.isEmpty(true);
     * // => true
     *
     * _.isEmpty(1);
     * // => true
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({ 'a': 1 });
     * // => false
     */
    function isEmpty(value) {
      if (value == null) {
        return true;
      }
      if (isArrayLike(value) && (isArray(value) || isString(value) || isArguments(value) ||
          (isObjectLike(value) && isFunction(value.splice)))) {
        return !value.length;
      }
      return !keys(value).length;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent. If `customizer` is provided it is invoked to compare values.
     * If `customizer` returns `undefined` comparisons are handled by the method
     * instead. The `customizer` is bound to `thisArg` and invoked with three
     * arguments: (value, other [, index|key]).
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. Functions and DOM nodes
     * are **not** supported. Provide a customizer function to extend support
     * for comparing other values.
     *
     * @static
     * @memberOf _
     * @alias eq
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize value comparisons.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'fred' };
     *
     * object == other;
     * // => false
     *
     * _.isEqual(object, other);
     * // => true
     *
     * // using a customizer callback
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isEqual(array, other, function(value, other) {
     *   if (_.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/)) {
     *     return true;
     *   }
     * });
     * // => true
     */
    function isEqual(value, other, customizer, thisArg) {
      customizer = typeof customizer == 'function' ? bindCallback(customizer, thisArg, 3) : undefined;
      var result = customizer ? customizer(value, other) : undefined;
      return  result === undefined ? baseIsEqual(value, other, customizer) : !!result;
    }

    /**
     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
     * `SyntaxError`, `TypeError`, or `URIError` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
     * @example
     *
     * _.isError(new Error);
     * // => true
     *
     * _.isError(Error);
     * // => false
     */
    function isError(value) {
      return isObjectLike(value) && typeof value.message == 'string' && objToString.call(value) == errorTag;
    }

    /**
     * Checks if `value` is a finite primitive number.
     *
     * **Note:** This method is based on [`Number.isFinite`](http://ecma-international.org/ecma-262/6.0/#sec-number.isfinite).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
     * @example
     *
     * _.isFinite(10);
     * // => true
     *
     * _.isFinite('10');
     * // => false
     *
     * _.isFinite(true);
     * // => false
     *
     * _.isFinite(Object(10));
     * // => false
     *
     * _.isFinite(Infinity);
     * // => false
     */
    function isFinite(value) {
      return typeof value == 'number' && nativeIsFinite(value);
    }

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in older versions of Chrome and Safari which return 'function' for regexes
      // and Safari 8 equivalents which return 'object' for typed array constructors.
      return isObject(value) && objToString.call(value) == funcTag;
    }

    /**
     * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(1);
     * // => false
     */
    function isObject(value) {
      // Avoid a V8 JIT bug in Chrome 19-20.
      // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
      var type = typeof value;
      return !!value && (type == 'object' || type == 'function');
    }

    /**
     * Performs a deep comparison between `object` and `source` to determine if
     * `object` contains equivalent property values. If `customizer` is provided
     * it is invoked to compare values. If `customizer` returns `undefined`
     * comparisons are handled by the method instead. The `customizer` is bound
     * to `thisArg` and invoked with three arguments: (value, other, index|key).
     *
     * **Note:** This method supports comparing properties of arrays, booleans,
     * `Date` objects, numbers, `Object` objects, regexes, and strings. Functions
     * and DOM nodes are **not** supported. Provide a customizer function to extend
     * support for comparing other values.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Function} [customizer] The function to customize value comparisons.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.isMatch(object, { 'age': 40 });
     * // => true
     *
     * _.isMatch(object, { 'age': 36 });
     * // => false
     *
     * // using a customizer callback
     * var object = { 'greeting': 'hello' };
     * var source = { 'greeting': 'hi' };
     *
     * _.isMatch(object, source, function(value, other) {
     *   return _.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/) || undefined;
     * });
     * // => true
     */
    function isMatch(object, source, customizer, thisArg) {
      customizer = typeof customizer == 'function' ? bindCallback(customizer, thisArg, 3) : undefined;
      return baseIsMatch(object, getMatchData(source), customizer);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * **Note:** This method is not the same as [`isNaN`](https://es5.github.io/#x15.1.2.4)
     * which returns `true` for `undefined` and other non-numeric values.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // An `NaN` primitive is the only value that is not equal to itself.
      // Perform the `toStringTag` check first to avoid errors with some host objects in IE.
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is a native function.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
     * @example
     *
     * _.isNative(Array.prototype.push);
     * // => true
     *
     * _.isNative(_);
     * // => false
     */
    function isNative(value) {
      if (value == null) {
        return false;
      }
      if (isFunction(value)) {
        return reIsNative.test(fnToString.call(value));
      }
      return isObjectLike(value) && reIsHostCtor.test(value);
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(void 0);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is classified as a `Number` primitive or object.
     *
     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
     * as numbers, use the `_.isFinite` method.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isNumber(8.4);
     * // => true
     *
     * _.isNumber(NaN);
     * // => true
     *
     * _.isNumber('8.4');
     * // => false
     */
    function isNumber(value) {
      return typeof value == 'number' || (isObjectLike(value) && objToString.call(value) == numberTag);
    }

    /**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * **Note:** This method assumes objects created by the `Object` constructor
     * have no inherited enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */
    function isPlainObject(value) {
      var Ctor;

      // Exit early for non `Object` objects.
      if (!(isObjectLike(value) && objToString.call(value) == objectTag && !isArguments(value)) ||
          (!hasOwnProperty.call(value, 'constructor') && (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
        return false;
      }
      // IE < 9 iterates inherited properties before own properties. If the first
      // iterated property is an object's own property then there are no inherited
      // enumerable properties.
      var result;
      // In most environments an object's own properties are iterated before
      // its inherited properties. If the last iterated property is an object's
      // own property then there are no inherited enumerable properties.
      baseForIn(value, function(subValue, key) {
        result = key;
      });
      return result === undefined || hasOwnProperty.call(value, result);
    }

    /**
     * Checks if `value` is classified as a `RegExp` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isRegExp(/abc/);
     * // => true
     *
     * _.isRegExp('/abc/');
     * // => false
     */
    function isRegExp(value) {
      return isObject(value) && objToString.call(value) == regexpTag;
    }

    /**
     * Checks if `value` is classified as a `String` primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */
    function isString(value) {
      return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
    }

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    function isTypedArray(value) {
      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
    }

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */
    function isUndefined(value) {
      return value === undefined;
    }

    /**
     * Checks if `value` is less than `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`, else `false`.
     * @example
     *
     * _.lt(1, 3);
     * // => true
     *
     * _.lt(3, 3);
     * // => false
     *
     * _.lt(3, 1);
     * // => false
     */
    function lt(value, other) {
      return value < other;
    }

    /**
     * Checks if `value` is less than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than or equal to `other`, else `false`.
     * @example
     *
     * _.lte(1, 3);
     * // => true
     *
     * _.lte(3, 3);
     * // => true
     *
     * _.lte(3, 1);
     * // => false
     */
    function lte(value, other) {
      return value <= other;
    }

    /**
     * Converts `value` to an array.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Array} Returns the converted array.
     * @example
     *
     * (function() {
     *   return _.toArray(arguments).slice(1);
     * }(1, 2, 3));
     * // => [2, 3]
     */
    function toArray(value) {
      var length = value ? getLength(value) : 0;
      if (!isLength(length)) {
        return values(value);
      }
      if (!length) {
        return [];
      }
      return arrayCopy(value);
    }

    /**
     * Converts `value` to a plain object flattening inherited enumerable
     * properties of `value` to own properties of the plain object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Object} Returns the converted plain object.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new Foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */
    function toPlainObject(value) {
      return baseCopy(value, keysIn(value));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Recursively merges own enumerable properties of the source object(s), that
     * don't resolve to `undefined` into the destination object. Subsequent sources
     * overwrite property assignments of previous sources. If `customizer` is
     * provided it is invoked to produce the merged values of the destination and
     * source properties. If `customizer` returns `undefined` merging is handled
     * by the method instead. The `customizer` is bound to `thisArg` and invoked
     * with five arguments: (objectValue, sourceValue, key, object, source).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var users = {
     *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
     * };
     *
     * var ages = {
     *   'data': [{ 'age': 36 }, { 'age': 40 }]
     * };
     *
     * _.merge(users, ages);
     * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
     *
     * // using a customizer callback
     * var object = {
     *   'fruits': ['apple'],
     *   'vegetables': ['beet']
     * };
     *
     * var other = {
     *   'fruits': ['banana'],
     *   'vegetables': ['carrot']
     * };
     *
     * _.merge(object, other, function(a, b) {
     *   if (_.isArray(a)) {
     *     return a.concat(b);
     *   }
     * });
     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
     */
    var merge = createAssigner(baseMerge);

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object. Subsequent sources overwrite property assignments of previous sources.
     * If `customizer` is provided it is invoked to produce the assigned values.
     * The `customizer` is bound to `thisArg` and invoked with five arguments:
     * (objectValue, sourceValue, key, object, source).
     *
     * **Note:** This method mutates `object` and is based on
     * [`Object.assign`](http://ecma-international.org/ecma-262/6.0/#sec-object.assign).
     *
     * @static
     * @memberOf _
     * @alias extend
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
     * // => { 'user': 'fred', 'age': 40 }
     *
     * // using a customizer callback
     * var defaults = _.partialRight(_.assign, function(value, other) {
     *   return _.isUndefined(value) ? other : value;
     * });
     *
     * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
     * // => { 'user': 'barney', 'age': 36 }
     */
    var assign = createAssigner(function(object, source, customizer) {
      return customizer
        ? assignWith(object, source, customizer)
        : baseAssign(object, source);
    });

    /**
     * Creates an object that inherits from the given `prototype` object. If a
     * `properties` object is provided its own enumerable properties are assigned
     * to the created object.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, {
     *   'constructor': Circle
     * });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties, guard) {
      var result = baseCreate(prototype);
      if (guard && isIterateeCall(prototype, properties, guard)) {
        properties = undefined;
      }
      return properties ? baseAssign(result, properties) : result;
    }

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object for all destination properties that resolve to `undefined`. Once a
     * property is set, additional values of the same property are ignored.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
     * // => { 'user': 'barney', 'age': 36 }
     */
    var defaults = createDefaults(assign, assignDefaults);

    /**
     * This method is like `_.defaults` except that it recursively assigns
     * default properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.defaultsDeep({ 'user': { 'name': 'barney' } }, { 'user': { 'name': 'fred', 'age': 36 } });
     * // => { 'user': { 'name': 'barney', 'age': 36 } }
     *
     */
    var defaultsDeep = createDefaults(merge, mergeDefaults);

    /**
     * This method is like `_.find` except that it returns the key of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findKey(users, function(chr) {
     *   return chr.age < 40;
     * });
     * // => 'barney' (iteration order is not guaranteed)
     *
     * // using the `_.matches` callback shorthand
     * _.findKey(users, { 'age': 1, 'active': true });
     * // => 'pebbles'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findKey(users, 'active', false);
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.findKey(users, 'active');
     * // => 'barney'
     */
    var findKey = createFindKey(baseForOwn);

    /**
     * This method is like `_.findKey` except that it iterates over elements of
     * a collection in the opposite order.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findLastKey(users, function(chr) {
     *   return chr.age < 40;
     * });
     * // => returns `pebbles` assuming `_.findKey` returns `barney`
     *
     * // using the `_.matches` callback shorthand
     * _.findLastKey(users, { 'age': 36, 'active': true });
     * // => 'barney'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findLastKey(users, 'active', false);
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.findLastKey(users, 'active');
     * // => 'pebbles'
     */
    var findLastKey = createFindKey(baseForOwnRight);

    /**
     * Iterates over own and inherited enumerable properties of an object invoking
     * `iteratee` for each property. The `iteratee` is bound to `thisArg` and invoked
     * with three arguments: (value, key, object). Iteratee functions may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forIn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a', 'b', and 'c' (iteration order is not guaranteed)
     */
    var forIn = createForIn(baseFor);

    /**
     * This method is like `_.forIn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forInRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'c', 'b', and 'a' assuming `_.forIn ` logs 'a', 'b', and 'c'
     */
    var forInRight = createForIn(baseForRight);

    /**
     * Iterates over own enumerable properties of an object invoking `iteratee`
     * for each property. The `iteratee` is bound to `thisArg` and invoked with
     * three arguments: (value, key, object). Iteratee functions may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a' and 'b' (iteration order is not guaranteed)
     */
    var forOwn = createForOwn(baseForOwn);

    /**
     * This method is like `_.forOwn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwnRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'b' and 'a' assuming `_.forOwn` logs 'a' and 'b'
     */
    var forOwnRight = createForOwn(baseForOwnRight);

    /**
     * Creates an array of function property names from all enumerable properties,
     * own and inherited, of `object`.
     *
     * @static
     * @memberOf _
     * @alias methods
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the new array of property names.
     * @example
     *
     * _.functions(_);
     * // => ['after', 'ary', 'assign', ...]
     */
    function functions(object) {
      return baseFunctions(object, keysIn(object));
    }

    /**
     * Gets the property value at `path` of `object`. If the resolved value is
     * `undefined` the `defaultValue` is used in its place.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : baseGet(object, toPath(path), path + '');
      return result === undefined ? defaultValue : result;
    }

    /**
     * Checks if `path` is a direct property.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` is a direct property, else `false`.
     * @example
     *
     * var object = { 'a': { 'b': { 'c': 3 } } };
     *
     * _.has(object, 'a');
     * // => true
     *
     * _.has(object, 'a.b.c');
     * // => true
     *
     * _.has(object, ['a', 'b', 'c']);
     * // => true
     */
    function has(object, path) {
      if (object == null) {
        return false;
      }
      var result = hasOwnProperty.call(object, path);
      if (!result && !isKey(path)) {
        path = toPath(path);
        object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
        if (object == null) {
          return false;
        }
        path = last(path);
        result = hasOwnProperty.call(object, path);
      }
      return result || (isLength(object.length) && isIndex(path, object.length) &&
        (isArray(object) || isArguments(object)));
    }

    /**
     * Creates an object composed of the inverted keys and values of `object`.
     * If `object` contains duplicate values, subsequent values overwrite property
     * assignments of previous values unless `multiValue` is `true`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to invert.
     * @param {boolean} [multiValue] Allow multiple values per key.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invert(object);
     * // => { '1': 'c', '2': 'b' }
     *
     * // with `multiValue`
     * _.invert(object, true);
     * // => { '1': ['a', 'c'], '2': ['b'] }
     */
    function invert(object, multiValue, guard) {
      if (guard && isIterateeCall(object, multiValue, guard)) {
        multiValue = undefined;
      }
      var index = -1,
          props = keys(object),
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index],
            value = object[key];

        if (multiValue) {
          if (hasOwnProperty.call(result, value)) {
            result[value].push(key);
          } else {
            result[value] = [key];
          }
        }
        else {
          result[value] = key;
        }
      }
      return result;
    }

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    var keys = !nativeKeys ? shimKeys : function(object) {
      var Ctor = object == null ? undefined : object.constructor;
      if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
          (typeof object != 'function' && isArrayLike(object))) {
        return shimKeys(object);
      }
      return isObject(object) ? nativeKeys(object) : [];
    };

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn(object) {
      if (object == null) {
        return [];
      }
      if (!isObject(object)) {
        object = Object(object);
      }
      var length = object.length;
      length = (length && isLength(length) &&
        (isArray(object) || isArguments(object)) && length) || 0;

      var Ctor = object.constructor,
          index = -1,
          isProto = typeof Ctor == 'function' && Ctor.prototype === object,
          result = Array(length),
          skipIndexes = length > 0;

      while (++index < length) {
        result[index] = (index + '');
      }
      for (var key in object) {
        if (!(skipIndexes && isIndex(key, length)) &&
            !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The opposite of `_.mapValues`; this method creates an object with the
     * same values as `object` and keys generated by running each own enumerable
     * property of `object` through `iteratee`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the new mapped object.
     * @example
     *
     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
     *   return key + value;
     * });
     * // => { 'a1': 1, 'b2': 2 }
     */
    var mapKeys = createObjectMapper(true);

    /**
     * Creates an object with the same keys as `object` and values generated by
     * running each own enumerable property of `object` through `iteratee`. The
     * iteratee function is bound to `thisArg` and invoked with three arguments:
     * (value, key, object).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the new mapped object.
     * @example
     *
     * _.mapValues({ 'a': 1, 'b': 2 }, function(n) {
     *   return n * 3;
     * });
     * // => { 'a': 3, 'b': 6 }
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * // using the `_.property` callback shorthand
     * _.mapValues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     */
    var mapValues = createObjectMapper();

    /**
     * The opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable properties of `object` that are not omitted.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|...(string|string[])} [predicate] The function invoked per
     *  iteration or property names to omit, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.omit(object, 'age');
     * // => { 'user': 'fred' }
     *
     * _.omit(object, _.isNumber);
     * // => { 'user': 'fred' }
     */
    var omit = restParam(function(object, props) {
      if (object == null) {
        return {};
      }
      if (typeof props[0] != 'function') {
        var props = arrayMap(baseFlatten(props), String);
        return pickByArray(object, baseDifference(keysIn(object), props));
      }
      var predicate = bindCallback(props[0], props[1], 3);
      return pickByCallback(object, function(value, key, object) {
        return !predicate(value, key, object);
      });
    });

    /**
     * Creates a two dimensional array of the key-value pairs for `object`,
     * e.g. `[[key1, value1], [key2, value2]]`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the new array of key-value pairs.
     * @example
     *
     * _.pairs({ 'barney': 36, 'fred': 40 });
     * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
     */
    function pairs(object) {
      object = toObject(object);

      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        var key = props[index];
        result[index] = [key, object[key]];
      }
      return result;
    }

    /**
     * Creates an object composed of the picked `object` properties. Property
     * names may be specified as individual arguments or as arrays of property
     * names. If `predicate` is provided it is invoked for each property of `object`
     * picking the properties `predicate` returns truthy for. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|...(string|string[])} [predicate] The function invoked per
     *  iteration or property names to pick, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.pick(object, 'user');
     * // => { 'user': 'fred' }
     *
     * _.pick(object, _.isString);
     * // => { 'user': 'fred' }
     */
    var pick = restParam(function(object, props) {
      if (object == null) {
        return {};
      }
      return typeof props[0] == 'function'
        ? pickByCallback(object, bindCallback(props[0], props[1], 3))
        : pickByArray(object, baseFlatten(props));
    });

    /**
     * This method is like `_.get` except that if the resolved value is a function
     * it is invoked with the `this` binding of its parent object and its result
     * is returned.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to resolve.
     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
     *
     * _.result(object, 'a[0].b.c1');
     * // => 3
     *
     * _.result(object, 'a[0].b.c2');
     * // => 4
     *
     * _.result(object, 'a.b.c', 'default');
     * // => 'default'
     *
     * _.result(object, 'a.b.c', _.constant('default'));
     * // => 'default'
     */
    function result(object, path, defaultValue) {
      var result = object == null ? undefined : object[path];
      if (result === undefined) {
        if (object != null && !isKey(path, object)) {
          path = toPath(path);
          object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
          result = object == null ? undefined : object[last(path)];
        }
        result = result === undefined ? defaultValue : result;
      }
      return isFunction(result) ? result.call(object) : result;
    }

    /**
     * Sets the property value of `path` on `object`. If a portion of `path`
     * does not exist it is created.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to augment.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, 'x[0].y.z', 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */
    function set(object, path, value) {
      if (object == null) {
        return object;
      }
      var pathKey = (path + '');
      path = (object[pathKey] != null || isKey(path, object)) ? [pathKey] : toPath(path);

      var index = -1,
          length = path.length,
          lastIndex = length - 1,
          nested = object;

      while (nested != null && ++index < length) {
        var key = path[index];
        if (isObject(nested)) {
          if (index == lastIndex) {
            nested[key] = value;
          } else if (nested[key] == null) {
            nested[key] = isIndex(path[index + 1]) ? [] : {};
          }
        }
        nested = nested[key];
      }
      return object;
    }

    /**
     * An alternative to `_.reduce`; this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own enumerable
     * properties through `iteratee`, with each invocation potentially mutating
     * the `accumulator` object. The `iteratee` is bound to `thisArg` and invoked
     * with four arguments: (accumulator, value, key, object). Iteratee functions
     * may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Array|Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.transform([2, 3, 4], function(result, n) {
     *   result.push(n *= n);
     *   return n % 2 == 0;
     * });
     * // => [4, 9]
     *
     * _.transform({ 'a': 1, 'b': 2 }, function(result, n, key) {
     *   result[key] = n * 3;
     * });
     * // => { 'a': 3, 'b': 6 }
     */
    function transform(object, iteratee, accumulator, thisArg) {
      var isArr = isArray(object) || isTypedArray(object);
      iteratee = getCallback(iteratee, thisArg, 4);

      if (accumulator == null) {
        if (isArr || isObject(object)) {
          var Ctor = object.constructor;
          if (isArr) {
            accumulator = isArray(object) ? new Ctor : [];
          } else {
            accumulator = baseCreate(isFunction(Ctor) ? Ctor.prototype : undefined);
          }
        } else {
          accumulator = {};
        }
      }
      (isArr ? arrayEach : baseForOwn)(object, function(value, index, object) {
        return iteratee(accumulator, value, index, object);
      });
      return accumulator;
    }

    /**
     * Creates an array of the own enumerable property values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.values(new Foo);
     * // => [1, 2] (iteration order is not guaranteed)
     *
     * _.values('hi');
     * // => ['h', 'i']
     */
    function values(object) {
      return baseValues(object, keys(object));
    }

    /**
     * Creates an array of the own and inherited enumerable property values
     * of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.valuesIn(new Foo);
     * // => [1, 2, 3] (iteration order is not guaranteed)
     */
    function valuesIn(object) {
      return baseValues(object, keysIn(object));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Checks if `n` is between `start` and up to but not including, `end`. If
     * `end` is not specified it is set to `start` with `start` then set to `0`.
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} n The number to check.
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `n` is in the range, else `false`.
     * @example
     *
     * _.inRange(3, 2, 4);
     * // => true
     *
     * _.inRange(4, 8);
     * // => true
     *
     * _.inRange(4, 2);
     * // => false
     *
     * _.inRange(2, 2);
     * // => false
     *
     * _.inRange(1.2, 2);
     * // => true
     *
     * _.inRange(5.2, 4);
     * // => false
     */
    function inRange(value, start, end) {
      start = +start || 0;
      if (end === undefined) {
        end = start;
        start = 0;
      } else {
        end = +end || 0;
      }
      return value >= nativeMin(start, end) && value < nativeMax(start, end);
    }

    /**
     * Produces a random number between `min` and `max` (inclusive). If only one
     * argument is provided a number between `0` and the given number is returned.
     * If `floating` is `true`, or either `min` or `max` are floats, a floating-point
     * number is returned instead of an integer.
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} [min=0] The minimum possible value.
     * @param {number} [max=1] The maximum possible value.
     * @param {boolean} [floating] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(min, max, floating) {
      if (floating && isIterateeCall(min, max, floating)) {
        max = floating = undefined;
      }
      var noMin = min == null,
          noMax = max == null;

      if (floating == null) {
        if (noMax && typeof min == 'boolean') {
          floating = min;
          min = 1;
        }
        else if (typeof max == 'boolean') {
          floating = max;
          noMax = true;
        }
      }
      if (noMin && noMax) {
        max = 1;
        noMax = false;
      }
      min = +min || 0;
      if (noMax) {
        max = min;
        min = 0;
      } else {
        max = +max || 0;
      }
      if (floating || min % 1 || max % 1) {
        var rand = nativeRandom();
        return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand + '').length - 1)))), max);
      }
      return baseRandom(min, max);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the camel cased string.
     * @example
     *
     * _.camelCase('Foo Bar');
     * // => 'fooBar'
     *
     * _.camelCase('--foo-bar');
     * // => 'fooBar'
     *
     * _.camelCase('__foo_bar__');
     * // => 'fooBar'
     */
    var camelCase = createCompounder(function(result, word, index) {
      word = word.toLowerCase();
      return result + (index ? (word.charAt(0).toUpperCase() + word.slice(1)) : word);
    });

    /**
     * Capitalizes the first character of `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to capitalize.
     * @returns {string} Returns the capitalized string.
     * @example
     *
     * _.capitalize('fred');
     * // => 'Fred'
     */
    function capitalize(string) {
      string = baseToString(string);
      return string && (string.charAt(0).toUpperCase() + string.slice(1));
    }

    /**
     * Deburrs `string` by converting [latin-1 supplementary letters](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
     * to basic latin letters and removing [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to deburr.
     * @returns {string} Returns the deburred string.
     * @example
     *
     * _.deburr('déjà vu');
     * // => 'deja vu'
     */
    function deburr(string) {
      string = baseToString(string);
      return string && string.replace(reLatin1, deburrLetter).replace(reComboMark, '');
    }

    /**
     * Checks if `string` ends with the given target string.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=string.length] The position to search from.
     * @returns {boolean} Returns `true` if `string` ends with `target`, else `false`.
     * @example
     *
     * _.endsWith('abc', 'c');
     * // => true
     *
     * _.endsWith('abc', 'b');
     * // => false
     *
     * _.endsWith('abc', 'b', 2);
     * // => true
     */
    function endsWith(string, target, position) {
      string = baseToString(string);
      target = (target + '');

      var length = string.length;
      position = position === undefined
        ? length
        : nativeMin(position < 0 ? 0 : (+position || 0), length);

      position -= target.length;
      return position >= 0 && string.indexOf(target, position) == position;
    }

    /**
     * Converts the characters "&", "<", ">", '"', "'", and "\`", in `string` to
     * their corresponding HTML entities.
     *
     * **Note:** No other characters are escaped. To escape additional characters
     * use a third-party library like [_he_](https://mths.be/he).
     *
     * Though the ">" character is escaped for symmetry, characters like
     * ">" and "/" don't need escaping in HTML and have no special meaning
     * unless they're part of a tag or unquoted attribute value.
     * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
     * (under "semi-related fun fact") for more details.
     *
     * Backticks are escaped because in Internet Explorer < 9, they can break out
     * of attribute values or HTML comments. See [#59](https://html5sec.org/#59),
     * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
     * [#133](https://html5sec.org/#133) of the [HTML5 Security Cheatsheet](https://html5sec.org/)
     * for more details.
     *
     * When working with HTML you should always [quote attribute values](http://wonko.com/post/html-escaping)
     * to reduce XSS vectors.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */
    function escape(string) {
      // Reset `lastIndex` because in IE < 9 `String#replace` does not.
      string = baseToString(string);
      return (string && reHasUnescapedHtml.test(string))
        ? string.replace(reUnescapedHtml, escapeHtmlChar)
        : string;
    }

    /**
     * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
     * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escapeRegExp('[lodash](https://lodash.com/)');
     * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
     */
    function escapeRegExp(string) {
      string = baseToString(string);
      return (string && reHasRegExpChars.test(string))
        ? string.replace(reRegExpChars, escapeRegExpChar)
        : (string || '(?:)');
    }

    /**
     * Converts `string` to [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the kebab cased string.
     * @example
     *
     * _.kebabCase('Foo Bar');
     * // => 'foo-bar'
     *
     * _.kebabCase('fooBar');
     * // => 'foo-bar'
     *
     * _.kebabCase('__foo_bar__');
     * // => 'foo-bar'
     */
    var kebabCase = createCompounder(function(result, word, index) {
      return result + (index ? '-' : '') + word.toLowerCase();
    });

    /**
     * Pads `string` on the left and right sides if it's shorter than `length`.
     * Padding characters are truncated if they can't be evenly divided by `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */
    function pad(string, length, chars) {
      string = baseToString(string);
      length = +length;

      var strLength = string.length;
      if (strLength >= length || !nativeIsFinite(length)) {
        return string;
      }
      var mid = (length - strLength) / 2,
          leftLength = nativeFloor(mid),
          rightLength = nativeCeil(mid);

      chars = createPadding('', rightLength, chars);
      return chars.slice(0, leftLength) + string + chars;
    }

    /**
     * Pads `string` on the left side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padLeft('abc', 6);
     * // => '   abc'
     *
     * _.padLeft('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padLeft('abc', 3);
     * // => 'abc'
     */
    var padLeft = createPadDir();

    /**
     * Pads `string` on the right side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padRight('abc', 6);
     * // => 'abc   '
     *
     * _.padRight('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padRight('abc', 3);
     * // => 'abc'
     */
    var padRight = createPadDir(true);

    /**
     * Converts `string` to an integer of the specified radix. If `radix` is
     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a hexadecimal,
     * in which case a `radix` of `16` is used.
     *
     * **Note:** This method aligns with the [ES5 implementation](https://es5.github.io/#E)
     * of `parseInt`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} string The string to convert.
     * @param {number} [radix] The radix to interpret `value` by.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     *
     * _.map(['6', '08', '10'], _.parseInt);
     * // => [6, 8, 10]
     */
    function parseInt(string, radix, guard) {
      // Firefox < 21 and Opera < 15 follow ES3 for `parseInt`.
      // Chrome fails to trim leading <BOM> whitespace characters.
      // See https://code.google.com/p/v8/issues/detail?id=3109 for more details.
      if (guard ? isIterateeCall(string, radix, guard) : radix == null) {
        radix = 0;
      } else if (radix) {
        radix = +radix;
      }
      string = trim(string);
      return nativeParseInt(string, radix || (reHasHexPrefix.test(string) ? 16 : 10));
    }

    /**
     * Repeats the given string `n` times.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to repeat.
     * @param {number} [n=0] The number of times to repeat the string.
     * @returns {string} Returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */
    function repeat(string, n) {
      var result = '';
      string = baseToString(string);
      n = +n;
      if (n < 1 || !string || !nativeIsFinite(n)) {
        return result;
      }
      // Leverage the exponentiation by squaring algorithm for a faster repeat.
      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
      do {
        if (n % 2) {
          result += string;
        }
        n = nativeFloor(n / 2);
        string += string;
      } while (n);

      return result;
    }

    /**
     * Converts `string` to [snake case](https://en.wikipedia.org/wiki/Snake_case).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Foo Bar');
     * // => 'foo_bar'
     *
     * _.snakeCase('fooBar');
     * // => 'foo_bar'
     *
     * _.snakeCase('--foo-bar');
     * // => 'foo_bar'
     */
    var snakeCase = createCompounder(function(result, word, index) {
      return result + (index ? '_' : '') + word.toLowerCase();
    });

    /**
     * Converts `string` to [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the start cased string.
     * @example
     *
     * _.startCase('--foo-bar');
     * // => 'Foo Bar'
     *
     * _.startCase('fooBar');
     * // => 'Foo Bar'
     *
     * _.startCase('__foo_bar__');
     * // => 'Foo Bar'
     */
    var startCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + (word.charAt(0).toUpperCase() + word.slice(1));
    });

    /**
     * Checks if `string` starts with the given target string.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=0] The position to search from.
     * @returns {boolean} Returns `true` if `string` starts with `target`, else `false`.
     * @example
     *
     * _.startsWith('abc', 'a');
     * // => true
     *
     * _.startsWith('abc', 'b');
     * // => false
     *
     * _.startsWith('abc', 'b', 1);
     * // => true
     */
    function startsWith(string, target, position) {
      string = baseToString(string);
      position = position == null
        ? 0
        : nativeMin(position < 0 ? 0 : (+position || 0), string.length);

      return string.lastIndexOf(target, position) == position;
    }

    /**
     * Creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, HTML-escape interpolated data properties in
     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
     * properties may be accessed as free variables in the template. If a setting
     * object is provided it takes precedence over `_.templateSettings` values.
     *
     * **Note:** In the development build `_.template` utilizes
     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for easier debugging.
     *
     * For more information on precompiling templates see
     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
     *
     * For more information on Chrome extension sandboxes see
     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The template string.
     * @param {Object} [options] The options object.
     * @param {RegExp} [options.escape] The HTML "escape" delimiter.
     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
     * @param {Object} [options.imports] An object to import into the template as free variables.
     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
     * @param {string} [options.sourceURL] The sourceURL of the template's compiled source.
     * @param {string} [options.variable] The data object variable name.
     * @param- {Object} [otherOptions] Enables the legacy `options` param signature.
     * @returns {Function} Returns the compiled template function.
     * @example
     *
     * // using the "interpolate" delimiter to create a compiled template
     * var compiled = _.template('hello <%= user %>!');
     * compiled({ 'user': 'fred' });
     * // => 'hello fred!'
     *
     * // using the HTML "escape" delimiter to escape data property values
     * var compiled = _.template('<b><%- value %></b>');
     * compiled({ 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // using the "evaluate" delimiter to execute JavaScript and generate HTML
     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the internal `print` function in "evaluate" delimiters
     * var compiled = _.template('<% print("hello " + user); %>!');
     * compiled({ 'user': 'barney' });
     * // => 'hello barney!'
     *
     * // using the ES delimiter as an alternative to the default "interpolate" delimiter
     * var compiled = _.template('hello ${ user }!');
     * compiled({ 'user': 'pebbles' });
     * // => 'hello pebbles!'
     *
     * // using custom template delimiters
     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
     * var compiled = _.template('hello {{ user }}!');
     * compiled({ 'user': 'mustache' });
     * // => 'hello mustache!'
     *
     * // using backslashes to treat delimiters as plain text
     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
     * compiled({ 'value': 'ignored' });
     * // => '<%- value %>'
     *
     * // using the `imports` option to import `jQuery` as `jq`
     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the `sourceURL` option to specify a custom sourceURL for the template
     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
     *
     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     * //   var __t, __p = '';
     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
     * //   return __p;
     * // }
     *
     * // using the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and a stack trace
     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(string, options, otherOptions) {
      // Based on John Resig's `tmpl` implementation (http://ejohn.org/blog/javascript-micro-templating/)
      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
      var settings = lodash.templateSettings;

      if (otherOptions && isIterateeCall(string, options, otherOptions)) {
        options = otherOptions = undefined;
      }
      string = baseToString(string);
      options = assignWith(baseAssign({}, otherOptions || options), settings, assignOwnDefaults);

      var imports = assignWith(baseAssign({}, options.imports), settings.imports, assignOwnDefaults),
          importsKeys = keys(imports),
          importsValues = baseValues(imports, importsKeys);

      var isEscaping,
          isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // Compile the regexp to match each delimiter.
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      // Use a sourceURL for easier debugging.
      var sourceURL = '//# sourceURL=' +
        ('sourceURL' in options
          ? options.sourceURL
          : ('lodash.templateSources[' + (++templateCounter) + ']')
        ) + '\n';

      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // Escape characters that can't be included in string literals.
        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // Replace delimiters with snippets.
        if (escapeValue) {
          isEscaping = true;
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // The JS engine embedded in Adobe products requires returning the `match`
        // string in order to produce the correct `offset` value.
        return match;
      });

      source += "';\n";

      // If `variable` is not specified wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain.
      var variable = options.variable;
      if (!variable) {
        source = 'with (obj) {\n' + source + '\n}\n';
      }
      // Cleanup code by stripping empty strings.
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // Frame code as the function body.
      source = 'function(' + (variable || 'obj') + ') {\n' +
        (variable
          ? ''
          : 'obj || (obj = {});\n'
        ) +
        "var __t, __p = ''" +
        (isEscaping
           ? ', __e = _.escape'
           : ''
        ) +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      var result = attempt(function() {
        return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
      });

      // Provide the compiled function's source by its `toString` method or
      // the `source` property as a convenience for inlining compiled templates.
      result.source = source;
      if (isError(result)) {
        throw result;
      }
      return result;
    }

    /**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar']
     */
    function trim(string, chars, guard) {
      var value = string;
      string = baseToString(string);
      if (!string) {
        return string;
      }
      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
        return string.slice(trimmedLeftIndex(string), trimmedRightIndex(string) + 1);
      }
      chars = (chars + '');
      return string.slice(charsLeftIndex(string, chars), charsRightIndex(string, chars) + 1);
    }

    /**
     * Removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimLeft('  abc  ');
     * // => 'abc  '
     *
     * _.trimLeft('-_-abc-_-', '_-');
     * // => 'abc-_-'
     */
    function trimLeft(string, chars, guard) {
      var value = string;
      string = baseToString(string);
      if (!string) {
        return string;
      }
      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
        return string.slice(trimmedLeftIndex(string));
      }
      return string.slice(charsLeftIndex(string, (chars + '')));
    }

    /**
     * Removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimRight('  abc  ');
     * // => '  abc'
     *
     * _.trimRight('-_-abc-_-', '_-');
     * // => '-_-abc'
     */
    function trimRight(string, chars, guard) {
      var value = string;
      string = baseToString(string);
      if (!string) {
        return string;
      }
      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
        return string.slice(0, trimmedRightIndex(string) + 1);
      }
      return string.slice(0, charsRightIndex(string, (chars + '')) + 1);
    }

    /**
     * Truncates `string` if it's longer than the given maximum string length.
     * The last characters of the truncated string are replaced with the omission
     * string which defaults to "...".
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to truncate.
     * @param {Object|number} [options] The options object or maximum string length.
     * @param {number} [options.length=30] The maximum string length.
     * @param {string} [options.omission='...'] The string to indicate text is omitted.
     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the truncated string.
     * @example
     *
     * _.trunc('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', 24);
     * // => 'hi-diddly-ho there, n...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': ' '
     * });
     * // => 'hi-diddly-ho there,...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': /,? +/
     * });
     * // => 'hi-diddly-ho there...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'omission': ' [...]'
     * });
     * // => 'hi-diddly-ho there, neig [...]'
     */
    function trunc(string, options, guard) {
      if (guard && isIterateeCall(string, options, guard)) {
        options = undefined;
      }
      var length = DEFAULT_TRUNC_LENGTH,
          omission = DEFAULT_TRUNC_OMISSION;

      if (options != null) {
        if (isObject(options)) {
          var separator = 'separator' in options ? options.separator : separator;
          length = 'length' in options ? (+options.length || 0) : length;
          omission = 'omission' in options ? baseToString(options.omission) : omission;
        } else {
          length = +options || 0;
        }
      }
      string = baseToString(string);
      if (length >= string.length) {
        return string;
      }
      var end = length - omission.length;
      if (end < 1) {
        return omission;
      }
      var result = string.slice(0, end);
      if (separator == null) {
        return result + omission;
      }
      if (isRegExp(separator)) {
        if (string.slice(end).search(separator)) {
          var match,
              newEnd,
              substring = string.slice(0, end);

          if (!separator.global) {
            separator = RegExp(separator.source, (reFlags.exec(separator) || '') + 'g');
          }
          separator.lastIndex = 0;
          while ((match = separator.exec(substring))) {
            newEnd = match.index;
          }
          result = result.slice(0, newEnd == null ? end : newEnd);
        }
      } else if (string.indexOf(separator, end) != end) {
        var index = result.lastIndexOf(separator);
        if (index > -1) {
          result = result.slice(0, index);
        }
      }
      return result + omission;
    }

    /**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `string` to their
     * corresponding characters.
     *
     * **Note:** No other HTML entities are unescaped. To unescape additional HTML
     * entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */
    function unescape(string) {
      string = baseToString(string);
      return (string && reHasEscapedHtml.test(string))
        ? string.replace(reEscapedHtml, unescapeHtmlChar)
        : string;
    }

    /**
     * Splits `string` into an array of its words.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {RegExp|string} [pattern] The pattern to match words.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */
    function words(string, pattern, guard) {
      if (guard && isIterateeCall(string, pattern, guard)) {
        pattern = undefined;
      }
      string = baseToString(string);
      return string.match(pattern || reWords) || [];
    }

    /*------------------------------------------------------------------------*/

    /**
     * Attempts to invoke `func`, returning either the result or the caught error
     * object. Any additional arguments are provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Function} func The function to attempt.
     * @returns {*} Returns the `func` result or error object.
     * @example
     *
     * // avoid throwing errors for invalid selectors
     * var elements = _.attempt(function(selector) {
     *   return document.querySelectorAll(selector);
     * }, '>_>');
     *
     * if (_.isError(elements)) {
     *   elements = [];
     * }
     */
    var attempt = restParam(function(func, args) {
      try {
        return func.apply(undefined, args);
      } catch(e) {
        return isError(e) ? e : new Error(e);
      }
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and arguments of the created function. If `func` is a property name the
     * created callback returns the property value for a given element. If `func`
     * is an object the created callback returns `true` for elements that contain
     * the equivalent object properties, otherwise it returns `false`.
     *
     * @static
     * @memberOf _
     * @alias iteratee
     * @category Utility
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the callback.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // wrap to create custom callback shorthands
     * _.callback = _.wrap(_.callback, function(callback, func, thisArg) {
     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(func);
     *   if (!match) {
     *     return callback(func, thisArg);
     *   }
     *   return function(object) {
     *     return match[2] == 'gt'
     *       ? object[match[1]] > match[3]
     *       : object[match[1]] < match[3];
     *   };
     * });
     *
     * _.filter(users, 'age__gt36');
     * // => [{ 'user': 'fred', 'age': 40 }]
     */
    function callback(func, thisArg, guard) {
      if (guard && isIterateeCall(func, thisArg, guard)) {
        thisArg = undefined;
      }
      return isObjectLike(func)
        ? matches(func)
        : baseCallback(func, thisArg);
    }

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var getter = _.constant(object);
     *
     * getter() === object;
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * This method returns the first argument provided to it.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.identity(object) === object;
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Creates a function that performs a deep comparison between a given object
     * and `source`, returning `true` if the given object has equivalent property
     * values, else `false`.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, _.matches({ 'age': 40, 'active': false }));
     * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
     */
    function matches(source) {
      return baseMatches(baseClone(source, true));
    }

    /**
     * Creates a function that compares the property value of `path` on a given
     * object to `value`.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * _.find(users, _.matchesProperty('user', 'fred'));
     * // => { 'user': 'fred' }
     */
    function matchesProperty(path, srcValue) {
      return baseMatchesProperty(path, baseClone(srcValue, true));
    }

    /**
     * Creates a function that invokes the method at `path` on a given object.
     * Any additional arguments are provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': { 'c': _.constant(2) } } },
     *   { 'a': { 'b': { 'c': _.constant(1) } } }
     * ];
     *
     * _.map(objects, _.method('a.b.c'));
     * // => [2, 1]
     *
     * _.invoke(_.sortBy(objects, _.method(['a', 'b', 'c'])), 'a.b.c');
     * // => [1, 2]
     */
    var method = restParam(function(path, args) {
      return function(object) {
        return invokePath(object, path, args);
      };
    });

    /**
     * The opposite of `_.method`; this method creates a function that invokes
     * the method at a given path on `object`. Any additional arguments are
     * provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} object The object to query.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var array = _.times(3, _.constant),
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
     * // => [2, 0]
     */
    var methodOf = restParam(function(object, args) {
      return function(path) {
        return invokePath(object, path, args);
      };
    });

    /**
     * Adds all own enumerable function properties of a source object to the
     * destination object. If `object` is a function then methods are added to
     * its prototype as well.
     *
     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
     * avoid conflicts caused by modifying the original.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Function|Object} [object=lodash] The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.chain=true] Specify whether the functions added
     *  are chainable.
     * @returns {Function|Object} Returns `object`.
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */
    function mixin(object, source, options) {
      if (options == null) {
        var isObj = isObject(source),
            props = isObj ? keys(source) : undefined,
            methodNames = (props && props.length) ? baseFunctions(source, props) : undefined;

        if (!(methodNames ? methodNames.length : isObj)) {
          methodNames = false;
          options = source;
          source = object;
          object = this;
        }
      }
      if (!methodNames) {
        methodNames = baseFunctions(source, keys(source));
      }
      var chain = true,
          index = -1,
          isFunc = isFunction(object),
          length = methodNames.length;

      if (options === false) {
        chain = false;
      } else if (isObject(options) && 'chain' in options) {
        chain = options.chain;
      }
      while (++index < length) {
        var methodName = methodNames[index],
            func = source[methodName];

        object[methodName] = func;
        if (isFunc) {
          object.prototype[methodName] = (function(func) {
            return function() {
              var chainAll = this.__chain__;
              if (chain || chainAll) {
                var result = object(this.__wrapped__),
                    actions = result.__actions__ = arrayCopy(this.__actions__);

                actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
                result.__chain__ = chainAll;
                return result;
              }
              return func.apply(object, arrayPush([this.value()], arguments));
            };
          }(func));
        }
      }
      return object;
    }

    /**
     * Reverts the `_` variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      root._ = oldDash;
      return this;
    }

    /**
     * A no-operation function that returns `undefined` regardless of the
     * arguments it receives.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.noop(object) === undefined;
     * // => true
     */
    function noop() {
      // No operation performed.
    }

    /**
     * Creates a function that returns the property value at `path` on a
     * given object.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': { 'c': 2 } } },
     *   { 'a': { 'b': { 'c': 1 } } }
     * ];
     *
     * _.map(objects, _.property('a.b.c'));
     * // => [2, 1]
     *
     * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
     * // => [1, 2]
     */
    function property(path) {
      return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
    }

    /**
     * The opposite of `_.property`; this method creates a function that returns
     * the property value at a given path on `object`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} object The object to query.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var array = [0, 1, 2],
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
     * // => [2, 0]
     */
    function propertyOf(object) {
      return function(path) {
        return baseGet(object, toPath(path), path + '');
      };
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. If `end` is not specified it is
     * set to `start` with `start` then set to `0`. If `end` is less than `start`
     * a zero-length range is created unless a negative `step` is specified.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the new array of numbers.
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    function range(start, end, step) {
      if (step && isIterateeCall(start, end, step)) {
        end = step = undefined;
      }
      start = +start || 0;
      step = step == null ? 1 : (+step || 0);

      if (end == null) {
        end = start;
        start = 0;
      } else {
        end = +end || 0;
      }
      // Use `Array(length)` so engines like Chakra and V8 avoid slower modes.
      // See https://youtu.be/XAqIpGU8ZZk#t=17m25s for more details.
      var index = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);

      while (++index < length) {
        result[index] = start;
        start += step;
      }
      return result;
    }

    /**
     * Invokes the iteratee function `n` times, returning an array of the results
     * of each invocation. The `iteratee` is bound to `thisArg` and invoked with
     * one argument; (index).
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * var diceRolls = _.times(3, _.partial(_.random, 1, 6, false));
     * // => [3, 6, 4]
     *
     * _.times(3, function(n) {
     *   mage.castSpell(n);
     * });
     * // => invokes `mage.castSpell(n)` three times with `n` of `0`, `1`, and `2`
     *
     * _.times(3, function(n) {
     *   this.cast(n);
     * }, mage);
     * // => also invokes `mage.castSpell(n)` three times
     */
    function times(n, iteratee, thisArg) {
      n = nativeFloor(n);

      // Exit early to avoid a JSC JIT bug in Safari 8
      // where `Array(0)` is treated as `Array(1)`.
      if (n < 1 || !nativeIsFinite(n)) {
        return [];
      }
      var index = -1,
          result = Array(nativeMin(n, MAX_ARRAY_LENGTH));

      iteratee = bindCallback(iteratee, thisArg, 1);
      while (++index < n) {
        if (index < MAX_ARRAY_LENGTH) {
          result[index] = iteratee(index);
        } else {
          iteratee(index);
        }
      }
      return result;
    }

    /**
     * Generates a unique ID. If `prefix` is provided the ID is appended to it.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {string} [prefix] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return baseToString(prefix) + id;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Adds two numbers.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} augend The first number to add.
     * @param {number} addend The second number to add.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.add(6, 4);
     * // => 10
     */
    function add(augend, addend) {
      return (+augend || 0) + (+addend || 0);
    }

    /**
     * Calculates `n` rounded up to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round up.
     * @param {number} [precision=0] The precision to round up to.
     * @returns {number} Returns the rounded up number.
     * @example
     *
     * _.ceil(4.006);
     * // => 5
     *
     * _.ceil(6.004, 2);
     * // => 6.01
     *
     * _.ceil(6040, -2);
     * // => 6100
     */
    var ceil = createRound('ceil');

    /**
     * Calculates `n` rounded down to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round down.
     * @param {number} [precision=0] The precision to round down to.
     * @returns {number} Returns the rounded down number.
     * @example
     *
     * _.floor(4.006);
     * // => 4
     *
     * _.floor(0.046, 2);
     * // => 0.04
     *
     * _.floor(4060, -2);
     * // => 4000
     */
    var floor = createRound('floor');

    /**
     * Gets the maximum value of `collection`. If `collection` is empty or falsey
     * `-Infinity` is returned. If an iteratee function is provided it is invoked
     * for each value in `collection` to generate the criterion by which the value
     * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * _.max([]);
     * // => -Infinity
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.max(users, function(chr) {
     *   return chr.age;
     * });
     * // => { 'user': 'fred', 'age': 40 }
     *
     * // using the `_.property` callback shorthand
     * _.max(users, 'age');
     * // => { 'user': 'fred', 'age': 40 }
     */
    var max = createExtremum(gt, NEGATIVE_INFINITY);

    /**
     * Gets the minimum value of `collection`. If `collection` is empty or falsey
     * `Infinity` is returned. If an iteratee function is provided it is invoked
     * for each value in `collection` to generate the criterion by which the value
     * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * _.min([]);
     * // => Infinity
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.min(users, function(chr) {
     *   return chr.age;
     * });
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // using the `_.property` callback shorthand
     * _.min(users, 'age');
     * // => { 'user': 'barney', 'age': 36 }
     */
    var min = createExtremum(lt, POSITIVE_INFINITY);

    /**
     * Calculates `n` rounded to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round.
     * @param {number} [precision=0] The precision to round to.
     * @returns {number} Returns the rounded number.
     * @example
     *
     * _.round(4.006);
     * // => 4
     *
     * _.round(4.006, 2);
     * // => 4.01
     *
     * _.round(4060, -2);
     * // => 4100
     */
    var round = createRound('round');

    /**
     * Gets the sum of the values in `collection`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.sum([4, 6]);
     * // => 10
     *
     * _.sum({ 'a': 4, 'b': 6 });
     * // => 10
     *
     * var objects = [
     *   { 'n': 4 },
     *   { 'n': 6 }
     * ];
     *
     * _.sum(objects, function(object) {
     *   return object.n;
     * });
     * // => 10
     *
     * // using the `_.property` callback shorthand
     * _.sum(objects, 'n');
     * // => 10
     */
    function sum(collection, iteratee, thisArg) {
      if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
        iteratee = undefined;
      }
      iteratee = getCallback(iteratee, thisArg, 3);
      return iteratee.length == 1
        ? arraySum(isArray(collection) ? collection : toIterable(collection), iteratee)
        : baseSum(collection, iteratee);
    }

    /*------------------------------------------------------------------------*/

    // Ensure wrappers are instances of `baseLodash`.
    lodash.prototype = baseLodash.prototype;

    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
    LodashWrapper.prototype.constructor = LodashWrapper;

    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
    LazyWrapper.prototype.constructor = LazyWrapper;

    // Add functions to the `Map` cache.
    MapCache.prototype['delete'] = mapDelete;
    MapCache.prototype.get = mapGet;
    MapCache.prototype.has = mapHas;
    MapCache.prototype.set = mapSet;

    // Add functions to the `Set` cache.
    SetCache.prototype.push = cachePush;

    // Assign cache to `_.memoize`.
    memoize.Cache = MapCache;

    // Add functions that return wrapped values when chaining.
    lodash.after = after;
    lodash.ary = ary;
    lodash.assign = assign;
    lodash.at = at;
    lodash.before = before;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.callback = callback;
    lodash.chain = chain;
    lodash.chunk = chunk;
    lodash.compact = compact;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.curry = curry;
    lodash.curryRight = curryRight;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defaultsDeep = defaultsDeep;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.drop = drop;
    lodash.dropRight = dropRight;
    lodash.dropRightWhile = dropRightWhile;
    lodash.dropWhile = dropWhile;
    lodash.fill = fill;
    lodash.filter = filter;
    lodash.flatten = flatten;
    lodash.flattenDeep = flattenDeep;
    lodash.flow = flow;
    lodash.flowRight = flowRight;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.functions = functions;
    lodash.groupBy = groupBy;
    lodash.indexBy = indexBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.invert = invert;
    lodash.invoke = invoke;
    lodash.keys = keys;
    lodash.keysIn = keysIn;
    lodash.map = map;
    lodash.mapKeys = mapKeys;
    lodash.mapValues = mapValues;
    lodash.matches = matches;
    lodash.matchesProperty = matchesProperty;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.method = method;
    lodash.methodOf = methodOf;
    lodash.mixin = mixin;
    lodash.modArgs = modArgs;
    lodash.negate = negate;
    lodash.omit = omit;
    lodash.once = once;
    lodash.pairs = pairs;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.partition = partition;
    lodash.pick = pick;
    lodash.pluck = pluck;
    lodash.property = property;
    lodash.propertyOf = propertyOf;
    lodash.pull = pull;
    lodash.pullAt = pullAt;
    lodash.range = range;
    lodash.rearg = rearg;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.restParam = restParam;
    lodash.set = set;
    lodash.shuffle = shuffle;
    lodash.slice = slice;
    lodash.sortBy = sortBy;
    lodash.sortByAll = sortByAll;
    lodash.sortByOrder = sortByOrder;
    lodash.spread = spread;
    lodash.take = take;
    lodash.takeRight = takeRight;
    lodash.takeRightWhile = takeRightWhile;
    lodash.takeWhile = takeWhile;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.thru = thru;
    lodash.times = times;
    lodash.toArray = toArray;
    lodash.toPlainObject = toPlainObject;
    lodash.transform = transform;
    lodash.union = union;
    lodash.uniq = uniq;
    lodash.unzip = unzip;
    lodash.unzipWith = unzipWith;
    lodash.values = values;
    lodash.valuesIn = valuesIn;
    lodash.where = where;
    lodash.without = without;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.zip = zip;
    lodash.zipObject = zipObject;
    lodash.zipWith = zipWith;

    // Add aliases.
    lodash.backflow = flowRight;
    lodash.collect = map;
    lodash.compose = flowRight;
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.extend = assign;
    lodash.iteratee = callback;
    lodash.methods = functions;
    lodash.object = zipObject;
    lodash.select = filter;
    lodash.tail = rest;
    lodash.unique = uniq;

    // Add functions to `lodash.prototype`.
    mixin(lodash, lodash);

    /*------------------------------------------------------------------------*/

    // Add functions that return unwrapped values when chaining.
    lodash.add = add;
    lodash.attempt = attempt;
    lodash.camelCase = camelCase;
    lodash.capitalize = capitalize;
    lodash.ceil = ceil;
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.deburr = deburr;
    lodash.endsWith = endsWith;
    lodash.escape = escape;
    lodash.escapeRegExp = escapeRegExp;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.findWhere = findWhere;
    lodash.first = first;
    lodash.floor = floor;
    lodash.get = get;
    lodash.gt = gt;
    lodash.gte = gte;
    lodash.has = has;
    lodash.identity = identity;
    lodash.includes = includes;
    lodash.indexOf = indexOf;
    lodash.inRange = inRange;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isBoolean = isBoolean;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isError = isError;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isMatch = isMatch;
    lodash.isNaN = isNaN;
    lodash.isNative = isNative;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isString = isString;
    lodash.isTypedArray = isTypedArray;
    lodash.isUndefined = isUndefined;
    lodash.kebabCase = kebabCase;
    lodash.last = last;
    lodash.lastIndexOf = lastIndexOf;
    lodash.lt = lt;
    lodash.lte = lte;
    lodash.max = max;
    lodash.min = min;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.pad = pad;
    lodash.padLeft = padLeft;
    lodash.padRight = padRight;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.repeat = repeat;
    lodash.result = result;
    lodash.round = round;
    lodash.runInContext = runInContext;
    lodash.size = size;
    lodash.snakeCase = snakeCase;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.sortedLastIndex = sortedLastIndex;
    lodash.startCase = startCase;
    lodash.startsWith = startsWith;
    lodash.sum = sum;
    lodash.template = template;
    lodash.trim = trim;
    lodash.trimLeft = trimLeft;
    lodash.trimRight = trimRight;
    lodash.trunc = trunc;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;
    lodash.words = words;

    // Add aliases.
    lodash.all = every;
    lodash.any = some;
    lodash.contains = includes;
    lodash.eq = isEqual;
    lodash.detect = find;
    lodash.foldl = reduce;
    lodash.foldr = reduceRight;
    lodash.head = first;
    lodash.include = includes;
    lodash.inject = reduce;

    mixin(lodash, (function() {
      var source = {};
      baseForOwn(lodash, function(func, methodName) {
        if (!lodash.prototype[methodName]) {
          source[methodName] = func;
        }
      });
      return source;
    }()), false);

    /*------------------------------------------------------------------------*/

    // Add functions capable of returning wrapped and unwrapped values when chaining.
    lodash.sample = sample;

    lodash.prototype.sample = function(n) {
      if (!this.__chain__ && n == null) {
        return sample(this.value());
      }
      return this.thru(function(value) {
        return sample(value, n);
      });
    };

    /*------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type string
     */
    lodash.VERSION = VERSION;

    // Assign default placeholders.
    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
      lodash[methodName].placeholder = lodash;
    });

    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
    arrayEach(['drop', 'take'], function(methodName, index) {
      LazyWrapper.prototype[methodName] = function(n) {
        var filtered = this.__filtered__;
        if (filtered && !index) {
          return new LazyWrapper(this);
        }
        n = n == null ? 1 : nativeMax(nativeFloor(n) || 0, 0);

        var result = this.clone();
        if (filtered) {
          result.__takeCount__ = nativeMin(result.__takeCount__, n);
        } else {
          result.__views__.push({ 'size': n, 'type': methodName + (result.__dir__ < 0 ? 'Right' : '') });
        }
        return result;
      };

      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
        return this.reverse()[methodName](n).reverse();
      };
    });

    // Add `LazyWrapper` methods that accept an `iteratee` value.
    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
      var type = index + 1,
          isFilter = type != LAZY_MAP_FLAG;

      LazyWrapper.prototype[methodName] = function(iteratee, thisArg) {
        var result = this.clone();
        result.__iteratees__.push({ 'iteratee': getCallback(iteratee, thisArg, 1), 'type': type });
        result.__filtered__ = result.__filtered__ || isFilter;
        return result;
      };
    });

    // Add `LazyWrapper` methods for `_.first` and `_.last`.
    arrayEach(['first', 'last'], function(methodName, index) {
      var takeName = 'take' + (index ? 'Right' : '');

      LazyWrapper.prototype[methodName] = function() {
        return this[takeName](1).value()[0];
      };
    });

    // Add `LazyWrapper` methods for `_.initial` and `_.rest`.
    arrayEach(['initial', 'rest'], function(methodName, index) {
      var dropName = 'drop' + (index ? '' : 'Right');

      LazyWrapper.prototype[methodName] = function() {
        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
      };
    });

    // Add `LazyWrapper` methods for `_.pluck` and `_.where`.
    arrayEach(['pluck', 'where'], function(methodName, index) {
      var operationName = index ? 'filter' : 'map',
          createCallback = index ? baseMatches : property;

      LazyWrapper.prototype[methodName] = function(value) {
        return this[operationName](createCallback(value));
      };
    });

    LazyWrapper.prototype.compact = function() {
      return this.filter(identity);
    };

    LazyWrapper.prototype.reject = function(predicate, thisArg) {
      predicate = getCallback(predicate, thisArg, 1);
      return this.filter(function(value) {
        return !predicate(value);
      });
    };

    LazyWrapper.prototype.slice = function(start, end) {
      start = start == null ? 0 : (+start || 0);

      var result = this;
      if (result.__filtered__ && (start > 0 || end < 0)) {
        return new LazyWrapper(result);
      }
      if (start < 0) {
        result = result.takeRight(-start);
      } else if (start) {
        result = result.drop(start);
      }
      if (end !== undefined) {
        end = (+end || 0);
        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
      }
      return result;
    };

    LazyWrapper.prototype.takeRightWhile = function(predicate, thisArg) {
      return this.reverse().takeWhile(predicate, thisArg).reverse();
    };

    LazyWrapper.prototype.toArray = function() {
      return this.take(POSITIVE_INFINITY);
    };

    // Add `LazyWrapper` methods to `lodash.prototype`.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var checkIteratee = /^(?:filter|map|reject)|While$/.test(methodName),
          retUnwrapped = /^(?:first|last)$/.test(methodName),
          lodashFunc = lodash[retUnwrapped ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName];

      if (!lodashFunc) {
        return;
      }
      lodash.prototype[methodName] = function() {
        var args = retUnwrapped ? [1] : arguments,
            chainAll = this.__chain__,
            value = this.__wrapped__,
            isHybrid = !!this.__actions__.length,
            isLazy = value instanceof LazyWrapper,
            iteratee = args[0],
            useLazy = isLazy || isArray(value);

        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
          // Avoid lazy use if the iteratee has a "length" value other than `1`.
          isLazy = useLazy = false;
        }
        var interceptor = function(value) {
          return (retUnwrapped && chainAll)
            ? lodashFunc(value, 1)[0]
            : lodashFunc.apply(undefined, arrayPush([value], args));
        };

        var action = { 'func': thru, 'args': [interceptor], 'thisArg': undefined },
            onlyLazy = isLazy && !isHybrid;

        if (retUnwrapped && !chainAll) {
          if (onlyLazy) {
            value = value.clone();
            value.__actions__.push(action);
            return func.call(value);
          }
          return lodashFunc.call(undefined, this.value())[0];
        }
        if (!retUnwrapped && useLazy) {
          value = onlyLazy ? value : new LazyWrapper(this);
          var result = func.apply(value, args);
          result.__actions__.push(action);
          return new LodashWrapper(result, chainAll);
        }
        return this.thru(interceptor);
      };
    });

    // Add `Array` and `String` methods to `lodash.prototype`.
    arrayEach(['join', 'pop', 'push', 'replace', 'shift', 'sort', 'splice', 'split', 'unshift'], function(methodName) {
      var func = (/^(?:replace|split)$/.test(methodName) ? stringProto : arrayProto)[methodName],
          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
          retUnwrapped = /^(?:join|pop|replace|shift)$/.test(methodName);

      lodash.prototype[methodName] = function() {
        var args = arguments;
        if (retUnwrapped && !this.__chain__) {
          return func.apply(this.value(), args);
        }
        return this[chainName](function(value) {
          return func.apply(value, args);
        });
      };
    });

    // Map minified function names to their real names.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var lodashFunc = lodash[methodName];
      if (lodashFunc) {
        var key = lodashFunc.name,
            names = realNames[key] || (realNames[key] = []);

        names.push({ 'name': methodName, 'func': lodashFunc });
      }
    });

    realNames[createHybridWrapper(undefined, BIND_KEY_FLAG).name] = [{ 'name': 'wrapper', 'func': undefined }];

    // Add functions to the lazy wrapper.
    LazyWrapper.prototype.clone = lazyClone;
    LazyWrapper.prototype.reverse = lazyReverse;
    LazyWrapper.prototype.value = lazyValue;

    // Add chaining functions to the `lodash` wrapper.
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.commit = wrapperCommit;
    lodash.prototype.concat = wrapperConcat;
    lodash.prototype.plant = wrapperPlant;
    lodash.prototype.reverse = wrapperReverse;
    lodash.prototype.toString = wrapperToString;
    lodash.prototype.run = lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;

    // Add function aliases to the `lodash` wrapper.
    lodash.prototype.collect = lodash.prototype.map;
    lodash.prototype.head = lodash.prototype.first;
    lodash.prototype.select = lodash.prototype.filter;
    lodash.prototype.tail = lodash.prototype.rest;

    return lodash;
  }

  /*--------------------------------------------------------------------------*/

  // Export lodash.
  var _ = runInContext();

  // Some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose lodash to the global object when an AMD loader is present to avoid
    // errors in cases where lodash is loaded by a script tag and not intended
    // as an AMD module. See http://requirejs.org/docs/errors.html#mismatch for
    // more details.
    root._ = _;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    define('lodash',[],function() {
      return _;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for Node.js or RingoJS.
    if (moduleExports) {
      (freeModule.exports = _)._ = _;
    }
    // Export for Rhino with CommonJS support.
    else {
      freeExports._ = _;
    }
  }
  else {
    // Export for a browser or Rhino.
    root._ = _;
  }
}.call(this));

/**
 * interact.js v1.2.4
 *
 * Copyright (c) 2012-2015 Taye Adeyemi <dev@taye.me>
 * Open source under the MIT License.
 * https://raw.github.com/taye/interact.js/master/LICENSE
 */
(function (realWindow) {
    'use strict';

    var // get wrapped window if using Shadow DOM polyfill
        window = (function () {
            // create a TextNode
            var el = realWindow.document.createTextNode('');

            // check if it's wrapped by a polyfill
            if (el.ownerDocument !== realWindow.document
                && typeof realWindow.wrap === 'function'
                && realWindow.wrap(el) === el) {
                // return wrapped window
                return realWindow.wrap(realWindow);
            }

            // no Shadow DOM polyfil or native implementation
            return realWindow;
        }()),

        document           = window.document,
        DocumentFragment   = window.DocumentFragment   || blank,
        SVGElement         = window.SVGElement         || blank,
        SVGSVGElement      = window.SVGSVGElement      || blank,
        SVGElementInstance = window.SVGElementInstance || blank,
        HTMLElement        = window.HTMLElement        || window.Element,

        PointerEvent = (window.PointerEvent || window.MSPointerEvent),
        pEventTypes,

        hypot = Math.hypot || function (x, y) { return Math.sqrt(x * x + y * y); },

        tmpXY = {},     // reduce object creation in getXY()

        documents       = [],   // all documents being listened to

        interactables   = [],   // all set interactables
        interactions    = [],   // all interactions

        dynamicDrop     = false,

        // {
        //      type: {
        //          selectors: ['selector', ...],
        //          contexts : [document, ...],
        //          listeners: [[listener, useCapture], ...]
        //      }
        //  }
        delegatedEvents = {},

        defaultOptions = {
            base: {
                accept        : null,
                actionChecker : null,
                styleCursor   : true,
                preventDefault: 'auto',
                origin        : { x: 0, y: 0 },
                deltaSource   : 'page',
                allowFrom     : null,
                ignoreFrom    : null,
                _context      : document,
                dropChecker   : null
            },

            drag: {
                enabled: false,
                manualStart: true,
                max: Infinity,
                maxPerElement: 1,

                snap: null,
                restrict: null,
                inertia: null,
                autoScroll: null,

                axis: 'xy',
            },

            drop: {
                enabled: false,
                accept: null,
                overlap: 'pointer'
            },

            resize: {
                enabled: false,
                manualStart: false,
                max: Infinity,
                maxPerElement: 1,

                snap: null,
                restrict: null,
                inertia: null,
                autoScroll: null,

                square: false,
                axis: 'xy',

                // object with props left, right, top, bottom which are
                // true/false values to resize when the pointer is over that edge,
                // CSS selectors to match the handles for each direction
                // or the Elements for each handle
                edges: null,

                // a value of 'none' will limit the resize rect to a minimum of 0x0
                // 'negate' will alow the rect to have negative width/height
                // 'reposition' will keep the width/height positive by swapping
                // the top and bottom edges and/or swapping the left and right edges
                invert: 'none'
            },

            gesture: {
                manualStart: false,
                enabled: false,
                max: Infinity,
                maxPerElement: 1,

                restrict: null
            },

            perAction: {
                manualStart: false,
                max: Infinity,
                maxPerElement: 1,

                snap: {
                    enabled     : false,
                    endOnly     : false,
                    range       : Infinity,
                    targets     : null,
                    offsets     : null,

                    relativePoints: null
                },

                restrict: {
                    enabled: false,
                    endOnly: false
                },

                autoScroll: {
                    enabled     : false,
                    container   : null,     // the item that is scrolled (Window or HTMLElement)
                    margin      : 60,
                    speed       : 300       // the scroll speed in pixels per second
                },

                inertia: {
                    enabled          : false,
                    resistance       : 10,    // the lambda in exponential decay
                    minSpeed         : 100,   // target speed must be above this for inertia to start
                    endSpeed         : 10,    // the speed at which inertia is slow enough to stop
                    allowResume      : true,  // allow resuming an action in inertia phase
                    zeroResumeDelta  : true,  // if an action is resumed after launch, set dx/dy to 0
                    smoothEndDuration: 300    // animate to snap/restrict endOnly if there's no inertia
                }
            },

            _holdDuration: 600
        },

        // Things related to autoScroll
        autoScroll = {
            interaction: null,
            i: null,    // the handle returned by window.setInterval
            x: 0, y: 0, // Direction each pulse is to scroll in

            // scroll the window by the values in scroll.x/y
            scroll: function () {
                var options = autoScroll.interaction.target.options[autoScroll.interaction.prepared.name].autoScroll,
                    container = options.container || getWindow(autoScroll.interaction.element),
                    now = new Date().getTime(),
                    // change in time in seconds
                    dt = (now - autoScroll.prevTime) / 1000,
                    // displacement
                    s = options.speed * dt;

                if (s >= 1) {
                    if (isWindow(container)) {
                        container.scrollBy(autoScroll.x * s, autoScroll.y * s);
                    }
                    else if (container) {
                        container.scrollLeft += autoScroll.x * s;
                        container.scrollTop  += autoScroll.y * s;
                    }

                    autoScroll.prevTime = now;
                }

                if (autoScroll.isScrolling) {
                    cancelFrame(autoScroll.i);
                    autoScroll.i = reqFrame(autoScroll.scroll);
                }
            },

            edgeMove: function (event) {
                var interaction,
                    target,
                    doAutoscroll = false;

                for (var i = 0; i < interactions.length; i++) {
                    interaction = interactions[i];

                    if (interaction.interacting()
                        && checkAutoScroll(interaction.target, interaction.prepared.name)) {

                        target = interaction.target;
                        doAutoscroll = true;
                        break;
                    }
                }

                if (!doAutoscroll) { return; }

                var top,
                    right,
                    bottom,
                    left,
                    options = target.options[interaction.prepared.name].autoScroll,
                    container = options.container || getWindow(interaction.element);

                if (isWindow(container)) {
                    left   = event.clientX < autoScroll.margin;
                    top    = event.clientY < autoScroll.margin;
                    right  = event.clientX > container.innerWidth  - autoScroll.margin;
                    bottom = event.clientY > container.innerHeight - autoScroll.margin;
                }
                else {
                    var rect = getElementRect(container);

                    left   = event.clientX < rect.left   + autoScroll.margin;
                    top    = event.clientY < rect.top    + autoScroll.margin;
                    right  = event.clientX > rect.right  - autoScroll.margin;
                    bottom = event.clientY > rect.bottom - autoScroll.margin;
                }

                autoScroll.x = (right ? 1: left? -1: 0);
                autoScroll.y = (bottom? 1:  top? -1: 0);

                if (!autoScroll.isScrolling) {
                    // set the autoScroll properties to those of the target
                    autoScroll.margin = options.margin;
                    autoScroll.speed  = options.speed;

                    autoScroll.start(interaction);
                }
            },

            isScrolling: false,
            prevTime: 0,

            start: function (interaction) {
                autoScroll.isScrolling = true;
                cancelFrame(autoScroll.i);

                autoScroll.interaction = interaction;
                autoScroll.prevTime = new Date().getTime();
                autoScroll.i = reqFrame(autoScroll.scroll);
            },

            stop: function () {
                autoScroll.isScrolling = false;
                cancelFrame(autoScroll.i);
            }
        },

        // Does the browser support touch input?
        supportsTouch = (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch),

        // Does the browser support PointerEvents
        supportsPointerEvent = !!PointerEvent,

        // Less Precision with touch input
        margin = supportsTouch || supportsPointerEvent? 20: 10,

        pointerMoveTolerance = 1,

        // for ignoring browser's simulated mouse events
        prevTouchTime = 0,

        // Allow this many interactions to happen simultaneously
        maxInteractions = Infinity,

        // Check if is IE9 or older
        actionCursors = (document.all && !window.atob) ? {
            drag    : 'move',
            resizex : 'e-resize',
            resizey : 's-resize',
            resizexy: 'se-resize',

            resizetop        : 'n-resize',
            resizeleft       : 'w-resize',
            resizebottom     : 's-resize',
            resizeright      : 'e-resize',
            resizetopleft    : 'se-resize',
            resizebottomright: 'se-resize',
            resizetopright   : 'ne-resize',
            resizebottomleft : 'ne-resize',

            gesture : ''
        } : {
            drag    : 'move',
            resizex : 'ew-resize',
            resizey : 'ns-resize',
            resizexy: 'nwse-resize',

            resizetop        : 'ns-resize',
            resizeleft       : 'ew-resize',
            resizebottom     : 'ns-resize',
            resizeright      : 'ew-resize',
            resizetopleft    : 'nwse-resize',
            resizebottomright: 'nwse-resize',
            resizetopright   : 'nesw-resize',
            resizebottomleft : 'nesw-resize',

            gesture : ''
        },

        actionIsEnabled = {
            drag   : true,
            resize : true,
            gesture: true
        },

        // because Webkit and Opera still use 'mousewheel' event type
        wheelEvent = 'onmousewheel' in document? 'mousewheel': 'wheel',

        eventTypes = [
            'dragstart',
            'dragmove',
            'draginertiastart',
            'dragend',
            'dragenter',
            'dragleave',
            'dropactivate',
            'dropdeactivate',
            'dropmove',
            'drop',
            'resizestart',
            'resizemove',
            'resizeinertiastart',
            'resizeend',
            'gesturestart',
            'gesturemove',
            'gestureinertiastart',
            'gestureend',

            'down',
            'move',
            'up',
            'cancel',
            'tap',
            'doubletap',
            'hold'
        ],

        globalEvents = {},

        // Opera Mobile must be handled differently
        isOperaMobile = navigator.appName == 'Opera' &&
            supportsTouch &&
            navigator.userAgent.match('Presto'),

        // scrolling doesn't change the result of
        // getBoundingClientRect/getClientRects on iOS <=7 but it does on iOS 8
        isIOS7orLower = (/iP(hone|od|ad)/.test(navigator.platform)
                            && /OS [1-7][^\d]/.test(navigator.appVersion)),

        // prefix matchesSelector
        prefixedMatchesSelector = 'matches' in Element.prototype?
                'matches': 'webkitMatchesSelector' in Element.prototype?
                    'webkitMatchesSelector': 'mozMatchesSelector' in Element.prototype?
                        'mozMatchesSelector': 'oMatchesSelector' in Element.prototype?
                            'oMatchesSelector': 'msMatchesSelector',

        // will be polyfill function if browser is IE8
        ie8MatchesSelector,

        // native requestAnimationFrame or polyfill
        reqFrame = realWindow.requestAnimationFrame,
        cancelFrame = realWindow.cancelAnimationFrame,

        // Events wrapper
        events = (function () {
            var useAttachEvent = ('attachEvent' in window) && !('addEventListener' in window),
                addEvent       = useAttachEvent?  'attachEvent': 'addEventListener',
                removeEvent    = useAttachEvent?  'detachEvent': 'removeEventListener',
                on             = useAttachEvent? 'on': '',

                elements          = [],
                targets           = [],
                attachedListeners = [];

            function add (element, type, listener, useCapture) {
                var elementIndex = indexOf(elements, element),
                    target = targets[elementIndex];

                if (!target) {
                    target = {
                        events: {},
                        typeCount: 0
                    };

                    elementIndex = elements.push(element) - 1;
                    targets.push(target);

                    attachedListeners.push((useAttachEvent ? {
                            supplied: [],
                            wrapped : [],
                            useCount: []
                        } : null));
                }

                if (!target.events[type]) {
                    target.events[type] = [];
                    target.typeCount++;
                }

                if (!contains(target.events[type], listener)) {
                    var ret;

                    if (useAttachEvent) {
                        var listeners = attachedListeners[elementIndex],
                            listenerIndex = indexOf(listeners.supplied, listener);

                        var wrapped = listeners.wrapped[listenerIndex] || function (event) {
                            if (!event.immediatePropagationStopped) {
                                event.target = event.srcElement;
                                event.currentTarget = element;

                                event.preventDefault = event.preventDefault || preventDef;
                                event.stopPropagation = event.stopPropagation || stopProp;
                                event.stopImmediatePropagation = event.stopImmediatePropagation || stopImmProp;

                                if (/mouse|click/.test(event.type)) {
                                    event.pageX = event.clientX + getWindow(element).document.documentElement.scrollLeft;
                                    event.pageY = event.clientY + getWindow(element).document.documentElement.scrollTop;
                                }

                                listener(event);
                            }
                        };

                        ret = element[addEvent](on + type, wrapped, Boolean(useCapture));

                        if (listenerIndex === -1) {
                            listeners.supplied.push(listener);
                            listeners.wrapped.push(wrapped);
                            listeners.useCount.push(1);
                        }
                        else {
                            listeners.useCount[listenerIndex]++;
                        }
                    }
                    else {
                        ret = element[addEvent](type, listener, useCapture || false);
                    }
                    target.events[type].push(listener);

                    return ret;
                }
            }

            function remove (element, type, listener, useCapture) {
                var i,
                    elementIndex = indexOf(elements, element),
                    target = targets[elementIndex],
                    listeners,
                    listenerIndex,
                    wrapped = listener;

                if (!target || !target.events) {
                    return;
                }

                if (useAttachEvent) {
                    listeners = attachedListeners[elementIndex];
                    listenerIndex = indexOf(listeners.supplied, listener);
                    wrapped = listeners.wrapped[listenerIndex];
                }

                if (type === 'all') {
                    for (type in target.events) {
                        if (target.events.hasOwnProperty(type)) {
                            remove(element, type, 'all');
                        }
                    }
                    return;
                }

                if (target.events[type]) {
                    var len = target.events[type].length;

                    if (listener === 'all') {
                        for (i = 0; i < len; i++) {
                            remove(element, type, target.events[type][i], Boolean(useCapture));
                        }
                    } else {
                        for (i = 0; i < len; i++) {
                            if (target.events[type][i] === listener) {
                                element[removeEvent](on + type, wrapped, useCapture || false);
                                target.events[type].splice(i, 1);

                                if (useAttachEvent && listeners) {
                                    listeners.useCount[listenerIndex]--;
                                    if (listeners.useCount[listenerIndex] === 0) {
                                        listeners.supplied.splice(listenerIndex, 1);
                                        listeners.wrapped.splice(listenerIndex, 1);
                                        listeners.useCount.splice(listenerIndex, 1);
                                    }
                                }

                                break;
                            }
                        }
                    }

                    if (target.events[type] && target.events[type].length === 0) {
                        target.events[type] = null;
                        target.typeCount--;
                    }
                }

                if (!target.typeCount) {
                    targets.splice(elementIndex);
                    elements.splice(elementIndex);
                    attachedListeners.splice(elementIndex);
                }
            }

            function preventDef () {
                this.returnValue = false;
            }

            function stopProp () {
                this.cancelBubble = true;
            }

            function stopImmProp () {
                this.cancelBubble = true;
                this.immediatePropagationStopped = true;
            }

            return {
                add: add,
                remove: remove,
                useAttachEvent: useAttachEvent,

                _elements: elements,
                _targets: targets,
                _attachedListeners: attachedListeners
            };
        }());

    function blank () {}

    function isElement (o) {
        if (!o || (typeof o !== 'object')) { return false; }

        var _window = getWindow(o) || window;

        return (/object|function/.test(typeof _window.Element)
            ? o instanceof _window.Element //DOM2
            : o.nodeType === 1 && typeof o.nodeName === "string");
    }
    function isWindow (thing) { return !!(thing && thing.Window) && (thing instanceof thing.Window); }
    function isDocFrag (thing) { return !!thing && thing instanceof DocumentFragment; }
    function isArray (thing) {
        return isObject(thing)
                && (typeof thing.length !== undefined)
                && isFunction(thing.splice);
    }
    function isObject   (thing) { return !!thing && (typeof thing === 'object'); }
    function isFunction (thing) { return typeof thing === 'function'; }
    function isNumber   (thing) { return typeof thing === 'number'  ; }
    function isBool     (thing) { return typeof thing === 'boolean' ; }
    function isString   (thing) { return typeof thing === 'string'  ; }

    function trySelector (value) {
        if (!isString(value)) { return false; }

        // an exception will be raised if it is invalid
        document.querySelector(value);
        return true;
    }

    function extend (dest, source) {
        for (var prop in source) {
            dest[prop] = source[prop];
        }
        return dest;
    }

    function copyCoords (dest, src) {
        dest.page = dest.page || {};
        dest.page.x = src.page.x;
        dest.page.y = src.page.y;

        dest.client = dest.client || {};
        dest.client.x = src.client.x;
        dest.client.y = src.client.y;

        dest.timeStamp = src.timeStamp;
    }

    function setEventXY (targetObj, pointer, interaction) {
        if (!pointer) {
            if (interaction.pointerIds.length > 1) {
                pointer = touchAverage(interaction.pointers);
            }
            else {
                pointer = interaction.pointers[0];
            }
        }

        getPageXY(pointer, tmpXY, interaction);
        targetObj.page.x = tmpXY.x;
        targetObj.page.y = tmpXY.y;

        getClientXY(pointer, tmpXY, interaction);
        targetObj.client.x = tmpXY.x;
        targetObj.client.y = tmpXY.y;

        targetObj.timeStamp = new Date().getTime();
    }

    function setEventDeltas (targetObj, prev, cur) {
        targetObj.page.x     = cur.page.x      - prev.page.x;
        targetObj.page.y     = cur.page.y      - prev.page.y;
        targetObj.client.x   = cur.client.x    - prev.client.x;
        targetObj.client.y   = cur.client.y    - prev.client.y;
        targetObj.timeStamp = new Date().getTime() - prev.timeStamp;

        // set pointer velocity
        var dt = Math.max(targetObj.timeStamp / 1000, 0.001);
        targetObj.page.speed   = hypot(targetObj.page.x, targetObj.page.y) / dt;
        targetObj.page.vx      = targetObj.page.x / dt;
        targetObj.page.vy      = targetObj.page.y / dt;

        targetObj.client.speed = hypot(targetObj.client.x, targetObj.page.y) / dt;
        targetObj.client.vx    = targetObj.client.x / dt;
        targetObj.client.vy    = targetObj.client.y / dt;
    }

    // Get specified X/Y coords for mouse or event.touches[0]
    function getXY (type, pointer, xy) {
        xy = xy || {};
        type = type || 'page';

        xy.x = pointer[type + 'X'];
        xy.y = pointer[type + 'Y'];

        return xy;
    }

    function getPageXY (pointer, page, interaction) {
        page = page || {};

        if (pointer instanceof InteractEvent) {
            if (/inertiastart/.test(pointer.type)) {
                interaction = interaction || pointer.interaction;

                extend(page, interaction.inertiaStatus.upCoords.page);

                page.x += interaction.inertiaStatus.sx;
                page.y += interaction.inertiaStatus.sy;
            }
            else {
                page.x = pointer.pageX;
                page.y = pointer.pageY;
            }
        }
        // Opera Mobile handles the viewport and scrolling oddly
        else if (isOperaMobile) {
            getXY('screen', pointer, page);

            page.x += window.scrollX;
            page.y += window.scrollY;
        }
        else {
            getXY('page', pointer, page);
        }

        return page;
    }

    function getClientXY (pointer, client, interaction) {
        client = client || {};

        if (pointer instanceof InteractEvent) {
            if (/inertiastart/.test(pointer.type)) {
                extend(client, interaction.inertiaStatus.upCoords.client);

                client.x += interaction.inertiaStatus.sx;
                client.y += interaction.inertiaStatus.sy;
            }
            else {
                client.x = pointer.clientX;
                client.y = pointer.clientY;
            }
        }
        else {
            // Opera Mobile handles the viewport and scrolling oddly
            getXY(isOperaMobile? 'screen': 'client', pointer, client);
        }

        return client;
    }

    function getScrollXY (win) {
        win = win || window;
        return {
            x: win.scrollX || win.document.documentElement.scrollLeft,
            y: win.scrollY || win.document.documentElement.scrollTop
        };
    }

    function getPointerId (pointer) {
        return isNumber(pointer.pointerId)? pointer.pointerId : pointer.identifier;
    }

    function getActualElement (element) {
        return (element instanceof SVGElementInstance
            ? element.correspondingUseElement
            : element);
    }

    function getWindow (node) {
        if (isWindow(node)) {
            return node;
        }

        var rootNode = (node.ownerDocument || node);

        return rootNode.defaultView || rootNode.parentWindow || window;
    }

    function getElementRect (element) {
        var scroll = isIOS7orLower
                ? { x: 0, y: 0 }
                : getScrollXY(getWindow(element)),
            clientRect = (element instanceof SVGElement)?
                element.getBoundingClientRect():
                element.getClientRects()[0];

        return clientRect && {
            left  : clientRect.left   + scroll.x,
            right : clientRect.right  + scroll.x,
            top   : clientRect.top    + scroll.y,
            bottom: clientRect.bottom + scroll.y,
            width : clientRect.width || clientRect.right - clientRect.left,
            height: clientRect.heigh || clientRect.bottom - clientRect.top
        };
    }

    function getTouchPair (event) {
        var touches = [];

        // array of touches is supplied
        if (isArray(event)) {
            touches[0] = event[0];
            touches[1] = event[1];
        }
        // an event
        else {
            if (event.type === 'touchend') {
                if (event.touches.length === 1) {
                    touches[0] = event.touches[0];
                    touches[1] = event.changedTouches[0];
                }
                else if (event.touches.length === 0) {
                    touches[0] = event.changedTouches[0];
                    touches[1] = event.changedTouches[1];
                }
            }
            else {
                touches[0] = event.touches[0];
                touches[1] = event.touches[1];
            }
        }

        return touches;
    }

    function touchAverage (event) {
        var touches = getTouchPair(event);

        return {
            pageX: (touches[0].pageX + touches[1].pageX) / 2,
            pageY: (touches[0].pageY + touches[1].pageY) / 2,
            clientX: (touches[0].clientX + touches[1].clientX) / 2,
            clientY: (touches[0].clientY + touches[1].clientY) / 2
        };
    }

    function touchBBox (event) {
        if (!event.length && !(event.touches && event.touches.length > 1)) {
            return;
        }

        var touches = getTouchPair(event),
            minX = Math.min(touches[0].pageX, touches[1].pageX),
            minY = Math.min(touches[0].pageY, touches[1].pageY),
            maxX = Math.max(touches[0].pageX, touches[1].pageX),
            maxY = Math.max(touches[0].pageY, touches[1].pageY);

        return {
            x: minX,
            y: minY,
            left: minX,
            top: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    function touchDistance (event, deltaSource) {
        deltaSource = deltaSource || defaultOptions.deltaSource;

        var sourceX = deltaSource + 'X',
            sourceY = deltaSource + 'Y',
            touches = getTouchPair(event);


        var dx = touches[0][sourceX] - touches[1][sourceX],
            dy = touches[0][sourceY] - touches[1][sourceY];

        return hypot(dx, dy);
    }

    function touchAngle (event, prevAngle, deltaSource) {
        deltaSource = deltaSource || defaultOptions.deltaSource;

        var sourceX = deltaSource + 'X',
            sourceY = deltaSource + 'Y',
            touches = getTouchPair(event),
            dx = touches[0][sourceX] - touches[1][sourceX],
            dy = touches[0][sourceY] - touches[1][sourceY],
            angle = 180 * Math.atan(dy / dx) / Math.PI;

        if (isNumber(prevAngle)) {
            var dr = angle - prevAngle,
                drClamped = dr % 360;

            if (drClamped > 315) {
                angle -= 360 + (angle / 360)|0 * 360;
            }
            else if (drClamped > 135) {
                angle -= 180 + (angle / 360)|0 * 360;
            }
            else if (drClamped < -315) {
                angle += 360 + (angle / 360)|0 * 360;
            }
            else if (drClamped < -135) {
                angle += 180 + (angle / 360)|0 * 360;
            }
        }

        return  angle;
    }

    function getOriginXY (interactable, element) {
        var origin = interactable
                ? interactable.options.origin
                : defaultOptions.origin;

        if (origin === 'parent') {
            origin = parentElement(element);
        }
        else if (origin === 'self') {
            origin = interactable.getRect(element);
        }
        else if (trySelector(origin)) {
            origin = closest(element, origin) || { x: 0, y: 0 };
        }

        if (isFunction(origin)) {
            origin = origin(interactable && element);
        }

        if (isElement(origin))  {
            origin = getElementRect(origin);
        }

        origin.x = ('x' in origin)? origin.x : origin.left;
        origin.y = ('y' in origin)? origin.y : origin.top;

        return origin;
    }

    // http://stackoverflow.com/a/5634528/2280888
    function _getQBezierValue(t, p1, p2, p3) {
        var iT = 1 - t;
        return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
    }

    function getQuadraticCurvePoint(startX, startY, cpX, cpY, endX, endY, position) {
        return {
            x:  _getQBezierValue(position, startX, cpX, endX),
            y:  _getQBezierValue(position, startY, cpY, endY)
        };
    }

    // http://gizma.com/easing/
    function easeOutQuad (t, b, c, d) {
        t /= d;
        return -c * t*(t-2) + b;
    }

    function nodeContains (parent, child) {
        while (child) {
            if (child === parent) {
                return true;
            }

            child = child.parentNode;
        }

        return false;
    }

    function closest (child, selector) {
        var parent = parentElement(child);

        while (isElement(parent)) {
            if (matchesSelector(parent, selector)) { return parent; }

            parent = parentElement(parent);
        }

        return null;
    }

    function parentElement (node) {
        var parent = node.parentNode;

        if (isDocFrag(parent)) {
            // skip past #shado-root fragments
            while ((parent = parent.host) && isDocFrag(parent)) {}

            return parent;
        }

        return parent;
    }

    function inContext (interactable, element) {
        return interactable._context === element.ownerDocument
                || nodeContains(interactable._context, element);
    }

    function testIgnore (interactable, interactableElement, element) {
        var ignoreFrom = interactable.options.ignoreFrom;

        if (!ignoreFrom || !isElement(element)) { return false; }

        if (isString(ignoreFrom)) {
            return matchesUpTo(element, ignoreFrom, interactableElement);
        }
        else if (isElement(ignoreFrom)) {
            return nodeContains(ignoreFrom, element);
        }

        return false;
    }

    function testAllow (interactable, interactableElement, element) {
        var allowFrom = interactable.options.allowFrom;

        if (!allowFrom) { return true; }

        if (!isElement(element)) { return false; }

        if (isString(allowFrom)) {
            return matchesUpTo(element, allowFrom, interactableElement);
        }
        else if (isElement(allowFrom)) {
            return nodeContains(allowFrom, element);
        }

        return false;
    }

    function checkAxis (axis, interactable) {
        if (!interactable) { return false; }

        var thisAxis = interactable.options.drag.axis;

        return (axis === 'xy' || thisAxis === 'xy' || thisAxis === axis);
    }

    function checkSnap (interactable, action) {
        var options = interactable.options;

        if (/^resize/.test(action)) {
            action = 'resize';
        }

        return options[action].snap && options[action].snap.enabled;
    }

    function checkRestrict (interactable, action) {
        var options = interactable.options;

        if (/^resize/.test(action)) {
            action = 'resize';
        }

        return  options[action].restrict && options[action].restrict.enabled;
    }

    function checkAutoScroll (interactable, action) {
        var options = interactable.options;

        if (/^resize/.test(action)) {
            action = 'resize';
        }

        return  options[action].autoScroll && options[action].autoScroll.enabled;
    }

    function withinInteractionLimit (interactable, element, action) {
        var options = interactable.options,
            maxActions = options[action.name].max,
            maxPerElement = options[action.name].maxPerElement,
            activeInteractions = 0,
            targetCount = 0,
            targetElementCount = 0;

        for (var i = 0, len = interactions.length; i < len; i++) {
            var interaction = interactions[i],
                otherAction = interaction.prepared.name,
                active = interaction.interacting();

            if (!active) { continue; }

            activeInteractions++;

            if (activeInteractions >= maxInteractions) {
                return false;
            }

            if (interaction.target !== interactable) { continue; }

            targetCount += (otherAction === action.name)|0;

            if (targetCount >= maxActions) {
                return false;
            }

            if (interaction.element === element) {
                targetElementCount++;

                if (otherAction !== action.name || targetElementCount >= maxPerElement) {
                    return false;
                }
            }
        }

        return maxInteractions > 0;
    }

    // Test for the element that's "above" all other qualifiers
    function indexOfDeepestElement (elements) {
        var dropzone,
            deepestZone = elements[0],
            index = deepestZone? 0: -1,
            parent,
            deepestZoneParents = [],
            dropzoneParents = [],
            child,
            i,
            n;

        for (i = 1; i < elements.length; i++) {
            dropzone = elements[i];

            // an element might belong to multiple selector dropzones
            if (!dropzone || dropzone === deepestZone) {
                continue;
            }

            if (!deepestZone) {
                deepestZone = dropzone;
                index = i;
                continue;
            }

            // check if the deepest or current are document.documentElement or document.rootElement
            // - if the current dropzone is, do nothing and continue
            if (dropzone.parentNode === dropzone.ownerDocument) {
                continue;
            }
            // - if deepest is, update with the current dropzone and continue to next
            else if (deepestZone.parentNode === dropzone.ownerDocument) {
                deepestZone = dropzone;
                index = i;
                continue;
            }

            if (!deepestZoneParents.length) {
                parent = deepestZone;
                while (parent.parentNode && parent.parentNode !== parent.ownerDocument) {
                    deepestZoneParents.unshift(parent);
                    parent = parent.parentNode;
                }
            }

            // if this element is an svg element and the current deepest is
            // an HTMLElement
            if (deepestZone instanceof HTMLElement
                && dropzone instanceof SVGElement
                && !(dropzone instanceof SVGSVGElement)) {

                if (dropzone === deepestZone.parentNode) {
                    continue;
                }

                parent = dropzone.ownerSVGElement;
            }
            else {
                parent = dropzone;
            }

            dropzoneParents = [];

            while (parent.parentNode !== parent.ownerDocument) {
                dropzoneParents.unshift(parent);
                parent = parent.parentNode;
            }

            n = 0;

            // get (position of last common ancestor) + 1
            while (dropzoneParents[n] && dropzoneParents[n] === deepestZoneParents[n]) {
                n++;
            }

            var parents = [
                dropzoneParents[n - 1],
                dropzoneParents[n],
                deepestZoneParents[n]
            ];

            child = parents[0].lastChild;

            while (child) {
                if (child === parents[1]) {
                    deepestZone = dropzone;
                    index = i;
                    deepestZoneParents = [];

                    break;
                }
                else if (child === parents[2]) {
                    break;
                }

                child = child.previousSibling;
            }
        }

        return index;
    }

    function Interaction () {
        this.target          = null; // current interactable being interacted with
        this.element         = null; // the target element of the interactable
        this.dropTarget      = null; // the dropzone a drag target might be dropped into
        this.dropElement     = null; // the element at the time of checking
        this.prevDropTarget  = null; // the dropzone that was recently dragged away from
        this.prevDropElement = null; // the element at the time of checking

        this.prepared        = {     // action that's ready to be fired on next move event
            name : null,
            axis : null,
            edges: null
        };

        this.matches         = [];   // all selectors that are matched by target element
        this.matchElements   = [];   // corresponding elements

        this.inertiaStatus = {
            active       : false,
            smoothEnd    : false,

            startEvent: null,
            upCoords: {},

            xe: 0, ye: 0,
            sx: 0, sy: 0,

            t0: 0,
            vx0: 0, vys: 0,
            duration: 0,

            resumeDx: 0,
            resumeDy: 0,

            lambda_v0: 0,
            one_ve_v0: 0,
            i  : null
        };

        if (isFunction(Function.prototype.bind)) {
            this.boundInertiaFrame = this.inertiaFrame.bind(this);
            this.boundSmoothEndFrame = this.smoothEndFrame.bind(this);
        }
        else {
            var that = this;

            this.boundInertiaFrame = function () { return that.inertiaFrame(); };
            this.boundSmoothEndFrame = function () { return that.smoothEndFrame(); };
        }

        this.activeDrops = {
            dropzones: [],      // the dropzones that are mentioned below
            elements : [],      // elements of dropzones that accept the target draggable
            rects    : []       // the rects of the elements mentioned above
        };

        // keep track of added pointers
        this.pointers    = [];
        this.pointerIds  = [];
        this.downTargets = [];
        this.downTimes   = [];
        this.holdTimers  = [];

        // Previous native pointer move event coordinates
        this.prevCoords = {
            page     : { x: 0, y: 0 },
            client   : { x: 0, y: 0 },
            timeStamp: 0
        };
        // current native pointer move event coordinates
        this.curCoords = {
            page     : { x: 0, y: 0 },
            client   : { x: 0, y: 0 },
            timeStamp: 0
        };

        // Starting InteractEvent pointer coordinates
        this.startCoords = {
            page     : { x: 0, y: 0 },
            client   : { x: 0, y: 0 },
            timeStamp: 0
        };

        // Change in coordinates and time of the pointer
        this.pointerDelta = {
            page     : { x: 0, y: 0, vx: 0, vy: 0, speed: 0 },
            client   : { x: 0, y: 0, vx: 0, vy: 0, speed: 0 },
            timeStamp: 0
        };

        this.downEvent   = null;    // pointerdown/mousedown/touchstart event
        this.downPointer = {};

        this._eventTarget    = null;
        this._curEventTarget = null;

        this.prevEvent = null;      // previous action event
        this.tapTime   = 0;         // time of the most recent tap event
        this.prevTap   = null;

        this.startOffset    = { left: 0, right: 0, top: 0, bottom: 0 };
        this.restrictOffset = { left: 0, right: 0, top: 0, bottom: 0 };
        this.snapOffsets    = [];

        this.gesture = {
            start: { x: 0, y: 0 },

            startDistance: 0,   // distance between two touches of touchStart
            prevDistance : 0,
            distance     : 0,

            scale: 1,           // gesture.distance / gesture.startDistance

            startAngle: 0,      // angle of line joining two touches
            prevAngle : 0       // angle of the previous gesture event
        };

        this.snapStatus = {
            x       : 0, y       : 0,
            dx      : 0, dy      : 0,
            realX   : 0, realY   : 0,
            snappedX: 0, snappedY: 0,
            targets : [],
            locked  : false,
            changed : false
        };

        this.restrictStatus = {
            dx         : 0, dy         : 0,
            restrictedX: 0, restrictedY: 0,
            snap       : null,
            restricted : false,
            changed    : false
        };

        this.restrictStatus.snap = this.snapStatus;

        this.pointerIsDown   = false;
        this.pointerWasMoved = false;
        this.gesturing       = false;
        this.dragging        = false;
        this.resizing        = false;
        this.resizeAxes      = 'xy';

        this.mouse = false;

        interactions.push(this);
    }

    Interaction.prototype = {
        getPageXY  : function (pointer, xy) { return   getPageXY(pointer, xy, this); },
        getClientXY: function (pointer, xy) { return getClientXY(pointer, xy, this); },
        setEventXY : function (target, ptr) { return  setEventXY(target, ptr, this); },

        pointerOver: function (pointer, event, eventTarget) {
            if (this.prepared.name || !this.mouse) { return; }

            var curMatches = [],
                curMatchElements = [],
                prevTargetElement = this.element;

            this.addPointer(pointer);

            if (this.target
                && (testIgnore(this.target, this.element, eventTarget)
                    || !testAllow(this.target, this.element, eventTarget))) {
                // if the eventTarget should be ignored or shouldn't be allowed
                // clear the previous target
                this.target = null;
                this.element = null;
                this.matches = [];
                this.matchElements = [];
            }

            var elementInteractable = interactables.get(eventTarget),
                elementAction = (elementInteractable
                                 && !testIgnore(elementInteractable, eventTarget, eventTarget)
                                 && testAllow(elementInteractable, eventTarget, eventTarget)
                                 && validateAction(
                                     elementInteractable.getAction(pointer, this, eventTarget),
                                     elementInteractable));

            if (elementAction && !withinInteractionLimit(elementInteractable, eventTarget, elementAction)) {
                 elementAction = null;
            }

            function pushCurMatches (interactable, selector) {
                if (interactable
                    && inContext(interactable, eventTarget)
                    && !testIgnore(interactable, eventTarget, eventTarget)
                    && testAllow(interactable, eventTarget, eventTarget)
                    && matchesSelector(eventTarget, selector)) {

                    curMatches.push(interactable);
                    curMatchElements.push(eventTarget);
                }
            }

            if (elementAction) {
                this.target = elementInteractable;
                this.element = eventTarget;
                this.matches = [];
                this.matchElements = [];
            }
            else {
                interactables.forEachSelector(pushCurMatches);

                if (this.validateSelector(pointer, curMatches, curMatchElements)) {
                    this.matches = curMatches;
                    this.matchElements = curMatchElements;

                    this.pointerHover(pointer, event, this.matches, this.matchElements);
                    events.add(eventTarget,
                                        PointerEvent? pEventTypes.move : 'mousemove',
                                        listeners.pointerHover);
                }
                else if (this.target) {
                    if (nodeContains(prevTargetElement, eventTarget)) {
                        this.pointerHover(pointer, event, this.matches, this.matchElements);
                        events.add(this.element,
                                            PointerEvent? pEventTypes.move : 'mousemove',
                                            listeners.pointerHover);
                    }
                    else {
                        this.target = null;
                        this.element = null;
                        this.matches = [];
                        this.matchElements = [];
                    }
                }
            }
        },

        // Check what action would be performed on pointerMove target if a mouse
        // button were pressed and change the cursor accordingly
        pointerHover: function (pointer, event, eventTarget, curEventTarget, matches, matchElements) {
            var target = this.target;

            if (!this.prepared.name && this.mouse) {

                var action;

                // update pointer coords for defaultActionChecker to use
                this.setEventXY(this.curCoords, pointer);

                if (matches) {
                    action = this.validateSelector(pointer, matches, matchElements);
                }
                else if (target) {
                    action = validateAction(target.getAction(this.pointers[0], this, this.element), this.target);
                }

                if (target && target.options.styleCursor) {
                    if (action) {
                        target._doc.documentElement.style.cursor = getActionCursor(action);
                    }
                    else {
                        target._doc.documentElement.style.cursor = '';
                    }
                }
            }
            else if (this.prepared.name) {
                this.checkAndPreventDefault(event, target, this.element);
            }
        },

        pointerOut: function (pointer, event, eventTarget) {
            if (this.prepared.name) { return; }

            // Remove temporary event listeners for selector Interactables
            if (!interactables.get(eventTarget)) {
                events.remove(eventTarget,
                                       PointerEvent? pEventTypes.move : 'mousemove',
                                       listeners.pointerHover);
            }

            if (this.target && this.target.options.styleCursor && !this.interacting()) {
                this.target._doc.documentElement.style.cursor = '';
            }
        },

        selectorDown: function (pointer, event, eventTarget, curEventTarget) {
            var that = this,
                // copy event to be used in timeout for IE8
                eventCopy = events.useAttachEvent? extend({}, event) : event,
                element = eventTarget,
                pointerIndex = this.addPointer(pointer),
                action;

            this.holdTimers[pointerIndex] = setTimeout(function () {
                that.pointerHold(events.useAttachEvent? eventCopy : pointer, eventCopy, eventTarget, curEventTarget);
            }, defaultOptions._holdDuration);

            this.pointerIsDown = true;

            // Check if the down event hits the current inertia target
            if (this.inertiaStatus.active && this.target.selector) {
                // climb up the DOM tree from the event target
                while (isElement(element)) {

                    // if this element is the current inertia target element
                    if (element === this.element
                        // and the prospective action is the same as the ongoing one
                        && validateAction(this.target.getAction(pointer, this, this.element), this.target).name === this.prepared.name) {

                        // stop inertia so that the next move will be a normal one
                        cancelFrame(this.inertiaStatus.i);
                        this.inertiaStatus.active = false;

                        this.collectEventTargets(pointer, event, eventTarget, 'down');
                        return;
                    }
                    element = parentElement(element);
                }
            }

            // do nothing if interacting
            if (this.interacting()) {
                this.collectEventTargets(pointer, event, eventTarget, 'down');
                return;
            }

            function pushMatches (interactable, selector, context) {
                var elements = ie8MatchesSelector
                    ? context.querySelectorAll(selector)
                    : undefined;

                if (inContext(interactable, element)
                    && !testIgnore(interactable, element, eventTarget)
                    && testAllow(interactable, element, eventTarget)
                    && matchesSelector(element, selector, elements)) {

                    that.matches.push(interactable);
                    that.matchElements.push(element);
                }
            }

            // update pointer coords for defaultActionChecker to use
            this.setEventXY(this.curCoords, pointer);

            while (isElement(element) && !action) {
                this.matches = [];
                this.matchElements = [];

                interactables.forEachSelector(pushMatches);

                action = this.validateSelector(pointer, this.matches, this.matchElements);
                element = parentElement(element);
            }

            if (action) {
                this.prepared.name  = action.name;
                this.prepared.axis  = action.axis;
                this.prepared.edges = action.edges;

                this.collectEventTargets(pointer, event, eventTarget, 'down');

                return this.pointerDown(pointer, event, eventTarget, curEventTarget, action);
            }
            else {
                // do these now since pointerDown isn't being called from here
                this.downTimes[pointerIndex] = new Date().getTime();
                this.downTargets[pointerIndex] = eventTarget;
                this.downEvent = event;
                extend(this.downPointer, pointer);

                copyCoords(this.prevCoords, this.curCoords);
                this.pointerWasMoved = false;
            }

            this.collectEventTargets(pointer, event, eventTarget, 'down');
        },

        // Determine action to be performed on next pointerMove and add appropriate
        // style and event Listeners
        pointerDown: function (pointer, event, eventTarget, curEventTarget, forceAction) {
            if (!forceAction && !this.inertiaStatus.active && this.pointerWasMoved && this.prepared.name) {
                this.checkAndPreventDefault(event, this.target, this.element);

                return;
            }

            this.pointerIsDown = true;

            var pointerIndex = this.addPointer(pointer),
                action;

            // If it is the second touch of a multi-touch gesture, keep the target
            // the same if a target was set by the first touch
            // Otherwise, set the target if there is no action prepared
            if ((this.pointerIds.length < 2 && !this.target) || !this.prepared.name) {

                var interactable = interactables.get(curEventTarget);

                if (interactable
                    && !testIgnore(interactable, curEventTarget, eventTarget)
                    && testAllow(interactable, curEventTarget, eventTarget)
                    && (action = validateAction(forceAction || interactable.getAction(pointer, this, curEventTarget), interactable, eventTarget))
                    && withinInteractionLimit(interactable, curEventTarget, action)) {
                    this.target = interactable;
                    this.element = curEventTarget;
                }
            }

            var target = this.target,
                options = target && target.options;

            if (target && !this.interacting()) {
                action = action || validateAction(forceAction || target.getAction(pointer, this, curEventTarget), target, this.element);

                this.setEventXY(this.startCoords);

                if (!action) { return; }

                if (options.styleCursor) {
                    target._doc.documentElement.style.cursor = getActionCursor(action);
                }

                this.resizeAxes = action.name === 'resize'? action.axis : null;

                if (action === 'gesture' && this.pointerIds.length < 2) {
                    action = null;
                }

                this.prepared.name  = action.name;
                this.prepared.axis  = action.axis;
                this.prepared.edges = action.edges;

                this.snapStatus.snappedX = this.snapStatus.snappedY =
                    this.restrictStatus.restrictedX = this.restrictStatus.restrictedY = NaN;

                this.downTimes[pointerIndex] = new Date().getTime();
                this.downTargets[pointerIndex] = eventTarget;
                this.downEvent = event;
                extend(this.downPointer, pointer);

                this.setEventXY(this.prevCoords);
                this.pointerWasMoved = false;

                this.checkAndPreventDefault(event, target, this.element);
            }
            // if inertia is active try to resume action
            else if (this.inertiaStatus.active
                && curEventTarget === this.element
                && validateAction(target.getAction(pointer, this, this.element), target).name === this.prepared.name) {

                cancelFrame(this.inertiaStatus.i);
                this.inertiaStatus.active = false;

                this.checkAndPreventDefault(event, target, this.element);
            }
        },

        setModifications: function (coords, preEnd) {
            var target         = this.target,
                shouldMove     = true,
                shouldSnap     = checkSnap(target, this.prepared.name)     && (!target.options[this.prepared.name].snap.endOnly     || preEnd),
                shouldRestrict = checkRestrict(target, this.prepared.name) && (!target.options[this.prepared.name].restrict.endOnly || preEnd);

            if (shouldSnap    ) { this.setSnapping   (coords); } else { this.snapStatus    .locked     = false; }
            if (shouldRestrict) { this.setRestriction(coords); } else { this.restrictStatus.restricted = false; }

            if (shouldSnap && this.snapStatus.locked && !this.snapStatus.changed) {
                shouldMove = shouldRestrict && this.restrictStatus.restricted && this.restrictStatus.changed;
            }
            else if (shouldRestrict && this.restrictStatus.restricted && !this.restrictStatus.changed) {
                shouldMove = false;
            }

            return shouldMove;
        },

        setStartOffsets: function (action, interactable, element) {
            var rect = interactable.getRect(element),
                origin = getOriginXY(interactable, element),
                snap = interactable.options[this.prepared.name].snap,
                restrict = interactable.options[this.prepared.name].restrict,
                width, height;

            if (rect) {
                this.startOffset.left = this.startCoords.page.x - rect.left;
                this.startOffset.top  = this.startCoords.page.y - rect.top;

                this.startOffset.right  = rect.right  - this.startCoords.page.x;
                this.startOffset.bottom = rect.bottom - this.startCoords.page.y;

                if ('width' in rect) { width = rect.width; }
                else { width = rect.right - rect.left; }
                if ('height' in rect) { height = rect.height; }
                else { height = rect.bottom - rect.top; }
            }
            else {
                this.startOffset.left = this.startOffset.top = this.startOffset.right = this.startOffset.bottom = 0;
            }

            this.snapOffsets.splice(0);

            var snapOffset = snap && snap.offset === 'startCoords'
                                ? {
                                    x: this.startCoords.page.x - origin.x,
                                    y: this.startCoords.page.y - origin.y
                                }
                                : snap && snap.offset || { x: 0, y: 0 };

            if (rect && snap && snap.relativePoints && snap.relativePoints.length) {
                for (var i = 0; i < snap.relativePoints.length; i++) {
                    this.snapOffsets.push({
                        x: this.startOffset.left - (width  * snap.relativePoints[i].x) + snapOffset.x,
                        y: this.startOffset.top  - (height * snap.relativePoints[i].y) + snapOffset.y
                    });
                }
            }
            else {
                this.snapOffsets.push(snapOffset);
            }

            if (rect && restrict.elementRect) {
                this.restrictOffset.left = this.startOffset.left - (width  * restrict.elementRect.left);
                this.restrictOffset.top  = this.startOffset.top  - (height * restrict.elementRect.top);

                this.restrictOffset.right  = this.startOffset.right  - (width  * (1 - restrict.elementRect.right));
                this.restrictOffset.bottom = this.startOffset.bottom - (height * (1 - restrict.elementRect.bottom));
            }
            else {
                this.restrictOffset.left = this.restrictOffset.top = this.restrictOffset.right = this.restrictOffset.bottom = 0;
            }
        },

        /*\
         * Interaction.start
         [ method ]
         *
         * Start an action with the given Interactable and Element as tartgets. The
         * action must be enabled for the target Interactable and an appropriate number
         * of pointers must be held down – 1 for drag/resize, 2 for gesture.
         *
         * Use it with `interactable.<action>able({ manualStart: false })` to always
         * [start actions manually](https://github.com/taye/interact.js/issues/114)
         *
         - action       (object)  The action to be performed - drag, resize, etc.
         - interactable (Interactable) The Interactable to target
         - element      (Element) The DOM Element to target
         = (object) interact
         **
         | interact(target)
         |   .draggable({
         |     // disable the default drag start by down->move
         |     manualStart: true
         |   })
         |   // start dragging after the user holds the pointer down
         |   .on('hold', function (event) {
         |     var interaction = event.interaction;
         |
         |     if (!interaction.interacting()) {
         |       interaction.start({ name: 'drag' },
         |                         event.interactable,
         |                         event.currentTarget);
         |     }
         | });
        \*/
        start: function (action, interactable, element) {
            if (this.interacting()
                || !this.pointerIsDown
                || this.pointerIds.length < (action.name === 'gesture'? 2 : 1)) {
                return;
            }

            // if this interaction had been removed after stopping
            // add it back
            if (indexOf(interactions, this) === -1) {
                interactions.push(this);
            }

            this.prepared.name  = action.name;
            this.prepared.axis  = action.axis;
            this.prepared.edges = action.edges;
            this.target         = interactable;
            this.element        = element;

            this.setStartOffsets(action.name, interactable, element);
            this.setModifications(this.startCoords.page);

            this.prevEvent = this[this.prepared.name + 'Start'](this.downEvent);
        },

        pointerMove: function (pointer, event, eventTarget, curEventTarget, preEnd) {
            this.recordPointer(pointer);

            this.setEventXY(this.curCoords, (pointer instanceof InteractEvent)
                                                ? this.inertiaStatus.startEvent
                                                : undefined);

            var duplicateMove = (this.curCoords.page.x === this.prevCoords.page.x
                                 && this.curCoords.page.y === this.prevCoords.page.y
                                 && this.curCoords.client.x === this.prevCoords.client.x
                                 && this.curCoords.client.y === this.prevCoords.client.y);

            var dx, dy,
                pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer));

            // register movement greater than pointerMoveTolerance
            if (this.pointerIsDown && !this.pointerWasMoved) {
                dx = this.curCoords.client.x - this.startCoords.client.x;
                dy = this.curCoords.client.y - this.startCoords.client.y;

                this.pointerWasMoved = hypot(dx, dy) > pointerMoveTolerance;
            }

            if (!duplicateMove && (!this.pointerIsDown || this.pointerWasMoved)) {
                if (this.pointerIsDown) {
                    clearTimeout(this.holdTimers[pointerIndex]);
                }

                this.collectEventTargets(pointer, event, eventTarget, 'move');
            }

            if (!this.pointerIsDown) { return; }

            if (duplicateMove && this.pointerWasMoved && !preEnd) {
                this.checkAndPreventDefault(event, this.target, this.element);
                return;
            }

            // set pointer coordinate, time changes and speeds
            setEventDeltas(this.pointerDelta, this.prevCoords, this.curCoords);

            if (!this.prepared.name) { return; }

            if (this.pointerWasMoved
                // ignore movement while inertia is active
                && (!this.inertiaStatus.active || (pointer instanceof InteractEvent && /inertiastart/.test(pointer.type)))) {

                // if just starting an action, calculate the pointer speed now
                if (!this.interacting()) {
                    setEventDeltas(this.pointerDelta, this.prevCoords, this.curCoords);

                    // check if a drag is in the correct axis
                    if (this.prepared.name === 'drag') {
                        var absX = Math.abs(dx),
                            absY = Math.abs(dy),
                            targetAxis = this.target.options.drag.axis,
                            axis = (absX > absY ? 'x' : absX < absY ? 'y' : 'xy');

                        // if the movement isn't in the axis of the interactable
                        if (axis !== 'xy' && targetAxis !== 'xy' && targetAxis !== axis) {
                            // cancel the prepared action
                            this.prepared.name = null;

                            // then try to get a drag from another ineractable

                            var element = eventTarget;

                            // check element interactables
                            while (isElement(element)) {
                                var elementInteractable = interactables.get(element);

                                if (elementInteractable
                                    && elementInteractable !== this.target
                                    && !elementInteractable.options.drag.manualStart
                                    && elementInteractable.getAction(this.downPointer, this, element).name === 'drag'
                                    && checkAxis(axis, elementInteractable)) {

                                    this.prepared.name = 'drag';
                                    this.target = elementInteractable;
                                    this.element = element;
                                    break;
                                }

                                element = parentElement(element);
                            }

                            // if there's no drag from element interactables,
                            // check the selector interactables
                            if (!this.prepared.name) {
                                var getDraggable = function (interactable, selector, context) {
                                    var elements = ie8MatchesSelector
                                        ? context.querySelectorAll(selector)
                                        : undefined;

                                    if (interactable === this.target) { return; }

                                    if (inContext(interactable, eventTarget)
                                        && !interactable.options.drag.manualStart
                                        && !testIgnore(interactable, element, eventTarget)
                                        && testAllow(interactable, element, eventTarget)
                                        && matchesSelector(element, selector, elements)
                                        && interactable.getAction(this.downPointer, this, element).name === 'drag'
                                        && checkAxis(axis, interactable)
                                        && withinInteractionLimit(interactable, element, 'drag')) {

                                        return interactable;
                                    }
                                };

                                element = eventTarget;

                                while (isElement(element)) {
                                    var selectorInteractable = interactables.forEachSelector(getDraggable);

                                    if (selectorInteractable) {
                                        this.prepared.name = 'drag';
                                        this.target = selectorInteractable;
                                        this.element = element;
                                        break;
                                    }

                                    element = parentElement(element);
                                }
                            }
                        }
                    }
                }

                var starting = !!this.prepared.name && !this.interacting();

                if (starting
                    && (this.target.options[this.prepared.name].manualStart
                        || !withinInteractionLimit(this.target, this.element, this.prepared))) {
                    this.stop();
                    return;
                }

                if (this.prepared.name && this.target) {
                    if (starting) {
                        this.start(this.prepared, this.target, this.element);
                    }

                    var shouldMove = this.setModifications(this.curCoords.page, preEnd);

                    // move if snapping or restriction doesn't prevent it
                    if (shouldMove || starting) {
                        this.prevEvent = this[this.prepared.name + 'Move'](event);
                    }

                    this.checkAndPreventDefault(event, this.target, this.element);
                }
            }

            copyCoords(this.prevCoords, this.curCoords);

            if (this.dragging || this.resizing) {
                autoScroll.edgeMove(event);
            }
        },

        dragStart: function (event) {
            var dragEvent = new InteractEvent(this, event, 'drag', 'start', this.element);

            this.dragging = true;
            this.target.fire(dragEvent);

            // reset active dropzones
            this.activeDrops.dropzones = [];
            this.activeDrops.elements  = [];
            this.activeDrops.rects     = [];

            if (!this.dynamicDrop) {
                this.setActiveDrops(this.element);
            }

            var dropEvents = this.getDropEvents(event, dragEvent);

            if (dropEvents.activate) {
                this.fireActiveDrops(dropEvents.activate);
            }

            return dragEvent;
        },

        dragMove: function (event) {
            var target = this.target,
                dragEvent  = new InteractEvent(this, event, 'drag', 'move', this.element),
                draggableElement = this.element,
                drop = this.getDrop(dragEvent, draggableElement);

            this.dropTarget = drop.dropzone;
            this.dropElement = drop.element;

            var dropEvents = this.getDropEvents(event, dragEvent);

            target.fire(dragEvent);

            if (dropEvents.leave) { this.prevDropTarget.fire(dropEvents.leave); }
            if (dropEvents.enter) {     this.dropTarget.fire(dropEvents.enter); }
            if (dropEvents.move ) {     this.dropTarget.fire(dropEvents.move ); }

            this.prevDropTarget  = this.dropTarget;
            this.prevDropElement = this.dropElement;

            return dragEvent;
        },

        resizeStart: function (event) {
            var resizeEvent = new InteractEvent(this, event, 'resize', 'start', this.element);

            if (this.prepared.edges) {
                var startRect = this.target.getRect(this.element);

                if (this.target.options.resize.square) {
                    var squareEdges = extend({}, this.prepared.edges);

                    squareEdges.top    = squareEdges.top    || (squareEdges.left   && !squareEdges.bottom);
                    squareEdges.left   = squareEdges.left   || (squareEdges.top    && !squareEdges.right );
                    squareEdges.bottom = squareEdges.bottom || (squareEdges.right  && !squareEdges.top   );
                    squareEdges.right  = squareEdges.right  || (squareEdges.bottom && !squareEdges.left  );

                    this.prepared._squareEdges = squareEdges;
                }
                else {
                    this.prepared._squareEdges = null;
                }

                this.resizeRects = {
                    start     : startRect,
                    current   : extend({}, startRect),
                    restricted: extend({}, startRect),
                    previous  : extend({}, startRect),
                    delta     : {
                        left: 0, right : 0, width : 0,
                        top : 0, bottom: 0, height: 0
                    }
                };

                resizeEvent.rect = this.resizeRects.restricted;
                resizeEvent.deltaRect = this.resizeRects.delta;
            }

            this.target.fire(resizeEvent);

            this.resizing = true;

            return resizeEvent;
        },

        resizeMove: function (event) {
            var resizeEvent = new InteractEvent(this, event, 'resize', 'move', this.element);

            var edges = this.prepared.edges,
                invert = this.target.options.resize.invert,
                invertible = invert === 'reposition' || invert === 'negate';

            if (edges) {
                var dx = resizeEvent.dx,
                    dy = resizeEvent.dy,

                    start      = this.resizeRects.start,
                    current    = this.resizeRects.current,
                    restricted = this.resizeRects.restricted,
                    delta      = this.resizeRects.delta,
                    previous   = extend(this.resizeRects.previous, restricted);

                if (this.target.options.resize.square) {
                    var originalEdges = edges;

                    edges = this.prepared._squareEdges;

                    if ((originalEdges.left && originalEdges.bottom)
                        || (originalEdges.right && originalEdges.top)) {
                        dy = -dx;
                    }
                    else if (originalEdges.left || originalEdges.right) { dy = dx; }
                    else if (originalEdges.top || originalEdges.bottom) { dx = dy; }
                }

                // update the 'current' rect without modifications
                if (edges.top   ) { current.top    += dy; }
                if (edges.bottom) { current.bottom += dy; }
                if (edges.left  ) { current.left   += dx; }
                if (edges.right ) { current.right  += dx; }

                if (invertible) {
                    // if invertible, copy the current rect
                    extend(restricted, current);

                    if (invert === 'reposition') {
                        // swap edge values if necessary to keep width/height positive
                        var swap;

                        if (restricted.top > restricted.bottom) {
                            swap = restricted.top;

                            restricted.top = restricted.bottom;
                            restricted.bottom = swap;
                        }
                        if (restricted.left > restricted.right) {
                            swap = restricted.left;

                            restricted.left = restricted.right;
                            restricted.right = swap;
                        }
                    }
                }
                else {
                    // if not invertible, restrict to minimum of 0x0 rect
                    restricted.top    = Math.min(current.top, start.bottom);
                    restricted.bottom = Math.max(current.bottom, start.top);
                    restricted.left   = Math.min(current.left, start.right);
                    restricted.right  = Math.max(current.right, start.left);
                }

                restricted.width  = restricted.right  - restricted.left;
                restricted.height = restricted.bottom - restricted.top ;

                for (var edge in restricted) {
                    delta[edge] = restricted[edge] - previous[edge];
                }

                resizeEvent.edges = this.prepared.edges;
                resizeEvent.rect = restricted;
                resizeEvent.deltaRect = delta;
            }

            this.target.fire(resizeEvent);

            return resizeEvent;
        },

        gestureStart: function (event) {
            var gestureEvent = new InteractEvent(this, event, 'gesture', 'start', this.element);

            gestureEvent.ds = 0;

            this.gesture.startDistance = this.gesture.prevDistance = gestureEvent.distance;
            this.gesture.startAngle = this.gesture.prevAngle = gestureEvent.angle;
            this.gesture.scale = 1;

            this.gesturing = true;

            this.target.fire(gestureEvent);

            return gestureEvent;
        },

        gestureMove: function (event) {
            if (!this.pointerIds.length) {
                return this.prevEvent;
            }

            var gestureEvent;

            gestureEvent = new InteractEvent(this, event, 'gesture', 'move', this.element);
            gestureEvent.ds = gestureEvent.scale - this.gesture.scale;

            this.target.fire(gestureEvent);

            this.gesture.prevAngle = gestureEvent.angle;
            this.gesture.prevDistance = gestureEvent.distance;

            if (gestureEvent.scale !== Infinity &&
                gestureEvent.scale !== null &&
                gestureEvent.scale !== undefined  &&
                !isNaN(gestureEvent.scale)) {

                this.gesture.scale = gestureEvent.scale;
            }

            return gestureEvent;
        },

        pointerHold: function (pointer, event, eventTarget) {
            this.collectEventTargets(pointer, event, eventTarget, 'hold');
        },

        pointerUp: function (pointer, event, eventTarget, curEventTarget) {
            var pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer));

            clearTimeout(this.holdTimers[pointerIndex]);

            this.collectEventTargets(pointer, event, eventTarget, 'up' );
            this.collectEventTargets(pointer, event, eventTarget, 'tap');

            this.pointerEnd(pointer, event, eventTarget, curEventTarget);

            this.removePointer(pointer);
        },

        pointerCancel: function (pointer, event, eventTarget, curEventTarget) {
            var pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer));

            clearTimeout(this.holdTimers[pointerIndex]);

            this.collectEventTargets(pointer, event, eventTarget, 'cancel');
            this.pointerEnd(pointer, event, eventTarget, curEventTarget);

            this.removePointer(pointer);
        },

        // http://www.quirksmode.org/dom/events/click.html
        // >Events leading to dblclick
        //
        // IE8 doesn't fire down event before dblclick.
        // This workaround tries to fire a tap and doubletap after dblclick
        ie8Dblclick: function (pointer, event, eventTarget) {
            if (this.prevTap
                && event.clientX === this.prevTap.clientX
                && event.clientY === this.prevTap.clientY
                && eventTarget   === this.prevTap.target) {

                this.downTargets[0] = eventTarget;
                this.downTimes[0] = new Date().getTime();
                this.collectEventTargets(pointer, event, eventTarget, 'tap');
            }
        },

        // End interact move events and stop auto-scroll unless inertia is enabled
        pointerEnd: function (pointer, event, eventTarget, curEventTarget) {
            var endEvent,
                target = this.target,
                options = target && target.options,
                inertiaOptions = options && this.prepared.name && options[this.prepared.name].inertia,
                inertiaStatus = this.inertiaStatus;

            if (this.interacting()) {

                if (inertiaStatus.active) { return; }

                var pointerSpeed,
                    now = new Date().getTime(),
                    inertiaPossible = false,
                    inertia = false,
                    smoothEnd = false,
                    endSnap = checkSnap(target, this.prepared.name) && options[this.prepared.name].snap.endOnly,
                    endRestrict = checkRestrict(target, this.prepared.name) && options[this.prepared.name].restrict.endOnly,
                    dx = 0,
                    dy = 0,
                    startEvent;

                if (this.dragging) {
                    if      (options.drag.axis === 'x' ) { pointerSpeed = Math.abs(this.pointerDelta.client.vx); }
                    else if (options.drag.axis === 'y' ) { pointerSpeed = Math.abs(this.pointerDelta.client.vy); }
                    else   /*options.drag.axis === 'xy'*/{ pointerSpeed = this.pointerDelta.client.speed; }
                }
                else {
                    pointerSpeed = this.pointerDelta.client.speed;
                }

                // check if inertia should be started
                inertiaPossible = (inertiaOptions && inertiaOptions.enabled
                                   && this.prepared.name !== 'gesture'
                                   && event !== inertiaStatus.startEvent);

                inertia = (inertiaPossible
                           && (now - this.curCoords.timeStamp) < 50
                           && pointerSpeed > inertiaOptions.minSpeed
                           && pointerSpeed > inertiaOptions.endSpeed);

                if (inertiaPossible && !inertia && (endSnap || endRestrict)) {

                    var snapRestrict = {};

                    snapRestrict.snap = snapRestrict.restrict = snapRestrict;

                    if (endSnap) {
                        this.setSnapping(this.curCoords.page, snapRestrict);
                        if (snapRestrict.locked) {
                            dx += snapRestrict.dx;
                            dy += snapRestrict.dy;
                        }
                    }

                    if (endRestrict) {
                        this.setRestriction(this.curCoords.page, snapRestrict);
                        if (snapRestrict.restricted) {
                            dx += snapRestrict.dx;
                            dy += snapRestrict.dy;
                        }
                    }

                    if (dx || dy) {
                        smoothEnd = true;
                    }
                }

                if (inertia || smoothEnd) {
                    copyCoords(inertiaStatus.upCoords, this.curCoords);

                    this.pointers[0] = inertiaStatus.startEvent = startEvent =
                        new InteractEvent(this, event, this.prepared.name, 'inertiastart', this.element);

                    inertiaStatus.t0 = now;

                    target.fire(inertiaStatus.startEvent);

                    if (inertia) {
                        inertiaStatus.vx0 = this.pointerDelta.client.vx;
                        inertiaStatus.vy0 = this.pointerDelta.client.vy;
                        inertiaStatus.v0 = pointerSpeed;

                        this.calcInertia(inertiaStatus);

                        var page = extend({}, this.curCoords.page),
                            origin = getOriginXY(target, this.element),
                            statusObject;

                        page.x = page.x + inertiaStatus.xe - origin.x;
                        page.y = page.y + inertiaStatus.ye - origin.y;

                        statusObject = {
                            useStatusXY: true,
                            x: page.x,
                            y: page.y,
                            dx: 0,
                            dy: 0,
                            snap: null
                        };

                        statusObject.snap = statusObject;

                        dx = dy = 0;

                        if (endSnap) {
                            var snap = this.setSnapping(this.curCoords.page, statusObject);

                            if (snap.locked) {
                                dx += snap.dx;
                                dy += snap.dy;
                            }
                        }

                        if (endRestrict) {
                            var restrict = this.setRestriction(this.curCoords.page, statusObject);

                            if (restrict.restricted) {
                                dx += restrict.dx;
                                dy += restrict.dy;
                            }
                        }

                        inertiaStatus.modifiedXe += dx;
                        inertiaStatus.modifiedYe += dy;

                        inertiaStatus.i = reqFrame(this.boundInertiaFrame);
                    }
                    else {
                        inertiaStatus.smoothEnd = true;
                        inertiaStatus.xe = dx;
                        inertiaStatus.ye = dy;

                        inertiaStatus.sx = inertiaStatus.sy = 0;

                        inertiaStatus.i = reqFrame(this.boundSmoothEndFrame);
                    }

                    inertiaStatus.active = true;
                    return;
                }

                if (endSnap || endRestrict) {
                    // fire a move event at the snapped coordinates
                    this.pointerMove(pointer, event, eventTarget, curEventTarget, true);
                }
            }

            if (this.dragging) {
                endEvent = new InteractEvent(this, event, 'drag', 'end', this.element);

                var draggableElement = this.element,
                    drop = this.getDrop(endEvent, draggableElement);

                this.dropTarget = drop.dropzone;
                this.dropElement = drop.element;

                var dropEvents = this.getDropEvents(event, endEvent);

                if (dropEvents.leave) { this.prevDropTarget.fire(dropEvents.leave); }
                if (dropEvents.enter) {     this.dropTarget.fire(dropEvents.enter); }
                if (dropEvents.drop ) {     this.dropTarget.fire(dropEvents.drop ); }
                if (dropEvents.deactivate) {
                    this.fireActiveDrops(dropEvents.deactivate);
                }

                target.fire(endEvent);
            }
            else if (this.resizing) {
                endEvent = new InteractEvent(this, event, 'resize', 'end', this.element);
                target.fire(endEvent);
            }
            else if (this.gesturing) {
                endEvent = new InteractEvent(this, event, 'gesture', 'end', this.element);
                target.fire(endEvent);
            }

            this.stop(event);
        },

        collectDrops: function (element) {
            var drops = [],
                elements = [],
                i;

            element = element || this.element;

            // collect all dropzones and their elements which qualify for a drop
            for (i = 0; i < interactables.length; i++) {
                if (!interactables[i].options.drop.enabled) { continue; }

                var current = interactables[i],
                    accept = current.options.drop.accept;

                // test the draggable element against the dropzone's accept setting
                if ((isElement(accept) && accept !== element)
                    || (isString(accept)
                        && !matchesSelector(element, accept))) {

                    continue;
                }

                // query for new elements if necessary
                var dropElements = current.selector? current._context.querySelectorAll(current.selector) : [current._element];

                for (var j = 0, len = dropElements.length; j < len; j++) {
                    var currentElement = dropElements[j];

                    if (currentElement === element) {
                        continue;
                    }

                    drops.push(current);
                    elements.push(currentElement);
                }
            }

            return {
                dropzones: drops,
                elements: elements
            };
        },

        fireActiveDrops: function (event) {
            var i,
                current,
                currentElement,
                prevElement;

            // loop through all active dropzones and trigger event
            for (i = 0; i < this.activeDrops.dropzones.length; i++) {
                current = this.activeDrops.dropzones[i];
                currentElement = this.activeDrops.elements [i];

                // prevent trigger of duplicate events on same element
                if (currentElement !== prevElement) {
                    // set current element as event target
                    event.target = currentElement;
                    current.fire(event);
                }
                prevElement = currentElement;
            }
        },

        // Collect a new set of possible drops and save them in activeDrops.
        // setActiveDrops should always be called when a drag has just started or a
        // drag event happens while dynamicDrop is true
        setActiveDrops: function (dragElement) {
            // get dropzones and their elements that could receive the draggable
            var possibleDrops = this.collectDrops(dragElement, true);

            this.activeDrops.dropzones = possibleDrops.dropzones;
            this.activeDrops.elements  = possibleDrops.elements;
            this.activeDrops.rects     = [];

            for (var i = 0; i < this.activeDrops.dropzones.length; i++) {
                this.activeDrops.rects[i] = this.activeDrops.dropzones[i].getRect(this.activeDrops.elements[i]);
            }
        },

        getDrop: function (event, dragElement) {
            var validDrops = [];

            if (dynamicDrop) {
                this.setActiveDrops(dragElement);
            }

            // collect all dropzones and their elements which qualify for a drop
            for (var j = 0; j < this.activeDrops.dropzones.length; j++) {
                var current        = this.activeDrops.dropzones[j],
                    currentElement = this.activeDrops.elements [j],
                    rect           = this.activeDrops.rects    [j];

                validDrops.push(current.dropCheck(this.pointers[0], this.target, dragElement, currentElement, rect)
                                ? currentElement
                                : null);
            }

            // get the most appropriate dropzone based on DOM depth and order
            var dropIndex = indexOfDeepestElement(validDrops),
                dropzone  = this.activeDrops.dropzones[dropIndex] || null,
                element   = this.activeDrops.elements [dropIndex] || null;

            return {
                dropzone: dropzone,
                element: element
            };
        },

        getDropEvents: function (pointerEvent, dragEvent) {
            var dropEvents = {
                enter     : null,
                leave     : null,
                activate  : null,
                deactivate: null,
                move      : null,
                drop      : null
            };

            if (this.dropElement !== this.prevDropElement) {
                // if there was a prevDropTarget, create a dragleave event
                if (this.prevDropTarget) {
                    dropEvents.leave = {
                        target       : this.prevDropElement,
                        dropzone     : this.prevDropTarget,
                        relatedTarget: dragEvent.target,
                        draggable    : dragEvent.interactable,
                        dragEvent    : dragEvent,
                        interaction  : this,
                        timeStamp    : dragEvent.timeStamp,
                        type         : 'dragleave'
                    };

                    dragEvent.dragLeave = this.prevDropElement;
                    dragEvent.prevDropzone = this.prevDropTarget;
                }
                // if the dropTarget is not null, create a dragenter event
                if (this.dropTarget) {
                    dropEvents.enter = {
                        target       : this.dropElement,
                        dropzone     : this.dropTarget,
                        relatedTarget: dragEvent.target,
                        draggable    : dragEvent.interactable,
                        dragEvent    : dragEvent,
                        interaction  : this,
                        timeStamp    : dragEvent.timeStamp,
                        type         : 'dragenter'
                    };

                    dragEvent.dragEnter = this.dropElement;
                    dragEvent.dropzone = this.dropTarget;
                }
            }

            if (dragEvent.type === 'dragend' && this.dropTarget) {
                dropEvents.drop = {
                    target       : this.dropElement,
                    dropzone     : this.dropTarget,
                    relatedTarget: dragEvent.target,
                    draggable    : dragEvent.interactable,
                    dragEvent    : dragEvent,
                    interaction  : this,
                    timeStamp    : dragEvent.timeStamp,
                    type         : 'drop'
                };
            }
            if (dragEvent.type === 'dragstart') {
                dropEvents.activate = {
                    target       : null,
                    dropzone     : null,
                    relatedTarget: dragEvent.target,
                    draggable    : dragEvent.interactable,
                    dragEvent    : dragEvent,
                    interaction  : this,
                    timeStamp    : dragEvent.timeStamp,
                    type         : 'dropactivate'
                };
            }
            if (dragEvent.type === 'dragend') {
                dropEvents.deactivate = {
                    target       : null,
                    dropzone     : null,
                    relatedTarget: dragEvent.target,
                    draggable    : dragEvent.interactable,
                    dragEvent    : dragEvent,
                    interaction  : this,
                    timeStamp    : dragEvent.timeStamp,
                    type         : 'dropdeactivate'
                };
            }
            if (dragEvent.type === 'dragmove' && this.dropTarget) {
                dropEvents.move = {
                    target       : this.dropElement,
                    dropzone     : this.dropTarget,
                    relatedTarget: dragEvent.target,
                    draggable    : dragEvent.interactable,
                    dragEvent    : dragEvent,
                    interaction  : this,
                    dragmove     : dragEvent,
                    timeStamp    : dragEvent.timeStamp,
                    type         : 'dropmove'
                };
                dragEvent.dropzone = this.dropTarget;
            }

            return dropEvents;
        },

        currentAction: function () {
            return (this.dragging && 'drag') || (this.resizing && 'resize') || (this.gesturing && 'gesture') || null;
        },

        interacting: function () {
            return this.dragging || this.resizing || this.gesturing;
        },

        clearTargets: function () {
            if (this.target && !this.target.selector) {
                this.target = this.element = null;
            }

            this.dropTarget = this.dropElement = this.prevDropTarget = this.prevDropElement = null;
        },

        stop: function (event) {
            if (this.interacting()) {
                autoScroll.stop();
                this.matches = [];
                this.matchElements = [];

                var target = this.target;

                if (target.options.styleCursor) {
                    target._doc.documentElement.style.cursor = '';
                }

                // prevent Default only if were previously interacting
                if (event && isFunction(event.preventDefault)) {
                    this.checkAndPreventDefault(event, target, this.element);
                }

                if (this.dragging) {
                    this.activeDrops.dropzones = this.activeDrops.elements = this.activeDrops.rects = null;
                }

                this.clearTargets();
            }

            this.pointerIsDown = this.snapStatus.locked = this.dragging = this.resizing = this.gesturing = false;
            this.prepared.name = this.prevEvent = null;
            this.inertiaStatus.resumeDx = this.inertiaStatus.resumeDy = 0;

            // remove pointers if their ID isn't in this.pointerIds
            for (var i = 0; i < this.pointers.length; i++) {
                if (indexOf(this.pointerIds, getPointerId(this.pointers[i])) === -1) {
                    this.pointers.splice(i, 1);
                }
            }

            // delete interaction if it's not the only one
            if (interactions.length > 1) {
                interactions.splice(indexOf(interactions, this), 1);
            }
        },

        inertiaFrame: function () {
            var inertiaStatus = this.inertiaStatus,
                options = this.target.options[this.prepared.name].inertia,
                lambda = options.resistance,
                t = new Date().getTime() / 1000 - inertiaStatus.t0;

            if (t < inertiaStatus.te) {

                var progress =  1 - (Math.exp(-lambda * t) - inertiaStatus.lambda_v0) / inertiaStatus.one_ve_v0;

                if (inertiaStatus.modifiedXe === inertiaStatus.xe && inertiaStatus.modifiedYe === inertiaStatus.ye) {
                    inertiaStatus.sx = inertiaStatus.xe * progress;
                    inertiaStatus.sy = inertiaStatus.ye * progress;
                }
                else {
                    var quadPoint = getQuadraticCurvePoint(
                            0, 0,
                            inertiaStatus.xe, inertiaStatus.ye,
                            inertiaStatus.modifiedXe, inertiaStatus.modifiedYe,
                            progress);

                    inertiaStatus.sx = quadPoint.x;
                    inertiaStatus.sy = quadPoint.y;
                }

                this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);

                inertiaStatus.i = reqFrame(this.boundInertiaFrame);
            }
            else {
                inertiaStatus.sx = inertiaStatus.modifiedXe;
                inertiaStatus.sy = inertiaStatus.modifiedYe;

                this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);

                inertiaStatus.active = false;
                this.pointerEnd(inertiaStatus.startEvent, inertiaStatus.startEvent);
            }
        },

        smoothEndFrame: function () {
            var inertiaStatus = this.inertiaStatus,
                t = new Date().getTime() - inertiaStatus.t0,
                duration = this.target.options[this.prepared.name].inertia.smoothEndDuration;

            if (t < duration) {
                inertiaStatus.sx = easeOutQuad(t, 0, inertiaStatus.xe, duration);
                inertiaStatus.sy = easeOutQuad(t, 0, inertiaStatus.ye, duration);

                this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);

                inertiaStatus.i = reqFrame(this.boundSmoothEndFrame);
            }
            else {
                inertiaStatus.sx = inertiaStatus.xe;
                inertiaStatus.sy = inertiaStatus.ye;

                this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);

                inertiaStatus.active = false;
                inertiaStatus.smoothEnd = false;

                this.pointerEnd(inertiaStatus.startEvent, inertiaStatus.startEvent);
            }
        },

        addPointer: function (pointer) {
            var id = getPointerId(pointer),
                index = this.mouse? 0 : indexOf(this.pointerIds, id);

            if (index === -1) {
                index = this.pointerIds.length;
            }

            this.pointerIds[index] = id;
            this.pointers[index] = pointer;

            return index;
        },

        removePointer: function (pointer) {
            var id = getPointerId(pointer),
                index = this.mouse? 0 : indexOf(this.pointerIds, id);

            if (index === -1) { return; }

            if (!this.interacting()) {
                this.pointers.splice(index, 1);
            }

            this.pointerIds .splice(index, 1);
            this.downTargets.splice(index, 1);
            this.downTimes  .splice(index, 1);
            this.holdTimers .splice(index, 1);
        },

        recordPointer: function (pointer) {
            // Do not update pointers while inertia is active.
            // The inertia start event should be this.pointers[0]
            if (this.inertiaStatus.active) { return; }

            var index = this.mouse? 0: indexOf(this.pointerIds, getPointerId(pointer));

            if (index === -1) { return; }

            this.pointers[index] = pointer;
        },

        collectEventTargets: function (pointer, event, eventTarget, eventType) {
            var pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer));

            // do not fire a tap event if the pointer was moved before being lifted
            if (eventType === 'tap' && (this.pointerWasMoved
                // or if the pointerup target is different to the pointerdown target
                || !(this.downTargets[pointerIndex] && this.downTargets[pointerIndex] === eventTarget))) {
                return;
            }

            var targets = [],
                elements = [],
                element = eventTarget;

            function collectSelectors (interactable, selector, context) {
                var els = ie8MatchesSelector
                        ? context.querySelectorAll(selector)
                        : undefined;

                if (interactable._iEvents[eventType]
                    && isElement(element)
                    && inContext(interactable, element)
                    && !testIgnore(interactable, element, eventTarget)
                    && testAllow(interactable, element, eventTarget)
                    && matchesSelector(element, selector, els)) {

                    targets.push(interactable);
                    elements.push(element);
                }
            }

            while (element) {
                if (interact.isSet(element) && interact(element)._iEvents[eventType]) {
                    targets.push(interact(element));
                    elements.push(element);
                }

                interactables.forEachSelector(collectSelectors);

                element = parentElement(element);
            }

            // create the tap event even if there are no listeners so that
            // doubletap can still be created and fired
            if (targets.length || eventType === 'tap') {
                this.firePointers(pointer, event, eventTarget, targets, elements, eventType);
            }
        },

        firePointers: function (pointer, event, eventTarget, targets, elements, eventType) {
            var pointerIndex = this.mouse? 0 : indexOf(getPointerId(pointer)),
                pointerEvent = {},
                i,
                // for tap events
                interval, createNewDoubleTap;

            // if it's a doubletap then the event properties would have been
            // copied from the tap event and provided as the pointer argument
            if (eventType === 'doubletap') {
                pointerEvent = pointer;
            }
            else {
                extend(pointerEvent, event);
                if (event !== pointer) {
                    extend(pointerEvent, pointer);
                }

                pointerEvent.preventDefault           = preventOriginalDefault;
                pointerEvent.stopPropagation          = InteractEvent.prototype.stopPropagation;
                pointerEvent.stopImmediatePropagation = InteractEvent.prototype.stopImmediatePropagation;
                pointerEvent.interaction              = this;

                pointerEvent.timeStamp     = new Date().getTime();
                pointerEvent.originalEvent = event;
                pointerEvent.type          = eventType;
                pointerEvent.pointerId     = getPointerId(pointer);
                pointerEvent.pointerType   = this.mouse? 'mouse' : !supportsPointerEvent? 'touch'
                                                    : isString(pointer.pointerType)
                                                        ? pointer.pointerType
                                                        : [,,'touch', 'pen', 'mouse'][pointer.pointerType];
            }

            if (eventType === 'tap') {
                pointerEvent.dt = pointerEvent.timeStamp - this.downTimes[pointerIndex];

                interval = pointerEvent.timeStamp - this.tapTime;
                createNewDoubleTap = !!(this.prevTap && this.prevTap.type !== 'doubletap'
                       && this.prevTap.target === pointerEvent.target
                       && interval < 500);

                pointerEvent.double = createNewDoubleTap;

                this.tapTime = pointerEvent.timeStamp;
            }

            for (i = 0; i < targets.length; i++) {
                pointerEvent.currentTarget = elements[i];
                pointerEvent.interactable = targets[i];
                targets[i].fire(pointerEvent);

                if (pointerEvent.immediatePropagationStopped
                    ||(pointerEvent.propagationStopped && elements[i + 1] !== pointerEvent.currentTarget)) {
                    break;
                }
            }

            if (createNewDoubleTap) {
                var doubleTap = {};

                extend(doubleTap, pointerEvent);

                doubleTap.dt   = interval;
                doubleTap.type = 'doubletap';

                this.collectEventTargets(doubleTap, event, eventTarget, 'doubletap');

                this.prevTap = doubleTap;
            }
            else if (eventType === 'tap') {
                this.prevTap = pointerEvent;
            }
        },

        validateSelector: function (pointer, matches, matchElements) {
            for (var i = 0, len = matches.length; i < len; i++) {
                var match = matches[i],
                    matchElement = matchElements[i],
                    action = validateAction(match.getAction(pointer, this, matchElement), match);

                if (action && withinInteractionLimit(match, matchElement, action)) {
                    this.target = match;
                    this.element = matchElement;

                    return action;
                }
            }
        },

        setSnapping: function (pageCoords, status) {
            var snap = this.target.options[this.prepared.name].snap,
                targets = [],
                target,
                page,
                i;

            status = status || this.snapStatus;

            if (status.useStatusXY) {
                page = { x: status.x, y: status.y };
            }
            else {
                var origin = getOriginXY(this.target, this.element);

                page = extend({}, pageCoords);

                page.x -= origin.x;
                page.y -= origin.y;
            }

            status.realX = page.x;
            status.realY = page.y;

            page.x = page.x - this.inertiaStatus.resumeDx;
            page.y = page.y - this.inertiaStatus.resumeDy;

            var len = snap.targets? snap.targets.length : 0;

            for (var relIndex = 0; relIndex < this.snapOffsets.length; relIndex++) {
                var relative = {
                    x: page.x - this.snapOffsets[relIndex].x,
                    y: page.y - this.snapOffsets[relIndex].y
                };

                for (i = 0; i < len; i++) {
                    if (isFunction(snap.targets[i])) {
                        target = snap.targets[i](relative.x, relative.y, this);
                    }
                    else {
                        target = snap.targets[i];
                    }

                    if (!target) { continue; }

                    targets.push({
                        x: isNumber(target.x) ? (target.x + this.snapOffsets[relIndex].x) : relative.x,
                        y: isNumber(target.y) ? (target.y + this.snapOffsets[relIndex].y) : relative.y,

                        range: isNumber(target.range)? target.range: snap.range
                    });
                }
            }

            var closest = {
                    target: null,
                    inRange: false,
                    distance: 0,
                    range: 0,
                    dx: 0,
                    dy: 0
                };

            for (i = 0, len = targets.length; i < len; i++) {
                target = targets[i];

                var range = target.range,
                    dx = target.x - page.x,
                    dy = target.y - page.y,
                    distance = hypot(dx, dy),
                    inRange = distance <= range;

                // Infinite targets count as being out of range
                // compared to non infinite ones that are in range
                if (range === Infinity && closest.inRange && closest.range !== Infinity) {
                    inRange = false;
                }

                if (!closest.target || (inRange
                    // is the closest target in range?
                    ? (closest.inRange && range !== Infinity
                        // the pointer is relatively deeper in this target
                        ? distance / range < closest.distance / closest.range
                        // this target has Infinite range and the closest doesn't
                        : (range === Infinity && closest.range !== Infinity)
                            // OR this target is closer that the previous closest
                            || distance < closest.distance)
                    // The other is not in range and the pointer is closer to this target
                    : (!closest.inRange && distance < closest.distance))) {

                    if (range === Infinity) {
                        inRange = true;
                    }

                    closest.target = target;
                    closest.distance = distance;
                    closest.range = range;
                    closest.inRange = inRange;
                    closest.dx = dx;
                    closest.dy = dy;

                    status.range = range;
                }
            }

            var snapChanged;

            if (closest.target) {
                snapChanged = (status.snappedX !== closest.target.x || status.snappedY !== closest.target.y);

                status.snappedX = closest.target.x;
                status.snappedY = closest.target.y;
            }
            else {
                snapChanged = true;

                status.snappedX = NaN;
                status.snappedY = NaN;
            }

            status.dx = closest.dx;
            status.dy = closest.dy;

            status.changed = (snapChanged || (closest.inRange && !status.locked));
            status.locked = closest.inRange;

            return status;
        },

        setRestriction: function (pageCoords, status) {
            var target = this.target,
                restrict = target && target.options[this.prepared.name].restrict,
                restriction = restrict && restrict.restriction,
                page;

            if (!restriction) {
                return status;
            }

            status = status || this.restrictStatus;

            page = status.useStatusXY
                    ? page = { x: status.x, y: status.y }
                    : page = extend({}, pageCoords);

            if (status.snap && status.snap.locked) {
                page.x += status.snap.dx || 0;
                page.y += status.snap.dy || 0;
            }

            page.x -= this.inertiaStatus.resumeDx;
            page.y -= this.inertiaStatus.resumeDy;

            status.dx = 0;
            status.dy = 0;
            status.restricted = false;

            var rect, restrictedX, restrictedY;

            if (isString(restriction)) {
                if (restriction === 'parent') {
                    restriction = parentElement(this.element);
                }
                else if (restriction === 'self') {
                    restriction = target.getRect(this.element);
                }
                else {
                    restriction = closest(this.element, restriction);
                }

                if (!restriction) { return status; }
            }

            if (isFunction(restriction)) {
                restriction = restriction(page.x, page.y, this.element);
            }

            if (isElement(restriction)) {
                restriction = getElementRect(restriction);
            }

            rect = restriction;

            if (!restriction) {
                restrictedX = page.x;
                restrictedY = page.y;
            }
            // object is assumed to have
            // x, y, width, height or
            // left, top, right, bottom
            else if ('x' in restriction && 'y' in restriction) {
                restrictedX = Math.max(Math.min(rect.x + rect.width  - this.restrictOffset.right , page.x), rect.x + this.restrictOffset.left);
                restrictedY = Math.max(Math.min(rect.y + rect.height - this.restrictOffset.bottom, page.y), rect.y + this.restrictOffset.top );
            }
            else {
                restrictedX = Math.max(Math.min(rect.right  - this.restrictOffset.right , page.x), rect.left + this.restrictOffset.left);
                restrictedY = Math.max(Math.min(rect.bottom - this.restrictOffset.bottom, page.y), rect.top  + this.restrictOffset.top );
            }

            status.dx = restrictedX - page.x;
            status.dy = restrictedY - page.y;

            status.changed = status.restrictedX !== restrictedX || status.restrictedY !== restrictedY;
            status.restricted = !!(status.dx || status.dy);

            status.restrictedX = restrictedX;
            status.restrictedY = restrictedY;

            return status;
        },

        checkAndPreventDefault: function (event, interactable, element) {
            if (!(interactable = interactable || this.target)) { return; }

            var options = interactable.options,
                prevent = options.preventDefault;

            if (prevent === 'auto' && element && !/^input$|^textarea$/i.test(element.nodeName)) {
                // do not preventDefault on pointerdown if the prepared action is a drag
                // and dragging can only start from a certain direction - this allows
                // a touch to pan the viewport if a drag isn't in the right direction
                if (/down|start/i.test(event.type)
                    && this.prepared.name === 'drag' && options.drag.axis !== 'xy') {

                    return;
                }

                // with manualStart, only preventDefault while interacting
                if (options[this.prepared.name] && options[this.prepared.name].manualStart
                    && !this.interacting()) {
                    return;
                }

                event.preventDefault();
                return;
            }

            if (prevent === 'always') {
                event.preventDefault();
                return;
            }
        },

        calcInertia: function (status) {
            var inertiaOptions = this.target.options[this.prepared.name].inertia,
                lambda = inertiaOptions.resistance,
                inertiaDur = -Math.log(inertiaOptions.endSpeed / status.v0) / lambda;

            status.x0 = this.prevEvent.pageX;
            status.y0 = this.prevEvent.pageY;
            status.t0 = status.startEvent.timeStamp / 1000;
            status.sx = status.sy = 0;

            status.modifiedXe = status.xe = (status.vx0 - inertiaDur) / lambda;
            status.modifiedYe = status.ye = (status.vy0 - inertiaDur) / lambda;
            status.te = inertiaDur;

            status.lambda_v0 = lambda / status.v0;
            status.one_ve_v0 = 1 - inertiaOptions.endSpeed / status.v0;
        },

        _updateEventTargets: function (target, currentTarget) {
            this._eventTarget    = target;
            this._curEventTarget = currentTarget;
        }

    };

    function getInteractionFromPointer (pointer, eventType, eventTarget) {
        var i = 0, len = interactions.length,
            mouseEvent = (/mouse/i.test(pointer.pointerType || eventType)
                          // MSPointerEvent.MSPOINTER_TYPE_MOUSE
                          || pointer.pointerType === 4),
            interaction;

        var id = getPointerId(pointer);

        // try to resume inertia with a new pointer
        if (/down|start/i.test(eventType)) {
            for (i = 0; i < len; i++) {
                interaction = interactions[i];

                var element = eventTarget;

                if (interaction.inertiaStatus.active && interaction.target.options[interaction.prepared.name].inertia.allowResume
                    && (interaction.mouse === mouseEvent)) {
                    while (element) {
                        // if the element is the interaction element
                        if (element === interaction.element) {
                            // update the interaction's pointer
                            if (interaction.pointers[0]) {
                                interaction.removePointer(interaction.pointers[0]);
                            }
                            interaction.addPointer(pointer);

                            return interaction;
                        }
                        element = parentElement(element);
                    }
                }
            }
        }

        // if it's a mouse interaction
        if (mouseEvent || !(supportsTouch || supportsPointerEvent)) {

            // find a mouse interaction that's not in inertia phase
            for (i = 0; i < len; i++) {
                if (interactions[i].mouse && !interactions[i].inertiaStatus.active) {
                    return interactions[i];
                }
            }

            // find any interaction specifically for mouse.
            // if the eventType is a mousedown, and inertia is active
            // ignore the interaction
            for (i = 0; i < len; i++) {
                if (interactions[i].mouse && !(/down/.test(eventType) && interactions[i].inertiaStatus.active)) {
                    return interaction;
                }
            }

            // create a new interaction for mouse
            interaction = new Interaction();
            interaction.mouse = true;

            return interaction;
        }

        // get interaction that has this pointer
        for (i = 0; i < len; i++) {
            if (contains(interactions[i].pointerIds, id)) {
                return interactions[i];
            }
        }

        // at this stage, a pointerUp should not return an interaction
        if (/up|end|out/i.test(eventType)) {
            return null;
        }

        // get first idle interaction
        for (i = 0; i < len; i++) {
            interaction = interactions[i];

            if ((!interaction.prepared.name || (interaction.target.options.gesture.enabled))
                && !interaction.interacting()
                && !(!mouseEvent && interaction.mouse)) {

                interaction.addPointer(pointer);

                return interaction;
            }
        }

        return new Interaction();
    }

    function doOnInteractions (method) {
        return (function (event) {
            var interaction,
                eventTarget = getActualElement(event.path
                                               ? event.path[0]
                                               : event.target),
                curEventTarget = getActualElement(event.currentTarget),
                i;

            if (supportsTouch && /touch/.test(event.type)) {
                prevTouchTime = new Date().getTime();

                for (i = 0; i < event.changedTouches.length; i++) {
                    var pointer = event.changedTouches[i];

                    interaction = getInteractionFromPointer(pointer, event.type, eventTarget);

                    if (!interaction) { continue; }

                    interaction._updateEventTargets(eventTarget, curEventTarget);

                    interaction[method](pointer, event, eventTarget, curEventTarget);
                }
            }
            else {
                if (!supportsPointerEvent && /mouse/.test(event.type)) {
                    // ignore mouse events while touch interactions are active
                    for (i = 0; i < interactions.length; i++) {
                        if (!interactions[i].mouse && interactions[i].pointerIsDown) {
                            return;
                        }
                    }

                    // try to ignore mouse events that are simulated by the browser
                    // after a touch event
                    if (new Date().getTime() - prevTouchTime < 500) {
                        return;
                    }
                }

                interaction = getInteractionFromPointer(event, event.type, eventTarget);

                if (!interaction) { return; }

                interaction._updateEventTargets(eventTarget, curEventTarget);

                interaction[method](event, event, eventTarget, curEventTarget);
            }
        });
    }

    function InteractEvent (interaction, event, action, phase, element, related) {
        var client,
            page,
            target      = interaction.target,
            snapStatus  = interaction.snapStatus,
            restrictStatus  = interaction.restrictStatus,
            pointers    = interaction.pointers,
            deltaSource = (target && target.options || defaultOptions).deltaSource,
            sourceX     = deltaSource + 'X',
            sourceY     = deltaSource + 'Y',
            options     = target? target.options: defaultOptions,
            origin      = getOriginXY(target, element),
            starting    = phase === 'start',
            ending      = phase === 'end',
            coords      = starting? interaction.startCoords : interaction.curCoords;

        element = element || interaction.element;

        page   = extend({}, coords.page);
        client = extend({}, coords.client);

        page.x -= origin.x;
        page.y -= origin.y;

        client.x -= origin.x;
        client.y -= origin.y;

        var relativePoints = options[action].snap && options[action].snap.relativePoints ;

        if (checkSnap(target, action) && !(starting && relativePoints && relativePoints.length)) {
            this.snap = {
                range  : snapStatus.range,
                locked : snapStatus.locked,
                x      : snapStatus.snappedX,
                y      : snapStatus.snappedY,
                realX  : snapStatus.realX,
                realY  : snapStatus.realY,
                dx     : snapStatus.dx,
                dy     : snapStatus.dy
            };

            if (snapStatus.locked) {
                page.x += snapStatus.dx;
                page.y += snapStatus.dy;
                client.x += snapStatus.dx;
                client.y += snapStatus.dy;
            }
        }

        if (checkRestrict(target, action) && !(starting && options[action].restrict.elementRect) && restrictStatus.restricted) {
            page.x += restrictStatus.dx;
            page.y += restrictStatus.dy;
            client.x += restrictStatus.dx;
            client.y += restrictStatus.dy;

            this.restrict = {
                dx: restrictStatus.dx,
                dy: restrictStatus.dy
            };
        }

        this.pageX     = page.x;
        this.pageY     = page.y;
        this.clientX   = client.x;
        this.clientY   = client.y;

        this.x0        = interaction.startCoords.page.x;
        this.y0        = interaction.startCoords.page.y;
        this.clientX0  = interaction.startCoords.client.x;
        this.clientY0  = interaction.startCoords.client.y;
        this.ctrlKey   = event.ctrlKey;
        this.altKey    = event.altKey;
        this.shiftKey  = event.shiftKey;
        this.metaKey   = event.metaKey;
        this.button    = event.button;
        this.target    = element;
        this.t0        = interaction.downTimes[0];
        this.type      = action + (phase || '');

        this.interaction = interaction;
        this.interactable = target;

        var inertiaStatus = interaction.inertiaStatus;

        if (inertiaStatus.active) {
            this.detail = 'inertia';
        }

        if (related) {
            this.relatedTarget = related;
        }

        // end event dx, dy is difference between start and end points
        if (ending) {
            if (deltaSource === 'client') {
                this.dx = client.x - interaction.startCoords.client.x;
                this.dy = client.y - interaction.startCoords.client.y;
            }
            else {
                this.dx = page.x - interaction.startCoords.page.x;
                this.dy = page.y - interaction.startCoords.page.y;
            }
        }
        else if (starting) {
            this.dx = 0;
            this.dy = 0;
        }
        // copy properties from previousmove if starting inertia
        else if (phase === 'inertiastart') {
            this.dx = interaction.prevEvent.dx;
            this.dy = interaction.prevEvent.dy;
        }
        else {
            if (deltaSource === 'client') {
                this.dx = client.x - interaction.prevEvent.clientX;
                this.dy = client.y - interaction.prevEvent.clientY;
            }
            else {
                this.dx = page.x - interaction.prevEvent.pageX;
                this.dy = page.y - interaction.prevEvent.pageY;
            }
        }
        if (interaction.prevEvent && interaction.prevEvent.detail === 'inertia'
            && !inertiaStatus.active
            && options[action].inertia && options[action].inertia.zeroResumeDelta) {

            inertiaStatus.resumeDx += this.dx;
            inertiaStatus.resumeDy += this.dy;

            this.dx = this.dy = 0;
        }

        if (action === 'resize' && interaction.resizeAxes) {
            if (options.resize.square) {
                if (interaction.resizeAxes === 'y') {
                    this.dx = this.dy;
                }
                else {
                    this.dy = this.dx;
                }
                this.axes = 'xy';
            }
            else {
                this.axes = interaction.resizeAxes;

                if (interaction.resizeAxes === 'x') {
                    this.dy = 0;
                }
                else if (interaction.resizeAxes === 'y') {
                    this.dx = 0;
                }
            }
        }
        else if (action === 'gesture') {
            this.touches = [pointers[0], pointers[1]];

            if (starting) {
                this.distance = touchDistance(pointers, deltaSource);
                this.box      = touchBBox(pointers);
                this.scale    = 1;
                this.ds       = 0;
                this.angle    = touchAngle(pointers, undefined, deltaSource);
                this.da       = 0;
            }
            else if (ending || event instanceof InteractEvent) {
                this.distance = interaction.prevEvent.distance;
                this.box      = interaction.prevEvent.box;
                this.scale    = interaction.prevEvent.scale;
                this.ds       = this.scale - 1;
                this.angle    = interaction.prevEvent.angle;
                this.da       = this.angle - interaction.gesture.startAngle;
            }
            else {
                this.distance = touchDistance(pointers, deltaSource);
                this.box      = touchBBox(pointers);
                this.scale    = this.distance / interaction.gesture.startDistance;
                this.angle    = touchAngle(pointers, interaction.gesture.prevAngle, deltaSource);

                this.ds = this.scale - interaction.gesture.prevScale;
                this.da = this.angle - interaction.gesture.prevAngle;
            }
        }

        if (starting) {
            this.timeStamp = interaction.downTimes[0];
            this.dt        = 0;
            this.duration  = 0;
            this.speed     = 0;
            this.velocityX = 0;
            this.velocityY = 0;
        }
        else if (phase === 'inertiastart') {
            this.timeStamp = interaction.prevEvent.timeStamp;
            this.dt        = interaction.prevEvent.dt;
            this.duration  = interaction.prevEvent.duration;
            this.speed     = interaction.prevEvent.speed;
            this.velocityX = interaction.prevEvent.velocityX;
            this.velocityY = interaction.prevEvent.velocityY;
        }
        else {
            this.timeStamp = new Date().getTime();
            this.dt        = this.timeStamp - interaction.prevEvent.timeStamp;
            this.duration  = this.timeStamp - interaction.downTimes[0];

            if (event instanceof InteractEvent) {
                var dx = this[sourceX] - interaction.prevEvent[sourceX],
                    dy = this[sourceY] - interaction.prevEvent[sourceY],
                    dt = this.dt / 1000;

                this.speed = hypot(dx, dy) / dt;
                this.velocityX = dx / dt;
                this.velocityY = dy / dt;
            }
            // if normal move or end event, use previous user event coords
            else {
                // speed and velocity in pixels per second
                this.speed = interaction.pointerDelta[deltaSource].speed;
                this.velocityX = interaction.pointerDelta[deltaSource].vx;
                this.velocityY = interaction.pointerDelta[deltaSource].vy;
            }
        }

        if ((ending || phase === 'inertiastart')
            && interaction.prevEvent.speed > 600 && this.timeStamp - interaction.prevEvent.timeStamp < 150) {

            var angle = 180 * Math.atan2(interaction.prevEvent.velocityY, interaction.prevEvent.velocityX) / Math.PI,
                overlap = 22.5;

            if (angle < 0) {
                angle += 360;
            }

            var left = 135 - overlap <= angle && angle < 225 + overlap,
                up   = 225 - overlap <= angle && angle < 315 + overlap,

                right = !left && (315 - overlap <= angle || angle <  45 + overlap),
                down  = !up   &&   45 - overlap <= angle && angle < 135 + overlap;

            this.swipe = {
                up   : up,
                down : down,
                left : left,
                right: right,
                angle: angle,
                speed: interaction.prevEvent.speed,
                velocity: {
                    x: interaction.prevEvent.velocityX,
                    y: interaction.prevEvent.velocityY
                }
            };
        }
    }

    InteractEvent.prototype = {
        preventDefault: blank,
        stopImmediatePropagation: function () {
            this.immediatePropagationStopped = this.propagationStopped = true;
        },
        stopPropagation: function () {
            this.propagationStopped = true;
        }
    };

    function preventOriginalDefault () {
        this.originalEvent.preventDefault();
    }

    function getActionCursor (action) {
        var cursor = '';

        if (action.name === 'drag') {
            cursor =  actionCursors.drag;
        }
        if (action.name === 'resize') {
            if (action.axis) {
                cursor =  actionCursors[action.name + action.axis];
            }
            else if (action.edges) {
                var cursorKey = 'resize',
                    edgeNames = ['top', 'bottom', 'left', 'right'];

                for (var i = 0; i < 4; i++) {
                    if (action.edges[edgeNames[i]]) {
                        cursorKey += edgeNames[i];
                    }
                }

                cursor = actionCursors[cursorKey];
            }
        }

        return cursor;
    }

    function checkResizeEdge (name, value, page, element, interactableElement, rect) {
        // false, '', undefined, null
        if (!value) { return false; }

        // true value, use pointer coords and element rect
        if (value === true) {
            // if dimensions are negative, "switch" edges
            var width = isNumber(rect.width)? rect.width : rect.right - rect.left,
                height = isNumber(rect.height)? rect.height : rect.bottom - rect.top;

            if (width < 0) {
                if      (name === 'left' ) { name = 'right'; }
                else if (name === 'right') { name = 'left' ; }
            }
            if (height < 0) {
                if      (name === 'top'   ) { name = 'bottom'; }
                else if (name === 'bottom') { name = 'top'   ; }
            }

            if (name === 'left'  ) { return page.x < ((width  >= 0? rect.left: rect.right ) + margin); }
            if (name === 'top'   ) { return page.y < ((height >= 0? rect.top : rect.bottom) + margin); }

            if (name === 'right' ) { return page.x > ((width  >= 0? rect.right : rect.left) - margin); }
            if (name === 'bottom') { return page.y > ((height >= 0? rect.bottom: rect.top ) - margin); }
        }

        // the remaining checks require an element
        if (!isElement(element)) { return false; }

        return isElement(value)
                    // the value is an element to use as a resize handle
                    ? value === element
                    // otherwise check if element matches value as selector
                    : matchesUpTo(element, value, interactableElement);
    }

    function defaultActionChecker (pointer, interaction, element) {
        var rect = this.getRect(element),
            shouldResize = false,
            action = null,
            resizeAxes = null,
            resizeEdges,
            page = extend({}, interaction.curCoords.page),
            options = this.options;

        if (!rect) { return null; }

        if (actionIsEnabled.resize && options.resize.enabled) {
            var resizeOptions = options.resize;

            resizeEdges = {
                left: false, right: false, top: false, bottom: false
            };

            // if using resize.edges
            if (isObject(resizeOptions.edges)) {
                for (var edge in resizeEdges) {
                    resizeEdges[edge] = checkResizeEdge(edge,
                                                        resizeOptions.edges[edge],
                                                        page,
                                                        interaction._eventTarget,
                                                        element,
                                                        rect);
                }

                resizeEdges.left = resizeEdges.left && !resizeEdges.right;
                resizeEdges.top  = resizeEdges.top  && !resizeEdges.bottom;

                shouldResize = resizeEdges.left || resizeEdges.right || resizeEdges.top || resizeEdges.bottom;
            }
            else {
                var right  = options.resize.axis !== 'y' && page.x > (rect.right  - margin),
                    bottom = options.resize.axis !== 'x' && page.y > (rect.bottom - margin);

                shouldResize = right || bottom;
                resizeAxes = (right? 'x' : '') + (bottom? 'y' : '');
            }
        }

        action = shouldResize
            ? 'resize'
            : actionIsEnabled.drag && options.drag.enabled
                ? 'drag'
                : null;

        if (actionIsEnabled.gesture
            && interaction.pointerIds.length >=2
            && !(interaction.dragging || interaction.resizing)) {
            action = 'gesture';
        }

        if (action) {
            return {
                name: action,
                axis: resizeAxes,
                edges: resizeEdges
            };
        }

        return null;
    }

    // Check if action is enabled globally and the current target supports it
    // If so, return the validated action. Otherwise, return null
    function validateAction (action, interactable) {
        if (!isObject(action)) { return null; }

        var actionName = action.name,
            options = interactable.options;

        if ((  (actionName  === 'resize'   && options.resize.enabled )
            || (actionName      === 'drag'     && options.drag.enabled  )
            || (actionName      === 'gesture'  && options.gesture.enabled))
            && actionIsEnabled[actionName]) {

            if (actionName === 'resize' || actionName === 'resizeyx') {
                actionName = 'resizexy';
            }

            return action;
        }
        return null;
    }

    var listeners = {},
        interactionListeners = [
            'dragStart', 'dragMove', 'resizeStart', 'resizeMove', 'gestureStart', 'gestureMove',
            'pointerOver', 'pointerOut', 'pointerHover', 'selectorDown',
            'pointerDown', 'pointerMove', 'pointerUp', 'pointerCancel', 'pointerEnd',
            'addPointer', 'removePointer', 'recordPointer',
        ];

    for (var i = 0, len = interactionListeners.length; i < len; i++) {
        var name = interactionListeners[i];

        listeners[name] = doOnInteractions(name);
    }

    // bound to the interactable context when a DOM event
    // listener is added to a selector interactable
    function delegateListener (event, useCapture) {
        var fakeEvent = {},
            delegated = delegatedEvents[event.type],
            eventTarget = getActualElement(event.path
                                           ? event.path[0]
                                           : event.target),
            element = eventTarget;

        useCapture = useCapture? true: false;

        // duplicate the event so that currentTarget can be changed
        for (var prop in event) {
            fakeEvent[prop] = event[prop];
        }

        fakeEvent.originalEvent = event;
        fakeEvent.preventDefault = preventOriginalDefault;

        // climb up document tree looking for selector matches
        while (isElement(element)) {
            for (var i = 0; i < delegated.selectors.length; i++) {
                var selector = delegated.selectors[i],
                    context = delegated.contexts[i];

                if (matchesSelector(element, selector)
                    && nodeContains(context, eventTarget)
                    && nodeContains(context, element)) {

                    var listeners = delegated.listeners[i];

                    fakeEvent.currentTarget = element;

                    for (var j = 0; j < listeners.length; j++) {
                        if (listeners[j][1] === useCapture) {
                            listeners[j][0](fakeEvent);
                        }
                    }
                }
            }

            element = parentElement(element);
        }
    }

    function delegateUseCapture (event) {
        return delegateListener.call(this, event, true);
    }

    interactables.indexOfElement = function indexOfElement (element, context) {
        context = context || document;

        for (var i = 0; i < this.length; i++) {
            var interactable = this[i];

            if ((interactable.selector === element
                && (interactable._context === context))
                || (!interactable.selector && interactable._element === element)) {

                return i;
            }
        }
        return -1;
    };

    interactables.get = function interactableGet (element, options) {
        return this[this.indexOfElement(element, options && options.context)];
    };

    interactables.forEachSelector = function (callback) {
        for (var i = 0; i < this.length; i++) {
            var interactable = this[i];

            if (!interactable.selector) {
                continue;
            }

            var ret = callback(interactable, interactable.selector, interactable._context, i, this);

            if (ret !== undefined) {
                return ret;
            }
        }
    };

    /*\
     * interact
     [ method ]
     *
     * The methods of this variable can be used to set elements as
     * interactables and also to change various default settings.
     *
     * Calling it as a function and passing an element or a valid CSS selector
     * string returns an Interactable object which has various methods to
     * configure it.
     *
     - element (Element | string) The HTML or SVG Element to interact with or CSS selector
     = (object) An @Interactable
     *
     > Usage
     | interact(document.getElementById('draggable')).draggable(true);
     |
     | var rectables = interact('rect');
     | rectables
     |     .gesturable(true)
     |     .on('gesturemove', function (event) {
     |         // something cool...
     |     })
     |     .autoScroll(true);
    \*/
    function interact (element, options) {
        return interactables.get(element, options) || new Interactable(element, options);
    }

    /*\
     * Interactable
     [ property ]
     **
     * Object type returned by @interact
    \*/
    function Interactable (element, options) {
        this._element = element;
        this._iEvents = this._iEvents || {};

        var _window;

        if (trySelector(element)) {
            this.selector = element;

            var context = options && options.context;

            _window = context? getWindow(context) : window;

            if (context && (_window.Node
                    ? context instanceof _window.Node
                    : (isElement(context) || context === _window.document))) {

                this._context = context;
            }
        }
        else {
            _window = getWindow(element);

            if (isElement(element, _window)) {

                if (PointerEvent) {
                    events.add(this._element, pEventTypes.down, listeners.pointerDown );
                    events.add(this._element, pEventTypes.move, listeners.pointerHover);
                }
                else {
                    events.add(this._element, 'mousedown' , listeners.pointerDown );
                    events.add(this._element, 'mousemove' , listeners.pointerHover);
                    events.add(this._element, 'touchstart', listeners.pointerDown );
                    events.add(this._element, 'touchmove' , listeners.pointerHover);
                }
            }
        }

        this._doc = _window.document;

        if (!contains(documents, this._doc)) {
            listenToDocument(this._doc);
        }

        interactables.push(this);

        this.set(options);
    }

    Interactable.prototype = {
        setOnEvents: function (action, phases) {
            if (action === 'drop') {
                if (isFunction(phases.ondrop)          ) { this.ondrop           = phases.ondrop          ; }
                if (isFunction(phases.ondropactivate)  ) { this.ondropactivate   = phases.ondropactivate  ; }
                if (isFunction(phases.ondropdeactivate)) { this.ondropdeactivate = phases.ondropdeactivate; }
                if (isFunction(phases.ondragenter)     ) { this.ondragenter      = phases.ondragenter     ; }
                if (isFunction(phases.ondragleave)     ) { this.ondragleave      = phases.ondragleave     ; }
                if (isFunction(phases.ondropmove)      ) { this.ondropmove       = phases.ondropmove      ; }
            }
            else {
                action = 'on' + action;

                if (isFunction(phases.onstart)       ) { this[action + 'start'         ] = phases.onstart         ; }
                if (isFunction(phases.onmove)        ) { this[action + 'move'          ] = phases.onmove          ; }
                if (isFunction(phases.onend)         ) { this[action + 'end'           ] = phases.onend           ; }
                if (isFunction(phases.oninertiastart)) { this[action + 'inertiastart'  ] = phases.oninertiastart  ; }
            }

            return this;
        },

        /*\
         * Interactable.draggable
         [ method ]
         *
         * Gets or sets whether drag actions can be performed on the
         * Interactable
         *
         = (boolean) Indicates if this can be the target of drag events
         | var isDraggable = interact('ul li').draggable();
         * or
         - options (boolean | object) #optional true/false or An object with event listeners to be fired on drag events (object makes the Interactable draggable)
         = (object) This Interactable
         | interact(element).draggable({
         |     onstart: function (event) {},
         |     onmove : function (event) {},
         |     onend  : function (event) {},
         |
         |     // the axis in which the first movement must be
         |     // for the drag sequence to start
         |     // 'xy' by default - any direction
         |     axis: 'x' || 'y' || 'xy',
         |
         |     // max number of drags that can happen concurrently
         |     // with elements of this Interactable. Infinity by default
         |     max: Infinity,
         |
         |     // max number of drags that can target the same element+Interactable
         |     // 1 by default
         |     maxPerElement: 2
         | });
        \*/
        draggable: function (options) {
            if (isObject(options)) {
                this.options.drag.enabled = options.enabled === false? false: true;
                this.setPerAction('drag', options);
                this.setOnEvents('drag', options);

                if (/^x$|^y$|^xy$/.test(options.axis)) {
                    this.options.drag.axis = options.axis;
                }
                else if (options.axis === null) {
                    delete this.options.drag.axis;
                }

                return this;
            }

            if (isBool(options)) {
                this.options.drag.enabled = options;

                return this;
            }

            return this.options.drag;
        },

        setPerAction: function (action, options) {
            // for all the default per-action options
            for (var option in options) {
                // if this option exists for this action
                if (option in defaultOptions[action]) {
                    // if the option in the options arg is an object value
                    if (isObject(options[option])) {
                        // duplicate the object
                        this.options[action][option] = extend(this.options[action][option] || {}, options[option]);

                        if (isObject(defaultOptions.perAction[option]) && 'enabled' in defaultOptions.perAction[option]) {
                            this.options[action][option].enabled = options[option].enabled === false? false : true;
                        }
                    }
                    else if (isBool(options[option]) && isObject(defaultOptions.perAction[option])) {
                        this.options[action][option].enabled = options[option];
                    }
                    else if (options[option] !== undefined) {
                        // or if it's not undefined, do a plain assignment
                        this.options[action][option] = options[option];
                    }
                }
            }
        },

        /*\
         * Interactable.dropzone
         [ method ]
         *
         * Returns or sets whether elements can be dropped onto this
         * Interactable to trigger drop events
         *
         * Dropzones can receive the following events:
         *  - `dropactivate` and `dropdeactivate` when an acceptable drag starts and ends
         *  - `dragenter` and `dragleave` when a draggable enters and leaves the dropzone
         *  - `dragmove` when a draggable that has entered the dropzone is moved
         *  - `drop` when a draggable is dropped into this dropzone
         *
         *  Use the `accept` option to allow only elements that match the given CSS selector or element.
         *
         *  Use the `overlap` option to set how drops are checked for. The allowed values are:
         *   - `'pointer'`, the pointer must be over the dropzone (default)
         *   - `'center'`, the draggable element's center must be over the dropzone
         *   - a number from 0-1 which is the `(intersection area) / (draggable area)`.
         *       e.g. `0.5` for drop to happen when half of the area of the
         *       draggable is over the dropzone
         *
         - options (boolean | object | null) #optional The new value to be set.
         | interact('.drop').dropzone({
         |   accept: '.can-drop' || document.getElementById('single-drop'),
         |   overlap: 'pointer' || 'center' || zeroToOne
         | }
         = (boolean | object) The current setting or this Interactable
        \*/
        dropzone: function (options) {
            if (isObject(options)) {
                this.options.drop.enabled = options.enabled === false? false: true;
                this.setOnEvents('drop', options);
                this.accept(options.accept);

                if (/^(pointer|center)$/.test(options.overlap)) {
                    this.options.drop.overlap = options.overlap;
                }
                else if (isNumber(options.overlap)) {
                    this.options.drop.overlap = Math.max(Math.min(1, options.overlap), 0);
                }

                return this;
            }

            if (isBool(options)) {
                this.options.drop.enabled = options;

                return this;
            }

            return this.options.drop;
        },

        dropCheck: function (pointer, draggable, draggableElement, dropElement, rect) {
            var dropped = false;

            // if the dropzone has no rect (eg. display: none)
            // call the custom dropChecker or just return false
            if (!(rect = rect || this.getRect(dropElement))) {
                return (this.options.dropChecker
                    ? this.options.dropChecker(pointer, dropped, this, dropElement, draggable, draggableElement)
                    : false);
            }

            var dropOverlap = this.options.drop.overlap;

            if (dropOverlap === 'pointer') {
                var page = getPageXY(pointer),
                    origin = getOriginXY(draggable, draggableElement),
                    horizontal,
                    vertical;

                page.x += origin.x;
                page.y += origin.y;

                horizontal = (page.x > rect.left) && (page.x < rect.right);
                vertical   = (page.y > rect.top ) && (page.y < rect.bottom);

                dropped = horizontal && vertical;
            }

            var dragRect = draggable.getRect(draggableElement);

            if (dropOverlap === 'center') {
                var cx = dragRect.left + dragRect.width  / 2,
                    cy = dragRect.top  + dragRect.height / 2;

                dropped = cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom;
            }

            if (isNumber(dropOverlap)) {
                var overlapArea  = (Math.max(0, Math.min(rect.right , dragRect.right ) - Math.max(rect.left, dragRect.left))
                                  * Math.max(0, Math.min(rect.bottom, dragRect.bottom) - Math.max(rect.top , dragRect.top ))),
                    overlapRatio = overlapArea / (dragRect.width * dragRect.height);

                dropped = overlapRatio >= dropOverlap;
            }

            if (this.options.dropChecker) {
                dropped = this.options.dropChecker(pointer, dropped, this, dropElement, draggable, draggableElement);
            }

            return dropped;
        },

        /*\
         * Interactable.dropChecker
         [ method ]
         *
         * Gets or sets the function used to check if a dragged element is
         * over this Interactable. See @Interactable.dropCheck.
         *
         - checker (function) #optional
         * The checker is a function which takes a mouseUp/touchEnd event as a
         * parameter and returns true or false to indicate if the the current
         * draggable can be dropped into this Interactable
         *
         - checker (function) The function that will be called when checking for a drop
         * The checker function takes the following arguments:
         *
         - pointer (MouseEvent | PointerEvent | Touch) The pointer/event that ends a drag
         - dropped (boolean) The value from the default drop check
         - dropzone (Interactable) The dropzone interactable
         - dropElement (Element) The dropzone element
         - draggable (Interactable) The Interactable being dragged
         - draggableElement (Element) The actual element that's being dragged
         *
         = (Function | Interactable) The checker function or this Interactable
        \*/
        dropChecker: function (checker) {
            if (isFunction(checker)) {
                this.options.dropChecker = checker;

                return this;
            }
            if (checker === null) {
                delete this.options.getRect;

                return this;
            }

            return this.options.dropChecker;
        },

        /*\
         * Interactable.accept
         [ method ]
         *
         * Deprecated. add an `accept` property to the options object passed to
         * @Interactable.dropzone instead.
         *
         * Gets or sets the Element or CSS selector match that this
         * Interactable accepts if it is a dropzone.
         *
         - newValue (Element | string | null) #optional
         * If it is an Element, then only that element can be dropped into this dropzone.
         * If it is a string, the element being dragged must match it as a selector.
         * If it is null, the accept options is cleared - it accepts any element.
         *
         = (string | Element | null | Interactable) The current accept option if given `undefined` or this Interactable
        \*/
        accept: function (newValue) {
            if (isElement(newValue)) {
                this.options.drop.accept = newValue;

                return this;
            }

            // test if it is a valid CSS selector
            if (trySelector(newValue)) {
                this.options.drop.accept = newValue;

                return this;
            }

            if (newValue === null) {
                delete this.options.drop.accept;

                return this;
            }

            return this.options.drop.accept;
        },

        /*\
         * Interactable.resizable
         [ method ]
         *
         * Gets or sets whether resize actions can be performed on the
         * Interactable
         *
         = (boolean) Indicates if this can be the target of resize elements
         | var isResizeable = interact('input[type=text]').resizable();
         * or
         - options (boolean | object) #optional true/false or An object with event listeners to be fired on resize events (object makes the Interactable resizable)
         = (object) This Interactable
         | interact(element).resizable({
         |     onstart: function (event) {},
         |     onmove : function (event) {},
         |     onend  : function (event) {},
         |
         |     edges: {
         |       top   : true,       // Use pointer coords to check for resize.
         |       left  : false,      // Disable resizing from left edge.
         |       bottom: '.resize-s',// Resize if pointer target matches selector
         |       right : handleEl    // Resize if pointer target is the given Element
         |     },
         |
         |     // a value of 'none' will limit the resize rect to a minimum of 0x0
         |     // 'negate' will allow the rect to have negative width/height
         |     // 'reposition' will keep the width/height positive by swapping
         |     // the top and bottom edges and/or swapping the left and right edges
         |     invert: 'none' || 'negate' || 'reposition'
         |
         |     // limit multiple resizes.
         |     // See the explanation in the @Interactable.draggable example
         |     max: Infinity,
         |     maxPerElement: 1,
         | });
        \*/
        resizable: function (options) {
            if (isObject(options)) {
                this.options.resize.enabled = options.enabled === false? false: true;
                this.setPerAction('resize', options);
                this.setOnEvents('resize', options);

                if (/^x$|^y$|^xy$/.test(options.axis)) {
                    this.options.resize.axis = options.axis;
                }
                else if (options.axis === null) {
                    this.options.resize.axis = defaultOptions.resize.axis;
                }

                if (isBool(options.square)) {
                    this.options.resize.square = options.square;
                }

                return this;
            }
            if (isBool(options)) {
                this.options.resize.enabled = options;

                return this;
            }
            return this.options.resize;
        },

        /*\
         * Interactable.squareResize
         [ method ]
         *
         * Deprecated. Add a `square: true || false` property to @Interactable.resizable instead
         *
         * Gets or sets whether resizing is forced 1:1 aspect
         *
         = (boolean) Current setting
         *
         * or
         *
         - newValue (boolean) #optional
         = (object) this Interactable
        \*/
        squareResize: function (newValue) {
            if (isBool(newValue)) {
                this.options.resize.square = newValue;

                return this;
            }

            if (newValue === null) {
                delete this.options.resize.square;

                return this;
            }

            return this.options.resize.square;
        },

        /*\
         * Interactable.gesturable
         [ method ]
         *
         * Gets or sets whether multitouch gestures can be performed on the
         * Interactable's element
         *
         = (boolean) Indicates if this can be the target of gesture events
         | var isGestureable = interact(element).gesturable();
         * or
         - options (boolean | object) #optional true/false or An object with event listeners to be fired on gesture events (makes the Interactable gesturable)
         = (object) this Interactable
         | interact(element).gesturable({
         |     onstart: function (event) {},
         |     onmove : function (event) {},
         |     onend  : function (event) {},
         |
         |     // limit multiple gestures.
         |     // See the explanation in @Interactable.draggable example
         |     max: Infinity,
         |     maxPerElement: 1,
         | });
        \*/
        gesturable: function (options) {
            if (isObject(options)) {
                this.options.gesture.enabled = options.enabled === false? false: true;
                this.setPerAction('gesture', options);
                this.setOnEvents('gesture', options);

                return this;
            }

            if (isBool(options)) {
                this.options.gesture.enabled = options;

                return this;
            }

            return this.options.gesture;
        },

        /*\
         * Interactable.autoScroll
         [ method ]
         **
         * Deprecated. Add an `autoscroll` property to the options object
         * passed to @Interactable.draggable or @Interactable.resizable instead.
         *
         * Returns or sets whether dragging and resizing near the edges of the
         * window/container trigger autoScroll for this Interactable
         *
         = (object) Object with autoScroll properties
         *
         * or
         *
         - options (object | boolean) #optional
         * options can be:
         * - an object with margin, distance and interval properties,
         * - true or false to enable or disable autoScroll or
         = (Interactable) this Interactable
        \*/
        autoScroll: function (options) {
            if (isObject(options)) {
                options = extend({ actions: ['drag', 'resize']}, options);
            }
            else if (isBool(options)) {
                options = { actions: ['drag', 'resize'], enabled: options };
            }

            return this.setOptions('autoScroll', options);
        },

        /*\
         * Interactable.snap
         [ method ]
         **
         * Deprecated. Add a `snap` property to the options object passed
         * to @Interactable.draggable or @Interactable.resizable instead.
         *
         * Returns or sets if and how action coordinates are snapped. By
         * default, snapping is relative to the pointer coordinates. You can
         * change this by setting the
         * [`elementOrigin`](https://github.com/taye/interact.js/pull/72).
         **
         = (boolean | object) `false` if snap is disabled; object with snap properties if snap is enabled
         **
         * or
         **
         - options (object | boolean | null) #optional
         = (Interactable) this Interactable
         > Usage
         | interact(document.querySelector('#thing')).snap({
         |     targets: [
         |         // snap to this specific point
         |         {
         |             x: 100,
         |             y: 100,
         |             range: 25
         |         },
         |         // give this function the x and y page coords and snap to the object returned
         |         function (x, y) {
         |             return {
         |                 x: x,
         |                 y: (75 + 50 * Math.sin(x * 0.04)),
         |                 range: 40
         |             };
         |         },
         |         // create a function that snaps to a grid
         |         interact.createSnapGrid({
         |             x: 50,
         |             y: 50,
         |             range: 10,              // optional
         |             offset: { x: 5, y: 10 } // optional
         |         })
         |     ],
         |     // do not snap during normal movement.
         |     // Instead, trigger only one snapped move event
         |     // immediately before the end event.
         |     endOnly: true,
         |
         |     relativePoints: [
         |         { x: 0, y: 0 },  // snap relative to the top left of the element
         |         { x: 1, y: 1 },  // and also to the bottom right
         |     ],  
         |
         |     // offset the snap target coordinates
         |     // can be an object with x/y or 'startCoords'
         |     offset: { x: 50, y: 50 }
         |   }
         | });
        \*/
        snap: function (options) {
            var ret = this.setOptions('snap', options);

            if (ret === this) { return this; }

            return ret.drag;
        },

        setOptions: function (option, options) {
            var actions = options && isArray(options.actions)
                    ? options.actions
                    : ['drag'];

            var i;

            if (isObject(options) || isBool(options)) {
                for (i = 0; i < actions.length; i++) {
                    var action = /resize/.test(actions[i])? 'resize' : actions[i];

                    if (!isObject(this.options[action])) { continue; }

                    var thisOption = this.options[action][option];

                    if (isObject(options)) {
                        extend(thisOption, options);
                        thisOption.enabled = options.enabled === false? false: true;

                        if (option === 'snap') {
                            if (thisOption.mode === 'grid') {
                                thisOption.targets = [
                                    interact.createSnapGrid(extend({
                                        offset: thisOption.gridOffset || { x: 0, y: 0 }
                                    }, thisOption.grid || {}))
                                ];
                            }
                            else if (thisOption.mode === 'anchor') {
                                thisOption.targets = thisOption.anchors;
                            }
                            else if (thisOption.mode === 'path') {
                                thisOption.targets = thisOption.paths;
                            }

                            if ('elementOrigin' in options) {
                                thisOption.relativePoints = [options.elementOrigin];
                            }
                        }
                    }
                    else if (isBool(options)) {
                        thisOption.enabled = options;
                    }
                }

                return this;
            }

            var ret = {},
                allActions = ['drag', 'resize', 'gesture'];

            for (i = 0; i < allActions.length; i++) {
                if (option in defaultOptions[allActions[i]]) {
                    ret[allActions[i]] = this.options[allActions[i]][option];
                }
            }

            return ret;
        },


        /*\
         * Interactable.inertia
         [ method ]
         **
         * Deprecated. Add an `inertia` property to the options object passed
         * to @Interactable.draggable or @Interactable.resizable instead.
         *
         * Returns or sets if and how events continue to run after the pointer is released
         **
         = (boolean | object) `false` if inertia is disabled; `object` with inertia properties if inertia is enabled
         **
         * or
         **
         - options (object | boolean | null) #optional
         = (Interactable) this Interactable
         > Usage
         | // enable and use default settings
         | interact(element).inertia(true);
         |
         | // enable and use custom settings
         | interact(element).inertia({
         |     // value greater than 0
         |     // high values slow the object down more quickly
         |     resistance     : 16,
         |
         |     // the minimum launch speed (pixels per second) that results in inertia start
         |     minSpeed       : 200,
         |
         |     // inertia will stop when the object slows down to this speed
         |     endSpeed       : 20,
         |
         |     // boolean; should actions be resumed when the pointer goes down during inertia
         |     allowResume    : true,
         |
         |     // boolean; should the jump when resuming from inertia be ignored in event.dx/dy
         |     zeroResumeDelta: false,
         |
         |     // if snap/restrict are set to be endOnly and inertia is enabled, releasing
         |     // the pointer without triggering inertia will animate from the release
         |     // point to the snaped/restricted point in the given amount of time (ms)
         |     smoothEndDuration: 300,
         |
         |     // an array of action types that can have inertia (no gesture)
         |     actions        : ['drag', 'resize']
         | });
         |
         | // reset custom settings and use all defaults
         | interact(element).inertia(null);
        \*/
        inertia: function (options) {
            var ret = this.setOptions('inertia', options);

            if (ret === this) { return this; }

            return ret.drag;
        },

        getAction: function (pointer, interaction, element) {
            var action = this.defaultActionChecker(pointer, interaction, element);

            if (this.options.actionChecker) {
                return this.options.actionChecker(pointer, action, this, element, interaction);
            }

            return action;
        },

        defaultActionChecker: defaultActionChecker,

        /*\
         * Interactable.actionChecker
         [ method ]
         *
         * Gets or sets the function used to check action to be performed on
         * pointerDown
         *
         - checker (function | null) #optional A function which takes a pointer event, defaultAction string, interactable, element and interaction as parameters and returns an object with name property 'drag' 'resize' or 'gesture' and optionally an `edges` object with boolean 'top', 'left', 'bottom' and right props.
         = (Function | Interactable) The checker function or this Interactable
         *
         | interact('.resize-horiz').actionChecker(function (defaultAction, interactable) {
         |   return {
         |     // resize from the top and right edges
         |     name: 'resize',
         |     edges: { top: true, right: true }
         |   };
         | });
        \*/
        actionChecker: function (checker) {
            if (isFunction(checker)) {
                this.options.actionChecker = checker;

                return this;
            }

            if (checker === null) {
                delete this.options.actionChecker;

                return this;
            }

            return this.options.actionChecker;
        },

        /*\
         * Interactable.getRect
         [ method ]
         *
         * The default function to get an Interactables bounding rect. Can be
         * overridden using @Interactable.rectChecker.
         *
         - element (Element) #optional The element to measure.
         = (object) The object's bounding rectangle.
         o {
         o     top   : 0,
         o     left  : 0,
         o     bottom: 0,
         o     right : 0,
         o     width : 0,
         o     height: 0
         o }
        \*/
        getRect: function rectCheck (element) {
            element = element || this._element;

            if (this.selector && !(isElement(element))) {
                element = this._context.querySelector(this.selector);
            }

            return getElementRect(element);
        },

        /*\
         * Interactable.rectChecker
         [ method ]
         *
         * Returns or sets the function used to calculate the interactable's
         * element's rectangle
         *
         - checker (function) #optional A function which returns this Interactable's bounding rectangle. See @Interactable.getRect
         = (function | object) The checker function or this Interactable
        \*/
        rectChecker: function (checker) {
            if (isFunction(checker)) {
                this.getRect = checker;

                return this;
            }

            if (checker === null) {
                delete this.options.getRect;

                return this;
            }

            return this.getRect;
        },

        /*\
         * Interactable.styleCursor
         [ method ]
         *
         * Returns or sets whether the action that would be performed when the
         * mouse on the element are checked on `mousemove` so that the cursor
         * may be styled appropriately
         *
         - newValue (boolean) #optional
         = (boolean | Interactable) The current setting or this Interactable
        \*/
        styleCursor: function (newValue) {
            if (isBool(newValue)) {
                this.options.styleCursor = newValue;

                return this;
            }

            if (newValue === null) {
                delete this.options.styleCursor;

                return this;
            }

            return this.options.styleCursor;
        },

        /*\
         * Interactable.preventDefault
         [ method ]
         *
         * Returns or sets whether to prevent the browser's default behaviour
         * in response to pointer events. Can be set to:
         *  - `'always'` to always prevent
         *  - `'never'` to never prevent
         *  - `'auto'` to let interact.js try to determine what would be best
         *
         - newValue (string) #optional `true`, `false` or `'auto'`
         = (string | Interactable) The current setting or this Interactable
        \*/
        preventDefault: function (newValue) {
            if (/^(always|never|auto)$/.test(newValue)) {
                this.options.preventDefault = newValue;
                return this;
            }

            if (isBool(newValue)) {
                this.options.preventDefault = newValue? 'always' : 'never';
                return this;
            }

            return this.options.preventDefault;
        },

        /*\
         * Interactable.origin
         [ method ]
         *
         * Gets or sets the origin of the Interactable's element.  The x and y
         * of the origin will be subtracted from action event coordinates.
         *
         - origin (object | string) #optional An object eg. { x: 0, y: 0 } or string 'parent', 'self' or any CSS selector
         * OR
         - origin (Element) #optional An HTML or SVG Element whose rect will be used
         **
         = (object) The current origin or this Interactable
        \*/
        origin: function (newValue) {
            if (trySelector(newValue)) {
                this.options.origin = newValue;
                return this;
            }
            else if (isObject(newValue)) {
                this.options.origin = newValue;
                return this;
            }

            return this.options.origin;
        },

        /*\
         * Interactable.deltaSource
         [ method ]
         *
         * Returns or sets the mouse coordinate types used to calculate the
         * movement of the pointer.
         *
         - newValue (string) #optional Use 'client' if you will be scrolling while interacting; Use 'page' if you want autoScroll to work
         = (string | object) The current deltaSource or this Interactable
        \*/
        deltaSource: function (newValue) {
            if (newValue === 'page' || newValue === 'client') {
                this.options.deltaSource = newValue;

                return this;
            }

            return this.options.deltaSource;
        },

        /*\
         * Interactable.restrict
         [ method ]
         **
         * Deprecated. Add a `restrict` property to the options object passed to
         * @Interactable.draggable, @Interactable.resizable or @Interactable.gesturable instead.
         *
         * Returns or sets the rectangles within which actions on this
         * interactable (after snap calculations) are restricted. By default,
         * restricting is relative to the pointer coordinates. You can change
         * this by setting the
         * [`elementRect`](https://github.com/taye/interact.js/pull/72).
         **
         - options (object) #optional an object with keys drag, resize, and/or gesture whose values are rects, Elements, CSS selectors, or 'parent' or 'self'
         = (object) The current restrictions object or this Interactable
         **
         | interact(element).restrict({
         |     // the rect will be `interact.getElementRect(element.parentNode)`
         |     drag: element.parentNode,
         |
         |     // x and y are relative to the the interactable's origin
         |     resize: { x: 100, y: 100, width: 200, height: 200 }
         | })
         |
         | interact('.draggable').restrict({
         |     // the rect will be the selected element's parent
         |     drag: 'parent',
         |
         |     // do not restrict during normal movement.
         |     // Instead, trigger only one restricted move event
         |     // immediately before the end event.
         |     endOnly: true,
         |
         |     // https://github.com/taye/interact.js/pull/72#issue-41813493
         |     elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
         | });
        \*/
        restrict: function (options) {
            if (!isObject(options)) {
                return this.setOptions('restrict', options);
            }

            var actions = ['drag', 'resize', 'gesture'],
                ret;

            for (var i = 0; i < actions.length; i++) {
                var action = actions[i];

                if (action in options) {
                    var perAction = extend({
                            actions: [action],
                            restriction: options[action]
                        }, options);

                    ret = this.setOptions('restrict', perAction);
                }
            }

            return ret;
        },

        /*\
         * Interactable.context
         [ method ]
         *
         * Gets the selector context Node of the Interactable. The default is `window.document`.
         *
         = (Node) The context Node of this Interactable
         **
        \*/
        context: function () {
            return this._context;
        },

        _context: document,

        /*\
         * Interactable.ignoreFrom
         [ method ]
         *
         * If the target of the `mousedown`, `pointerdown` or `touchstart`
         * event or any of it's parents match the given CSS selector or
         * Element, no drag/resize/gesture is started.
         *
         - newValue (string | Element | null) #optional a CSS selector string, an Element or `null` to not ignore any elements
         = (string | Element | object) The current ignoreFrom value or this Interactable
         **
         | interact(element, { ignoreFrom: document.getElementById('no-action') });
         | // or
         | interact(element).ignoreFrom('input, textarea, a');
        \*/
        ignoreFrom: function (newValue) {
            if (trySelector(newValue)) {            // CSS selector to match event.target
                this.options.ignoreFrom = newValue;
                return this;
            }

            if (isElement(newValue)) {              // specific element
                this.options.ignoreFrom = newValue;
                return this;
            }

            return this.options.ignoreFrom;
        },

        /*\
         * Interactable.allowFrom
         [ method ]
         *
         * A drag/resize/gesture is started only If the target of the
         * `mousedown`, `pointerdown` or `touchstart` event or any of it's
         * parents match the given CSS selector or Element.
         *
         - newValue (string | Element | null) #optional a CSS selector string, an Element or `null` to allow from any element
         = (string | Element | object) The current allowFrom value or this Interactable
         **
         | interact(element, { allowFrom: document.getElementById('drag-handle') });
         | // or
         | interact(element).allowFrom('.handle');
        \*/
        allowFrom: function (newValue) {
            if (trySelector(newValue)) {            // CSS selector to match event.target
                this.options.allowFrom = newValue;
                return this;
            }

            if (isElement(newValue)) {              // specific element
                this.options.allowFrom = newValue;
                return this;
            }

            return this.options.allowFrom;
        },

        /*\
         * Interactable.element
         [ method ]
         *
         * If this is not a selector Interactable, it returns the element this
         * interactable represents
         *
         = (Element) HTML / SVG Element
        \*/
        element: function () {
            return this._element;
        },

        /*\
         * Interactable.fire
         [ method ]
         *
         * Calls listeners for the given InteractEvent type bound globally
         * and directly to this Interactable
         *
         - iEvent (InteractEvent) The InteractEvent object to be fired on this Interactable
         = (Interactable) this Interactable
        \*/
        fire: function (iEvent) {
            if (!(iEvent && iEvent.type) || !contains(eventTypes, iEvent.type)) {
                return this;
            }

            var listeners,
                i,
                len,
                onEvent = 'on' + iEvent.type,
                funcName = '';

            // Interactable#on() listeners
            if (iEvent.type in this._iEvents) {
                listeners = this._iEvents[iEvent.type];

                for (i = 0, len = listeners.length; i < len && !iEvent.immediatePropagationStopped; i++) {
                    funcName = listeners[i].name;
                    listeners[i](iEvent);
                }
            }

            // interactable.onevent listener
            if (isFunction(this[onEvent])) {
                funcName = this[onEvent].name;
                this[onEvent](iEvent);
            }

            // interact.on() listeners
            if (iEvent.type in globalEvents && (listeners = globalEvents[iEvent.type]))  {

                for (i = 0, len = listeners.length; i < len && !iEvent.immediatePropagationStopped; i++) {
                    funcName = listeners[i].name;
                    listeners[i](iEvent);
                }
            }

            return this;
        },

        /*\
         * Interactable.on
         [ method ]
         *
         * Binds a listener for an InteractEvent or DOM event.
         *
         - eventType  (string | array | object) The types of events to listen for
         - listener   (function) The function to be called on the given event(s)
         - useCapture (boolean) #optional useCapture flag for addEventListener
         = (object) This Interactable
        \*/
        on: function (eventType, listener, useCapture) {
            var i;

            if (isString(eventType) && eventType.search(' ') !== -1) {
                eventType = eventType.trim().split(/ +/);
            }

            if (isArray(eventType)) {
                for (i = 0; i < eventType.length; i++) {
                    this.on(eventType[i], listener, useCapture);
                }

                return this;
            }

            if (isObject(eventType)) {
                for (var prop in eventType) {
                    this.on(prop, eventType[prop], listener);
                }

                return this;
            }

            if (eventType === 'wheel') {
                eventType = wheelEvent;
            }

            // convert to boolean
            useCapture = useCapture? true: false;

            if (contains(eventTypes, eventType)) {
                // if this type of event was never bound to this Interactable
                if (!(eventType in this._iEvents)) {
                    this._iEvents[eventType] = [listener];
                }
                else {
                    this._iEvents[eventType].push(listener);
                }
            }
            // delegated event for selector
            else if (this.selector) {
                if (!delegatedEvents[eventType]) {
                    delegatedEvents[eventType] = {
                        selectors: [],
                        contexts : [],
                        listeners: []
                    };

                    // add delegate listener functions
                    for (i = 0; i < documents.length; i++) {
                        events.add(documents[i], eventType, delegateListener);
                        events.add(documents[i], eventType, delegateUseCapture, true);
                    }
                }

                var delegated = delegatedEvents[eventType],
                    index;

                for (index = delegated.selectors.length - 1; index >= 0; index--) {
                    if (delegated.selectors[index] === this.selector
                        && delegated.contexts[index] === this._context) {
                        break;
                    }
                }

                if (index === -1) {
                    index = delegated.selectors.length;

                    delegated.selectors.push(this.selector);
                    delegated.contexts .push(this._context);
                    delegated.listeners.push([]);
                }

                // keep listener and useCapture flag
                delegated.listeners[index].push([listener, useCapture]);
            }
            else {
                events.add(this._element, eventType, listener, useCapture);
            }

            return this;
        },

        /*\
         * Interactable.off
         [ method ]
         *
         * Removes an InteractEvent or DOM event listener
         *
         - eventType  (string | array | object) The types of events that were listened for
         - listener   (function) The listener function to be removed
         - useCapture (boolean) #optional useCapture flag for removeEventListener
         = (object) This Interactable
        \*/
        off: function (eventType, listener, useCapture) {
            var i;

            if (isString(eventType) && eventType.search(' ') !== -1) {
                eventType = eventType.trim().split(/ +/);
            }

            if (isArray(eventType)) {
                for (i = 0; i < eventType.length; i++) {
                    this.off(eventType[i], listener, useCapture);
                }

                return this;
            }

            if (isObject(eventType)) {
                for (var prop in eventType) {
                    this.off(prop, eventType[prop], listener);
                }

                return this;
            }

            var eventList,
                index = -1;

            // convert to boolean
            useCapture = useCapture? true: false;

            if (eventType === 'wheel') {
                eventType = wheelEvent;
            }

            // if it is an action event type
            if (contains(eventTypes, eventType)) {
                eventList = this._iEvents[eventType];

                if (eventList && (index = indexOf(eventList, listener)) !== -1) {
                    this._iEvents[eventType].splice(index, 1);
                }
            }
            // delegated event
            else if (this.selector) {
                var delegated = delegatedEvents[eventType],
                    matchFound = false;

                if (!delegated) { return this; }

                // count from last index of delegated to 0
                for (index = delegated.selectors.length - 1; index >= 0; index--) {
                    // look for matching selector and context Node
                    if (delegated.selectors[index] === this.selector
                        && delegated.contexts[index] === this._context) {

                        var listeners = delegated.listeners[index];

                        // each item of the listeners array is an array: [function, useCaptureFlag]
                        for (i = listeners.length - 1; i >= 0; i--) {
                            var fn = listeners[i][0],
                                useCap = listeners[i][1];

                            // check if the listener functions and useCapture flags match
                            if (fn === listener && useCap === useCapture) {
                                // remove the listener from the array of listeners
                                listeners.splice(i, 1);

                                // if all listeners for this interactable have been removed
                                // remove the interactable from the delegated arrays
                                if (!listeners.length) {
                                    delegated.selectors.splice(index, 1);
                                    delegated.contexts .splice(index, 1);
                                    delegated.listeners.splice(index, 1);

                                    // remove delegate function from context
                                    events.remove(this._context, eventType, delegateListener);
                                    events.remove(this._context, eventType, delegateUseCapture, true);

                                    // remove the arrays if they are empty
                                    if (!delegated.selectors.length) {
                                        delegatedEvents[eventType] = null;
                                    }
                                }

                                // only remove one listener
                                matchFound = true;
                                break;
                            }
                        }

                        if (matchFound) { break; }
                    }
                }
            }
            // remove listener from this Interatable's element
            else {
                events.remove(this._element, eventType, listener, useCapture);
            }

            return this;
        },

        /*\
         * Interactable.set
         [ method ]
         *
         * Reset the options of this Interactable
         - options (object) The new settings to apply
         = (object) This Interactablw
        \*/
        set: function (options) {
            if (!isObject(options)) {
                options = {};
            }

            this.options = extend({}, defaultOptions.base);

            var i,
                actions = ['drag', 'drop', 'resize', 'gesture'],
                methods = ['draggable', 'dropzone', 'resizable', 'gesturable'],
                perActions = extend(extend({}, defaultOptions.perAction), options[action] || {});

            for (i = 0; i < actions.length; i++) {
                var action = actions[i];

                this.options[action] = extend({}, defaultOptions[action]);

                this.setPerAction(action, perActions);

                this[methods[i]](options[action]);
            }

            var settings = [
                    'accept', 'actionChecker', 'allowFrom', 'deltaSource',
                    'dropChecker', 'ignoreFrom', 'origin', 'preventDefault',
                    'rectChecker'
                ];

            for (i = 0, len = settings.length; i < len; i++) {
                var setting = settings[i];

                this.options[setting] = defaultOptions.base[setting];

                if (setting in options) {
                    this[setting](options[setting]);
                }
            }

            return this;
        },

        /*\
         * Interactable.unset
         [ method ]
         *
         * Remove this interactable from the list of interactables and remove
         * it's drag, drop, resize and gesture capabilities
         *
         = (object) @interact
        \*/
        unset: function () {
            events.remove(this, 'all');

            if (!isString(this.selector)) {
                events.remove(this, 'all');
                if (this.options.styleCursor) {
                    this._element.style.cursor = '';
                }
            }
            else {
                // remove delegated events
                for (var type in delegatedEvents) {
                    var delegated = delegatedEvents[type];

                    for (var i = 0; i < delegated.selectors.length; i++) {
                        if (delegated.selectors[i] === this.selector
                            && delegated.contexts[i] === this._context) {

                            delegated.selectors.splice(i, 1);
                            delegated.contexts .splice(i, 1);
                            delegated.listeners.splice(i, 1);

                            // remove the arrays if they are empty
                            if (!delegated.selectors.length) {
                                delegatedEvents[type] = null;
                            }
                        }

                        events.remove(this._context, type, delegateListener);
                        events.remove(this._context, type, delegateUseCapture, true);

                        break;
                    }
                }
            }

            this.dropzone(false);

            interactables.splice(indexOf(interactables, this), 1);

            return interact;
        }
    };

    function warnOnce (method, message) {
        var warned = false;

        return function () {
            if (!warned) {
                window.console.warn(message);
                warned = true;
            }

            return method.apply(this, arguments);
        };
    }

    Interactable.prototype.snap = warnOnce(Interactable.prototype.snap,
         'Interactable#snap is deprecated. See the new documentation for snapping at http://interactjs.io/docs/snapping');
    Interactable.prototype.restrict = warnOnce(Interactable.prototype.restrict,
         'Interactable#restrict is deprecated. See the new documentation for resticting at http://interactjs.io/docs/restriction');
    Interactable.prototype.inertia = warnOnce(Interactable.prototype.inertia,
         'Interactable#inertia is deprecated. See the new documentation for inertia at http://interactjs.io/docs/inertia');
    Interactable.prototype.autoScroll = warnOnce(Interactable.prototype.autoScroll,
         'Interactable#autoScroll is deprecated. See the new documentation for autoScroll at http://interactjs.io/docs/#autoscroll');

    /*\
     * interact.isSet
     [ method ]
     *
     * Check if an element has been set
     - element (Element) The Element being searched for
     = (boolean) Indicates if the element or CSS selector was previously passed to interact
    \*/
    interact.isSet = function(element, options) {
        return interactables.indexOfElement(element, options && options.context) !== -1;
    };

    /*\
     * interact.on
     [ method ]
     *
     * Adds a global listener for an InteractEvent or adds a DOM event to
     * `document`
     *
     - type       (string | array | object) The types of events to listen for
     - listener   (function) The function to be called on the given event(s)
     - useCapture (boolean) #optional useCapture flag for addEventListener
     = (object) interact
    \*/
    interact.on = function (type, listener, useCapture) {
        if (isString(type) && type.search(' ') !== -1) {
            type = type.trim().split(/ +/);
        }

        if (isArray(type)) {
            for (var i = 0; i < type.length; i++) {
                interact.on(type[i], listener, useCapture);
            }

            return interact;
        }

        if (isObject(type)) {
            for (var prop in type) {
                interact.on(prop, type[prop], listener);
            }

            return interact;
        }

        // if it is an InteractEvent type, add listener to globalEvents
        if (contains(eventTypes, type)) {
            // if this type of event was never bound
            if (!globalEvents[type]) {
                globalEvents[type] = [listener];
            }
            else {
                globalEvents[type].push(listener);
            }
        }
        // If non InteractEvent type, addEventListener to document
        else {
            events.add(document, type, listener, useCapture);
        }

        return interact;
    };

    /*\
     * interact.off
     [ method ]
     *
     * Removes a global InteractEvent listener or DOM event from `document`
     *
     - type       (string | array | object) The types of events that were listened for
     - listener   (function) The listener function to be removed
     - useCapture (boolean) #optional useCapture flag for removeEventListener
     = (object) interact
     \*/
    interact.off = function (type, listener, useCapture) {
        if (isString(type) && type.search(' ') !== -1) {
            type = type.trim().split(/ +/);
        }

        if (isArray(type)) {
            for (var i = 0; i < type.length; i++) {
                interact.off(type[i], listener, useCapture);
            }

            return interact;
        }

        if (isObject(type)) {
            for (var prop in type) {
                interact.off(prop, type[prop], listener);
            }

            return interact;
        }

        if (!contains(eventTypes, type)) {
            events.remove(document, type, listener, useCapture);
        }
        else {
            var index;

            if (type in globalEvents
                && (index = indexOf(globalEvents[type], listener)) !== -1) {
                globalEvents[type].splice(index, 1);
            }
        }

        return interact;
    };

    /*\
     * interact.enableDragging
     [ method ]
     *
     * Deprecated.
     *
     * Returns or sets whether dragging is enabled for any Interactables
     *
     - newValue (boolean) #optional `true` to allow the action; `false` to disable action for all Interactables
     = (boolean | object) The current setting or interact
    \*/
    interact.enableDragging = warnOnce(function (newValue) {
        if (newValue !== null && newValue !== undefined) {
            actionIsEnabled.drag = newValue;

            return interact;
        }
        return actionIsEnabled.drag;
    }, 'interact.enableDragging is deprecated and will soon be removed.');

    /*\
     * interact.enableResizing
     [ method ]
     *
     * Deprecated.
     *
     * Returns or sets whether resizing is enabled for any Interactables
     *
     - newValue (boolean) #optional `true` to allow the action; `false` to disable action for all Interactables
     = (boolean | object) The current setting or interact
    \*/
    interact.enableResizing = warnOnce(function (newValue) {
        if (newValue !== null && newValue !== undefined) {
            actionIsEnabled.resize = newValue;

            return interact;
        }
        return actionIsEnabled.resize;
    }, 'interact.enableResizing is deprecated and will soon be removed.');

    /*\
     * interact.enableGesturing
     [ method ]
     *
     * Deprecated.
     *
     * Returns or sets whether gesturing is enabled for any Interactables
     *
     - newValue (boolean) #optional `true` to allow the action; `false` to disable action for all Interactables
     = (boolean | object) The current setting or interact
    \*/
    interact.enableGesturing = warnOnce(function (newValue) {
        if (newValue !== null && newValue !== undefined) {
            actionIsEnabled.gesture = newValue;

            return interact;
        }
        return actionIsEnabled.gesture;
    }, 'interact.enableGesturing is deprecated and will soon be removed.');

    interact.eventTypes = eventTypes;

    /*\
     * interact.debug
     [ method ]
     *
     * Returns debugging data
     = (object) An object with properties that outline the current state and expose internal functions and variables
    \*/
    interact.debug = function () {
        var interaction = interactions[0] || new Interaction();

        return {
            interactions          : interactions,
            target                : interaction.target,
            dragging              : interaction.dragging,
            resizing              : interaction.resizing,
            gesturing             : interaction.gesturing,
            prepared              : interaction.prepared,
            matches               : interaction.matches,
            matchElements         : interaction.matchElements,

            prevCoords            : interaction.prevCoords,
            startCoords           : interaction.startCoords,

            pointerIds            : interaction.pointerIds,
            pointers              : interaction.pointers,
            addPointer            : listeners.addPointer,
            removePointer         : listeners.removePointer,
            recordPointer        : listeners.recordPointer,

            snap                  : interaction.snapStatus,
            restrict              : interaction.restrictStatus,
            inertia               : interaction.inertiaStatus,

            downTime              : interaction.downTimes[0],
            downEvent             : interaction.downEvent,
            downPointer           : interaction.downPointer,
            prevEvent             : interaction.prevEvent,

            Interactable          : Interactable,
            interactables         : interactables,
            pointerIsDown         : interaction.pointerIsDown,
            defaultOptions        : defaultOptions,
            defaultActionChecker  : defaultActionChecker,

            actionCursors         : actionCursors,
            dragMove              : listeners.dragMove,
            resizeMove            : listeners.resizeMove,
            gestureMove           : listeners.gestureMove,
            pointerUp             : listeners.pointerUp,
            pointerDown           : listeners.pointerDown,
            pointerMove           : listeners.pointerMove,
            pointerHover          : listeners.pointerHover,

            events                : events,
            globalEvents          : globalEvents,
            delegatedEvents       : delegatedEvents
        };
    };

    // expose the functions used to calculate multi-touch properties
    interact.getTouchAverage  = touchAverage;
    interact.getTouchBBox     = touchBBox;
    interact.getTouchDistance = touchDistance;
    interact.getTouchAngle    = touchAngle;

    interact.getElementRect   = getElementRect;
    interact.matchesSelector  = matchesSelector;
    interact.closest          = closest;

    /*\
     * interact.margin
     [ method ]
     *
     * Returns or sets the margin for autocheck resizing used in
     * @Interactable.getAction. That is the distance from the bottom and right
     * edges of an element clicking in which will start resizing
     *
     - newValue (number) #optional
     = (number | interact) The current margin value or interact
    \*/
    interact.margin = function (newvalue) {
        if (isNumber(newvalue)) {
            margin = newvalue;

            return interact;
        }
        return margin;
    };

    /*\
     * interact.supportsTouch
     [ method ]
     *
     = (boolean) Whether or not the browser supports touch input
    \*/
    interact.supportsTouch = function () {
        return supportsTouch;
    };

    /*\
     * interact.supportsPointerEvent
     [ method ]
     *
     = (boolean) Whether or not the browser supports PointerEvents
    \*/
    interact.supportsPointerEvent = function () {
        return supportsPointerEvent;
    };

    /*\
     * interact.stop
     [ method ]
     *
     * Cancels all interactions (end events are not fired)
     *
     - event (Event) An event on which to call preventDefault()
     = (object) interact
    \*/
    interact.stop = function (event) {
        for (var i = interactions.length - 1; i > 0; i--) {
            interactions[i].stop(event);
        }

        return interact;
    };

    /*\
     * interact.dynamicDrop
     [ method ]
     *
     * Returns or sets whether the dimensions of dropzone elements are
     * calculated on every dragmove or only on dragstart for the default
     * dropChecker
     *
     - newValue (boolean) #optional True to check on each move. False to check only before start
     = (boolean | interact) The current setting or interact
    \*/
    interact.dynamicDrop = function (newValue) {
        if (isBool(newValue)) {
            //if (dragging && dynamicDrop !== newValue && !newValue) {
                //calcRects(dropzones);
            //}

            dynamicDrop = newValue;

            return interact;
        }
        return dynamicDrop;
    };

    /*\
     * interact.pointerMoveTolerance
     [ method ]
     * Returns or sets the distance the pointer must be moved before an action
     * sequence occurs. This also affects tolerance for tap events.
     *
     - newValue (number) #optional The movement from the start position must be greater than this value
     = (number | Interactable) The current setting or interact
    \*/
    interact.pointerMoveTolerance = function (newValue) {
        if (isNumber(newValue)) {
            pointerMoveTolerance = newValue;

            return this;
        }

        return pointerMoveTolerance;
    };

    /*\
     * interact.maxInteractions
     [ method ]
     **
     * Returns or sets the maximum number of concurrent interactions allowed.
     * By default only 1 interaction is allowed at a time (for backwards
     * compatibility). To allow multiple interactions on the same Interactables
     * and elements, you need to enable it in the draggable, resizable and
     * gesturable `'max'` and `'maxPerElement'` options.
     **
     - newValue (number) #optional Any number. newValue <= 0 means no interactions.
    \*/
    interact.maxInteractions = function (newValue) {
        if (isNumber(newValue)) {
            maxInteractions = newValue;

            return this;
        }

        return maxInteractions;
    };

    interact.createSnapGrid = function (grid) {
        return function (x, y) {
            var offsetX = 0,
                offsetY = 0;

            if (isObject(grid.offset)) {
                offsetX = grid.offset.x;
                offsetY = grid.offset.y;
            }

            var gridx = Math.round((x - offsetX) / grid.x),
                gridy = Math.round((y - offsetY) / grid.y),

                newX = gridx * grid.x + offsetX,
                newY = gridy * grid.y + offsetY;

            return {
                x: newX,
                y: newY,
                range: grid.range
            };
        };
    };

    function endAllInteractions (event) {
        for (var i = 0; i < interactions.length; i++) {
            interactions[i].pointerEnd(event, event);
        }
    }

    function listenToDocument (doc) {
        if (contains(documents, doc)) { return; }

        var win = doc.defaultView || doc.parentWindow;

        // add delegate event listener
        for (var eventType in delegatedEvents) {
            events.add(doc, eventType, delegateListener);
            events.add(doc, eventType, delegateUseCapture, true);
        }

        if (PointerEvent) {
            if (PointerEvent === win.MSPointerEvent) {
                pEventTypes = {
                    up: 'MSPointerUp', down: 'MSPointerDown', over: 'mouseover',
                    out: 'mouseout', move: 'MSPointerMove', cancel: 'MSPointerCancel' };
            }
            else {
                pEventTypes = {
                    up: 'pointerup', down: 'pointerdown', over: 'pointerover',
                    out: 'pointerout', move: 'pointermove', cancel: 'pointercancel' };
            }

            events.add(doc, pEventTypes.down  , listeners.selectorDown );
            events.add(doc, pEventTypes.move  , listeners.pointerMove  );
            events.add(doc, pEventTypes.over  , listeners.pointerOver  );
            events.add(doc, pEventTypes.out   , listeners.pointerOut   );
            events.add(doc, pEventTypes.up    , listeners.pointerUp    );
            events.add(doc, pEventTypes.cancel, listeners.pointerCancel);

            // autoscroll
            events.add(doc, pEventTypes.move, autoScroll.edgeMove);
        }
        else {
            events.add(doc, 'mousedown', listeners.selectorDown);
            events.add(doc, 'mousemove', listeners.pointerMove );
            events.add(doc, 'mouseup'  , listeners.pointerUp   );
            events.add(doc, 'mouseover', listeners.pointerOver );
            events.add(doc, 'mouseout' , listeners.pointerOut  );

            events.add(doc, 'touchstart' , listeners.selectorDown );
            events.add(doc, 'touchmove'  , listeners.pointerMove  );
            events.add(doc, 'touchend'   , listeners.pointerUp    );
            events.add(doc, 'touchcancel', listeners.pointerCancel);

            // autoscroll
            events.add(doc, 'mousemove', autoScroll.edgeMove);
            events.add(doc, 'touchmove', autoScroll.edgeMove);
        }

        events.add(win, 'blur', endAllInteractions);

        try {
            if (win.frameElement) {
                var parentDoc = win.frameElement.ownerDocument,
                    parentWindow = parentDoc.defaultView;

                events.add(parentDoc   , 'mouseup'      , listeners.pointerEnd);
                events.add(parentDoc   , 'touchend'     , listeners.pointerEnd);
                events.add(parentDoc   , 'touchcancel'  , listeners.pointerEnd);
                events.add(parentDoc   , 'pointerup'    , listeners.pointerEnd);
                events.add(parentDoc   , 'MSPointerUp'  , listeners.pointerEnd);
                events.add(parentWindow, 'blur'         , endAllInteractions );
            }
        }
        catch (error) {
            interact.windowParentError = error;
        }

        if (events.useAttachEvent) {
            // For IE's lack of Event#preventDefault
            events.add(doc, 'selectstart', function (event) {
                var interaction = interactions[0];

                if (interaction.currentAction()) {
                    interaction.checkAndPreventDefault(event);
                }
            });

            // For IE's bad dblclick event sequence
            events.add(doc, 'dblclick', doOnInteractions('ie8Dblclick'));
        }

        documents.push(doc);
    }

    listenToDocument(document);

    function indexOf (array, target) {
        for (var i = 0, len = array.length; i < len; i++) {
            if (array[i] === target) {
                return i;
            }
        }

        return -1;
    }

    function contains (array, target) {
        return indexOf(array, target) !== -1;
    }

    function matchesSelector (element, selector, nodeList) {
        if (ie8MatchesSelector) {
            return ie8MatchesSelector(element, selector, nodeList);
        }

        // remove /deep/ from selectors if shadowDOM polyfill is used
        if (window !== realWindow) {
            selector = selector.replace(/\/deep\//g, ' ');
        }

        return element[prefixedMatchesSelector](selector);
    }

    function matchesUpTo (element, selector, limit) {
        while (isElement(element)) {
            if (matchesSelector(element, selector)) {
                return true;
            }

            element = parentElement(element);

            if (element === limit) {
                return matchesSelector(element, selector);
            }
        }

        return false;
    }

    // For IE8's lack of an Element#matchesSelector
    // taken from http://tanalin.com/en/blog/2012/12/matches-selector-ie8/ and modified
    if (!(prefixedMatchesSelector in Element.prototype) || !isFunction(Element.prototype[prefixedMatchesSelector])) {
        ie8MatchesSelector = function (element, selector, elems) {
            elems = elems || element.parentNode.querySelectorAll(selector);

            for (var i = 0, len = elems.length; i < len; i++) {
                if (elems[i] === element) {
                    return true;
                }
            }

            return false;
        };
    }

    // requestAnimationFrame polyfill
    (function() {
        var lastTime = 0,
            vendors = ['ms', 'moz', 'webkit', 'o'];

        for(var x = 0; x < vendors.length && !realWindow.requestAnimationFrame; ++x) {
            reqFrame = realWindow[vendors[x]+'RequestAnimationFrame'];
            cancelFrame = realWindow[vendors[x]+'CancelAnimationFrame'] || realWindow[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!reqFrame) {
            reqFrame = function(callback) {
                var currTime = new Date().getTime(),
                    timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                    id = setTimeout(function() { callback(currTime + timeToCall); },
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }

        if (!cancelFrame) {
            cancelFrame = function(id) {
                clearTimeout(id);
            };
        }
    }());

    /* global exports: true, module, define */

    // http://documentcloud.github.io/underscore/docs/underscore.html#section-11
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = interact;
        }
        exports.interact = interact;
    }
    // AMD
    else if (typeof define === 'function' && define.amd) {
        define('interact', [],function() {
            return interact;
        });
    }
    else {
        realWindow.interact = interact;
    }

} (window));

define('util/dice', ['lodash'], function(_) {
    function roll(size) {
        return _.random(1, size);
    }

    return {
        d: function d(number, size) {
            if (!size) {
                size = number;
                number = 1;
            }
            var total = 0;
            _.times(number, function(n) { total += roll(size); });
            return total;
        },
        dd: function dd(number, size) {
            if (!size) {
                size = number;
                number = 1;
            }
            var rolls = [];
            _.times(number, function(n) { rolls.push(roll(size)); });
            return rolls;
        }
    };
});

define('util/find', ['lodash'], function(_) {
   return function find(roll) {
        return function rollMatch(tab) {
            if(tab.MinValue !== undefined && roll < tab.MinValue)
                return false;
            if(tab.MaxValue !== undefined && roll > tab.MaxValue)
                return false;
            if(tab.MinValue === undefined && tab.MaxValue === undefined && tab.ValueArray !== undefined && _.find(tab.ValueArray, function(num) { return num === roll; }) === undefined)
                return false;
            if(tab.MinValue === undefined && tab.MaxValue === undefined && tab.ValueArray === undefined && tab.Value !== undefined && tab.Value !== roll)
                return false;
            return true;
        };
    };
});

define('world/options', ['lodash','util/dice',], function(_, dice) {
    var d = dice.d;
    var dd = dice.dd;

    var ns = {};

    ns.Passengers = {
        '0': { Value: 0, Low: function() { return 0; }, Mid: function() { return 0; }, High: function() { return 0; } },
        '1': { Value: 1, Low: function() { return d(2, 6) - 6; }, Mid: function() { return d(1,6) - 2; }, High: function() { return 0; } },
        '2': { Value: 2, Low: function() { return d(2, 6); }, Mid: function() { return d(1, 6); }, High: function() { return d(1, 6) - d(1, 6); } },
        '3': { Value: 3, Low: function() { return d(2, 6); }, Mid: function() { return d(2, 6) - d(1, 6); }, High: function() { return d(2, 6) - d(2, 6); } },
        '4': { Value: 4, Low: function() { return d(3, 6) - d(1, 6); }, Mid: function() { return d(2, 6) - d(1, 6); }, High: function() { return d(2, 6) - d(1, 6); } },
        '5': { Value: 5, Low: function() { return d(3, 6) - d(1, 6); }, Mid: function() { return d(3, 6) - d(2, 6); }, High: function() { return d(2, 6) - d(1, 6); } },
        '6': { Value: 6, Low: function() { return d(3, 6); }, Mid: function() { return d(3, 6) - d(2, 6); }, High: function() { return d(3, 6) - d(2, 6); } },
        '7': { Value: 7, Low: function() { return d(3, 6); }, Mid: function() { return d(3, 6) - d(1, 6); }, High: function() { return d(3, 6) - d(2, 6); } },
        '8': { Value: 8, Low: function() { return d(4, 6); }, Mid: function() { return d(3, 6) - d(1, 6); }, High: function() { return d(3, 6) - d(1, 6); } },
        '9': { Value: 9, Low: function() { return d(4, 6); }, Mid: function() { return d(3, 6); }, High: function() { return d(3, 6) - d(1, 6); } },
        '10': { Value: 10, Low: function() { return d(5, 6); }, Mid: function() { return d(3, 6); }, High: function() { return d(3, 6) - d(1, 6); } },
        '11': { Value: 11, Low: function() { return d(5, 6); }, Mid: function() { return d(4, 6); }, High: function() { return d(3, 6); } },
        '12': { Value: 12, Low: function() { return d(6, 6); }, Mid: function() { return d(4, 6); }, High: function() { return d(3, 6); } },
        '13': { Value: 13, Low: function() { return d(6, 6); }, Mid: function() { return d(4, 6); }, High: function() { return d(4, 6); } },
        '14': { Value: 14, Low: function() { return d(7, 6); }, Mid: function() { return d(5, 6); }, High: function() { return d(4, 6); } },
        '15': { Value: 15, Low: function() { return d(8, 6); }, Mid: function() { return d(5, 6); }, High: function() { return d(4, 6); } },
        '16': { Value: 16, Low: function() { return d(9, 6); }, Mid: function() { return d(6, 6); }, High: function() { return d(5, 6); } },
    };

    ns.Freight = {
        '0': { Value: 0, Incidental: function() { return 0; }, Minor: function() { return 0; }, Major: function() { return 0; } },
        '1': { Value: 1, Incidental: function() { return 0; }, Minor: function() { return d(1, 6) - 4; }, Major: function() { return d(1, 6) - 4; } },
        '2': { Value: 2, Incidental: function() { return 0; }, Minor: function() { return d(1, 6) - 1; }, Major: function() { return d(1, 6) - 2; } },
        '3': { Value: 3, Incidental: function() { return 0; }, Minor: function() { return d(1, 6); }, Major: function() { return d(1, 6) - 1; } },
        '4': { Value: 4, Incidental: function() { return 0; }, Minor: function() { return d(1, 6) + 1; }, Major: function() { return d(1, 6); } },
        '5': { Value: 5, Incidental: function() { return 0; }, Minor: function() { return d(1, 6) + 2; }, Major: function() { return d(1, 6) + 1; } },
        '6': { Value: 6, Incidental: function() { return 0; }, Minor: function() { return d(1, 6) + 3; }, Major: function() { return d(1, 6) + 2; } },
        '7': { Value: 7, Incidental: function() { return 0; }, Minor: function() { return d(1, 6) + 4; }, Major: function() { return d(1, 6) + 3; } },
        '8': { Value: 8, Incidental: function() { return 0; }, Minor: function() { return d(1, 6) + 5; }, Major: function() { return d(1, 6) + 4; } },
        '9': { Value: 9, Incidental: function() { return d(1, 6) - 2; }, Minor: function() { return d(1, 6) + 5; }, Major: function() { return d(1, 6) + 5; } },
        '10': { Value: 10, Incidental: function() { return d(1, 6); }, Minor: function() { return d(1, 6) + 7; }, Major: function() { return d(1, 6) + 6; } },
        '11': { Value: 11, Incidental: function() { return d(1, 6) + 1; }, Minor: function() { return d(1, 6) + 8; }, Major: function() { return d(1, 6) + 7; } },
        '12': { Value: 12, Incidental: function() { return d(1, 6) + 2; }, Minor: function() { return d(1, 6) + 9; }, Major: function() { return d(1, 6) + 8; } },
        '13': { Value: 13, Incidental: function() { return d(1, 6) + 3; }, Minor: function() { return d(1, 6) + 10; }, Major: function() { return d(1, 6) + 9; } },
        '14': { Value: 14, Incidental: function() { return d(1, 6) + 4; }, Minor: function() { return d(1, 6) + 12; }, Major: function() { return d(1, 6) + 10; } },
        '15': { Value: 15, Incidental: function() { return d(1, 6) + 5; }, Minor: function() { return d(1, 6) + 14; }, Major: function() { return d(1, 6) + 11; } },
        '16': { Value: 16, Incidental: function() { return d(1, 6) + 6; }, Minor: function() { return d(1, 6) + 16; }, Major: function() { return d(1, 6) + 12; } },
    };

    ns.TradeModifier = {
        '-1': { Value: -1, PurchaseMod: 4, SaleMod: .25 },
        '0': { Value: 0, PurchaseMod: 3, SaleMod: .45 },
        '1': { Value: 1, PurchaseMod: 2, SaleMod: .5 },
        '2': { Value: 2, PurchaseMod: 1.75, SaleMod: .55 },
        '3': { Value: 3, PurchaseMod: 1.5, SaleMod: .6 },
        '4': { Value: 4, PurchaseMod: 1.35, SaleMod: .65 },
        '5': { Value: 5, PurchaseMod: 1.25, SaleMod: .75 },
        '6': { Value: 6, PurchaseMod: 1.2, SaleMod: .8 },
        '7': { Value: 7, PurchaseMod: 1.15, SaleMod: .85 },
        '8': { Value: 8, PurchaseMod: 1.1, SaleMod: .9 },
        '9': { Value: 9, PurchaseMod: 1.05, SaleMod: .95 },
        '10': { Value: 10, PurchaseMod: 1, SaleMod: 1 },
        '11': { Value: 11, PurchaseMod: .95, SaleMod: 1.05 },
        '12': { Value: 12, PurchaseMod: .9, SaleMod: 1.1 },
        '13': { Value: 13, PurchaseMod: .85, SaleMod: 1.15 },
        '14': { Value: 14, PurchaseMod: .8, SaleMod: 1.2 },
        '15': { Value: 15, PurchaseMod: .75, SaleMod: 1.25 },
        '16': { Value: 16, PurchaseMod: .7, SaleMod: 1.35 },
        '17': { Value: 17, PurchaseMod: .65, SaleMod: 1.5 },
        '18': { Value: 18, PurchaseMod: .55, SaleMod: 1.75 },
        '19': { Value: 19, PurchaseMod: .5, SaleMod: 2 },
        '20': { Value: 20, PurchaseMod: .4, SaleMod: 3 },
        '21': { Value: 21, PurchaseMod: .25, SaleMod: 4 },
    };

    ns.Bases = {
        N: { Name: 'Naval', Label: 'N', DisplayCharacter: String.fromCharCode(0x2605) },
        S: { Name: 'Scout', Label: 'S', DisplayCharacter: String.fromCharCode(0x25B2) },
        R: { Name: 'Research', Label: 'R', DisplayCharacter: String.fromCharCode(0x03C0) },
        T: { Name: 'TAS', Label: 'T', DisplayCharacter: String.fromCharCode(0x263c) },
        I: { Name: 'Imperial Consolate', Label: 'I', DisplayCharacter: String.fromCharCode(0x25A0) },
        P: { Name: 'Pirate', Label: 'P', DisplayCharacter: String.fromCharCode(0x2620) },
    };

    ns.Starbase = {
        'A': { Label: 'A', Class: 'A', Quality: 'Excellent', BerthingCost: '1d6*1000', Fuel: 'Refined', Facilities: 'Shipyard (all) Repair' },
        'B': { Label: 'B', Class: 'B', Quality: 'Good', BerthingCost: '1d6*500', Fuel: 'Refined', Facilities: 'Shipyard (spacecraft) Repair' },
        'C': { Label: 'C', Class: 'C', Quality: 'Routine', BerthingCost: '1d6*100', Fuel: 'Unrefined', Facilities: 'Shipyard (small craft) Repair' },
        'D': { Label: 'D', Class: 'D', Quality: 'Poor', BerthingCost: '1d6*10', Fuel: 'Unrefined', Facilities: 'Limited Repair' },
        'E': { Label: 'E', Class: 'E', Quality: 'Frontier', BerthingCost: '0', Fuel: 'None', Facilities: 'None' },
        'X': { Label: 'X', Class: 'X', Quality: 'No Starbase', BerthingCost: '0', Fuel: 'None', Facilities: 'None' }
    };

    ns.Size = {
        '0': { Value: 0, Label: '0', WorldSize: 800, SurfaceGravity: 0 },
        '1': { Value: 1, Label: '1', WorldSize: 1600, SurfaceGravity: .05 },
        '2': { Value: 2, Label: '2', WorldSize: 3200, SurfaceGravity: .15 },
        '3': { Value: 3, Label: '3', WorldSize: 4800, SurfaceGravity: .25 },
        '4': { Value: 4, Label: '4', WorldSize: 6400, SurfaceGravity: .35 },
        '5': { Value: 5, Label: '5', WorldSize: 8000, SurfaceGravity: .45 },
        '6': { Value: 6, Label: '6', WorldSize: 9600, SurfaceGravity: .7 },
        '7': { Value: 7, Label: '7', WorldSize: 11200, SurfaceGravity: .9 },
        '8': { Value: 8, Label: '8', WorldSize: 12800, SurfaceGravity: 1 },
        '9': { Value: 9, Label: '9', WorldSize: 14400, SurfaceGravity: 1.25 },
        'A': { Value: 10, Label: 'A', WorldSize: 16000, SurfaceGravity: 1.4 }
    }

    ns.SurvivalGear = {
        VaccSuit: { Name: 'Vacc Suit' },
        Respirator: { Name: 'Respirator' },
        Filter: { Name: 'Filter' },
        AirSupply: { Name: 'Air Supply' }
    };

    ns.Atmosphere = {
        '0': { Value: 0, Label: '0', Name: 'None', Preassure: '0', SurvivalGear: [ ns.SurvivalGear.VaccSuit ] },
        '1': { Value: 1, Label: '1', Name: 'Trace', Preassure: '0.001 to 0.09', SurvivalGear: [ ns.SurvivalGear.VaccSuit ] },
        '2': { Value: 2, Label: '2', Name: 'Very Thin, Tainted', Preassure: '0.1 to 0.42', SurvivalGear: [ ns.SurvivalGear.Respirator, ns.SurvivalGear.Filter ] },
        '3': { Value: 3, Label: '3', Name: 'Very Thin', Preassure: '0.1 to 0.42', SurvivalGear: [ ns.SurvivalGear.Respirator ] },
        '4': { Value: 4, Label: '4', Name: 'Thin, Tainted', Preassure: '0.43 to 0.7', SurvivalGear: [ ns.SurvivalGear.Filter ] },
        '5': { Value: 5, Label: '5', Name: 'Thin', Preassure: '0.43 to 0.7', SurvivalGear: [] },
        '6': { Value: 6, Label: '6', Name: 'Standard', Preassure: '0.71 to 1.49', SurvivalGear: [] },
        '7': { Value: 7, Label: '7', Name: 'Standard, Tainted', Preassure: '0.71 to 1.49', SurvivalGear: [ ns.SurvivalGear.Filter ] },
        '8': { Value: 8, Label: '8', Name: 'Dense', Preassure: '1.5 to 2.49', SurvivalGear: [] },
        '9': { Value: 9, Label: '9', Name: 'Dense, Tainted', Preassure: '1.5 to 2.49', SurvivalGear: [ ns.SurvivalGear.Filter ] },
        'A': { Value: 10, Label: 'A', Name: 'Exotic', Preassure: 'Varies', SurvivalGear: [ ns.SurvivalGear.AirSupply ] },
        'B': { Value: 11, Label: 'B', Name: 'Corrosive', Preassure: 'Varies', SurvivalGear: [ ns.SurvivalGear.VaccSuit ] },
        'C': { Value: 12, Label: 'C', Name: 'Insidious', Preassure: 'Varies', SurvivalGear: [ ns.SurvivalGear.VaccSuit ] },
        'D': { Value: 13, Label: 'D', Name: 'Dense, High', Preassure: '2.5+', SurvivalGear: [] },
        'E': { Value: 14, Label: 'E', Name: 'Thin, Low', Preassure: '0.5 or less', SurvivalGear: [] },
        'F': { Value: 15, Label: 'F', Name: 'Unusual', Preassure: 'Varies', SurvivalGear: [] }
    };

    ns.Temperature = {
        'X': { Type: 'Varies', AverageTemperature: 'Varies' },
        'Frozen': { Type: 'Frozen', AverageTemperature: '-51 or less' },
        'Cold': { Type: 'Cold', AverageTemperature: '-51 to 0' },
        'Temperate': { Type: 'Temperate', AverageTemperature: '0 to 30' },
        'Hot': { Type: 'Hot', AverageTemperature: '31 to 80' },
        'Roasting': { Type: 'Roasting', AverageTemperature: '81+' }
    };

    ns.Hydrographic = {
        '0': { Value: 0, Label: '0', Percentage: '0-5' },
        '1': { Value: 1, Label: '1', Precentage: '6-15' },
        '2': { Value: 2, Label: '2', Percentage: '16-25' },
        '3': { Value: 3, Label: '3', Percentage: '26-35' },
        '4': { Value: 4, Label: '4', Precentage: '36-45' },
        '5': { Value: 5, Label: '5', Percentage: '46-55' },
        '6': { Value: 6, Label: '6', Percentage: '56-65' },
        '7': { Value: 7, Label: '7', Percentage: '66-75' },
        '8': { Value: 8, Label: '8', Percentage: '79-85' },
        '9': { Value: 9, Label: '9', Percentage: '86-95' },
        'A': { Value: 10, Label: 'A', Percentage: '96-100' }
    };

    ns.Population = {
        '0': { Value: 0, Label: '0' },
        '1': { Value: 1, Label: '1' },
        '2': { Value: 2, Label: '2' },
        '3': { Value: 3, Label: '3' },
        '4': { Value: 4, Label: '4' },
        '5': { Value: 5, Label: '5' },
        '6': { Value: 6, Label: '6' },
        '7': { Value: 7, Label: '7' },
        '8': { Value: 8, Label: '8' },
        '9': { Value: 9, Label: '9' },
        'A': { Value: 10, Label: 'A' },
        'B': { Value: 11, Label: 'B' },
        'C': { Value: 12, Label: 'C' },
        'D': { Value: 13, Label: 'D' },
        'E': { Value: 14, Label: 'E' },
        'F': { Value: 15, Label: 'F' },
    };

    ns.Government = {
        '0': { Value: 0, Label: '0', Name: 'Anarchy' },
        '1': { Value: 1, Label: '1', Name: 'Company/corporation' },
        '2': { Value: 2, Label: '2', Name: 'Participating democracy' },
        '3': { Value: 3, Label: '3', Name: 'Self-perpetuating oligarchy' },
        '4': { Value: 4, Label: '4', Name: 'Representative democracy' },
        '5': { Value: 5, Label: '5', Name: 'Feudal technocracy' },
        '6': { Value: 6, Label: '6', Name: 'Captive government' },
        '7': { Value: 7, Label: '7', Name: 'Balkanisation' },
        '8': { Value: 8, Label: '8', Name: 'Civil service bureaucracy' },
        '9': { Value: 9, Label: '9', Name: 'Impersonal bureaucracy' },
        'A': { Value: 10, Label: 'A', Name: 'Charismatic dictator' },
        'B': { Value: 11, Label: 'B', Name: 'Non-charismatic dictator' },
        'C': { Value: 12, Label: 'C', Name: 'Charismatic oligarchy' },
        'D': { Value: 13, Label: 'D', Name: 'Religious dictatorship' },
    };

    ns.Law = {
        '0': { Value: 0, Label: '0' },
        '1': { Value: 1, Label: '1' },
        '2': { Value: 2, Label: '2' },
        '3': { Value: 3, Label: '3' },
        '4': { Value: 4, Label: '4' },
        '5': { Value: 5, Label: '5' },
        '6': { Value: 6, Label: '6' },
        '7': { Value: 7, Label: '7' },
        '8': { Value: 8, Label: '8' },
        '9': { Value: 9, Label: '9' },
    };

    ns.TechLevel = {
        '0': { Value: 0, Label: '0', Type: 'Primitive' },
        '1': { Value: 1, Label: '1', Type: 'Primitive' },
        '2': { Value: 2, Label: '2', Type: 'Primitive' },
        '3': { Value: 3, Label: '3', Type: 'Primitive' },
        '4': { Value: 4, Label: '4', Type: 'Industrial' },
        '5': { Value: 5, Label: '5', Type: 'Industrial' },
        '6': { Value: 6, Label: '6', Type: 'Industrial' },
        '7': { Value: 7, Label: '7', Type: 'Pre-Stellar' },
        '8': { Value: 8, Label: '8', Type: 'Pre-Stellar' },
        '9': { Value: 9, Label: '9', Type: 'Pre-Stellar' },
        'A': { Value: 10, Label: 'A', Type: 'Early Stellar' },
        'B': { Value: 11, Label: 'B', Type: 'Early Stellar' },
        'C': { Value: 12, Label: 'C', Type: 'Average Stellar' },
        'D': { Value: 13, Label: 'D', Type: 'Average Stellar' },
        'E': { Value: 14, Label: 'E', Type: 'Average Stellar' },
        'F': { Value: 15, Label: 'F', Type: 'High Stellar' },
        'G': { Value: 16, Label: 'G', Type: 'High Stellar' },
        'H': { Value: 17, Label: 'H', Type: 'Advanced Stellar' },
        'I': { Value: 18, Label: 'I', Type: 'Advanced Stellar' },
        'J': { Value: 19, Label: 'J', Type: 'Advanced Stellar' },
        'K': { Value: 20, Label: 'K', Type: 'Advanced Stellar' },
        'L': { Value: 21, Label: 'L', Type: 'Super Tech' },
        'M': { Value: 22, Label: 'M', Type: 'Super Tech' },
        'N': { Value: 23, Label: 'N', Type: 'Super Tech' },
        'O': { Value: 24, Label: 'O', Type: 'Super Tech' },
        'P': { Value: 25, Label: 'P', Type: 'Super Tech' },
        'Q': { Value: 26, Label: 'Q', Type: 'Super Tech' },
        'R': { Value: 27, Label: 'R', Type: 'Super Tech' },
        'S': { Value: 28, Label: 'S', Type: 'Super Tech' },
        'T': { Value: 29, Label: 'T', Type: 'Super Tech' },
        'U': { Value: 30, Label: 'U', Type: 'Super Tech' },
        'V': { Value: 31, Label: 'V', Type: 'Super Tech' },
    };

    ns.TradeGoods = {
        '11': {
            Label: '11',
            Type: 'Basic Electronics',
            LotMultiplier: 10,
            BasePrice: 10000,
            BlackMarket: false
        },
        '12': {
            Label: '12',
            Type: 'Basic Machine Parts',
            LotMultiplier: 10,
            BasePrice: 10000,
            BlackMarket: false
        },
        '13': {
            Label: '13',
            Type: 'Basic Manufactured Goods',
            LotMultiplier: 10,
            BasePrice: 10000,
            BlackMarket: false
        },
        '14': {
            Label: '14',
            Type: 'Basic Raw Materias',
            LotMultiplier: 10,
            BasePrice: 5000,
            BlackMarket: false
        },
        '15': {
            Label: '15',
            Type: 'Basic Consumables',
            LotMultiplier: 10,
            BasePrice: 2000,
            BlackMarket: false
        },
        '16': {
            Label: '16',
            Type: 'Basic Ore',
            LotMultiplier: 10,
            BasePrice: 1000,
            BlackMarket: false
        },
        '21': {
            Label: '21',
            Type: 'Advanced Electronics',
            LotMultiplier: 5,
            BasePrice: 100000,
            BlackMarket: false
        },
        '22': {
            Label: '22',
            Type: 'Advanced Machine Parts',
            LotMultiplier: 5,
            BasePrice: 75000,
            BlackMarket: false
        },
        '23': {
            Label: '23',
            Type: 'Advanced Manufactured Goods',
            LotMultiplier: 5,
            BasePrice: 100000,
            BlackMarket: false
        },
        '24': {
            Label: '24',
            Type: 'Advanced Weapons',
            LotMultiplier: 5,
            BasePrice: 150000,
            BlackMarket: false
        },
        '25': {
            Label: '25',
            Type: 'Advanced Vehicles',
            LotMultiplier: 5,
            BasePrice: 180000,
            BlackMarket: false
        },
        '26': {
            Label: '26',
            Type: 'Biochemicals',
            LotMultiplier: 5,
            BasePrice: 50000,
            BlackMarket: false
        },
        '31': {
            Label: '31',
            Type: 'Crystals and Gems',
            LotMultiplier: 5,
            BasePrice: 20000,
            BlackMarket: false
        },
        '32': {
            Label: '32',
            Type: 'Cybernetics',
            LotMultiplier: 1,
            BasePrice: 250000,
            BlackMarket: false
        },
        '33': {
            Label: '33',
            Type: 'Live Animals',
            LotMultiplier: 10,
            BasePrice: 10000,
            BlackMarket: false
        },
        '34': {
            Label: '34',
            Type: 'Luxury Consumables',
            LotMultiplier: 10,
            BasePrice: 20000,
            BlackMarket: false
        },
        '35': {
            Label: '35',
            Type: 'Luxury Goods',
            LotMultiplier: 1,
            BasePrice: 200000,
            BlackMarket: false
        },
        '36': {
            Label: '36',
            Type: 'Medical Supplies',
            LotMultiplier: 5,
            BasePrice: 50000,
            BlackMarket: false
        },
        '41': {
            Label: '41',
            Type: 'Petrochemicals',
            LotMultiplier: 10,
            BasePrice: 10000,
            BlackMarket: false
        },
        '42': {
            Label: '42',
            Type: 'Pharmaceuticals',
            LotMultiplier: 1,
            BasePrice: 100000,
            BlackMarket: false
        },
        '43': {
            Label: '43',
            Type: 'Polymers',
            LotMultiplier: 10,
            BasePrice: 7000,
            BlackMarket: false
        },
        '44': {
            Label: '44',
            Type: 'Precious Metals',
            LotMultiplier: 1,
            BasePrice: 50000,
            BlackMarket: false
        },
        '45': {
            Label: '45',
            Type: 'Radioactives',
            LotMultiplier: 1,
            BasePrice: 1000000,
            BlackMarket: false
        },
        '46': {
            Label: '46',
            Type: 'Robots',
            LotMultiplier: 5,
            BasePrice: 400000,
            BlackMarket: false
        },
        '51': {
            Label: '51',
            Type: 'Spices',
            LotMultiplier: 5,
            BasePrice: 6000,
            BlackMarket: false
        },
        '52': {
            Label: '52',
            Type: 'Textiles',
            LotMultiplier: 10,
            BasePrice: 3000,
            BlackMarket: false
        },
        '53': {
            Label: '53',
            Type: 'Uncommon Ore',
            LotMultiplier: 10,
            BasePrice: 5000,
            BlackMarket: false
        },
        '54': {
            Label: '54',
            Type: 'Uncommon Raw Materials',
            LotMultiplier: 10,
            BasePrice: 20000,
            BlackMarket: false
        },
        '55': {
            Label: '55',
            Type: 'Wood',
            LotMultiplier: 10,
            BasePrice: 1000,
            BlackMarket: false
        },
        '56': {
            Label: '56',
            Type: 'Vehicles',
            LotMultiplier: 10,
            BasePrice: 15000,
            BlackMarket: false
        },
        '61': {
            Label: '61',
            Type: 'Illegal Biochemicals',
            LotMultiplier: 5,
            BasePrice: 50000,
            BlackMarket: true
        },
        '62': {
            Label: '62',
            Type: 'Illegal Cybernetics',
            LotMultiplier: 1,
            BasePrice: 25000,
            BlackMarket: true
        },
        '63': {
            Label: '63',
            Type: 'Illegal Drugs',
            LotMultiplier: 1,
            BasePrice: 100000,
            BlackMarket: true
        },
        '64': {
            Label: '64',
            Type: 'Illegal Luxuries',
            LotMultiplier: 1,
            BasePrice: 50000,
            BlackMarket: true
        },
        '65': {
            Label: '65',
            Type: 'Illegal Weapons',
            LotMultiplier: 5,
            BasePrice: 150000,
            BlackMarket: true
        },
        '66': {
            Label: '66',
            Type: 'Exotics',
            LotMultiplier: 1,
            BasePrice: 0,
            BlackMarket: true
        }
    };

    ns.CommonTradeGoods = {
        '11': ns.TradeGoods['11'],
        '12': ns.TradeGoods['12'],
        '13': ns.TradeGoods['13'],
        '14': ns.TradeGoods['14'],
        '15': ns.TradeGoods['15'],
        '16': ns.TradeGoods['16'],
    };

    var tradeGoodMapper = function(val) {
        return ns.TradeGoods[val];
    };

    ns.TravelCodes = {
       'A': {
           Label: 'A',
           PassengerCurrentWorldModifier: 2,
           PassengerDestinationWorldModifier: -2,
           FreightCurrentWorldModifier: 5,
           FreightDestinationWorldModifier: -5,
           TradeGoodPurchaseModifiers: {},
           TradeGoodSaleModifiers: { '24': 2, '62': 6, '65': 8 }
        },
       'R': {
           Label: 'R',
           PassengerCurrentWorldModifier: 4,
           PassengerDestinationWorldModifier: -4,
           FreightCurrentWorldModifier: -5,
           FreightDestinationWorldModifier: null,
           TradeGoodPurchaseModifiers: {},
           TradeGoodSaleModifiers: { '24': 4, '62': 6, '65': 10 }
        },
       'G': {
           Label: ' ',
           PassengerCurrentWorldModifier: 0,
           PassengerDestinationWorldModifier: 0,
           FreightCurrentWorldModifier: 0,
           FreightDestinationWorldModifier: 0,
           TradeGoodPurchaseModifiers: {},
           TradeGoodSaleModifiers: {}
        }
    };

    ns.TradeCodes = {
        'Ag': {
            Label: 'Ag',
            Name: 'Agricultural',
            PassengerCurrentWorldModifier: 0,
            PassengerDestinationWorldModifier: 0,
            FreightCurrentWorldModifier: 2,
            FreightDestinationWorldModifier: 1,
            TradeGoods: _.map(['26', '33', '34', '52', '54', '55', '61', '64'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: { '15': 3, '26': 1, '33': 2, '34': 2, '52': 7, '55': 6, '64': 2 },
            TradeGoodSaleModifiers: { '12': 2, '14': 3, '41': 1, '45': -3, '46': 2 }
        },
        'As': {
            Label: 'As',
            Name: 'Asteroid',
            PassengerCurrentWorldModifier: 1,
            PassengerDestinationWorldModifier: -1,
            FreightCurrentWorldModifier: -3,
            FreightDestinationWorldModifier: 1,
            TradeGoods:  _.map(['31', '42', '44', '45', '53', '63'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: { '15': -4, '16': 4, '31': 2, '42': 2, '44': 3, '45': 2, '53': 4, '54': 2 },
            TradeGoodSaleModifiers: { '15': 1, '21': 3, '22': 2, '25': 2, '32': 1, '62': 4 }
        },
        'Ba': {
            Label: 'Ba',
            Name: 'Barren',
            PassengerCurrentWorldModifier: -5,
            PassengerDestinationWorldModifier: -5,
            FreightCurrentWorldModifier: null,
            FreightDestinationWorldModifier: -5,
            TradeGoods: null,
            TradeGoodPurchaseModifiers: {},
            TradeGoodSaleModifiers: {}
        },
        'De': {
            Label: 'De',
            Name: 'Desert',
            PassengerCurrentWorldModifier: -1,
            PassengerDestinationWorldModifier: -1,
            FreightCurrentWorldModifier: -3,
            FreightDestinationWorldModifier: 0,
            TradeGoods:  _.map(['31', '41', '42', '44', '45', '51', '54', '63'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: { '31': 1, '41': 2, '44': 1, '51': 2 },
            TradeGoodSaleModifiers: {}
        },
        'Fl': {
            Label: 'Fl',
            Name: 'Fluid Oceans',
            PassengerCurrentWorldModifier: 0,
            PassengerDestinationWorldModifier: 0,
            FreightCurrentWorldModifier: -3,
            FreightDestinationWorldModifier: 0,
            TradeGoods:  _.map(['41', '44'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: {},
            TradeGoodSaleModifiers: { '15': 1 }
        },
        'Ga': {
            Label: 'Ga',
            Name: 'Garden',
            PassengerCurrentWorldModifier: 2,
            PassengerDestinationWorldModifier: 2,
            FreightCurrentWorldModifier: 2,
            FreightDestinationWorldModifier: 1,
            TradeGoods: _.map(['33', '34', '51', '55', '64'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: { '14': 2, '15': 1 },
            TradeGoodSaleModifiers: {}
        },
        'Hi': {
            Label: 'Hi',
            Name: 'High Population',
            PassengerCurrentWorldModifier: 0,
            PassengerDestinationWorldModifier: 4,
            FreightCurrentWorldModifier: 2,
            FreightDestinationWorldModifier: 0,
            TradeGoods: _.map(['35', '36', '42', '63'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: { '42': 1 },
            TradeGoodSaleModifiers: { '13': 2, '15': 1, '23': 1, '34': 2, '51': 2, '52': 3, '56': 1, '63': 6, '64': 4 }
        },
        'Ht': {
            Label: 'Ht',
            Name: 'High Technology',
            PassengerCurrentWorldModifier: 0,
            PassengerDestinationWorldModifier: 0,
            FreightCurrentWorldModifier: 0,
            FreightDestinationWorldModifier: 0,
            TradeGoods: _.map(['21', '22', '23', '24', '25', '32', '36', '46', '56', '62', '65'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: { '11': 3, '21': 3, '22': 1, '24': 2, '25': 2, '36': 2, '56': 1, '65': 2 },
            TradeGoodSaleModifiers: { '44': 1, '45': 1, '46': 1, '54': 1 }
        },
        'Ic': {
            Label: 'Ic',
            Name: 'Ice-Capped',
            PassengerCurrentWorldModifier: 1,
            PassengerDestinationWorldModifier: -1,
            FreightCurrentWorldModifier: -3,
            FreightDestinationWorldModifier: 0,
            TradeGoods: _.map(['31', '41', '44', '53'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: { '31': 1, '44': 2 },
            TradeGoodSaleModifiers: { '15': 1, '32': 1, '62': 4 }
        },
        'In': {
            Label: 'In',
            Name: 'Industrial',
            PassengerCurrentWorldModifier: 2,
            PassengerDestinationWorldModifier: 1,
            FreightCurrentWorldModifier: 3,
            FreightDestinationWorldModifier: 2,
            TradeGoods: _.map(['21', '22', '23', '24', '25', '43', '46', '56', '65'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: { '11': 2, '12': 5, '13': 5, '21': 2, '22': 2, '23': 1, '56': 2 },
            TradeGoodSaleModifiers: { '14': 2, '16': 3, '26': 2, '31': 3, '26': 2, '41': 2, '44': 2, '45': 3, '53': 3, '54': 2, '55': 1, '61': 6 }
        },
        'Lo': {
            Label: 'Lo',
            Name: 'Low Population',
            PassengerCurrentWorldModifier: 0,
            PassengerDestinationWorldModifier: -4,
            FreightCurrentWorldModifier: -5,
            FreightDestinationWorldModifier: 0,
            TradeGoods: _.map(['45'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: { '45': -4 },
            TradeGoodSaleModifiers: { '33': 3 }
        },
        'Lt': {
            Label: 'Lt',
            Name: 'Low Technology',
            PassengerCurrentWorldModifier: 0,
            PassengerDestinationWorldModifier: 0,
            FreightCurrentWorldModifier: 0,
            FreightDestinationWorldModifier: 0,
            TradeGoods: [],
            TradeGoodPurchaseModifiers: {},
            TradeGoodSaleModifiers: { '11': 1, '41': 2, '42': 1 }
        },
        'Na': {
            Label: 'Na',
            Name: 'Non-Agricultural',
            PassengerCurrentWorldModifier: 0,
            PassengerDestinationWorldModifier: 0,
            FreightCurrentWorldModifier: -3,
            FreightDestinationWorldModifier: 1,
            TradeGoods: [],
            TradeGoodPurchaseModifiers: { '12': 2, '13': 2 },
            TradeGoodSaleModifiers: { '52': 2 }
        },
        'Ni': {
            Label: 'Ni',
            Name: 'Non-Industrial',
            PassengerCurrentWorldModifier: 0,
            PassengerDestinationWorldModifier: -1,
            FreightCurrentWorldModifier: -3,
            FreightDestinationWorldModifier: 1,
            TradeGoods: _.map(['52'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: {},
            TradeGoodSaleModifiers: { '11': 2, '12': 3, '13': 3, '16': 1, '21': 1, '22': 1, '43': 1, '45': -2, '53': 1, '56': 2 }
        },
        'Po': {
            Label: 'Po',
            Name: 'Poor',
            PassengerCurrentWorldModifier: -2,
            PassengerDestinationWorldModifier: -1,
            FreightCurrentWorldModifier: -3,
            FreightDestinationWorldModifier: -3,
            TradeGoods: [],
            TradeGoodPurchaseModifiers: {},
            TradeGoodSaleModifiers: { '11': 1, '14': 2, '24': 1, '36': 1, '51': 3, '65': 6 }
        },
        'Ri': {
            Label: 'Ri',
            Name: 'Rich',
            PassengerCurrentWorldModifier: -1,
            PassengerDestinationWorldModifier: 2,
            FreightCurrentWorldModifier: 2,
            FreightDestinationWorldModifier: 2,
            TradeGoods: [],
            TradeGoodPurchaseModifiers: { '11': 1 },
            TradeGoodSaleModifiers: { '21': 2, '23': 2, '25': 2, '31': 2, '32': 2, '34': 2, '35': 4, '36': 1, '42': 2, '43': 2, '44': 3, '51': 3, '55': 2, '62': 8, '63': 6, '64': 6 }
        },
        'Va': {
            Label: 'Va',
            Name: 'Vacuum',
            PassengerCurrentWorldModifier: 0,
            PassengerDestinationWorldModifier: 0,
            FreightCurrentWorldModifier: 0,
            FreightDestinationWorldModifier: 0,
            TradeGoods: [],
            TradeGoodPurchaseModifiers: {},
            TradeGoodSaleModifiers: {}
        },
        'Wa': {
            Label: 'Wa',
            Name: 'Water World',
            PassengerCurrentWorldModifier: 0,
            PassengerDestinationWorldModifier: 0,
            FreightCurrentWorldModifier: -3,
            FreightDestinationWorldModifier: 0,
            TradeGoods: _.map(['26', '34', '41', '42', '51', '54', '61', '63', '64'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: { '15': 2, '26': 2, '34': 1, '54': 1, '61': 2, '64': 1 },
            TradeGoodSaleModifiers: {}
        }
    };

    ns.FactionStrength = {
        'Obscure': { Strength: 'Obscure Group' },
        'Fringe': { Strength: 'Fringe Group' },
        'Minor': { Strength: 'Minor Group' },
        'Notable': { Strength: 'Notable Group' },
        'Significant': { Strength: 'Significant' },
        'Overwhelming': { Strength: 'Overwhelming popular support' }
    };

    return ns;
});

define('world/modifiers', [], function() {
    var ns = {};

    ns.Starbase = {
        Starbase: -7,
        Population: function(world) {
            return world.Population.Value;
        }
    };

    ns.Size = { Size: -2 };

    ns.Atmosphere = {
        Atmosphere: -7,
        Size: function(world) {
            if(world.Size.Value <= 2)
                return -100;

            return world.Size.Value;
        }
    };

    ns.Temperature = {
        Atmosphere: function(world) {
            switch(world.Atmosphere.Value) {
                case 0:
                case 1:
                    return null;
                case 2:
                case 3:
                    return -2;
                case 4:
                case 5:
                case 14:
                    return -1
                case 6:
                case 7:
                    return 0;
                case 8:
                case 9:
                    return 1;
                case 10:
                case 13:
                case 15:
                    return 2;
                case 11:
                case 12:
                    return 6;
                default:
                    return 0;
            }
        }
    };

    ns.Hydrographic = {
        Hydrographic: -7,
        Size: function(world) {
            var size = world.Size.Value;
            var atmo = world.Atmosphere.Value;
            if(size <= 1)
                return size - 6;
            if(atmo === 10 && size >= 3 && size <= 4)
                return size - 6;
            if(atmo === 2 || atmo === 3 || atmo === 11 || atmo == 12)
                return size - 4;
            return size;
        },
        Atmosphere: function(world) {
            switch(world.Atmosphere.Value) {
                case 0:
                case 1:
                case 10:
                case 11:
                case 12:
                    return -4;
                default:
                    return 0;
            }
        },
        Temperature: function(world) {
            if(world.Atmosphere.Value === 13)
                return 0;
            switch(world.Temperature.Name) {
                case 'Hot':
                    return -2;
                case 'Roasting':
                    return -6;
                default:
                    return 0;
            }
        }
    };

    ns.Population = {
        Population: -2,
        Size: function(world) {
            var size = world.Size.Value;
            if(size <= 2 || size === 10)
                return -1;
            return 0;
        },
        Atmosphere: function(world) {
            var atmo = world.Atmosphere.Value;
            if(atmo === 5 || atmo === 6 || atmo === 8)
                return 1;
            return -1;
        }
    };

    ns.Government = {
        Government: -7,
        Population: function(world) {
            var pop = world.Population.Value;
            if(pop <= 0)
                return -100;
            return world.Population.Value;
        }
    };

    ns.Law = {
        Law: -7,
        Population: function(world) {
            if(world.Population.Value <= 0)
                return -100;
            return 0;
        },
        Government: function(world) {
            return world.Government.Value;
        }
    };

    ns.TechLevel = {
        Starbase: function(world) {
            switch(world.Starbase.Label) {
                case 'A':
                    return 6;
                case 'B':
                    return 4;
                case 'C':
                    return 2;
                case 'X':
                    return -4;
                default:
                    return 0;
            }
        },
        Size: function(world) {
            switch(world.Size.Value) {
                case 0:
                case 1:
                    return 2;
                case 2:
                case 3:
                case 4:
                    return 1;
                default:
                    return 0;
            }
        },
        Atmosphere: function(world) {
            switch(world.Atmosphere.Value) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                    return 1;
                default:
                    return 0;
            }
        },
        Hydrographic: function(world) {
            switch(world.Hydrographic.Value) {
                case 0:
                case 9:
                    return 1;
                case 10:
                    return 2;
                default:
                    return 0;
            }
        },
        Population: function(world) {
            switch(world.Population.Value) {
                case 0:
                    return -100;
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 9:
                    return 1;
                case 10:
                    return 2;
                case 11:
                    return 3;
                case 12:
                    return 4;
                default:
                    return 0;
            }
        },
        Government: function(world) {
            switch(world.Government.Value) {
                case 0:
                case 5:
                    return 1;
                case 7:
                    return 2;
                case 13:
                case 14:
                    return -2;
                default:
                    return 0;
            }
        }
    };

    ns.Bases = {
        Starbase: 0
    };

    ns.TradeCodes = {
        Size: 0,
        Atmosphere: 0,
        Hydro: 0,
        Population: 0,
        Government: 0,
        Law: 0,
        TechLevel: 0
    };

    ns.TravelCodes = {
        Atmosphere: 0,
        Government: 0,
        Law: 0
    };

    ns.Factions = {
        Population: 0,
        Government: 0
    };

    ns.FactionCount = {
        Government: function(world) {
            var gov = world.Government.Value;
            if(gov === 0 || gov === 7)
                return 1;
            if(gov >= 10)
                return -1;
            return 0;
        }
    };

    return ns;
});

define('world/tables', [], function() {
    var ns = {};

    ns.Freight = [
        { Item: '0', Value: 0, MaxValue: 0 },
        { Item: '1', Value: 1 },
        { Item: '2', Value: 2 },
        { Item: '3', Value: 3 },
        { Item: '4', Value: 4 },
        { Item: '5', Value: 5 },
        { Item: '6', Value: 6 },
        { Item: '7', Value: 7 },
        { Item: '8', Value: 8 },
        { Item: '9', Value: 9 },
        { Item: '10', Value: 10 },
        { Item: '11', Value: 11 },
        { Item: '12', Value: 12 },
        { Item: '13', Value: 13 },
        { Item: '14', Value: 14 },
        { Item: '15', Value: 15 },
        { Item: '16', Value: 16, MinValue: 16 },
    ];

    ns.Passengers = [
        { Item: '0', Value: 0, MaxValue: 0 },
        { Item: '1', Value: 1 },
        { Item: '2', Value: 2 },
        { Item: '3', Value: 3 },
        { Item: '4', Value: 4 },
        { Item: '5', Value: 5 },
        { Item: '6', Value: 6 },
        { Item: '7', Value: 7 },
        { Item: '8', Value: 8 },
        { Item: '9', Value: 9 },
        { Item: '10', Value: 10 },
        { Item: '11', Value: 11 },
        { Item: '12', Value: 12 },
        { Item: '13', Value: 13 },
        { Item: '14', Value: 14 },
        { Item: '15', Value: 15 },
        { Item: '16', Value: 16, MinValue: 16 },
    ];

    ns.TradeModifier = [
        { Item: '-1', Value: -1, MaxValue: -1 },
        { Item: '0', Value: 0 },
        { Item: '1', Value: 1 },
        { Item: '2', Value: 2 },
        { Item: '3', Value: 3 },
        { Item: '4', Value: 4 },
        { Item: '5', Value: 5 },
        { Item: '6', Value: 6 },
        { Item: '7', Value: 7 },
        { Item: '8', Value: 8 },
        { Item: '9', Value: 9 },
        { Item: '10', Value: 10 },
        { Item: '11', Value: 11 },
        { Item: '12', Value: 12 },
        { Item: '13', Value: 13 },
        { Item: '14', Value: 14 },
        { Item: '15', Value: 15 },
        { Item: '16', Value: 16 },
        { Item: '17', Value: 17 },
        { Item: '18', Value: 18 },
        { Item: '19', Value: 19 },
        { Item: '20', Value: 20 },
        { Item: '21', Value: 21, MinValue: 21 },
    ];

    ns.Starbase = [
        { Item: 'X', MaxValue: 2 },
        { Item: 'E', MinValue: 3, MaxValue: 4 },
        { Item: 'D', MinValue: 5, MaxValue: 6 },
        { Item: 'C', MinValue: 7, MaxValue: 8 },
        { Item: 'B', MinValue: 9, MaxValue: 10 },
        { Item: 'A', MinValue: 11 }
    ];

    ns.Size = [
        { Item: '0', Value: 0, MaxValue: 0 },
        { Item: '1', Value: 1 },
        { Item: '2', Value: 2 },
        { Item: '3', Value: 3 },
        { Item: '4', Value: 4 },
        { Item: '5', Value: 5 },
        { Item: '6', Value: 6 },
        { Item: '7', Value: 7 },
        { Item: '8', Value: 8 },
        { Item: '9', Value: 9 },
        { Item: 'A', Value: 10, MinValue: 10 }
    ];

    ns.Atmosphere = [
        { Item: '0', Value: 0, MaxValue: 0 },
        { Item: '1', Value: 1 },
        { Item: '2', Value: 2 },
        { Item: '3', Value: 3 },
        { Item: '4', Value: 4 },
        { Item: '5', Value: 5 },
        { Item: '6', Value: 6 },
        { Item: '7', Value: 7 },
        { Item: '8', Value: 8 },
        { Item: '9', Value: 9 },
        { Item: 'A', Value: 10 },
        { Item: 'B', Value: 11 },
        { Item: 'C', Value: 12 },
        { Item: 'D', Value: 13 },
        { Item: 'E', Value: 14 },
        { Item: 'F', Value: 15, MinValue: 15 }
    ];

    ns.Temperature = [
        { Item: 'X', Value: null },
        { Item: 'Frozen', MaxValue: 2 },
        { Item: 'Cold', MinValue: 3, MaxValue: 4 },
        { Item: 'Temperate', MinValue: 5, MaxValue: 9 },
        { Item: 'Hot', MinValue: 10, MaxValue: 11 },
        { Item: 'Roasting', MinValue: 12 }
    ];

    ns.Hydrographic = [
        { Item: '0', MaxValue: 0, Value: 0 },
        { Item: '1', Value: 1 },
        { Item: '2', Value: 2 },
        { Item: '3', Value: 3 },
        { Item: '4', Value: 4 },
        { Item: '5', Value: 5 },
        { Item: '6', Value: 6 },
        { Item: '7', Value: 7 },
        { Item: '8', Value: 8 },
        { Item: '9', Value: 9 },
        { Item: 'A', Value: 10, MinValue: 10 }
    ];

    ns.Population = [
        { Item: '0', MaxValue: 0, Value: 0 },
        { Item: '1', Value: 1 },
        { Item: '2', Value: 2 },
        { Item: '3', Value: 3 },
        { Item: '4', Value: 4 },
        { Item: '5', Value: 5 },
        { Item: '6', Value: 6 },
        { Item: '7', Value: 7 },
        { Item: '8', Value: 8 },
        { Item: '9', Value: 9 },
        { Item: 'A', Value: 10 },
        { Item: 'B', Value: 11 },
        { Item: 'C', Value: 12 },
        { Item: 'D', Value: 13 },
        { Item: 'E', Value: 14 },
        { Item: 'F', MinValue: 15, Value: 15 }
    ];

    ns.Government = [
        { Item: '0', Value: 0, MaxValue: 0 },
        { Item: '1', Value: 1 },
        { Item: '2', Value: 2 },
        { Item: '3', Value: 3 },
        { Item: '4', Value: 4 },
        { Item: '5', Value: 5 },
        { Item: '6', Value: 6 },
        { Item: '7', Value: 7 },
        { Item: '8', Value: 8 },
        { Item: '9', Value: 9 },
        { Item: 'A', Value: 10 },
        { Item: 'B', Value: 11 },
        { Item: 'C', Value: 12 },
        { Item: 'D', Value: 13, MinValue: 13 }
    ];

    ns.Law = [
        { Item: '0', Value: 0, MaxValue: 0 },
        { Item: '1', Value: 1 },
        { Item: '2', Value: 2 },
        { Item: '3', Value: 3 },
        { Item: '4', Value: 4 },
        { Item: '5', Value: 5 },
        { Item: '6', Value: 6 },
        { Item: '7', Value: 7 },
        { Item: '8', Value: 8 },
        { Item: '9', Value: 9, MinValue: 9 }
    ];

    ns.TradeCodes = [
        {
            Item: 'Ag',
            Requirements: {
                Atmosphere: { MinValue: 4, MaxValue: 9 },
                Hydrographic: { MinValue: 4, MaxValue: 8 },
                Population: { MinValue: 5, MaxValue: 7 }
              }
        },
        {
            Item: 'As',
            Requirements: {
                Size: { Value: 0 },
                Atmosphere: { Value: 0 },
                Hydrographic: { Value: 0 }
            }
        },
        {
            Item: 'Ba',
            Requirements: {
                Population: { Value: 0 },
                Law: { Value: 0 },
                TechLevel: { Value: 0 }
            }
        },
        {
            Item: 'De',
            Requirements: {
                Atmosphere: { MinValue: 2 },
                Hydrographic: { Value: 0 }
            }
        },
        {
            Item: 'Fl',
            Requirements: {
                Atmosphere: { MinValue: 10 },
                Hydrographic: { MinValue: 1 }
            }
        },
        {
            Item: 'Ga',
            Requirements: {
                Size: { MinValue: 5 },
                Atmosphere: { MinValue: 4, MaxValue: 9 },
                Hydrographic: { MinValue: 4, MaxValue: 8 }
            }
        },
        {
            Item: 'Hi',
            Requirements: {
                Population: { MinValue: 9 }
            }
        },
        {
            Item: 'Ht',
            Requirements: {
                TechLevel: { MinValue: 12 }
            }
        },
        {
            Item: 'Ic',
            Requirements: {
                Atmosphere: { MinValue: 0, MaxValue: 1 },
                Hydrographic: { MinValue: 1 }
            }
        },
        {
            Item: 'In',
            Requirements: {
                Atmosphere: { ValueArray: [ 0, 1, 2, 4, 7, 9 ] },
                Population: { MinValue: 9 }
            }
        },
        {
            Item: 'Lo',
            Requirements: {
                Population: { MinValue: 1, MaxValue: 3 }
            }
        },
        {
            Item: 'Lt',
            Requirements: {
                TechLevel: { MaxValue: 5 }
            }
        },
        {
            Item: 'Na',
            Requirements: {
                Atmosphere: { MinValue: 0, MaxValue: 3 },
                Hydrographic: { MinValue: 0, MaxValue: 3 },
                Population: { MinValue: 6 }
            }
        },
        {
            Item: 'Ni',
            Requirements: {
                Population: { MinValue: 4, MaxValue: 6 }
            }
        },
        {
            Item: 'Po',
            Requirements: {
                Atmosphere: { MinValue: 2, MaxValue: 5 },
                Hydrographic: { MinValue: 0, MaxValue: 3 }
            }
        },
        {
            Item: 'Ri',
            Requirements: {
                Atmosphere: { ValueArray: [6, 8] },
                Population: { MinValue: 6, MaxValue: 8 }
            }
        },
        {
            Item: 'Va',
            Requirements: {
                Atmosphere: { Value: 0 }
            }
        },
        {
            Item: 'Wa',
            Requirements: {
                Hydrographic: { Value: 10 }
            }
        }
    ];

    ns.TechLevel = [
        { Item: '0', Value: 0, MaxValue: 0 },
        { Item: '1', Value: 1 },
        { Item: '2', Value: 2 },
        { Item: '3', Value: 3 },
        { Item: '4', Value: 4 },
        { Item: '5', Value: 5 },
        { Item: '6', Value: 6 },
        { Item: '7', Value: 7 },
        { Item: '8', Value: 8 },
        { Item: '9', Value: 9 },
        { Item: 'A', Value: 10 },
        { Item: 'B', Value: 11 },
        { Item: 'C', Value: 12 },
        { Item: 'D', Value: 13 },
        { Item: 'E', Value: 14 },
        { Item: 'F', Value: 15, MinValue: 15 },
    ];

    ns.FactionStrength = [
        { Item: 'Obscure', MaxValue: 3 },
        { Item: 'Fringe', MinValue: 4, MaxValue: 5 },
        { Item: 'Minor', MinValue: 6, MaxValue: 7 },
        { Item: 'Notable', MinValue: 8, MaxValue: 9 },
        { Item: 'Significant', MinValue: 10, MaxValue: 11 },
        { Item: 'Overwheming', MinValue: 12 }
    ];

    return ns;
});

define('world/generators',
    ['lodash', 'util/dice', 'util/find', 'world/options'],
    function(_, dice, find, options) {
    var d = dice.d;
    var dd = dice.dd;

    var StarbaseBases = {
      'A': [
        { MinValue: 8, Base: options.Bases.N },
        { MinValue: 10, Base: options.Bases.S },
        { MinValue: 8, Base: options.Bases.R },
        { MinValue: 4, Base: options.Bases.T },
        { MinValue: 6, Base: options.Bases.I }
      ],
      'B': [
        { MinValue: 8, Base: options.Bases.N },
        { MinValue: 8, Base: options.Bases.S },
        { MinValue: 10, Base: options.Bases.R },
        { MinValue: 6, Base: options.Bases.T },
        { MinValue: 8, Base: options.Bases.I },
        { MinValue: 12, Base: options.Bases.P }
      ],
      'C': [
        { MinValue: 8, Base: options.Bases.S },
        { MinValue: 10, Base: options.Bases.R },
        { MinValue: 10, Base: options.Bases.T },
        { MinValue: 10, Base: options.Bases.I },
        { MinValue: 10, Base: options.Bases.P }
      ],
      'D': [
        { MinValue: 7, Base: options.Bases.S },
        { MinValue: 12, Base: options.Bases.P }
      ],
      'E': [
        { MinValue: 12, Base: options.Bases.P }
      ],
      'X': []
    };

    var ns = {};

    ns.GasGiant = function (world, tables, modifiers, options) {
      world.GasGiant = d(2, 6) < 10;
    };

    ns.TradeCodes = function(world, tables, modifiers, options) {
      world.TradeCodes = _.chain(tables.TradeCodes)
        .filter(function(tab) {
            return _.every(Object.keys(tab.Requirements), function(label) { 
                return find(world[label].Value)(tab.Requirements[label]);
            });
        })
        .map(function(tab) {
            return options.TradeCodes[tab.Item];
        })
        .value();
    }

    ns.Bases = function(world, tables, modifiers, options) {
      world.Bases = _.chain(StarbaseBases[world.Starbase.Label])
        .filter(function(base) { return d(2, 6) >= base.MinValue; })
        .map(function(base) { return base.Base; })
        .value();
    };

    ns.TravelCodes = function(world, tables, modifiers, options) {
    var R = [];
    var A = [
        function(world) { return world.Atmosphere.Value >= 10; },
        function(world) { var law = world.Law.Value; return law === 0 || law >= 9; },
        function(world) { var gov = world.Government.Value; return gov === 0 || gov === 7 || gov === 10; }
    ];

    var item = options.TravelCodes['G'];

    if(_.find(R, function(f) { return f(world); }))
        item = options.TravelCodes['R'];
    else if(_.find(A, function(f) { return f(world); }))
        item = options.TravelCodes['A'];

    world.TravelCodes = [item];
    };

    ns.Atmosphere = function(world, tables, modifiers, options) {
      var field = 'Atmosphere';
      var mod = modifiers[field];
      var tab = tables[field];

      if(world[field] !== undefined && world[field] !== null)
          return;

      var modi = _.map(mod, function(func) { return func instanceof Function ? func(world) : func; });
      var mods = modi;
      var roll = d(2, 6);
      modi = _.some(modi, function(val) { return !val instanceof Number; })
        ? _.find(modi, function(val) { return !val instanceof Number; })
        : _.reduce(modi, function(memo, num) { return memo + num; }, roll);

      var label = _.find(tab, find(modi));
      var item = options[field][label.Item];

      if(world.Size.Value <= 4) {
          if(item.Value <= 2)
            item = options[field]['0'];
          else if(item.Value <= 5)
            item = options[field]['1'];
          else
            item = options[field]['A'];
      }

      world[field] = item;
    };

    ns.Factions = function(world, tables, modifiers, options) {
    function genGovType() {
        var field = 'Government';
        var opt = options[field];
        var tab = tables[field];
        var mod = modifiers[field];

        if(!tab)
            throw new Exception(field + ' table not found.');

        var modi = _.map(mod, function(func) { return func instanceof Function ? func(world) : func; });
        var roll = d(2, 6);
        modi = _.some(modi, function(val) { return typeof(val) !== 'number'; })
            ? _.find(modi, function(val) { return typeof(val) !== 'number'; })
            : _.reduce(modi, function(memo, num) { return memo + num; }, roll);

        var label = _.find(tab, find(modi));
        return opt[label.Item];
    }

    function genStrength() {
        return options.FactionStrength[_.find(tables.FactionStrength, find(d(2, 6))).Item];
    }

    world.Factions = [];

    if(world.Population.Value <= 0)
        return;

    var modi = _.map(modifiers['FactionCount'], function(func) { return func instanceof Function ? func(world) : func; });
    var roll = d(1, 3);
    modi = _.some(modi, function(val) { return typeof(val) !== 'number'; })
        ? _.find(modi, function(val) { return typeof(val) !== 'number'; })
        : _.reduce(modi, function(memo, num) { return memo + num; }, roll);

    _.times(modi, function() { world.Factions.push({ Government: genGovType(), Strength: genStrength() }); });
    };

    return ns;
});

define('name/planet', [], function() {
    return ['A\'Coloo',
        'A\'Glaxu',
        'A\'Umgam',
        'Abenz',
        'Abhijit',
        'Achelous',
        'Acheron',
        'Acon',
        'Acon I\'Kali',
        'Adeent',
        'Adonis',
        'Aeacus',
        'Aelon',
        'Aether',
        'Affar',
        'Ahemait',
        'Ailuros',
        'Aiwendil',
        'Akog',
        'Alklha',
        'Alkonost',
        'Allatu',
        'Allel',
        'Allis',
        'Almaren',
        'Alorv',
        'Aman',
        'Amasia',
        'Amenhotep',
        'America',
        'Amun',
        'Amurru',
        'Amymone',
        'Anan',
        'Anar Troni',
        'Anat',
        'Ancalagon',
        'Andish',
        'Andromedae',
        'Andron',
        'Anic',
        'Anid',
        'AnimTr\'Zarbe',
        'Anit',
        'Anith',
        'Anti',
        'Antini',
        'Antliae',
        'Anuradha',
        'Ao-Shun',
        'Apep',
        'ArbidTaxu',
        'Ardra',
        'Arietis',
        'Arin',
        'Artemis',
        'Ascack',
        'Ashadha',
        'Asherah',
        'Ashiesha',
        'Ashima',
        'Ashvini',
        'Asia',
        'Assid',
        'Astarte',
        'Asteria',
        'Atargatis',
        'Aten',
        'Atlas',
        'Atropos',
        'Australia',
        'Autrimpas',
        'Avalonia',
        'Axan',
        'Axon',
        'Aya',
        'Azur',
        'B\'Baja',
        'B\'Brahvi',
        'B\'Cirri',
        'B\'Hudi',
        'B\'Madi',
        'B\'Mani',
        'B\'Movi',
        'B\'Xani',
        'Ba-Ja',
        'Ba-Pef',
        'Baalou',
        'Bacia',
        'Baja',
        'Bajy',
        'Baka Shroni',
        'Balme',
        'Bandi',
        'Bani',
        'BaniTani',
        'Bantha',
        'Bari',
        'Barkiee',
        'Barkyo',
        'Baxu',
        'Benni',
        'Benzo',
        'Berith',
        'Bhadrapada',
        'BiXiu',
        'Bian-Cheng-Wang',
        'Bias',
        'Bima',
        'Bime',
        'Bisa',
        'Bolthor',
        'Booloo',
        'Boppa',
        'Brani',
        'Brazil',
        'Briareos',
        'Britain',
        'Brogge',
        'Broni',
        'Brynhild',
        'Byota',
        'Cacia',
        'Caeli',
        'Cai-Shen',
        'Cale',
        'Calliope',
        'Callisto',
        'Campa',
        'Cancri',
        'Canum',
        'CardaAnag',
        'Cargga',
        'Carggi',
        'Carinae',
        'Cassiopeiae',
        'Cata',
        'Catta',
        'Centauri',
        'CenteG\'Moisi',
        'Centri',
        'Cephei',
        'Cerberi',
        'Ceres',
        'Ceti',
        'Ceto',
        'Ch\'Cirri',
        'Chang-Er',
        'Chani',
        'Charon',
        'Charri',
        'Charybdis',
        'Chenaii',
        'Chitra',
        'Chorda',
        'Chronos',
        'Chuang-Mu',
        'Churquark',
        'Cimmeria',
        'Circe',
        'Circini',
        'Clio',
        'Clymene',
        'Clytia',
        'Coeurle',
        'Coli',
        'Comus',
        'Conaii',
        'Coni',
        'Cori',
        'Coronae',
        'Corvi',
        'Crucis',
        'Ctige',
        'Cuivienen',
        'Cybe',
        'Cygni',
        'Cylou',
        'D\'Onin',
        'Dagon',
        'Dari Sh\'Haga',
        'Darwin',
        'Daxu',
        'Delphini',
        'Di Xiu',
        'Di-Yu',
        'Dimste',
        'Dinii',
        'Dionysus',
        'Dobrynya',
        'Dokyo',
        'Doradus',
        'Dori Wardi',
        'DouXiu',
        'Draconis',
        'Draeki',
        'Draicia',
        'Draugluin',
        'Drone Talou',
        'Du-Shi-Wang',
        'Dugnai',
        'DuvePara',
        'E\'Ucras',
        'E\'Vasi',
        'Earendil',
        'Earth',
        'Echeer',
        'Egul',
        'Elendil',
        'Elyon',
        'Endiku',
        'Enmessara',
        'Entrar',
        'Erebus',
        'Eridani',
        'Eridu',
        'Ervoim',
        'Eshmun',
        'Este',
        'Ethen',
        'Europa',
        'Europe',
        'F\'Buda',
        'F\'Catti',
        'F\'Trube',
        'Fan-Kui',
        'Fang Xiu',
        'Felis',
        'Fendi',
        'Fornacis',
        'Fotta',
        'France',
        'Freya',
        'Freyr',
        'Fshoda',
        'Fu-Sang',
        'Fu-Xi',
        'Furloo',
        'Gaia',
        'Galli',
        'Gani Glallou',
        'Ganymede',
        'Gaunti',
        'Geminorum',
        'Getha',
        'Getha K\'Waura',
        'Gibson',
        'Gilgamesh',
        'Giraitis',
        'Gjalp',
        'Glana',
        'Glaurung',
        'Goida',
        'Gondwana',
        'Goni',
        'Goni Zarboe',
        'Gonii',
        'Gono',
        'GorniAceas',
        'Gothmog',
        'Gou-Mang',
        'Gowin',
        'Grauduse',
        'Grid',
        'Gudrun',
        'GuiXiu',
        'Gula',
        'Gullveig',
        'Gulveig',
        'Gungi',
        'H\'Buly',
        'H\'Harrhi',
        'H\'Meskloo',
        'H\'Sari',
        'H\'Vile',
        'Hadad',
        'Hades',
        'Hani',
        'Harrha',
        'Hasta',
        'Hata',
        'He-Bo',
        'He-Xian-Gu',
        'Helgardh',
        'Hemen',
        'Hemsut',
        'Henja',
        'Hera',
        'Herculis',
        'Herschelii',
        'Hestia',
        'Heyanga',
        'Hiri',
        'Hole',
        'Hori',
        'Hozo',
        'Hrungnir',
        'Hu-Jing-De',
        'Huldra',
        'Hurquen',
        'Hydrae',
        'Hyldemoer',
        'Hymir',
        'Hyrokkin',
        'I\'Fithpa',
        'Iahamu',
        'Iambe',
        'Iapetus',
        'Igan',
        'Igen',
        'Ihithp',
        'Ilmare',
        'Imentet',
        'Imhotep',
        'Inanna',
        'Indi',
        'Ingol',
        'Ingoum',
        'Irra',
        'Ishkur',
        'Ishtar',
        'Izek',
        'Japan',
        'Jezzo Tryuome',
        'Ji Xiu',
        'Jiao Xiu',
        'JingXiu',
        'Jiri',
        'Jord',
        'Jordani',
        'Jormungand',
        'JotiTigi',
        'Jyeshtha',
        'K\'Hendu',
        'Kaarja',
        'Kada',
        'Kallou',
        'Kalou',
        'Kang Xiu',
        'Kani',
        'Kari',
        'Kazi',
        'Kdoshi',
        'Keliukis',
        'Keni',
        'Kenya',
        'Kh\'Ishtan',
        'Khana',
        'Kini',
        'Kizo',
        'Klana',
        'Koni',
        'Koschei',
        'Kothar',
        'Kr\'Shaniea',
        'Kraha',
        'Krane',
        'Krittika',
        'Kroobsi',
        'KuiXiu',
        'Kulla',
        'Kumarbi',
        'Kz\'Horda',
        'Kzabri',
        'L\'Oalfan',
        'Lacertae',
        'Lachesis',
        'Lan-Cai-He',
        'Landri',
        'Lani',
        'Lanii',
        'Lao-Zi',
        'Lauksargis',
        'Laurasia',
        'Laurentia',
        'Leki',
        'Lemuria',
        'Leno',
        'Leonis',
        'Leporis',
        'Li-Jing',
        'Li-Nezha',
        'Librae',
        'Libuscha',
        'Lif',
        'Lifthrasir',
        'Likyo',
        'Lilith',
        'Liluri',
        'Liu-Bei',
        'LiuXiu',
        'Lu-Yan',
        'Luthien',
        'Lyncis',
        'Lyrae',
        'Lytir',
        'M\'Aman',
        'M\'Cale',
        'M\'Charro',
        'M\'Pequij',
        'M\'Tarke',
        'M\'Wirrni',
        'Macri',
        'Maenali',
        'Maggi',
        'Magha',
        'Magni',
        'Mahes',
        'Maja',
        'Mali',
        'Mandos',
        'Mani',
        'Manwe',
        'Mao Xiu',
        'Mara',
        'Mara Sate',
        'Mari',
        'Marko',
        'Markyo Kroido',
        'Mars',
        'Mautai',
        'MazoCale',
        'Mehen',
        'Meki',
        'Melian',
        'Melkor',
        'Mendes',
        'Menhit',
        'Mensae',
        'Mercury',
        'Meskloo',
        'Metis',
        'Micia Throma',
        'Mikula',
        'Mini',
        'Minos',
        'Modgud',
        'Moisi',
        'Monaii',
        'Moni',
        'Monocerotis',
        'Mori',
        'Morpha',
        'Morthra',
        'Mot',
        'MovooV\'Macri',
        'Moxu',
        'Mrigashirsha',
        'Mula',
        'Mushdama',
        'Mylitta',
        'N\'Chyni',
        'N\'Dari',
        'N\'Marki',
        'N\'Meeha',
        'N\'Methi',
        'N\'Zacha',
        'Nahar',
        'Nairni',
        'Namo',
        'Narni',
        'Neith',
        'Nena',
        'Ninagirsu',
        'Ningizzida',
        'Ninhursaga',
        'Niu Xiu',
        'Njord',
        'Noboe',
        'Nocke',
        'Noctae',
        'Nodi',
        'Notus',
        'Nu Xiu',
        'Nu-Gua',
        'O\'Booly',
        'OallennB\'Hurquark',
        'Oberon',
        'Octantis',
        'Oggon',
        'Oleb',
        'OptrarkBrini',
        'Oreer',
        'Orion',
        'Ostara',
        'Otr',
        'Oynyena',
        'P\'Benzo',
        'Paani',
        'Pako',
        'Pallas',
        'Pannotia',
        'Pazuzu',
        'Pelou',
        'Peng-Lai-Shan',
        'Perseus',
        'Persia',
        'Phaeton',
        'Phalguni',
        'Phoenicis',
        'Pictoris',
        'Piscium',
        'Pkalou',
        'Pluto',
        'Plutus',
        'Pocke',
        'Polevik',
        'Pollux',
        'Poseidon',
        'Prooti',
        'Punarvasu',
        'Pushya',
        'Qetesh',
        'Qin-Shu-Bao',
        'Quarka',
        'Quarkyo',
        'Quebec',
        'Queensland',
        'R\'Anic',
        'R\'Borge',
        'R\'Brilloo',
        'R\'Tona',
        'Raaly',
        'Radigast',
        'Raki',
        'Rani',
        'Reeni',
        'Reni',
        'Reshep',
        'Resheph',
        'Reticuli',
        'Revati',
        'Rhea',
        'Rodinia',
        'Rohini',
        'Roide Bete',
        'Rome',
        'Roni',
        'RoniBera',
        'Roniea',
        'Russia',
        'S\'Verve',
        'Sagittae',
        'Sahara',
        'Sahul',
        'Sari',
        'Sata',
        'Satet',
        'Sati',
        'Saule',
        'Sceptri',
        'Scorpii',
        'Scuti',
        'Seani',
        'SebeNoidi',
        'Sedna',
        'Seker',
        'Septu',
        'Serpentis',
        'Sextantis',
        'Sh\'Heeni',
        'Sh\'Tata',
        'Shahar',
        'Shalim',
        'Shatabhisha',
        'Shen Xiu',
        'Sheni',
        'Shi Xiu',
        'Shooni',
        'Shoza',
        'Shravana',
        'Shravishtha',
        'Shupa',
        'Sietynas',
        'Skadi',
        'Skafa Magga',
        'Skoll',
        'Slaxu',
        'Smei-Gorynich',
        'Solarii',
        'Solovei',
        'Song-Di-Wang',
        'Sonta',
        'Sonte',
        'Spequar',
        'Sudai Acquan',
        'Surtr',
        'Svartalfheim',
        'Svati',
        'Svyatogor',
        'Sychua',
        'Synthi',
        'Syri',
        'T\'Fori',
        'T\'Magga',
        'T\'Mahi',
        'T\'Shani',
        'T\'Tanndi',
        'T\'Traki',
        'TagaPascia',
        'Tale',
        'Tali',
        'Tame',
        'Tanda',
        'Tandi',
        'Tani',
        'Tannda',
        'Tarandi',
        'Taro',
        'Tase',
        'Tatau Wrosi',
        'Tati Gubra',
        'Tauri',
        'Tavle',
        'Tazo',
        'Telmun',
        'TeniSeano',
        'Terra',
        'Teta',
        'Tethys',
        'Tetri',
        'Teva',
        'Th\'Oszunt',
        'Thalassa',
        'Thargi',
        'Theeme',
        'Theia',
        'Theseus',
        'Thiassi',
        'Thiza',
        'Thoth',
        'Thrani',
        'Thrille',
        'Throni',
        'Thrudgelmir',
        'Thuringwethil',
        'Thurta',
        'Thyoph',
        'Tiamat',
        'Tian-Mu',
        'Tily',
        'Titan',
        'Titania',
        'Tnaga',
        'Tossi',
        'Tr\'Reni',
        'Tr\'Vroni',
        'Tracia',
        'Trako Inon',
        'Trande',
        'Trani',
        'Traniea',
        'Troma',
        'Truta T\'Bima',
        'Tulkas',
        'Udid',
        'Udun',
        'Uinen',
        'Ungoliant',
        'Uranus',
        'Urquan',
        'Ursae',
        'Uruk',
        'UtanVini',
        'Utumno',
        'V\'Cacia',
        'V\'Gani',
        'V\'Kale',
        'V\'Thraakne',
        'Vaalbara',
        'Vaganhope',
        'Valder',
        'Valinor',
        'Vana',
        'Vanaheim',
        'Vano Rome',
        'Vasi',
        'Ve',
        'Velle L\'Kloni',
        'Velorum',
        'Veni',
        'Ventau',
        'Venus',
        'Veri',
        'Vespae',
        'Vesta',
        'Victoria',
        'Vide Maha',
        'Vidi',
        'Vilga',
        'Vini',
        'VogaB\'Hykri',
        'Volantis',
        'Vorcia Guly',
        'Vorta H\'Fshoza',
        'Vortai',
        'Vulcan',
        'Vulcia',
        'W\'Goni',
        'W\'Morthri',
        'Warda',
        'Wardi',
        'Wei Xiu',
        'Whrlani',
        'Wile',
        'Xani',
        'Xena',
        'Xi-He',
        'Xi-Shi',
        'Xi-Wang-Mu',
        'Xin Xiu',
        'Xing Xiu',
        'Xu Xiu',
        'Xuan-Wen-Hua',
        'Yaning',
        'Yao-Chi',
        'Yarikh',
        'Yarilo',
        'Yavanna',
        'Yaw',
        'Yi',
        'Yi Xiu',
        'Yorkar',
        'Yu-Qiang',
        'Z\'Jezza',
        'Z\'Lani',
        'ZalkoDr\'Vile',
        'Zede',
        'Zentri',
        'Zera',
        'Zerga',
        'Zergi',
        'Zeri',
        'Zh\'Fera',
        'Zhang Xiu',
        'Zhang-Guo-Lao',
        'Zhen Xiu',
        'Zhong-Li-Quan',
        'Zhu-Yi',
        'Zhuang-Lun-Wang',
        'Zi Xiu',
        'Ziama',
        'Zini',
        'Zion',
        'Zori',
        'Zuri',
        'Zyga',
        'Zyge']
});

define('name', ['lodash', 'name/planet'], function(_, planet) {
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// name_generator.js
// written and released to the public domain by drow <drow@bin.sh>
// http://creativecommons.org/publicdomain/zero/1.0/

  var name_set = {};
  var chain_cache = {};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// generator function

  function generate_name (type) {
    var chain; if (chain = markov_chain(type)) {
      return markov_name(chain);
    }
    return '';
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// generate multiple

  function name_list (type, n_of) {
    var list = [];

    var i; for (i = 0; i < n_of; i++) {
      list.push(generate_name(type));
    }
    return list;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// get markov chain by type

  function markov_chain (type) {
    var chain; if (chain = chain_cache[type]) {
      return chain;
    } else {
      var list; if (list = name_set[type]) {
        var chain; if (chain = construct_chain(list)) {
          chain_cache[type] = chain;
          return chain;
        }
      }
    }
    return false;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// construct markov chain from list of names

  function construct_chain (list) {
    var chain = {};

    var i; for (i = 0; i < list.length; i++) {
      var names = list[i].split(/\s+/);
      chain = incr_chain(chain,'parts',names.length);

      var j; for (j = 0; j < names.length; j++) {
        var name = names[j];
        chain = incr_chain(chain,'name_len',name.length);

        var c = name.substr(0,1);
        chain = incr_chain(chain,'initial',c);

        var string = name.substr(1);
        var last_c = c;

        while (string.length > 0) {
          var c = string.substr(0,1);
          chain = incr_chain(chain,last_c,c);

          string = string.substr(1);
          last_c = c;
        }
      }
    }
    return scale_chain(chain);
  }
  function incr_chain (chain, key, token) {
    if (chain[key]) {
      if (chain[key][token]) {
        chain[key][token]++;
      } else {
        chain[key][token] = 1;
      }
    } else {
      chain[key] = {};
      chain[key][token] = 1;
    }
    return chain;
  }
  function scale_chain (chain) {
    var table_len = {};

    var key; for (key in chain) {
      table_len[key] = 0;

      var token; for (token in chain[key]) {
        var count = chain[key][token];
        var weighted = Math.floor(Math.pow(count,1.3));

        chain[key][token] = weighted;
        table_len[key] += weighted;
      }
    }
    chain['table_len'] = table_len;
    return chain;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// construct name from markov chain

  function markov_name (chain) {
    var parts = select_link(chain,'parts');
    var names = [];

    var i; for (i = 0; i < parts; i++) {
      var name_len = select_link(chain,'name_len');
      var c = select_link(chain,'initial');
      var name = c;
      var last_c = c;

      while (name.length < name_len) {
        c = select_link(chain,last_c);
        name += c;
        last_c = c;
      }
      names.push(name);
    }
    return names.join(' ');
  }
  function select_link (chain, key) {
    var len = chain['table_len'][key];
    var idx = Math.floor(Math.random() * len);

    var t = 0; for (token in chain[key]) {
      t += chain[key][token];
      if (idx < t) { return token; }
    }
    return '-';
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// require.js wrapper written by thomas brown

  var ns = {};

  ns.HasType = function(type) {
      return _.isArray(name_set[type]);
  }

  ns.AddType = function(type, value) {
      if(_.isArray(value)) {
          name_set[type] = value;
          return true;
      }
      return false
  }

  ns.Generate = function(type) {
      if(!type)
          type = _.sample(Object.keys(name_set));
      return generate_name(type);
  }

  ns.Types = function() {
      return Object.keys(name_set);
  }

  ns.AddType('planet', planet);

  return ns;

});

define('world',
    ['lodash', 'util/dice', 'util/find', 'world/options', 'world/modifiers', 'world/tables', 'world/generators', 'name'],
    function(_, dice, find, options, modifiers, tables, generators, name) {
    var d = dice.d;
    var dd = dice.dd;

    function DefineRequirements() {
        return {
            Simple: ['Starbase', 'Size', 'Temperature', 'Hydrographic', 'Population', 'Government', 'Law', 'TechLevel'],
            Complex: ['Atmosphere', 'Bases', 'TradeCodes', 'TravelCodes', 'GasGiant', 'Factions']
        };
    };
    function getMod(label) {
        return function(val) {
            if(val === undefined)
                return [];
            if(_.isArray(val))
                return _.map(val, function(v) { return v[label] === undefined ? [] : v[label]; });
            return val[label] === undefined ? [] : val[label];
        };
    };
    function calculatePassengerMod(currentWorld, targetWorld) {
        var currentPop = currentWorld.Population.Value;
        var currentMod = _.map(currentWorld, getMod('PassengerCurrentWorldModifier'));
        var targetMod = _.map(targetWorld, getMod('PassengerDestinationWorldModifier'));;

        var allMods = _.flatten([currentPop, currentMod, targetMod]);

        if(_.contains(allMods, null))
            return null;

        return _.reduce(allMods, function(memo, num) { return memo + num; }, 0);
    };
    function calculateFreightMod(currentWorld, targetWorld) {
        var targetPop = targetWorld.Population.Value;
        var currentMod = _.map(currentWorld, getMod('FreightCurrentWorldModifier'));
        var targetMod = _.map(targetWorld, getMod('FreightDestinationWorldModifer'));
        var techDiff = Math.abs(currentWorld.TechLevel.Value - targetWorld.TechLevel.Value);

        if(techDiff > 5)
            techDiff = 5;

        var allMods = _.flatten([targetPop, currentMod, targetMod, -techDiff]);

        if(_.contains(allMods, null))
            return null;

        return _.reduce(allMods, function(memo, num) { return memo + num; }, 0);
    };

    return {
        Generate: function() {
            var ns = {};
            var reqs = DefineRequirements();

            function loadDependencies(mod) {
                if(mod instanceof Object)
                    _.chain(Object.keys(mod))
                        .filter(function(val) { return mod[val] instanceof Function && !ns[val]; })
                        .each(function(val) {
                            if(_.contains(reqs.Simple, val))
                                fetchSimpleValue(val);
                            else if(_.contains(reqs.Complex, val))
                                fetchComplexValue(val);
                        });
            }

            function fetchSimpleValue(field) {
                var opt = options[field];
                var mod = modifiers[field];
                var tab = tables[field];

                if(ns[field] !== undefined && ns[field] !== null)
                    return;

                if(!tab)
                    throw new Exception(field + ' table not found.');

                loadDependencies(mod);

                var modi = _.map(mod, function(func) { return func instanceof Function ? func(ns) : func; });
                var mods = modi;
                var roll = d(2, 6);
                modi = _.some(modi, function(val) { return typeof(val) !== 'number'; })
                    ? _.find(modi, function(val) { return typeof(val) !== 'number'; })
                    : _.reduce(modi, function(memo, num) { return memo + num; }, roll);

                var label = _.find(tab, find(modi));
                ns[field] = opt[label.Item];

                reqs.Simple = _.filter(reqs.Simple, function(val) { return val !== field; });
            }

            function fetchComplexValue(field) {
                var opt = options[field];
                var mod = modifiers[field];
                var tab = tables[field];
                var gen = generators[field];

                if(ns[field] !== undefined && ns[field] !== null)
                    return;

                if(!gen)
                    throw field + ' generator not found.';

                loadDependencies(mod);

                gen(ns, tables, modifiers, options);

                reqs.Complex = _.filter(reqs.Complex, function(val) { return val !== field; });
            }

            while(reqs.Simple.length > 0) {
                var field = reqs.Simple.pop();
                fetchSimpleValue(field);
            }

            while(reqs.Complex.length > 0) {
                var field = reqs.Complex.pop();
                fetchComplexValue(field);
            }

            ns.Name = name.Generate('planet');

            return ns;
        },
        GenerateTradeGoods: function(world, variables) {
            variables = variables || {};
            var brokerPercent = variables.BrokerPercent || 0;
            var blackMarket = variables.BlackMarket || false;
            var brokerSkill = variables.BrokerSkill || 0;
            var characteristicModifier = variables.CharacteristicMod || 0;
            var supplierMod = variables.SupplierMod || 0;

            var availableTradeGoods = _.chain(
                _.union(_.map(options.CommonTradeGoods, function(val) { return val; }), 
                    _.chain(world)
                        .filter(function(val) {
                            return (_.isArray(val) && _.some(val, function(obj) { return _.isObject(obj) && obj.TradeGoods !== undefined; }))
                                || (_.isObject(val) && val.TradeGoods !== undefined);
                        })
                        .map(function(val) {
                            if(_.isArray(val))
                                return _.chain(val)
                                    .filter(function(obj) { return _.isObject(obj) && obj.TradeGoods !== undefined; })
                                    .map(function(obj) { return obj.TradeGoods; })
                                    .value();
                            return val.TradeGoods;
                        })
                        .value()))
                .flatten()
                .uniq()
                .value();

            if(_.some(availableTradeGoods, function(m) { return m === null; }))
                return [];

            if(!blackMarket)
                availableTradeGoods = _.filter(availableTradeGoods, function(tg) { return !tg.BlackMarket; });

            var additionalTradeGoodCount = d(1, 6);

            for(additionalTradeGoodCount; additionalTradeGoodCount > 0; additionalTradeGoodCount --) {
                var opt = undefined;
                var i = 0;
                while(opt === undefined || (opt.BlackMarket && !blackMarket)) {
                    var roll = dd(2, 6);
                    opt = options.TradeGoods[roll[0] * 10 + roll[1]];
                    if(i > 100)
                        break;
                    i++;
                }
                availableTradeGoods.push(opt);
            }

            var availableCount = _.countBy(availableTradeGoods, function(tg) { return tg.Type; });

            var purchaseModifiers = _.chain(world)
                .map(function(val) {
                    if(val === undefined)
                        return [];
                    if(_.isArray(val))
                        return _.map(val, function(v) { return v.TradeGoodPurchaseModifiers === undefined ? [] : v.TradeGoodPurchaseModifiers; });
                    return val.TradeGoodPurchaseModifiers === undefined ? [] : val.TradeGoodPurchaseModifiers;
                })
                .flatten()
                .value();

            var saleModifiers = _.chain(world)
                .map(function(val) {
                    if(val === undefined)
                        return [];
                    if(_.isArray(val))
                        return _.map(val, function(v) { return v.TradeGoodSaleModifiers === undefined ? [] : v.TradeGoodSaleModifiers; });
                    return val.TradeGoodSaleModifiers === undefined ? [] : val.TradeGoodSaleModifiers;
                })
                .flatten()
                .value();

            return _.chain(availableTradeGoods)
                .uniq()
                .map(function(tg) {

                    var count = availableCount[tg.Type];

                    var purchaseMod = _.chain(purchaseModifiers)
                        .pluck(tg.Label)
                        .reduce(function(memo, num) { return !_.isNumber(num) || memo > num ? memo : num; }, 0)
                        .value() || 0;

                    var saleMod = _.chain(saleModifiers)
                        .pluck(tg.Label)
                        .reduce(function(memo, num) { return memo > num ? memo : num; }, 0)
                        .value() || 0;

                    var totalMod = brokerSkill + characteristicModifier + purchaseMod - saleMod + supplierMod + d(3, 6);
                    var salePrice = options.TradeModifier[_.find(tables.TradeModifier, find(totalMod)).Item].PurchaseMod * tg.BasePrice;

                    return {
                        Type: tg.Type,
                        TradeGood: tg,
                        Tons: d(1, 6) * tg.LotMultiplier * count,
                        PricePerTon: salePrice,
                        BrokerAmount: salePrice * brokerPercent
                    };
                })
                .sortBy(function(tg) {
                    return tg.Type;
                })
                .value();
        },
        CalculatePassengerMod: function(currentWorld, targetWorld) {
            return calculatePassengerMod(currentWorld, targetWorld);
        },
        GeneratePassengers: function(currentWorld, targetWorld) {
            var totalMod = calculatePassengerMod(currentWorld, targetWorld);

            var item = options.Passengers[_.find(tables.Passengers, find(totalMod)).Item];
            var low = item.Low();
            var mid = item.Mid();
            var high = item.High();

            return { Low: low > 0 ? low : 0, Mid: mid > 0 ? mid : 0, High: high > 0 ? high : 0 };
        },
        CalculateFreightMod: function(currentWorld, targetWorld) {
            return calculateFreightMod(currentWorld, targetWorld);
        },
        GenerateFreight: function(currentWorld, targetWorld) {
            var totalMod = calculateFreightMod(currentWorld, targetWorld);

            var item = options.Freight[_.find(tables.Freight, find(totalMod)).Item];
            var inc = { multi: 1, count: item.Incidental() };
            var minor = { multi: 5, count: item.Minor() };
            var major = { multi: 10, count: item.Major() };

            return _.chain([inc, minor, major])
                .map(function(val) {
                    var arr = [];

                    _.times(val.count, function(n) { arr.push(d(1, 6) * val.multi); });

                    return arr;
                })
                .flatten()
                .sortBy()
                .value();
        },
        GenerateMail: function(currentWorld, targetWorld, variables) {
            var variables = variables || {};
            var isArmed = variables.ShipArmed ? 2 : 0;
            var rank = variables.HighestRank || 0;
            var social = variables.HighestSocial || 0;
            var lowTech = currentWorld.TechLevel.Value <= 5 || targetWorld.TechLevel.Value <= 5 ? -4 : 0;
            var freightMod = calculateFreightMod(currentWorld, targetWorld);

            if(freightMod < -10)
                freightMod = -2;
            else if(freightMod < -5)
                freightMod = -1;
            else if (freightMod < 4)
                freightMod = 0;
            else if (freightMod < 9)
                freightMod = 1;
            else
                freightMod = 2;

            var mailMod = _.reduce([isArmed, rank, social, lowTech, freightMod], function(memo, num) { return memo + num; }, d(2, 6));

            return mailMod >= 12;
        },
        UWP: function worldDesc(world, coords) {
            var labels = ['Starbase', 'Size', 'Atmosphere', 'Hydrographic', 'Population', 'Government', 'Law'];
            var out = world.Name + ' ';
            if(coords)
                out += '(' + coords.x + ', ' +  coords.y + ') ';
            for(var l in labels)
                out += world[labels[l]].Label;
            out += '-' + world.TechLevel.Label + ' ';
            for(var b in world.Bases)
                out += world.Bases[b].Label + ' ';
            for(var t in world.TradeCodes)
                out += world.TradeCodes[t].Label + ' ';
            for(var c in world.TravelCodes)
                out += world.TravelCodes[c].Label + ' ';
            return out.trim();
        }
    };
});

define('render/grid', [], function() {
    var cache = { offset: {}, mouseLoc: {}, size: {} };

    function isCached(opts, c) {
        var offSetX = opts.offSetX || 0;
        var offSetY = opts.offSetY || 0;
        var mouse = opts.mouse || {};
        return cache.offset.x === offSetX
            && cache.offset.y === offSetY
            && cache.mouseLoc.x === mouse.loc.x
            && cache.mouseLoc.y === mouse.loc.y
            && mouse.click.x === null
            && mouse.click.y === null
            && cache.size.width === c.width
            && cache.size.height === c.height;
    }

    function updateCache(opts, c) {
        var offSetX = opts.offSetX || 0;
        var offSetY = opts.offSetY || 0;
        var mouse = opts.mouse || {};
        cached = {
            offset : { x: offSetX, y: offSetY },
            mouseLoc : mouse.loc,
            size: { width: c.width, height: c.height }
        };
        return;
    }

    function loopDraw(drawFunc, size) {
        for (var xGrid = 0; xGrid <= size.width; xGrid++)
            for (var yGrid = 0; yGrid < size.height; yGrid++)
                drawFunc(xGrid, yGrid);
    }

    return function drawHexGrid(opts, c) {
        if(isCached(opts, c))
            return {};

        updateCache(opts, c);

        var returnData = {};

        var alpha = opts.alpha || 1;
        var color = opts.color || '#444';
        var highlightColor = opts.highlightColor || '#666';
        var selectedColor = opts.selectedColor || '#123';
        var lineWidth = opts.lineWidth || 1;
        var radius = opts.radius || 20;
        var offSetX = opts.offSetX || 0;
        var offSetY = opts.offSetY || 0;
        var background = opts.background;
        var mouse = opts.mouse || {};
        var selectedGrids = opts.selectedGrids || {};

        var r = radius;
        var part = 60;
        var hexSize = r * Math.sqrt(3);
        var yHexSize = r * Math.sqrt(2.25);
        var xHexes = c.width / hexSize + 4;
        var yHexes = c.height / yHexSize + 4;
        var hexRad = hexSize / 2;

        var globalOffSetX = offSetX;
        var globalOffSetY = offSetY;

        var mouseTile;
        var clickTile;

        var mapOffSet = {
            x: globalOffSetX === 0
                ? 0
                : globalOffSetX > 0
                    ? Math.floor(globalOffSetX/hexSize/2) * 2
                    : Math.ceil(globalOffSetX/hexSize/2) * 2,
            y: globalOffSetY === 0
                ? 0
                : globalOffSetY > 0
                    ? Math.floor(globalOffSetY/yHexSize/2) * 2
                    : Math.ceil(globalOffSetY/yHexSize/2) * 2
        };

        var size = { width: xHexes, height: yHexes };

        mapOffSet.x += 2;
        mapOffSet.y += 2;

        offSetX = offSetX % (hexSize * 2) - hexSize * 2;
        offSetY = offSetY % (yHexSize * 2) - yHexSize * 2;

        var mapGridCanvas = c.getContext('2d');
        mapGridCanvas.clearRect(0, 0, c.width, c.height);
        mapGridCanvas.globalAlpha = alpha;
        mapGridCanvas.strokeStyle = color;
        mapGridCanvas.lineWidth = lineWidth;

        if(background) {
            mapGridCanvas.fillStyle = background;
            mapGridCanvas.fillRect(0, 0, c.width, c.height);
        }

        function drawGrid(xGrid, yGrid) {
            var shiftX = yGrid % 2 * hexRad;
            var xCenter = xGrid * hexSize + shiftX + offSetX;
            var yCenter = yGrid * yHexSize + offSetY;

            for(var i=0; i<=6; i++) {
                var a = i * part - 90;
                var x = r * Math.cos(a * Math.PI / 180) + xCenter;
                var y = r * Math.sin(a * Math.PI / 180) + yCenter;
                if(i === 0)
                    mapGridCanvas.moveTo(x, y);
                else
                    mapGridCanvas.lineTo(x, y);
            }
        
            if(mouse && mouse.loc && _.isNumber(mouse.loc.x) && _.isNumber(mouse.loc.y)) {
                var mx = mouse.loc.x;
                var my = mouse.loc.y;
                var xDist = mx - xCenter;
                var yDist = my - yCenter;

                var dist = Math.sqrt(xDist * xDist + yDist * yDist);
                if(!mouseTile || mouseTile.dist > dist) {
                    mouseTile = {
                        x: xGrid,
                        y: yGrid,
                        dist: dist
                    };
                    mouseTile.id = mouseTile.x + ',' + mouseTile.y;
                }
            }

            if(mouse && mouse.click && _.isNumber(mouse.click.x) && _.isNumber(mouse.click.y)) {
                var mx = mouse.click.x;
                var my = mouse.click.y;
                var xDist = mx - xCenter;
                var yDist = my - yCenter;

                var dist = Math.sqrt(xDist * xDist + yDist * yDist);
                if(!clickTile || clickTile.dist > dist) {
                    clickTile = {
                        x: xGrid - mapOffSet.x,
                        y: yGrid - mapOffSet.y,
                        dist: dist
                    };
                    clickTile.id = clickTile.x + ',' + clickTile.y;
                }
            }
        }

        mapGridCanvas.beginPath();
        loopDraw(drawGrid, size);
        mapGridCanvas.stroke();

        if(selectedGrids
            && clickTile
            && clickTile.id
            && selectedGrids[clickTile.id]) {
            selectedGrids = _.omit(selectedGrids, clickTile.id);
            clickTile = {};
            returnData.selectedGrids = selectedGrids;
        }

        if(selectedGrids
            && clickTile
            && clickTile.id
            && _.isNumber(clickTile.x)
            && _.isNumber(clickTile.y)) {
            selectedGrids[clickTile.id] = { x: clickTile.x, y: clickTile.y };
            returnData.selectedGrids = selectedGrids;
        }

        mapGridCanvas.strokeStyle = highlightColor;
        mapGridCanvas.lineWidth = lineWidth * 4;

        mapGridCanvas.beginPath();
        if(mouseTile && _.isNumber(mouseTile.x) && _.isNumber(mouseTile.y)) {
            var xGrid = mouseTile.x; 
            var yGrid = mouseTile.y;
            var shiftX = yGrid % 2 * hexRad;
            for(var i = 0; i <= 6; i++) {
                var a = i * part - 90;
                var x = r * Math.cos(a * Math.PI / 180) + xGrid * hexSize + shiftX + offSetX;
                var y = r * Math.sin(a * Math.PI / 180) + yGrid * yHexSize + offSetY;
                if(i === 0)
                    mapGridCanvas.moveTo(x, y);
                else
                    mapGridCanvas.lineTo(x, y);
            }

            returnData.mouseTile = mouseTile;
        }
        else
            returnData.mouseTile = {};

        mapGridCanvas.stroke();

        mapGridCanvas.strokeStyle = selectedColor;

        mapGridCanvas.beginPath();
        if(selectedGrids && _.find(selectedGrids)) {
            for(var g in selectedGrids) {
                var selectedGrid = selectedGrids[g];
                if(!selectedGrid)
                    continue;
                var xGrid = selectedGrid.x + mapOffSet.x;
                var yGrid = selectedGrid.y + mapOffSet.y;
                var shiftX = yGrid % 2 * hexRad;

                if(xGrid > xHexes || xGrid < 0 || yGrid > yHexes || yGrid < 0) {
                    continue;
                }

                for(var i = 0; i <= 6; i++) {
                    var a = i * part - 90;
                    var x = r * Math.cos(a * Math.PI / 180) + xGrid * hexSize + shiftX + offSetX;
                    var y = r * Math.sin(a * Math.PI / 180) + yGrid * yHexSize + offSetY;
                    if(i === 0)
                        mapGridCanvas.moveTo(x, y);
                    else
                        mapGridCanvas.lineTo(x, y);
                }
            }
        }
        mapGridCanvas.stroke();

        mapGridCanvas.fillStyle = color;
        mapGridCanvas.strokeStyle = color;
        mapGridCanvas.font = '14px courier';
        for(var xGrid = 0; xGrid <= xHexes; xGrid++) {
            for(var yGrid = 0; yGrid <= yHexes; yGrid++) {
                var shiftX = yGrid % 2 * hexRad;
                var x = xGrid * hexSize + shiftX + offSetX;
                var y = yGrid * yHexSize + offSetY;

                y -= r *.6;
                var xg = xGrid - mapOffSet.x;
                var yg = yGrid - mapOffSet.y;
                var out = xg + ', ' + yg;
                x -= out.length / 4 * 14;
                mapGridCanvas.fillText(xg + ', ' + yg, x, y);
            }
        }

        mouse.click = { x: null, y: null };

        return returnData;
    }
});

define('render/tile', [], function() {
    var cached = { offset: {} };

    function loopDraw(drawFunc, size) {
        for(var xGrid = 0; xGrid <= size.width; xGrid++)
            for(var yGrid = 0; yGrid <= size.height; yGrid++)
                drawFunc(xGrid, yGrid);
    }

    return function drawPlanets(opts, c) {
        var returnData = {
            generateRequests: []
        };

        var alpha = opts.aplpha || 1;
        var color = opts.color || '#444';
        var lineWidth = opts.lineWidth || 1;
        var radius = opts.radius || 20;
        var planetSize = opts.planetSize || radius / 10;
        var offSetX = opts.offSetX || 0;
        var offSetY = opts.offSetY || 0;
        var tiles = opts.tiles || {};
        var background = opts.background || '#000';


        if(cached.offset.x === offSetX
            && cached.offset.y === offSetY
            && cached.size.width === c.width
            && cached.size.height === c.height)
            return;

        cached = {
            offset: { x: offSetX, y: offSetY },
            size: { width: c.width, height: c.height }
        };

        var mapCanvas = c.getContext('2d');
        mapCanvas.clearRect(0, 0, c.width, c.height);
        mapCanvas.globalAplpha = alpha;

        var r = radius;
        var hexSize = r * Math.sqrt(3);
        var yHexSize = r * Math.sqrt(2.25);
        var xHexes = c.width / hexSize + 4;
        var yHexes = c.height / yHexSize + 4;
        var hexRad = hexSize / 2;
        var xDiam = hexSize;
        var yDiam = yHexSize;

        var tileXOffSet = offSetX;
        var tileYOffSet = offSetY; 

        var textYOffSet = r * .6;
        var fontSize = r / 5;

        var size = { width: xHexes, height: yHexes };

        offSetX = offSetX % (hexSize * 2) - hexSize * 2;
        offSetY = offSetY % (yHexSize * 2) - yHexSize * 2;

        tileXOffSet -= offSetX;
        tileYOffSet -= offSetY;

        tileXOffSet /= xDiam;
        tileYOffSet /= yDiam;

        function getCoords(xGrid, yGrid) {
            var shiftX = yGrid % 2 * hexRad;
            var x = xGrid * hexSize + shiftX + offSetX;
            var y = yGrid * yHexSize + offSetY;
            var mapX = Math.floor(xGrid - tileXOffSet);
            var mapY = Math.floor(yGrid - tileYOffSet);

            return { x: x, y: y, map: { x: mapX, y: mapY } };
        }

        function getPlanet(tiles, map) {
            if(tiles[map.y] && tiles[map.y][map.x])
                return tiles[map.y][map.x];
            returnData.generateRequests.push(map);
            return {};
        }

        // Render travel codes
        mapCanvas.fillStyle = background;
        mapCanvas.strokeStyle = color;
        mapCanvas.lineWidth = lineWidth;
        mapCanvas.beginPath();
        function travelCode(xGrid, yGrid) {
            var loc = getCoords(xGrid, yGrid);

            var planet = getPlanet(tiles, loc.map);

            if(planet.TravelCodes && planet.TravelCodes.length > 0 && planet.TravelCodes[0].Label === 'A') {
                mapCanvas.moveTo(loc.x, loc.y);
                mapCanvas.arc(loc.x, loc.y, textYOffSet, 0, 2 * Math.PI, true);
            }
        }
        loopDraw(travelCode, size);
        mapCanvas.stroke();
        mapCanvas.fill();

        // Render planets
        mapCanvas.fillStyle = color;
        mapCanvas.strokeStyle = color;
        mapCanvas.lineWidth = lineWidth;
        mapCanvas.beginPath();
        function planetFill(xGrid, yGrid) {
            var loc = getCoords(xGrid, yGrid);

            var planet = getPlanet(tiles, loc.map);

            if(planet.Name) {
                mapCanvas.moveTo(loc.x, loc.y);
                mapCanvas.arc(loc.x, loc.y, planetSize, 0, 2 * Math.PI, true);
            }
        }
        loopDraw(planetFill, size);
        mapCanvas.fill();

        // Render labels
        mapCanvas.fillStyle = color;
        mapCanvas.strokeStyle = color;
        mapCanvas.lineWidth = lineWidth;
        mapCanvas.font = fontSize + 'px courier';
        function locationFill(xGrid, yGrid) {
            var loc = getCoords(xGrid, yGrid);
            var x = loc.x;
            var y = loc.y;

            var radMod = 0.6;

            var planet = getPlanet(tiles, loc.map);

            if(planet.Name) {
                var charCount = planet.Name.length / 4;
                x -= charCount * fontSize;
                mapCanvas.fillText(planet.Name, x, y + textYOffSet);
                mapCanvas.fillText(planet.Starbase.Label, loc.x - fontSize * .25, y - textYOffSet * .5);

                var baseCount = 0;
                var write = false;
                for(var b in planet.Bases) {
                    var base = planet.Bases[b];

                    var a = baseCount * 20 - 60;
                    var x = -r * radMod * Math.cos(a * Math.PI / 180) + loc.x;
                    var y = r * radMod * Math.sin(a * Math.PI / 180) + loc.y;

                    mapCanvas.fillText(base.DisplayCharacter, x, y);

                    baseCount ++;
                }

                if(planet.GasGiant) {
                    var a = -45;
                    var x = r * radMod * Math.cos(a * Math.PI / 180) + loc.x;
                    var y = r * radMod * Math.sin(a * Math.PI / 180) + loc.y;

                    mapCanvas.fillText(String.fromCharCode(0x25cf), x, y);
                    x -= fontSize * 0.5;
                    mapCanvas.fillText('---', x, y);
                }
            }
        }
        if(fontSize >= 8)
            loopDraw(locationFill, size);

        return returnData;
    }
});

define('render/detail', ['lodash', 'interact', 'world'], function(_, interact, World) {
    var body = document.getElementById('main');

    return function(gridOpts) {

        var sel = _.keys(gridOpts.selectedGrids);
        var det = _.chain(gridOpts.detailViews)
            .filter(function(val) { return val !== null; })
            .map(function(val) { return val; })
            .value();

        var missing = _.difference(sel, det);
        var extra = _.difference(det, sel);

        for(var m in missing) {
            var id = missing[m];
            var mis = gridOpts.selectedGrids[id];
            var tile = gridOpts.tiles[mis.y][mis.x];

            var misDiv;
            var displayId = _.find(_.keys(gridOpts.detailViews), function(key) { return gridOpts.detailViews[key] === null; });

            if(!displayId) {
                misDiv = document.createElement('div');
                displayId = _.uniqueId('detail_');
                misDiv.setAttribute('id', displayId);
                misDiv.setAttribute('class', 'detail');

                interact(misDiv).draggable({
                    max: Infinity,
                    onmove: function(event) {
                        var target = event.target,
                        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                        target.style.webkitTransform =
                        target.style.transform =
                            'translate(' + x + 'px, ' + y + 'px)';

                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    }
                });

                body.appendChild(misDiv);
            }
            else
                misDiv = document.getElementById(displayId);

            gridOpts.detailViews[displayId] = id;

            if(tile.Name) {
                misDiv.innerHTML = World.UWP(tile, mis);
                misDiv.style.display = 'block';
            }

            var startX = gridOpts.mouse.loc.x - 20;
            var startY = gridOpts.mouse.loc.y - 20;

            misDiv.style.webkitTransform =
            misDiv.style.transform =
                'translate(' + startX +  'px, ' + startY + 'px)';

            misDiv.setAttribute('data-x', startX);
            misDiv.setAttribute('data-y', startY);


        }

        for(var e in extra) {
            var val = extra[e];
            var displayId = _.find(_.keys(gridOpts.detailViews), function(key) { return gridOpts.detailViews[key] === extra[e]; });

            gridOpts.detailViews[displayId] = null;
            var div = document.getElementById(displayId);
            div.style.display = 'none';
        }

    }
});

require(['lodash', 'interact', 'world', 'name/planet', 'render/grid', 'render/tile', 'render/detail'],
    function(_, interact, World, planet, grid, planets, detail) {
        var body = document.getElementById('main');

        function render(opts, canvases) {
            var returnData = {};
            for(var i in canvases) {
                var canvas = canvases[i];
                _.extend(returnData, canvas.renderer(opts, canvas.canvas));
            }
            return returnData;
        }

        var gridCanvas = document.createElement('canvas');
        gridCanvas.setAttribute('id', 'grid-canvas');

        var planetCanvas = document.createElement('canvas');
        planetCanvas.setAttribute('id', 'planet-canvas');

        var canvases = [
            { canvas: gridCanvas, renderer: grid },
            { canvas: planetCanvas, renderer: planets },
            { canvas: null, renderer: detail }
        ];

        var gridOpts = {
            background: '#000',
            offSetX: 0,
            offSetY: 0,
            radius: 80,
            lineWidth: 0.5,
            color: '#444',
            tiles: {},
            mouse: { loc: { x: null, y: null }, click: { x: null, y: null } },
            selectedGrids: {},
            detailViews: {}
        };

        for(var yGrid = -10; yGrid <= 10; yGrid++) {
            gridOpts.tiles[yGrid] = {};
            for(var xGrid = -10; xGrid <= 15; xGrid++) {
                gridOpts.tiles[yGrid][xGrid] = Math.random() > 0.5 ? {} : World.Generate();
            }
        }

        var el = body;
        for(var i in canvases) {
            var canvas = canvases[i].canvas;
            if(canvas)
                el.appendChild(canvas);
        }

        var offSetDistance = 10;
        document.onkeydown = function(e) {
            switch(e.keyCode) {
                case 17: offSetDistance *= 5; break;
                case 37: gridOpts.offSetX -= offSetDistance; break;
                case 38: gridOpts.offSetY -= offSetDistance; break;
                case 39: gridOpts.offSetX += offSetDistance; break;
                case 40: gridOpts.offSetY += offSetDistance; break;
            }
        };

        document.onkeyup = function(e) {
            switch(e.keyCode) {
                case 17: offSetDistance *= .2; break;
            }
        }

        var size = window.onresize = function() {
            body.style.height = window.innerHeight - 10;
            for(var i in canvases) {
                var canvas = canvases[i].canvas;
                if(canvas) {
                    canvas.width = window.innerWidth - 10;
                    canvas.height = window.innerHeight - 10;
                }
            }
        }

        size();

        function ev(mouseProperty, value) {
            if(value)
                return function(e) {
                    gridOpts.mouse[mouseProperty] = value;
                }

            return function(e) {
                gridOpts.mouse[mouseProperty] = { x: e.clientX, y: e.clientY };
            }
        };

        document.onmousedown = function(e) {
            if(e.target.nodeName === 'CANVAS')
                gridOpts.mouse['click'] = { x: e.clientX, y: e.clientY };
        };
        //document.onmouseup = ev;
        //document.onmouseover = ev;
        document.onmouseout = ev('loc', { x: null, y: null });
        document.onmousemove = ev('loc')

        setInterval(
            function()
            {
                var returnData = render(gridOpts, canvases);

                if(returnData.generateRequests)
                    for(var gen in returnData.generateRequests) {
                        var map = returnData.generateRequests[gen];
                        if(!gridOpts.tiles[map.y])
                            gridOpts.tiles[map.y] = {};
                        gridOpts.tiles[map.y][map.x] = Math.random() > 0.5 ? {} : World.Generate();
                    }

                if(returnData.selectedGrids)
                    gridOpts.selectedGrids = returnData.selectedGrids;

                if(returnData.mouseData)
                    gridOpts.mouseTile = returnData.mouseTile;
            }, 29
        );

        interact.maxInteractions(Infinity);
});

define("main", function(){});

requirejs.config({
    paths: {
        "components": "../bower_components",
        "lodash": "../bower_components/lodash/lodash",
        "interact": "../bower_components/interact/interact"
    }
});

require(['main'], function() { console.log('main.js loaded'); });


define("config", function(){});

