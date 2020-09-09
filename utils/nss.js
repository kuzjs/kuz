// nss.js

const fs = require("fs");

function NewlineSeparatedStrings (filename) {
	this.filename = filename;
	this.headerLines = [];
	this.bodyLines = [];
	this.footerLines = [];
	this.SetupArrays();
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

NewlineSeparatedStrings.prototype.SetupArrays = function () {
	let regionIndex = 0;
	if (fs.existsSync(this.filename)) {
		let fileLines = this.GetLinesArray();
		for (let index in fileLines) {
			let line = fileLines[index];
			if (line.startsWith("====") || line.startsWith("----")) {
				regionIndex++;
			} else {
				switch (regionIndex) {
					case 0:
						line = line.trim();
						if (line.length != 0) {
							this.headerLines.push(line);
						}
						break;
					case 1:
						this.bodyLines.push(line);
						break;
					case 2:
						line = line.trim();
						if (line.length != 0) {
							this.footerLines.push(line);
						}
						break;
					default:
						break;
				}
			}
			if (regionIndex > 2) {
				break;
			}
		}
	}
}

NewlineSeparatedStrings.prototype.GetMetaLines = function () {
	return this.GetHeaderLines();
}

NewlineSeparatedStrings.prototype.GetHeaderLines = function () {
	return this.headerLines;
}

NewlineSeparatedStrings.prototype.GetContentLines = function () {
	return this.GetBodyLines();
}

NewlineSeparatedStrings.prototype.GetBodyLines = function () {
	return this.bodyLines;
}

NewlineSeparatedStrings.prototype.GetBodyString = function () {
	return this.bodyLines.join("\n");
}

NewlineSeparatedStrings.prototype.GetFooterLines = function () {
	return this.footerLines;
}

module.exports = {
	Nss: NewlineSeparatedStrings
};


