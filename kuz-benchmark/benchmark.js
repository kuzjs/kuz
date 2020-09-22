


function KuzBenchMark (name) {
	this.name = name;
	this.actions = [];
}

KuzBenchMark.prototype.getName = function () {
	return this.name;
}

KuzBenchMark.prototype.getNewAction = function (name) {
	const KuzAction = require("./action").KuzAction;
	let action = new KuzAction(this, name);
	this.actions.push(action);
	return action;
}

KuzBenchMark.prototype.print = function () {
	let table = this.actions[0].getTable();
	for (let action of this.actions) {
		table.add(action);
	}
	table.print();
}



module.exports = {
	KuzBenchMark: KuzBenchMark
};


