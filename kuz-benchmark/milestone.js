// milestone.js
const utils = require("./utils");



function KuzMilestone (benchMark, name) {
	this.benchMark = benchMark;
	this.name = name;
	this.time = process.hrtime.bigint();
}

KuzMilestone.prototype.getName = function () {
	return this.name;
}

KuzMilestone.prototype.getTimePassed = function () {
	return (this.time - this.benchMark.getTimeInit());
}

KuzMilestone.prototype.getTimePassedReadable = function () {
	return utils.getReadableTime(this.getTimePassed());
}

KuzMilestone.prototype.getRow = function () {
	return [
		this.benchMark.getName(),
		this.getName(),
		1,
		this.getTimePassedReadable(),
		this.getTimePassedReadable()
	];
}



module.exports = {
	KuzMilestone: KuzMilestone
};


