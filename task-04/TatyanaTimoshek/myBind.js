/* eslint no-extend-native: ["error", { "exceptions": ["Function"] }] */
/**
 * Написать метод .myBind, который будет работать аналогично
 * встроенному методу .bind у функций
 * https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 */

Function.prototype.myBind = function myBind(context) {
  var funcObj = this;
  return function returnBind() {
    return funcObj.apply(context, arguments);
  };
};
