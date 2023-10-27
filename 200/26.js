/**
 * @param {number[]} nums
 * @return {number}
 */
// var removeDuplicates = function(nums) {
//   if (nums.length < 1) return nums.length
//   // let fast = 1
//   let slow = 0
//   for (let fast = 1; fast < nums.length; fast++) {
//     if (nums[fast] !== nums[slow]) {
//       slow ++
//       nums[slow] = nums[fast]
//     }
//   }
//   return slow + 1
// };

// var removeDuplicates = function(nums) {
//   if (nums.length < 3) return nums.length
//   let slow = 2
//   for (let fast = 2; fast < nums.length; fast++) {
//     if (nums[slow - 2] !== nums[fast]) {
//       nums[slow] = nums[fast]
//       slow ++
//     }
//   }
//   return slow
// };


var removeDuplicates = function(nums) {
  if (nums.length < 3) return nums.length
  let slow = 0
  let fast = 1
  let count = 0
  while(fast < nums.length) {
    if (nums[fast] === nums[slow]) count ++
    else count = 0
    if (count < 2) {
      slow ++
      nums[slow] = nums[fast]
    }
    fast ++
  }
};



console.log(removeDuplicates([ 1, 1, 1, 2,2, 3])); // 0  2
