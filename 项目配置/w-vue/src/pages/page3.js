require(["@/utils/a.js"], function(a) {
	console.log(a + require("@/utils/b.js"));
});
