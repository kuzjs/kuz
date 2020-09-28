// layout.js

const fs = require("fs");
const pug = require("pug");

const fsutils = require("../kuz-fsutils");



function ThemeLayout (theme, data) {
	this.setupThemeElement(theme, data);
	this.getApp().layoutSetupActon.resetClock();
	this.setupLayout();
	this.getApp().layoutSetupActon.record();
}

const ThemeElement = require("./element");
ThemeLayout.prototype = new ThemeElement("layouts");
ThemeLayout.prototype.typeName = "Layout";

ThemeLayout.prototype.setupLayout = function () {
	if (!fs.existsSync(this.getInputFilePath())) {
		this.theme.site.causeError("Layout not found: " + this.getInputFilePath());
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

ThemeLayout.prototype.getCompiledPug = function () {
	if (this.pug === undefined) {
		this.pug = pug.compileFile(this.getInputFilePath());
		this.mtimeMs = fs.statSync(this.getInputFilePath()).mtimeMs;
	}
	return this.pug;
}

ThemeLayout.prototype.forcedUpdate = function () {
	this.pug = pug.compileFile(this.getInputFilePath());
	this.mtimeMs = fs.statSync(this.getInputFilePath()).mtimeMs;
	this.okay = true;
}

ThemeLayout.prototype.needsUpdate = function () {
	if (this.mtimeMs === fs.statSync(this.getInputFilePath()).mtimeMs) {
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
	this.printInputFilePath();
}



module.exports = ThemeLayout;


