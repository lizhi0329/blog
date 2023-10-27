/**
 * @param {number[]} nums
 * @return {boolean}
 */

// var canJump = function(nums) {
  // let step = nums[0]
  // for(let i = 1; i < step; i ++) {
  //   if(step >= nums.length - 1) return true

  //   if (step < i) return false

  //   step = Math.max(step, nums[i] + i)
  // }
// };

// var canJump = function(nums) {
//   let max = 0
//   let step = 0
//   let end = 0
//   for(let i = 0; i < nums.length - 1; i ++) {
//     max = Math.max(max, nums[i] + i)
//     if (end === i) {
//       end = max
//       step ++
//     }
//   }
//   return step
// };


var canJump = function(nums) {
  let end = nums.length - 1
  for (let i = nums.length - 2; i >= 0; i--) {
    if (end - i <= nums[i]) {
      end = i
    }
  }
};


console.log(canJump([2,3,1,1,4]));