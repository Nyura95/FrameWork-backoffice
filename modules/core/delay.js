class delay {
  constructor() {}
  startDelay(ms) {
    var ctr, rej, p = new Promise(function(resolve, reject){
      ctr = setTimeout(resolve, ms)
      rej = reject
    })
    return p;
  }
}

module.exports = delay;
