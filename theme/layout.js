// layout.js

const fs = require("fs");
const pug = require("pug");

const log = require("../kz-log/log");
const fsutils = require("../kz-fs");

function ThemeLayout (theme, data) {
	this.theme = theme;
	this.data = data;
	this.default = data.default ? data.default : false;
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
	this.ForcedUpdate();
}

ThemeLayout.prototype.AllIsWell = function () {
	if (this.allIsWell === undefined) {
		return false;
	}
	return this.allIsWell;
}

ThemeLayout.prototype.ForcedUpdate = function () {
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

ThemeLayout.prototype.Update = function () {
	if (this.NeedsUpdate()) {
		this.ForcedUpdate();
	}
}

ThemeLayout.prototype.Updatable = function () {
	this.PrintInputFilePath();
}



module.exports = {
	ThemeLayout: ThemeLayout
};


