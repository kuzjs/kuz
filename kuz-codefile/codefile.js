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

KuzCodeFile.prototype.GetLines = function () {
	let linesObject = {};
	if (this.Exists()) {
		let text = fs.readFileSync(this.path, "utf8").replace("\r", "");
		let linesArray = text.split("\n");
		for (let index=0; index<linesArray.length; index++) {
			let lineText = linesArray[index];
			let lineNumber = index + 1;
			linesObject[lineNumber] = lineText;
		}
	}
	return linesObject;
}



module.exports = {
	KuzCodeFile: KuzCodeFile
};


