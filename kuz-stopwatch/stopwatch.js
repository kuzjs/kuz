


function KuzStopWatch (name) {
	this.name = name;
	this.init_time = Date.now();
	this.records = [this.init_time];
}

KuzStopWatch.prototype.record = function () {
	let new_time = Date.now();
	this.records.push(new_time);
}

KuzStopWatch.prototype.getRecords = function () {
	return this.records;
}

KuzStopWatch.prototype.getTimePassed = function () {
	let current_time = Date.now();
	return (current_time - this.init_time);
}



module.exports = {
	KuzStopWatch: KuzStopWatch
};


