/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function(nums, val) {
  let slow = 0

  for(let fast = 0; right < nums.length; right++) {
    if (nums[fast] !== val) {
      nums[slow] = nums[fast]
      slow ++
    }
  }
  return slow
};

removeElement([3,2,2,3], 3)