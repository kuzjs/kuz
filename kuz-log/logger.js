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

const colors = {
	Reset: "\x1b[0m",
	Bright: "\x1b[1m",
	Dim: "\x1b[2m",
	Underscore: "\x1b[4m",
	Blink: "\x1b[5m",
	Reverse: "\x1b[7m",
	Hidden: "\x1b[8m",

	FgBlack: "\x1b[30m",
	FgRed: "\x1b[31m",
	FgGreen: "\x1b[32m",
	FgYellow: "\x1b[33m",
	FgBlue: "\x1b[34m",
	FgMagenta: "\x1b[35m",
	FgCyan: "\x1b[36m",
	FgWhite: "\x1b[37m",

	BgBlack: "\x1b[40m",
	BgRed: "\x1b[41m",
	BgGreen: "\x1b[42m",
	BgYellow: "\x1b[43m",
	BgBlue: "\x1b[44m",
	BgMagenta: "\x1b[45m",
	BgCyan: "\x1b[46m",
	BgWhite: "\x1b[47m"
};



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



function KuzLogger (name) {
	this.name = name ? name : "Anonymous";
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



KuzLogger.prototype.SetPath = function (path) {
	if (path != undefined) {
		this.path = path;
	}
}

KuzLogger.prototype.GetPath = function () {
	return this.path;
}



KuzLogger.prototype.SetParent = function (parent) {
	this.parent = parent;
}

KuzLogger.prototype.GetParent = function () {
	return this.parent;
}



KuzLogger.prototype.GetChild = function (name) {
	let child = new KuzLogger(name);

	child.SetParent(this);
	this.children.push(child);

	return child;
}



KuzLogger.prototype.Log = function (keyword, message, color) {
	let messageString = `[ ${color}${keyword.padStart(5)}${colors.Reset} ] (${this.name}) ${message}`;
	process.stdout.write(messageString);
	console.log();
}



KuzLogger.prototype.JustLogIt = function (message) {
	this.Log("JUST", message, colors.FgMagenta);
}

KuzLogger.prototype.Mundane = function (message) {
	if (this.DebugIsOn()) {
		this.Log("....", message, colors.FgGreen);
	}
}

KuzLogger.prototype.AsExpected = function (message) {
	this.Log("EXP", message, colors.FgGreen);
}

KuzLogger.prototype.Unexpected = function (message) {
	this.Log("UNEXP", message, colors.FgRed);
}

KuzLogger.prototype.NotFound = function (message) {
	this.Log("!FOUND", message, colors.FgRed);
}



KuzLogger.prototype.Green = function (message) {
	this.Log("OK", message, colors.FgGreen);
}

KuzLogger.prototype.Red = function (message) {
	this.Log("ERROR", message, colors.FgRed);
}

KuzLogger.prototype.Yellow = function (message) {
	if (this.DebugIsOn()) {
		this.Log("....", message, colors.FgYellow);
	}
}



KuzLogger.prototype.GoodNews = function (message) {
	this.Log("GOOD", message, colors.FgGreen);
}

KuzLogger.prototype.BadNews = function (message) {
	this.Log("BAD", message, colors.FgRed);
}

KuzLogger.prototype.SomeNews = function (message) {
	if (this.DebugIsOn()) {
		this.Log("SOME", message, colors.FgYellow);
	}
}



module.exports = {
	KuzLogger: KuzLogger
};


