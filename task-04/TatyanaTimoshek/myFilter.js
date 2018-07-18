/* eslint no-extend-native: ["error", { "exceptions": ["Array"] }] */
/**
 * Написать реализацию метода .myFilter, который работает
 * аналогично оригинальному
 * https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 */

Array.prototype.myFilter = function myFilter(callback, context) {
  var array = this.slice();
  var resultArray = [];
  var index;
  if (typeof callback !== 'function') {
    throw new Error('Callback is not a function.');
  }
  for (index = 0; index < array.length; index++) {
    if (
      array[index] !== undefined &&
      callback.apply(context, [array[index], index, array])
    ) {
      resultArray.push(array[index]);
    }
  }
  return resultArray;
};
