// template.js

const fs = require("fs");
const pug = require("pug");

const log = require("../utils/log");

function Template(theme, path) {
	this.theme = theme;
	this.path = path;
	this.Setup();
}

Template.prototype.Setup = function () {
	if (!fs.existsSync(this.path)) {
		this.theme.site.Error("Template not found: " + this.path);
		return;
	}
	this.ForcedUpdate();
}

Template.prototype.AllIsWell = function () {
	if (this.allIsWell === undefined) {
		return false;
	}
	return this.allIsWell;
}

Template.prototype.ForcedUpdate = function () {
	this.pug = pug.compileFile(this.path);
	this.mtimeMs = fs.statSync(this.path).mtimeMs;
	this.allIsWell = true;
}

Template.prototype.NeedsUpdate = function () {
	if (this.mtimeMs == fs.statSync(this.path).mtimeMs) {
		return false;
	}
	return true;
}

Template.prototype.Update = function () {
	if (this.NeedsUpdate()) {
		this.ForcedUpdate();
	}
}



module.exports = {
	Template: Template
};


