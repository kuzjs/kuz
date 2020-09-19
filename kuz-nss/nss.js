// nss.js

const fs = require("fs");

const fsutils = require("../kuz-fs");

const nssCommentStarters = [
	"/", "'", '"', "#"
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



function KuZNss (filename) {
	this.filename = filename;
}

KuZNss.prototype.IsValid = function () {
	return this.Exists();
}

KuZNss.prototype.Exists = function () {
	if (fsutils.IsFile(this.filename)) {
		return true;
	}
	return false;
}

KuZNss.prototype.GetLinesArray = function (lineText) {
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

KuZNss.prototype.GetLinesByRegionIndex = function (regionIndex) {
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

KuZNss.prototype.GetEvenRegionLines = function () {
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

KuZNss.prototype.GetOddRegionLines = function () {
	let currentRegionIndex = 0;
	let oddLines = [];
	if (fs.existsSync(this.filename)) {
		let fileLines = this.GetLinesArray();
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



KuZNss.prototype.GetMetaLines = function () {
	return this.GetEvenRegionLines();
}

KuZNss.prototype.GetContentLines = function () {
	return this.GetOddRegionLines();
}



KuZNss.prototype.GetHeaderLines = function () {
	return this.GetLinesByRegionIndex(0);
}

KuZNss.prototype.GetBodyLines = function () {
	return this.GetLinesByRegionIndex(1);
}

KuZNss.prototype.GetBodyString = function () {
	return this.GetBodyLines().join("\n");
}

KuZNss.prototype.GetFooterLines = function () {
	return this.GetLinesByRegionIndex(2);
}

module.exports = {
	Nss: KuZNss
};


