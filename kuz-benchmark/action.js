


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



module.exports = {
	KuzAction: KuzAction
};


