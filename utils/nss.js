// nss.js

const fs = require("fs");

function NewlineSeparatedStrings (filename) {
	this.filename = filename;
}

NewlineSeparatedStrings.prototype.GetLinesArray = function (lineText) {
	let values = [];
	if (fs.existsSync(this.filename)) {
		let fileText = fs.readFileSync(this.filename, "utf8").replace("\r", "");
		let fileLines = fileText.split("\n");
		for (let index in fileLines) {
			let line = fileLines[index].trimRight();
			if (line == "") {
				continue;
			} else if (line.startsWith("#") || line.startsWith("//")) {
				continue;
			} else {
				values.push(line);
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
			if (currentLine.startsWith("====") || currentLine.startsWith("----")) {
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
	let regionLines = [];
	if (fs.existsSync(this.filename)) {
		let fileLines = this.GetLinesArray();
		for (let currentLine of fileLines) {
			if (currentLine.startsWith("====") || currentLine.startsWith("----")) {
				currentRegionIndex++;
			} else if (currentRegionIndex % 2 == 0) {
				regionLines.push(currentLine);
			}
		}
	}

	return regionLines;
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


