var merge = function(nums1, m, nums2, n) {
  if (n === 0) return nums1;
  let p1 = m;
  let p2 = n;
  while(p2 > 0) {
      if (p1 === 0) {
        nums1[p2 - 1] = nums2[p2 - 1];
        p2 --
        continue
      }
      if (nums1[p1 - 1] < nums2[p2 - 1]) {
        nums1[p1 + p2 - 1] = nums2[p2 - 1]
        p2 --
        continue
      }
      nums1[p1 + p2 - 1] = nums1[p1 - 1]
      p1 --
  }
};
// console.log(merge([0], 0, [1],  1));
merge([2,0], 1, [1],  1)