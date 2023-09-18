var numDecodings = function (s) {
  const strArr = [...s]
  const dp = new Array(strArr.length).fill(-1)
  return process(strArr, 0, dp)
}

function process(arr, x, dp) {
  if (x === arr.length) {
    dp[x] = 1
    return 1
  }
  if (dp[x] > -1) return dp[x]
  if (arr[x] == '0') {
    dp[x] = 0
    return 0
  }
  let p2 = 0
  if (x + 1 < arr.length && (arr[x] - '0') * 10 + (arr[x + 1] - '0') < 27) {
    p2 = process(arr, x + 2)
  }
  dp[x] = process(arr, x + 1) + p2
  return process(arr, x + 1) + p2
}

console.log(numDecodings('12'))