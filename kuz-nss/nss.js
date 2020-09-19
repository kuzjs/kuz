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



function KZNss (filename) {
	this.filename = filename;
}

KZNss.prototype.GetLinesArray = function (lineText) {
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

KZNss.prototype.GetLinesByRegionIndex = function (regionIndex) {
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

KZNss.prototype.GetEvenRegionLines = function () {
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

KZNss.prototype.GetOddRegionLines = function () {
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

KZNss.prototype.GetMetaLines = function () {
	return this.GetHeaderLines();
}

KZNss.prototype.GetHeaderLines = function () {
	return this.GetLinesByRegionIndex(0);
}

KZNss.prototype.GetContentLines = function () {
	return this.GetBodyLines();
}

KZNss.prototype.GetBodyLines = function () {
	return this.GetLinesByRegionIndex(1);
}

KZNss.prototype.GetBodyString = function () {
	return this.GetBodyLines().join("\n");
}

KZNss.prototype.GetFooterLines = function () {
	return this.GetLinesByRegionIndex(2);
}

module.exports = {
	Nss: KZNss
};


