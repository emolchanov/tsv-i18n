/*   
 *  tsv-i18n:
 *  Convert tsv file to i18n object and backwards 
 *  by Eugene Molchanov
 */

module.exports = Converter;

var _each = require("lodash/collection/each");
var _rest = require("lodash/array/rest");
var _keys = require("lodash/object/keys");
var _isObject = require("lodash/lang/isObject");
var _isString = require("lodash/lang/isString");
var _parse = JSON.parse;
var _stringify = JSON.stringify;

function Converter(code) {
    this.frc = "string" === typeof code ? code : "CODE";
    return this;
}

Converter.prototype.obj2tsv = function (data) {
    var scope = {};
    if (!_isObject(data)) {
        try {
            scope.data = _parse(data);
        } catch (e) {
            throw new Error("JSON data error - " + e.message)
        }
    }
    scope.buffer = {};
    scope.langs = _keys(scope.data);
    scope.out = this.frc.toUpperCase();
    _each(scope.langs, function (l) {
        scope.out += '\t' + String(l).toUpperCase();
        _each(scope.data[l], function (v, n) {
            if (!scope.buffer[n]) scope.buffer[n] = {};
            scope.buffer[n][l] = v;
        });
    });
    scope.out += '\n';
    _each(scope.buffer, function (d, k) {
        scope.out += k;
        _each(scope.langs, function (l) {
            scope.out += '\t' + String(d[l] || "");
        });
        scope.out += '\n';
    });
    return scope.out;
};

Converter.prototype.tsv2obj = function (data, format) {
    var scope = {};
    if (!_isString(data) || data.indexOf("\t") <= 0) throw new Error("TSV data error");
    scope.data = data.split("\n");
    _each(scope.data, function (value, key, list) {
        list[key] = value.split("\t");
    });
    scope.schema = [];
    _each(scope.data[0], function (s, k) {
        scope.schema[k] = s.toLowerCase();
    });
    scope.out = {};
    _each(_rest(scope.schema), function (l) {
        var i = scope.schema.indexOf(l), b = scope.out[l] = {};
        _each(scope.data, function (a, k) {
            if (k <= 0 || a[0].length <= 0 || !a[i]) return;
            b[a[0]] = a[i];
        });
    });
    return _stringify(scope.out);
};
