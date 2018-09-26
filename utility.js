"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeNames = exports.asyncForEach = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var asyncForEach = exports.asyncForEach = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(array, callback) {
    var index;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            index = 0;

          case 1:
            if (!(index < array.length)) {
              _context.next = 7;
              break;
            }

            _context.next = 4;
            return callback(array[index], index, array);

          case 4:
            index++;
            _context.next = 1;
            break;

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function asyncForEach(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var mergeNames = exports.mergeNames = function mergeNames(arr, locales, id) {
  var output = [];
  var array = arr;
  array.forEach(function (obj) {
    var existing = output.filter(function (v) {
      return v[id] === obj[id];
    });
    if (existing.length) {
      var existingIndex = output.indexOf(existing[0]);
      if (locales.indexOf(obj.locale) != -1) {
        output[existingIndex][obj.locale] = obj;
      }
    } else {
      var temp = {
        slug: obj.slug
      };
      if (locales.indexOf(obj.locale) != -1) {
        temp[obj.locale] = obj;
      }
      output.push(temp);
    }
  });

  return output;
};