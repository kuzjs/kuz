// action.js

const utils = require("./utils");



function KuzAction (benchmark, name) {
	this.benchmark = benchmark;
	this.name = name;
	this.init_time = process.hrtime.bigint();
	this.last_time = this.init_time;
	this.durations = [];
}

KuzAction.prototype.resetClock = function () {
	this.last_time = process.hrtime.bigint();
}

KuzAction.prototype.record = function () {
	let new_time = process.hrtime.bigint();
	let duration = new_time - this.last_time;
	this.durations.push(duration);
	this.last_time = new_time;
}

KuzAction.prototype.getName = function () {
	return this.name;
}

KuzAction.prototype.getCount = function () {
	return this.durations.length;
}

KuzAction.prototype.getTotalTime = function () {
	let totalTime = BigInt(0);
	for (let duration of this.durations) {
		totalTime += duration;
	}
	return totalTime;
}

KuzAction.prototype.getAverageTime = function () {
	if (this.getCount() === 0) {
		return BigInt(0);
	}
	return this.getTotalTime() / BigInt(this.getCount());
}

KuzAction.prototype.getTable = function () {
	const KuzTable = require("../kuz-table");
	let table = new KuzTable();
	table.addColumn("Benchmark");
	table.addColumn("Action");
	table.addColumn("Count");
	table.addColumn("Total Time");
	table.addColumn("S   Ms   Us   Ns");
	return table;
}

KuzAction.prototype.getRow = function () {
	return [
		this.benchmark.getName(),
		this.getName(),
		this.getCount(),
		utils.getReadableTime(this.getTotalTime()),
		utils.getReadableTime(this.getAverageTime())
	];
}



module.exports = KuzAction;


