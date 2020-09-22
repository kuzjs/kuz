


function KuzAction (benchMark, name) {
	this.benchMark = benchMark;
	this.name = name;
	this.init_time = Date.now();
	this.last_time = this.init_time;
	this.durations = [];
}

KuzAction.prototype.resetClock = function () {
	this.last_time = Date.now();
}

KuzAction.prototype.record = function () {
	let new_time = Date.now();
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
	let totalTime = 0;
	for (let duration of this.durations) {
		totalTime += duration;
	}
	return totalTime;
}

KuzAction.prototype.getAverageTime = function () {
	return this.getTotalTime() / this.getCount();
}

KuzAction.prototype.getTable = function () {
	const KuZTable = require("../kuz-table").KuZTable;
	let table = new KuZTable();
	table.addColumn("BenchMark");
	table.addColumn("Action");
	table.addColumn("Count");
	table.addColumn("Total Time");
	table.addColumn("Avg Time");
	return table;
}

KuzAction.prototype.getRow = function () {
	return [
		this.benchMark.getName(),
		this.getName(),
		this.getCount(),
		this.getTotalTime(),
		this.getAverageTime()
	];
}



module.exports = {
	KuzAction: KuzAction
};


