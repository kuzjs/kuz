// layout.js

const fs = require("fs");
const pug = require("pug");

const fsutils = require("../kuz-fs");

function ThemeLayout (theme, data) {
	this.setupThemeElement(theme, data);
	this.setupLayout();
}

const ThemeElement = require("./element").ThemeElement;
ThemeLayout.prototype = new ThemeElement("layouts");
ThemeLayout.prototype.typeName = "Layout";

ThemeLayout.prototype.setupLayout = function () {
	if (!fs.existsSync(this.InputFilePath())) {
		this.theme.site.Error("Layout not found: " + this.InputFilePath());
		return;
	}
	this.forcedUpdate();
}

ThemeLayout.prototype.ok = function () {
	if (this.okay === undefined) {
		return false;
	}
	return this.okay;
}

ThemeLayout.prototype.forcedUpdate = function () {
	this.pug = pug.compileFile(this.InputFilePath());
	this.mtimeMs = fs.statSync(this.InputFilePath()).mtimeMs;
	this.okay = true;
}

ThemeLayout.prototype.needsUpdate = function () {
	if (this.mtimeMs == fs.statSync(this.InputFilePath()).mtimeMs) {
		return false;
	}
	return true;
}

ThemeLayout.prototype.update = function () {
	if (this.needsUpdate()) {
		this.forcedUpdate();
	}
}

ThemeLayout.prototype.updatable = function () {
	this.PrintInputFilePath();
}



module.exports = {
	ThemeLayout: ThemeLayout
};


