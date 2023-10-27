/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
  let min = Number.MAX_SAFE_INTEGER
  let value = 0
  for(let i = 0; i < prices.length; i++) {
    if(prices[i] < min) {
      min = prices[i]
    } else if (prices[i] - prices[min] > value) { 
      value = prices[i] - prices[min]
    }
  }
  return value
};

const prices = [7,1,5,3,6,4]

console.log(maxProfit(prices));