// logger.js

const months = [
	"January", "February", "March",
	"April", "May", "June",
	"July", "August", "September",
	"October", "November", "December"
];

const days = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];



function GetLogFileName () {
	let now = new Date();

	let hours = (now.getHours() + "h").padStart(3, "0");
	let minutes = (now.getMinutes() + "m").padStart(3, "0");
	let seconds = (now.getSeconds() + "s").padStart(3, "0");
	let milliseconds = (now.getMilliseconds() + "ms").padStart(5, "0");

	let date = (now.getDate() + "").padStart(2, "0");
	let month = (now.getMonth() + "").padStart(2, "0");
	let year = (now.getFullYear() + "").padStart(4, "0");

	let fileName = `log_on_${year}_${month}_${date}_at_${hours}_${minutes}_${seconds}.txt`;
	return fileName;
}

function GetLogFilePath () {
	return "logs/" + GetLogFileName();
}



function KuzLogger () {
	this.color = false;
	this.debug = false;
	this.disk = false;
	this.parent = null;
	this.children = [];
	this.path = GetLogFilePath();
}



KuzLogger.prototype.TurnOffColor = function () {
	this.color = false;
}

KuzLogger.prototype.TurnOnColor = function () {
	this.color = true;
}



KuzLogger.prototype.ColorIsOn = function () {
	if (this.parent) {
		return this.parent.ColorIsOn();
	}
	return this.color;
}

KuzLogger.prototype.ColorIsOff = function () {
	return !this.DebugIsOn();
}



KuzLogger.prototype.TurnOffDebug = function () {
	this.debug = false;
}

KuzLogger.prototype.TurnOnDebug = function () {
	this.debug = true;
}



KuzLogger.prototype.DebugIsOn = function () {
	if (this.parent) {
		return this.parent.DebugIsOn();
	}
	return this.debug;
}

KuzLogger.prototype.DebugIsOff = function () {
	return !this.DebugIsOn();
}



KuzLogger.prototype.TurnOffDisk = function () {
	this.disk = false;
}

KuzLogger.prototype.TurnOnDisk = function () {
	this.disk = true;
}



KuzLogger.prototype.DiskIsOn = function () {
	if (this.parent) {
		return this.parent.DiskIsOn();
	}
	return this.disk;
}

KuzLogger.prototype.DiskIsOff = function () {
	return !this.DiskIsOn();
}



KuzLogger.prototype.SetParent = function (parent) {
	this.parent = parent;
}

KuzLogger.prototype.GetParent = function () {
	return this.parent;
}



KuzLogger.prototype.GetChild = function () {
	let child = new KuzLogger();

	child.SetParent(this);
	this.children.push(child);

	return child;
}



module.exports = {
	KuzLogger: KuzLogger
};


