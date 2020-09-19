// module.js

const fs = require("fs");

const log = require("../kuz-log/log");
const fsutils = require("../kuz-fs");

function ThemeModule (theme, data) {
	this.SetupThemeElement(theme, data);
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
	this.ForcedUpdate();
}

ThemeModule.prototype.AllIsWell = function () {
	if (this.allIsWell === undefined) {
		return false;
	}
	return this.allIsWell;
}

ThemeModule.prototype.ForcedUpdate = function () {
	//
}

ThemeModule.prototype.NeedsUpdate = function () {
	if (this.mtimeMs == fs.statSync(this.InputFilePath()).mtimeMs) {
		return false;
	}
	return true;
}

ThemeModule.prototype.Update = function () {
	if (this.NeedsUpdate()) {
		this.ForcedUpdate();
	}
}

ThemeModule.prototype.Updatable = function () {
	this.PrintInputFilePath();
}



module.exports = {
	ThemeModule: ThemeModule
};


