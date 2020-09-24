// milestone.js
const utils = require("./utils");



function KuzMilestone (benchmark, name) {
	this.benchmark = benchmark;
	this.name = name;
	this.time = process.hrtime.bigint();
}

KuzMilestone.prototype.getName = function () {
	return this.name;
}

KuzMilestone.prototype.getTimePassed = function () {
	return (this.time - this.benchmark.getTimeInit());
}

KuzMilestone.prototype.getTimePassedReadable = function () {
	return utils.getReadableTime(this.getTimePassed());
}

KuzMilestone.prototype.getTable = function () {
	const KuZTable = require("../kuz-table").KuZTable;
	let table = new KuZTable();
	table.addColumn("Benchmark");
	table.addColumn("Milestone");
	table.addColumn("S   Ms   Us   Ns");
	return table;
}

KuzMilestone.prototype.getRow = function () {
	return [
		this.benchmark.getName(),
		this.getName(),
		this.getTimePassedReadable()
	];
}



module.exports = {
	KuzMilestone: KuzMilestone
};


