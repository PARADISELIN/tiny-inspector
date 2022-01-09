"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAllElementEqualArray = isAllElementEqualArray;

function isAllElementEqualArray(data) {
  if (data.length === 0) return false;
  if (data.length === 1) return true;
  return data.every(item => item === data[0]);
}