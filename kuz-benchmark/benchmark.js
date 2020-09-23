// benchmark.js
const utils = require("./utils");
const KuzMilestone = require("./milestone").KuzMilestone;



function KuzBenchMark (name) {
	this.name = name;
	this.actions = [];
	this.milestones = [];
	this.init_time = process.hrtime.bigint();
}

KuzBenchMark.prototype.getName = function () {
	return this.name;
}

KuzBenchMark.prototype.getTimeInit = function () {
	return this.init_time;
}

KuzBenchMark.prototype.getTimePassed = function () {
	return (process.hrtime.bigint() - this.init_time);
}

KuzBenchMark.prototype.getTimePassedReadable = function () {
	return utils.getReadableTime(this.getTimePassed());
}

KuzBenchMark.prototype.getNewAction = function (name) {
	const KuzAction = require("./action").KuzAction;
	let action = new KuzAction(this, name);
	this.actions.push(action);
	return action;
}

KuzBenchMark.prototype.recordMilestone = function (name) {
	const newMilestone = new KuzMilestone(this, name);
	this.milestones.push(newMilestone);
}

KuzBenchMark.prototype.printMilestones = function () {
	let table = this.milestones[0].getTable();
	for (let milestone of this.milestones) {
		table.add(milestone);
	}
	table.print();
}

KuzBenchMark.prototype.printActions = function () {
	let table = this.actions[0].getTable();

	for (let action of this.actions) {
		table.add(action);
	}

	table.addSeparatorRow();
	table.addRow(["Total", "", "", this.getTimePassedReadable(), ""]);
	table.print();
}

KuzBenchMark.prototype.print = function () {
	this.printMilestones();
	this.printActions();
}



module.exports = {
	KuzBenchMark: KuzBenchMark
};


