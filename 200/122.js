/**
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit(prices) {
  const n = prices.length
  const dp = new Array(n).fill([0, 0])
  dp[0][1] = -prices[0] // 第一天买入
  for(let i = 1; i < n; i++) {
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i])
    dp[i][1] = Math.max(dp[i - 1][0] - prices[i], dp[i - 1][1])
  }
  return dp[n - 1][0]
}


console.log(maxProfit([7,1,5,3,6,4]));