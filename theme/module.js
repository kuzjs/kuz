// ThemeModule.js

const fs = require("fs");

const log = require("../kz-log/log");
const fsutils = require("../kz-fs");

function ThemeModule (theme, data) {
	this.theme = theme;
	this.data = data;
	this.default = data.default ? data.default : false;
	this.Setup();
}

const ThemeElement = require("./element").ThemeElement;
ThemeModule.prototype = new ThemeElement();
ThemeModule.prototype.typeName = "ThemeModule";

ThemeModule.prototype.FullPath = function () {
	return fsutils.JoinPath(this.theme.ThemeModulesInputDirectory(), this.Path());
}

ThemeModule.prototype.Setup = function () {
	if (!fs.existsSync(this.FullPath())) {
		this.theme.site.Error("ThemeModule not found: " + this.FullPath());
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
	if (this.mtimeMs == fs.statSync(this.FullPath()).mtimeMs) {
		return false;
	}
	return true;
}

ThemeModule.prototype.Update = function () {
	if (this.NeedsUpdate()) {
		this.ForcedUpdate();
	}
}



module.exports = {
	ThemeModule: ThemeModule
};


