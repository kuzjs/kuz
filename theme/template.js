// template.js

const fs = require("fs");
const pug = require("pug");

const log = require("../utils/log");
const fsutils = require("../utils/fsutils");

function Template(theme, data) {
	this.theme = theme;
	this.name = data.name;
	this.description = data.description;
	this.title = data.title;
	this.path = data.path;
	this.default = data.default ? data.default : false;
	this.Setup();
}

Template.prototype.FullPath = function () {
	return fsutils.JoinPath(this.theme.TemplatesInputDirectory(), this.path);
}

Template.prototype.Setup = function () {
	if (!fs.existsSync(this.FullPath())) {
		this.theme.site.Error("Template not found: " + this.FullPath());
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
	this.pug = pug.compileFile(this.FullPath());
	this.mtimeMs = fs.statSync(this.FullPath()).mtimeMs;
	this.allIsWell = true;
}

Template.prototype.NeedsUpdate = function () {
	if (this.mtimeMs == fs.statSync(this.FullPath()).mtimeMs) {
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


