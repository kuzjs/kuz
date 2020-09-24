// logger.js

const fs = require("fs");
const utils = require("./utils");
const colors = require("./colors");



function KuzLogger (name) {
	this.name = name ? name : "Anonymous";
	this.color = true;
	this.silent = false;
	this.debug = false;
	this.disk = false;

	this.parent = null;
	this.locked = false;
	this.children = [];

	this.path = utils.getLogFilePath();
	this.index = 0;

	this.createdTime = Date.now();
	this.lastLogTime = this.createdTime;
}



KuzLogger.prototype.lock = function () {
	this.locked = true;
}

KuzLogger.prototype.unlock = function () {
	if (this.parent === null) {
		this.locked = false;
	}
}



KuzLogger.prototype.setName = function (name) {
	this.name = name;
}



KuzLogger.prototype.getIndex = function () {
	if (this.parent) {
		return this.parent.getIndex();
	}
	return this.index;
}

KuzLogger.prototype.upTheIndex = function () {
	if (this.parent) {
		return this.parent.upTheIndex();
	} else {
		return this.index++;
	}
}



KuzLogger.prototype.turnColorOff = function () {
	if (!this.locked) {
		this.color = false;
	}
}

KuzLogger.prototype.turnColorOn = function () {
	if (!this.locked) {
		this.color = true;
	}
}



KuzLogger.prototype.colorIsOn = function () {
	if (this.parent) {
		return this.parent.colorIsOn();
	}
	return this.color;
}

KuzLogger.prototype.colorIsOff = function () {
	return !this.colorIsOn();
}



KuzLogger.prototype.turnSilentModeOff = function () {
	if (!this.locked) {
		this.silent = false;
	}
}

KuzLogger.prototype.turnSilentModeOn = function () {
	if (!this.locked) {
		this.silent = true;
	}
}



KuzLogger.prototype.silentModeIsOn = function () {
	if (this.parent) {
		return this.parent.silentModeIsOn();
	}
	return this.silent;
}

KuzLogger.prototype.silentModeIsOff = function () {
	return !this.silentModeIsOn();
}



KuzLogger.prototype.turnDebugOff = function () {
	if (!this.locked) {
		this.debug = false;
	}
}

KuzLogger.prototype.turnDebugOn = function () {
	if (!this.locked) {
		this.debug = true;
	}
}



KuzLogger.prototype.debugIsOn = function () {
	if (this.parent) {
		return this.parent.debugIsOn();
	}
	return this.debug;
}

KuzLogger.prototype.debugIsOff = function () {
	return !this.debugIsOn();
}



KuzLogger.prototype.turnDiskOff = function () {
	this.disk = false;
}

KuzLogger.prototype.turnDiskOn = function () {
	this.disk = true;
}



KuzLogger.prototype.diskIsOn = function () {
	if (this.parent) {
		return this.parent.diskIsOn();
	}
	return this.disk;
}

KuzLogger.prototype.diskIsOff = function () {
	return !this.diskIsOn();
}



KuzLogger.prototype.setPath = function (path) {
	if (path != undefined) {
		this.path = path;
	}
}

KuzLogger.prototype.getPath = function () {
	if (this.parent) {
		return this.parent.getPath();
	}
	return this.path;
}



KuzLogger.prototype.setParent = function (parent) {
	this.parent = parent;
}

KuzLogger.prototype.getParent = function () {
	return this.parent;
}



KuzLogger.prototype.getChild = function (name) {
	let child = new KuzLogger(name);

	child.setParent(this);
	child.createdTime = this.createdTime;
	child.lastLogTime = this.lastLogTime;
	child.lock();
	this.children.push(child);

	return child;
}



KuzLogger.prototype.getFullMessage = function (keyword, index, timeStampPrefix, name, prefix, message, duration) {
	if (message) {
		return `[ ${keyword} ] ${index}. ${timeStampPrefix} (${name}) ${prefix} [${message}] ${duration}ms\n`;
	} else {
		return `[ ${keyword} ] ${index}. ${timeStampPrefix} (${name}) ${prefix} ${duration}ms\n`;
	}
}

