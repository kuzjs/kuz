// module.js

const fs = require("fs");

const fsutils = require("../kuz-fs");

function ThemeModule (theme, data) {
	this.setupThemeElement(theme, data);
	this.Setup();
}

const ThemeElement = require("./element").ThemeElement;
ThemeModule.prototype = new ThemeElement("modules");
ThemeModule.prototype.typeName = "Module";

ThemeModule.prototype.Setup = function () {
	if (!fs.existsSync(this.InputFilePath())) {
		this.theme.site.Error("Module not found: " + this.InputFilePath());
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
	if (this.mtimeMs == fs.statSync(this.InputFilePath()).mtimeMs) {
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
	this.PrintInputFilePath();
}



module.exports = {
	ThemeModule: ThemeModule
};


