/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function(nums, k) {
  if (k > nums.length) {
    k =  k % nums.length;
  }
  const last = nums.splice(nums.length - k, nums.length)

  nums.unshift(...last)
};


// [1,2]
rotate([1, 2])