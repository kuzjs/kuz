


function getReadableTime (big_nano) {
	const ten_k = BigInt(10000);

	if (big_nano < ten_k) {
		return big_nano + "ns";
	}

	const big_micro = big_nano / BigInt(1000);
	if (big_micro < ten_k) {
		return big_micro + "us";
	}

	const big_milli = big_micro / BigInt(1000);
	if (big_milli < ten_k) {
		return big_milli + "ms";
	}

	const big_seconds = big_milli / BigInt(1000);
	return big_seconds + "s";
}



function KuzAction (benchMark, name) {
	this.benchMark = benchMark;
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
	return this.getTotalTime() / BigInt(this.getCount());
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
		getReadableTime(this.getTotalTime()),
		getReadableTime(this.getAverageTime())
	];
}



module.exports = {
	KuzAction: KuzAction
};


