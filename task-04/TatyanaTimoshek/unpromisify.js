/* exported unpromisify  */
/**
 * Написать фукнцию обратную promisify
 *
 * она принимает фукнцию, которая возвращает результат в виде promise
 * и возвращает обертку работающую на error-first коллбэке
 */

function unpromisify(promisify) {
  var promise = promisify;
  var cb;
  return function wrap() {
    var args = [].slice.call(arguments);
    if (typeof args[args.length - 1] === 'function') {
      cb = args[args.length - 1];
      args.pop();
      promise.apply(this, args).then(
        function callback(data) {
          cb(null, data);
        },
        function callback(data) {
          cb(data);
        }
      );
      return;
    }
    promise();
  };
}
