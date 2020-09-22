// nss.js

const fs = require("fs");

const fsutils = require("../kuz-fs");

const regionCommentStarters = [
	"/", "'", '"', "#"
];

const regionSeparatorStarters = [
	"====", "----",
	"++++", "____",
	"....", "~~~~"
];

function LineIsComment (lineText) {
	lineText = lineText.trim();
	for (let nssCommentStarter of regionCommentStarters) {
		if (lineText.startsWith(nssCommentStarter)) {
			return true;
		}
	}
	return false;
}

function LineIsImportant (lineText) {
	return !LineIsComment(lineText);
}

function LineIsSeparator (lineText) {
	lineText = lineText.trim();
	for (let nssSeparatorStarter of regionSeparatorStarters) {
		if (lineText.startsWith(nssSeparatorStarter)) {
			return true;
		}
	}
	return false;
}



function KuzRegionFile (filename) {
	this.filename = filename;
}

KuzRegionFile.prototype.IsValid = function () {
	return this.Exists();
}

KuzRegionFile.prototype.Exists = function () {
	if (fsutils.IsFile(this.filename)) {
		return true;
	}
	return false;
}

KuzRegionFile.prototype.getLinesArray = function (lineText) {
	let values = [];
	if (fs.existsSync(this.filename)) {
		let fileText = fs.readFileSync(this.filename, "utf8").replace("\r", "");
		let fileLines = fileText.split("\n");
		for (let fileLine of fileLines) {
			let currentLine = fileLine.trimRight();
			if (currentLine == "") {
				continue;
			} else if (LineIsComment(currentLine)) {
				continue;
			} else {
				values.push(currentLine);
			}
		}
	}
	return values;
}

KuzRegionFile.prototype.getLinesByRegionIndex = function (regionIndex) {
	let currentRegionIndex = 0;
	let regionLines = [];
	if (fs.existsSync(this.filename)) {
		let fileLines = this.getLinesArray();
		for (let currentLine of fileLines) {
			if (LineIsSeparator(currentLine)) {
				currentRegionIndex++;
			} else if (currentRegionIndex == regionIndex) {
				if (regionIndex % 2 == 0) {
					regionLines.push(currentLine.trimLeft());
				} else {
					regionLines.push(currentLine);
				}
			} else if (currentRegionIndex > regionIndex) {
				break;
			}
		}
	}

	return regionLines;
}

KuzRegionFile.prototype.getEvenRegionLines = function () {
	let currentRegionIndex = 0;
	let evenLines = [];
	if (fs.existsSync(this.filename)) {
		let fileLines = this.getLinesArray();
		for (let currentLine of fileLines) {
			if (LineIsSeparator(currentLine)) {
				currentRegionIndex++;
			} else if (currentRegionIndex % 2 == 0) {
				if (LineIsImportant(currentLine)) {
					evenLines.push(currentLine);
				}
			}
		}
	}

	return evenLines;
}

KuzRegionFile.prototype.getOddRegionLines = function () {
	let currentRegionIndex = 0;
	let oddLines = [];
	if (fs.existsSync(this.filename)) {
		let fileLines = this.getLinesArray();
		for (let currentLine of fileLines) {
			if (LineIsSeparator(currentLine)) {
				currentRegionIndex++;
			} else if (currentRegionIndex % 2 == 1) {
				if (LineIsImportant(currentLine)) {
					oddLines.push(currentLine);
				}
			}
		}
	}

	return oddLines;
}



KuzRegionFile.prototype.getMetaLines = function () {
	return this.getEvenRegionLines();
}

KuzRegionFile.prototype.getContentLines = function () {
	return this.getOddRegionLines();
}



KuzRegionFile.prototype.getHeaderLines = function () {
	return this.getLinesByRegionIndex(0);
}

KuzRegionFile.prototype.getBodyLines = function () {
	return this.getLinesByRegionIndex(1);
}

KuzRegionFile.prototype.getBodyString = function () {
	return this.getBodyLines().join("\n");
}

KuzRegionFile.prototype.getFooterLines = function () {
	return this.getLinesByRegionIndex(2);
}

module.exports = {
	KuzRegionFile: KuzRegionFile
};


