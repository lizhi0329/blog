/**
 * @param {number[]} nums
 * @return {number[]}
 */
// 除自身以外数组的乘积
var productExceptSelf = function(nums) {
  const L = new Array(nums.length);
  const R = new Array(nums.length);
  const result = new Array(nums.length);
  L[0] = 1
  R[nums.length - 1] = 1
  for(let i = 1; i < nums.length ; i++) {
    L[i] = L[i - 1] * nums[i - 1]
  }
  for(let i = nums.length - 2; i >= 0; i--) {
    R[i] = R[i + 1] * nums[i + 1]
  }

  for(let i = 0; i < nums.length ; i ++) {
    result[i] = R[i] * L[i]
  }

  return result
};

console.log(productExceptSelf([1, 2, 3, 4]))