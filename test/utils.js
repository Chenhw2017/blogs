// timerGame.js
'use strict';

function awaitData (fn, threshhold) {
  return new Promise((resolve,reject) => {
      setTimeout(() => {
          fn();
          resolve()
      },threshhold)
  })
}
module.exports = awaitData;