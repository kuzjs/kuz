// Layout.js

const fs = require("fs");
const pug = require("pug");

const log = require("../kz-log/log");
const fsutils = require("../kz-fs");

function Layout (theme, data) {
	this.theme = theme;
	this.data = data;
	this.default = data.default ? data.default : false;
	this.Setup();
}

const ThemeElement = require("./element").ThemeElement;
Layout.prototype = new ThemeElement();
Layout.prototype.typeName = "Layout";

Layout.prototype.FullPath = function () {
	return fsutils.JoinPath(this.theme.LayoutsInputDirectory(), this.Path());
}

Layout.prototype.Setup = function () {
	if (!fs.existsSync(this.FullPath())) {
		this.theme.site.Error("Layout not found: " + this.FullPath());
		return;
	}
	this.ForcedUpdate();
}

Layout.prototype.AllIsWell = function () {
	if (this.allIsWell === undefined) {
		return false;
	}
	return this.allIsWell;
}

Layout.prototype.ForcedUpdate = function () {
	this.pug = pug.compileFile(this.FullPath());
	this.mtimeMs = fs.statSync(this.FullPath()).mtimeMs;
	this.allIsWell = true;
}

Layout.prototype.NeedsUpdate = function () {
	if (this.mtimeMs == fs.statSync(this.FullPath()).mtimeMs) {
		return false;
	}
	return true;
}

Layout.prototype.Update = function () {
	if (this.NeedsUpdate()) {
		this.ForcedUpdate();
	}
}



module.exports = {
	Layout: Layout
};


