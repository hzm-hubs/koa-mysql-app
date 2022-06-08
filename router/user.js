var userList = [
	{
		name: "James",
		age: 29,
	},
	{
		name: "harden",
		age: 20,
	},
];

const judgeInfo = function (queryName) {
	let result = "";
	if (!queryName) {
		result = "no this man";
	} else {
		if (!JSON.stringify(userList).includes(queryName)) {
			result = "welcome," + queryName;
		} else {
			result = "welcome back," + queryName;
		}
	}
	return result;
};

module.exports = judgeInfo;
