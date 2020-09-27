// codefile.js

const fs = require('fs');

const fsutils = require("../kuz-fsutils");



function KuzCodeFile (kuz, path) {
	this.kuz = kuz;
	this.path = path;

	this.log = this.kuz.log.getChild(this.path);
}

KuzCodeFile.prototype.exists = function () {
	if (fsutils.isFile(this.path)) {
		return true;
	}
	return false;
}

KuzCodeFile.prototype.ok = function () {
	if (!this.exists()) {
		return false;
	}
	return true;
}



KuzCodeFile.prototype.getLinesXtoY = function (x, y) {
	let linesObject = {};
	if (this.exists()) {
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

KuzCodeFile.prototype.getLines = function () {
	return this.GetLinesXtoY();
}

KuzCodeFile.prototype.getNLinesFromX = function (x, n) {
	return this.GetLinesXtoY(x, x+n-1);
}

KuzCodeFile.prototype.getContent = function () {
	if (this.exists()) {
		let text = fs.readFileSync(this.path, "utf8").replace("\r", "");
		return text;
	} else {
		return "";
	}
}



module.exports = KuzCodeFile;


