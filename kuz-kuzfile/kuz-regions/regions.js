// regions.js

const fs = require("fs");

const fsutils = require("../../kuz-fs");

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
	for (let regionCommentStarter of regionCommentStarters) {
		if (lineText.startsWith(regionCommentStarter)) {
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
	for (let regionSeparatorStarter of regionSeparatorStarters) {
		if (lineText.startsWith(regionSeparatorStarter)) {
			return true;
		}
	}
	return false;
}



function KuzRegions (filename) {
	this.filename = filename;
}

KuzRegions.prototype.IsValid = function () {
	return this.exists();
}

KuzRegions.prototype.exists = function () {
	if (fsutils.IsFile(this.filename)) {
		return true;
	}
	return false;
}

KuzRegions.prototype.getLinesArray = function (lineText) {
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

KuzRegions.prototype.getLinesByRegionIndex = function (regionIndex) {
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

KuzRegions.prototype.getEvenRegionLines = function () {
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

KuzRegions.prototype.getOddRegionLines = function () {
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



KuzRegions.prototype.getMetaLines = function () {
	return this.getEvenRegionLines();
}

KuzRegions.prototype.getContentLines = function () {
	return this.getOddRegionLines();
}



KuzRegions.prototype.getHeaderLines = function () {
	return this.getLinesByRegionIndex(0);
}

KuzRegions.prototype.getBodyLines = function () {
	return this.getLinesByRegionIndex(1);
}

KuzRegions.prototype.getBodyString = function () {
	return this.getBodyLines().join("\n");
}

KuzRegions.prototype.getFooterLines = function () {
	return this.getLinesByRegionIndex(2);
}

module.exports = {
	KuzRegions: KuzRegions
};


