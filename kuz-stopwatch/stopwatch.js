


function KuzStopWatch (name) {
	this.name = name;
	this.init_time = Date.now();
}

KuzStopWatch.prototype.getTimePassed = function () {
	let current_time = Date.now();
	return (current_time - this.init_time);
}



module.exports = {
	KuzStopWatch: KuzStopWatch
};


