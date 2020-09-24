// module.js

const fs = require("fs");

const fsutils = require("../kuz-fs");



function ThemeModule (theme, data) {
	this.setupThemeElement(theme, data);
	this.setupModule();
}

const ThemeElement = require("./element");
ThemeModule.prototype = new ThemeElement("modules");
ThemeModule.prototype.typeName = "Module";

ThemeModule.prototype.setupModule = function () {
	if (!fs.existsSync(this.getInputFilePath())) {
		this.theme.site.causeError("Module not found: " + this.getInputFilePath());
		return;
	}
	this.forcedUpdate();
}

ThemeModule.prototype.ok = function () {
	if (this.okay === undefined) {
		return false;
	}
	return this.okay;
}

ThemeModule.prototype.forcedUpdate = function () {
	//
}

ThemeModule.prototype.needsUpdate = function () {
	if (this.mtimeMs === fs.statSync(this.getInputFilePath()).mtimeMs) {
		return false;
	}
	return true;
}

ThemeModule.prototype.update = function () {
	if (this.needsUpdate()) {
		this.forcedUpdate();
	}
}

ThemeModule.prototype.updatable = function () {
	this.printInputFilePath();
}



module.exports = ThemeModule;


