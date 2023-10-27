/**
 * @param {number[]} citations
 * @return {number}
 */
var hIndex = function(citations) {
  citations.sort(function(a, b) {
    // 从大到小排列
    return b - a 
  })
  let h = 0
  for (let i = 0; i < citations.length; i++) {
    if (citations[i] > h) h ++
  }
  return h
};

const nums = [3,0,6,1,5]
console.log(hIndex(nums))

console.log(nums);