KuzLogger.prototype.logInternal = function (keyword, prefix, message, c1, c2, c3) {
	c2 = c2 ? c2 : c1;
	c3 = c3 ? c3 : c2;

	this.upTheIndex();
	let index = (this.getIndex() + "").padStart(3);

	let dataString = `${utils.getDateString()}`;
	let timeString = `${utils.getTimeString()}`;
	let timeStampPrefix = `on ${dataString} at ${timeString}`;

	let newLogTime = Date.now();
	let duration = newLogTime - this.createdTime;
	this.lastLogTime = newLogTime;

	let name = this.name;
	let messageNoColor = null;
	if (this.diskIsOn() || this.colorIsOff()) {
		messageNoColor = this.getFullMessage(keyword, index, timeStampPrefix, name, prefix, message, duration);
		if (this.diskIsOn()) {
			fs.appendFileSync(this.getPath(), messageNoColor);
		}
	}

	if (this.silentModeIsOff()) {
		if (this.colorIsOn()) {
			dataString = `${colors.FgYellow}${dataString}${colors.Reset}`;
			timeString = `${colors.FgCyan}${timeString}${colors.Reset}`;
			timeStampPrefix = `on ${dataString} at ${timeString}`;

			keyword = `${c1}${keyword}${colors.Reset}`;
			name = `${c2}${name}${colors.Reset}`;
			message = message ? `${c3}${message}${colors.Reset}` : message;

			let messageString = this.getFullMessage(keyword, index, timeStampPrefix, name, prefix, message, duration);
			process.stdout.write(messageString);
		} else {
			process.stdout.write(messageNoColor);
		}
	}
}



KuzLogger.prototype.justLogIt = function (prefix, message) {
	this.logInternal("  JUST ", prefix, message, colors.FgMagenta);
}

KuzLogger.prototype.mundane = function (prefix, message) {
	if (this.debugIsOn()) {
		this.logInternal("  .... ", prefix, message, colors.FgGreen);
	}
}

KuzLogger.prototype.asExpected = function (prefix, message) {
	this.logInternal("  EXP  ", prefix, message, colors.FgGreen);
}

KuzLogger.prototype.unexpected = function (prefix, message) {
	this.logInternal(" UNEXP ", prefix, message, colors.FgRed);
}

KuzLogger.prototype.notFound = function (prefix, message) {
	this.logInternal(" !FOUND", prefix, message, colors.FgRed);
}

KuzLogger.prototype.makeSuggestion = function (prefix, message) {
	this.logInternal("  SUG  ", prefix, message, colors.FgYellow);
}

KuzLogger.prototype.warn = function (prefix, message) {
	this.logInternal("WARNING", prefix, message, colors.FgYellow);
}



KuzLogger.prototype.green = function (prefix, message) {
	this.logInternal("   OK  ", prefix, message, colors.FgGreen);
}

KuzLogger.prototype.greenYellow = function (prefix, message) {
	this.logInternal("   OK  ", prefix, message, colors.FgGreen, colors.FgGreen, colors.FgYellow);
}

KuzLogger.prototype.red = function (prefix, message) {
	this.logInternal(" ERROR ", prefix, message, colors.FgRed);
}

KuzLogger.prototype.yellow = function (prefix, message) {
	if (this.debugIsOn()) {
		this.logInternal("  .... ", prefix, message, colors.FgYellow);
	}
}



KuzLogger.prototype.goodNews = function (prefix, message) {
	this.logInternal(" GOOD ", prefix, message, colors.FgGreen);
}

KuzLogger.prototype.badNews = function (prefix, message) {
	this.logInternal("  BAD ", prefix, message, colors.FgRed);
}

KuzLogger.prototype.someNews = function (prefix, message) {
	if (this.debugIsOn()) {
		this.logInternal(" SOME ", prefix, message, colors.FgYellow);
	}
}



module.exports = KuzLogger;


