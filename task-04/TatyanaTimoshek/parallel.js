/* exported Parallel */
/**
 * Реализовать класс, который позволяет запускать задачи параллельно
 * с заданным числом параллельно выполняющихся задач
 *
 *   var runner = new Parallel(2);
 *   runner
 *     .job(step0)
 *     .job(step1)
 *     .job(step2)
 *     .job(step3)
 *     .job(step4)
 *     .done(onDone);
 *
 *  Задача представляет из себя функцию, принимающую коллбэк, для информирования о результате работы
 */

function Parallel(a) {
  this.jobs = [];
  this.maxStream = a || 1;
  this.done.that = this;
  this.currentStreams = 0;
  this.callback = null;
  this.result = [];
  this.countOfStartJob = 0;
  this.countOfJob = 0;
}

Parallel.prototype.done = function done(cb) {
  var that = done.that;
  var j;
  if (typeof cb === 'function') that.callback = cb;
  else that.result.push(cb);

  if (that.currentStreams !== 0) that.currentStreams--;

  if (that.jobs.length === 0 && that.currentStreams === 0)
    setTimeout(that.callback, 0, that.result);

  if (that.currentStreams === 0) {
    for (j = that.currentStreams + 1; j <= that.maxStream; j++) {
      if (that.jobs.length > 0) {
        if (that.countOfStartJob === that.countOfJob) break;
        setTimeout(function timeout() {
          if (that.jobs.length > 0) {
            that.count++;
            that.jobs.shift().call(that, that.done);
          }
        }, 0);
        that.countOfStartJob++;
        that.currentStreams++;
      }
    }
  }
};

Parallel.prototype.job = function job(cb) {
  this.jobs.push(cb);
  this.countOfJob++;
  return this;
};
