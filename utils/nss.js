// nss.js

const fs = require("fs");

const nssCommentStarters = [
	"//"
];

const nssSeparatorStarters = [
	"====", "----",
	"++++", "____",
	"....", "~~~~"
];

function LineIsComment (lineText) {
	lineText = lineText.trim();
	for (let nssCommentStarter of nssCommentStarters) {
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
	for (let nssSeparatorStarter of nssSeparatorStarters) {
		if (lineText.startsWith(nssSeparatorStarter)) {
			return true;
		}
	}
	return false;
}



function NewlineSeparatedStrings (filename) {
	this.filename = filename;
}

NewlineSeparatedStrings.prototype.GetLinesArray = function (lineText) {
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

NewlineSeparatedStrings.prototype.GetLinesByRegionIndex = function (regionIndex) {
	let currentRegionIndex = 0;
	let regionLines = [];
	if (fs.existsSync(this.filename)) {
		let fileLines = this.GetLinesArray();
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

NewlineSeparatedStrings.prototype.GetEvenLines = function () {
	let currentRegionIndex = 0;
	let evenLines = [];
	if (fs.existsSync(this.filename)) {
		let fileLines = this.GetLinesArray();
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

NewlineSeparatedStrings.prototype.GetOddLines = function () {
	let currentRegionIndex = 0;
	let oddLines = [];
	if (fs.existsSync(this.filename)) {
		let fileLines = this.GetLinesArray();
		for (let currentLine of fileLines) {
			if (LineIsSeparator(currentLine)) {
				currentRegionIndex++;
			} else if (currentRegionIndex % 2 == 0) {
				if (LineIsImportant(currentLine)) {
					oddLines.push(currentLine);
				}
			}
		}
	}

	return oddLines;
}

NewlineSeparatedStrings.prototype.GetMetaLines = function () {
	return this.GetHeaderLines();
}

NewlineSeparatedStrings.prototype.GetHeaderLines = function () {
	return this.GetLinesByRegionIndex(0);
}

NewlineSeparatedStrings.prototype.GetContentLines = function () {
	return this.GetBodyLines();
}

NewlineSeparatedStrings.prototype.GetBodyLines = function () {
	return this.GetLinesByRegionIndex(1);
}

NewlineSeparatedStrings.prototype.GetBodyString = function () {
	return this.GetBodyLines().join("\n");
}

NewlineSeparatedStrings.prototype.GetFooterLines = function () {
	return this.GetLinesByRegionIndex(2);
}

module.exports = {
	Nss: NewlineSeparatedStrings
};


