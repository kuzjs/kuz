


function KuzBenchMark (name) {
	this.name = name;
	this.actions = [];
	this.init_time = process.hrtime.bigint();
}

KuzBenchMark.prototype.getName = function () {
	return this.name;
}

KuzBenchMark.prototype.getTimePassed = function () {
	return (process.hrtime.bigint() - this.init_time);
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
	table.addSeparatorRow();
	table.addRow(["Total", "", "", this.getTimePassed(), ""]);
	table.print();
}



module.exports = {
	KuzBenchMark: KuzBenchMark
};


