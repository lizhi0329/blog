/**
 * @param {number[]} nums
 * @return {number}
 */
var jump = function(nums) {
  let max = 0
  let step = 0
  let end = 0
  for(let i = 0; i < nums.length - 1; i++) {
    max = Math.max(max, nums[i] + i)
    if (end === i) {
      end = max
      step ++
    }
  }
  return step
};

console.log(jump([2,3,1,1,4]));