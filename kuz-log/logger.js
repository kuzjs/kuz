// logger.js

const fs = require("fs");



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



function GetDateString () {
	let now = new Date();

	let date = (now.getDate() + "").padStart(2, "0");
	let month = (now.getMonth() + "").padStart(2, "0");
	let year = (now.getFullYear() + "").padStart(4, "0");

	return `${date}_${month}_${year}`;
}

function GetTimeString () {
	let now = new Date();

	let hours = (now.getHours() + "h").padStart(3, "0");
	let minutes = (now.getMinutes() + "m").padStart(3, "0");
	let seconds = (now.getSeconds() + "s").padStart(3, "0");
	let milliseconds = (now.getMilliseconds() + "ms").padStart(5, "0");

	return `${hours}_${minutes}_${seconds}`;
}



function GetLogFileName () {
	let date = GetDateString();
	let time = GetTimeString();

	return `log_on_${date}_at_${time}.txt`;
}

function GetLogFilePath () {
	return "logs/" + GetLogFileName();
}



function KuzLogger (name) {
	this.name = name ? name : "Anonymous";
	this.color = true;
	this.debug = false;
	this.disk = false;
	this.parent = null;
	this.locked = false;
	this.children = [];
	this.path = GetLogFilePath();
}



KuzLogger.prototype.Lock = function () {
	this.locked = true;
}

KuzLogger.prototype.Unlock = function () {
	if (this.parent === null) {
		this.locked = false;
	}
}



KuzLogger.prototype.SetName = function (name) {
	this.name = name;
}



KuzLogger.prototype.TurnOffColor = function () {
	if (!this.locked) {
		this.color = false;
	}
}

KuzLogger.prototype.TurnOnColor = function () {
	if (!this.locked) {
		this.color = true;
	}
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
	if (!this.locked) {
		this.debug = false;
	}
}

KuzLogger.prototype.TurnOnDebug = function () {
	if (!this.locked) {
		this.debug = true;
	}
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
	child.Lock();
	this.children.push(child);

	return child;
}



KuzLogger.prototype.Log = function (keyword, prefix, message, c1, c2, c3) {
	c2 = c2 ? c2 : c1;
	c3 = c3 ? c3 : c2;

	let name = this.name;
	if (this.ColorIsOn()) {
		keyword = `${c1}${keyword}${colors.Reset}`;
		name = `${c2}${name}${colors.Reset}`;
		message = `${c3}${message}${colors.Reset}`;
	}

	let messageString = `[ ${keyword} ] (${name}) ${prefix} [${message}]\n`;
	process.stdout.write(messageString);

	if (this.DiskIsOn()) {
		let messageNoColor = `[ ${keyword} ] (${this.name}) ${message}\n`;
		fs.appendFileSync(this.path, messageNoColor);
	}
}



KuzLogger.prototype.JustLogIt = function (prefix, message) {
	this.Log(" JUST ", prefix, message, colors.FgMagenta);
}

KuzLogger.prototype.Mundane = function (prefix, message) {
	if (this.DebugIsOn()) {
		this.Log(" .... ", prefix, message, colors.FgGreen);
	}
}

KuzLogger.prototype.AsExpected = function (prefix, message) {
	this.Log("  EXP ", prefix, message, colors.FgGreen);
}

KuzLogger.prototype.Unexpected = function (prefix, message) {
	this.Log(" UNEXP", prefix, message, colors.FgRed);
}

KuzLogger.prototype.NotFound = function (prefix, message) {
	this.Log("!FOUND", prefix, message, colors.FgRed);
}



KuzLogger.prototype.Green = function (prefix, message) {
	this.Log("  OK  ", prefix, message, colors.FgGreen);
}

KuzLogger.prototype.GreenYellow = function (prefix, message) {
	this.Log("  OK  ", prefix, message, colors.FgGreen, colors.FgGreen, colors.FgYellow);
}

KuzLogger.prototype.Red = function (prefix, message) {
	this.Log(" ERROR", prefix, message, colors.FgRed);
}

KuzLogger.prototype.Yellow = function (prefix, message) {
	if (this.DebugIsOn()) {
		this.Log(" .... ", prefix, message, colors.FgYellow);
	}
}



KuzLogger.prototype.GoodNews = function (message) {
	this.Log(" GOOD ", message, colors.FgGreen);
}

KuzLogger.prototype.BadNews = function (message) {
	this.Log("  BAD ", message, colors.FgRed);
}

KuzLogger.prototype.SomeNews = function (message) {
	if (this.DebugIsOn()) {
		this.Log(" SOME ", message, colors.FgYellow);
	}
}



module.exports = {
	KuzLogger: KuzLogger
};


