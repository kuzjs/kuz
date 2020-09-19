// log.js

let DEBUG = false;
let FIRST_MESSAGE_INDEX = 1000;



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



function KZLog () {
	this.debug = false;
	this.prefix = "";
}

KZLog.prototype.Prefix = function (prefix) {
	if (prefix !== undefined) {
		this.prefix = prefix;
	}
	return this.prefix;
}



function Print (message) {
	process.stdout.write(message);
}

function PrintLn (message) {
	process.stdout.write(message);
	console.log();
}

function PrintMessage (message, type, color) {
	Print("[" + color + " " + type.padEnd(5) + " " + colors.Reset + "]");
	PrintLn(" (" + FIRST_MESSAGE_INDEX + ") " + color + message + colors.Reset);
	FIRST_MESSAGE_INDEX++;
}

function PrintGreen (message) {
	PrintMessage(message, "OK", colors.FgGreen);
}

function PrintRed (message) {
	PrintMessage(message, "ERROR", colors.FgRed);
}

function PrintYellow (message) {
	if (DEBUG) {
		PrintMessage(message, "", colors.FgYellow);
	}
}

function GoodNews (message) {
	PrintMessage(message, "GOOD", colors.FgGreen);
}

function BadNews (message) {
	PrintMessage(message, "BAD", colors.FgRed);
}

function SomeNews (message) {
	PrintMessage(message, "SOME", colors.FgYellow);
}

function DebugOff () {
	DEBUG = false;
}

function DebugOn () {
	DEBUG = true;
}



module.exports = {
	Green: PrintGreen,
	Red: PrintRed,
	Yellow: PrintYellow,
	DebugOff: DebugOff,
	DebugOn: DebugOn,
	GoodNews: GoodNews,
	BadNews: BadNews,
	SomeNews: SomeNews
};


