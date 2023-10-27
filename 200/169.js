/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {
    const n = nums.length / 2
    console.log(Math.ceil(n), n);
    return nums.sort((a, b) => a - b)[Math.ceil(n / 2)]
};

const nums  = [2,2,1,1,1,2,2]
majorityElement(nums)

console.log(nums);