/**
 * Написать реализацию eventBus в соответствии с тестами
 */

function EventBus() {}

EventBus.prototype.trigger = function trigger(event, arg) {
  var args = [].slice.call(arguments, 1);
  this[event] = this[event] || [];
  this[event].forEach(function triggerEvent(ev) {
    ev.apply(this, args);
  });
  return arg;
};

EventBus.prototype.on = function on(event, callback) {
  if (typeof callback !== 'function') return;
  if (this[event] === undefined) this[event] = [];
  this[event].push(callback);
};

EventBus.prototype.off = function off(event, callback) {
  var cbIndex = this[event].indexOf(callback);
  if (cbIndex === -1) return;
  this[event].splice(cbIndex, 1);
};
