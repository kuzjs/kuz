


function KuzStopwatch (name) {
	this.name = name;
	this.init_time = Date.now();
	this.records = [this.init_time];
}

KuzStopwatch.prototype.record = function () {
	let new_time = Date.now();
	this.records.push(new_time);
}

KuzStopwatch.prototype.getRecords = function () {
	return this.records;
}

KuzStopwatch.prototype.getTimePassed = function () {
	let current_time = Date.now();
	return (current_time - this.init_time);
}



module.exports = {
	KuzStopwatch: KuzStopwatch
};


