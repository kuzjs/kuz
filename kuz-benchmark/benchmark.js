// benchmark.js

const utils = require("./utils");
const KuzMilestone = require("./milestone");



function KuzBenchmark (name) {
	this.name = name;
	this.actions = [];
	this.milestones = [];
	this.init_time = process.hrtime.bigint();
}

KuzBenchmark.prototype.getName = function () {
	return this.name;
}

KuzBenchmark.prototype.getTimeInit = function () {
	return this.init_time;
}

KuzBenchmark.prototype.getTimePassed = function () {
	return (process.hrtime.bigint() - this.init_time);
}

KuzBenchmark.prototype.getTimePassedReadable = function () {
	return utils.getReadableTime(this.getTimePassed());
}

KuzBenchmark.prototype.getNewAction = function (name) {
	const KuzAction = require("./action");
	let action = new KuzAction(this, name);
	this.actions.push(action);
	return action;
}

KuzBenchmark.prototype.recordMilestone = function (name) {
	const newMilestone = new KuzMilestone(this, name);
	this.milestones.push(newMilestone);
	return this;
}

KuzBenchmark.prototype.printMilestones = function () {
	let table = this.milestones[0].getTable();
	for (let milestone of this.milestones) {
		table.add(milestone);
	}
	table.print();
	return this;
}

KuzBenchmark.prototype.printActions = function () {
	let table = this.actions[0].getTable();

	for (let action of this.actions) {
		table.add(action);
	}

	table.addSeparatorRow();
	table.addRow(["Total", "", "", this.getTimePassedReadable(), ""]);
	table.print();
	return this;
}

KuzBenchmark.prototype.print = function () {
	this.printMilestones().printActions();
	return this;
}



module.exports = KuzBenchmark;


