/* exported sum  */
/**
 * Написать фукнцию сумматор, которая будет работать
 * var s = sum();
 * console.log(s); // 0
 * console.log(s(1)); // 1
 * console.log(s(1)(2)); //3
 * console.log(s(3)(4)(5)); // 12
 * Число вызовов может быть неограниченым
 */

function sum() {
  var result = arguments[0] || 0;
  function add(arg) {
    return sum(arg == null ? result : result + arg);
  }
  add.valueOf = function valueOf() {
    return result;
  };
  return add;
}
