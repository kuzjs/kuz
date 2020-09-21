// layout.js

const fs = require("fs");
const pug = require("pug");

const fsutils = require("../kuz-fs");

function ThemeLayout (theme, data) {
	this.setupThemeElement(theme, data);
	this.Setup();
}

const ThemeElement = require("./element").ThemeElement;
ThemeLayout.prototype = new ThemeElement("layouts");
ThemeLayout.prototype.typeName = "Layout";

ThemeLayout.prototype.Setup = function () {
	if (!fs.existsSync(this.InputFilePath())) {
		this.theme.site.Error("Layout not found: " + this.InputFilePath());
		return;
	}
	this.forcedUpdate();
}

ThemeLayout.prototype.AllIsWell = function () {
	if (this.allIsWell === undefined) {
		return false;
	}
	return this.allIsWell;
}

ThemeLayout.prototype.forcedUpdate = function () {
	this.pug = pug.compileFile(this.InputFilePath());
	this.mtimeMs = fs.statSync(this.InputFilePath()).mtimeMs;
	this.allIsWell = true;
}

ThemeLayout.prototype.NeedsUpdate = function () {
	if (this.mtimeMs == fs.statSync(this.InputFilePath()).mtimeMs) {
		return false;
	}
	return true;
}

ThemeLayout.prototype.update = function () {
	if (this.NeedsUpdate()) {
		this.forcedUpdate();
	}
}

ThemeLayout.prototype.updatable = function () {
	this.PrintInputFilePath();
}



module.exports = {
	ThemeLayout: ThemeLayout
};


