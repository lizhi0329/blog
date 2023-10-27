/**
 * @param {string} s
 * @return {number}
 */
var romanToInt = function(s) {
  const arr = [...s]
  let slow = 0
  let fast = 1
  let result = ''
  while(fast < arr.length) {
    // if (arr[fast] === 'V' )
    if (arr[slow] === 'I') {
      if (arr[fast] === 'V' ) {
        result += '4'
      }
      if (arr[fast] === 'X' ) {
        result += '9'
      }
    }
  }
  // for(let i = arr.length - 1; i >= 0; i--) {

  // }
};

romanToInt("MCMXCIV")