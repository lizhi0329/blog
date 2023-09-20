var numDecodings = function (s) {
  const strArr = [...s]
  const dp = new Array(strArr.length).fill('')
  return process(strArr, 0, dp)
}

function process(arr, x, dp) {
  if (x === arr.length) {
    return 1
  }
  if (arr[x] == '0') {
    return 0
  }
  let p2 = 0
  if (x + 1 < arr.length && (arr[x] - '0') * 10 + (arr[x + 1] - '0') < 27) {
    p2 = dp[x + 2] ? dp[x + 2] : process(arr, x + 2) 
    dp[x + 2] = p2
  }
  let p1 = 0
  if (dp[x + 1]) {
    p1 = dp[x + 1]
  } else{
    dp[x + 1] = process(arr, x + 1)
  }
  return p1 + p2
}

console.log(numDecodings('12'))