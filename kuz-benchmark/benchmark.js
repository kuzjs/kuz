


function KuzBenchMark (name) {
	this.name = name;
	this.actions = [];
}

KuzBenchMark.prototype.getNewAction = function (name) {
	const KuzAction = require("./action").KuzAction;
	let action = new KuzAction(this, name);
	this.actions.push(action);
	return action;
}

KuzBenchMark.prototype.print = function () {
	for (let action of this.actions) {
		console.log(`${action.getName()}: ${action.getCount()} times in ${action.getTotalTime()}ms.`);
	}
}



module.exports = {
	KuzBenchMark: KuzBenchMark
};


