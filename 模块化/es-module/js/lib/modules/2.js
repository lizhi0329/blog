"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  name: true,
  getName: true,
  otherName: true
};
Object.defineProperty(exports, "getName", {
  enumerable: true,
  get: function get() {
    return _.getName;
  }
});
Object.defineProperty(exports, "name", {
  enumerable: true,
  get: function get() {
    return _.name;
  }
});
Object.defineProperty(exports, "otherName", {
  enumerable: true,
  get: function get() {
    return _.name;
  }
});
var _ = require("./1.js");
Object.keys(_).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _[key];
    }
  });
});