/* exported promisify  */
/**
 * Все асинхронные функции node.js и подавляющее большинство асинхронных функций внешних модулей
 * на данный момент всё же используют колбэки,
 * чтобы вернуть результат работы или сообщить об ошибке.
 * Нужно написать фукнцию promisify которая
 * - принимает асинхронную функцию на базе error-first коллбэка
 * - возвращает новую фукнцию, которая вместо коллбэка возвращает результат в виде промиса
 *
 * Аналог https://nodejs.org/api/util.html#util_util_promisify_original
 */

function promisify() {
  var callback = arguments[arguments.length - 1];
  return function returnFunc() {
    var args = [].slice.call(arguments);
    var context = this;
    return new Promise(function newPromise(resolve, reject) {
      function callBackFunc() {
        if (arguments[0]) reject(arguments[0]);
        resolve(arguments[1]);
      }
      args.push(callBackFunc);
      callback.apply(context, args);
    });
  };
}
