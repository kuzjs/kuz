// codefile.js

const fs = require('fs');

const log = require("../kuz-log/log");
const fsutils = require("../kuz-fs");



function KuzCodeFile (kuz, path) {
	this.kuz = kuz;
	this.path = path;
}

KuzCodeFile.prototype.Exists = function () {
	if (fsutils.IsFile(this.path)) {
		return true;
	}
	return false;
}

KuzCodeFile.prototype.IsValid = function () {
	return this.Exists();
}

KuzCodeFile.prototype.GetLinesXtoY = function (x, y) {
	let linesObject = {};
	if (this.Exists()) {
		let text = fs.readFileSync(this.path, "utf8").replace("\r", "");
		let linesArray = text.split("\n");

		x = (x === undefined) ? 1 : x;
		y = (y === undefined) ? linesArray.length : y;
		if (x > y) {
			return {};
		}

		for (let lineNumber = x; lineNumber <= y; lineNumber++) {
			let lineText = linesArray[lineNumber-1];
			linesObject[lineNumber] = lineText;
		}
	}
	return linesObject;
}

KuzCodeFile.prototype.GetLines = function () {
	return this.GetLinesXtoY();
}



module.exports = {
	KuzCodeFile: KuzCodeFile
};


