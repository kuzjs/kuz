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

Layout.prototype.GetTable = function () {
	const KZTable = require("../kz-table/table").KZTable;
	let table = new KZTable();
	table.AddColumn("Name");
	table.AddColumn("Theme");
	table.AddColumn("Title");
	table.AddColumn("Description");
	table.AddColumn("Documentation");
	table.AddColumn("Path");
	return table;
}

Layout.prototype.Row = function () {
	return [
		this.Name(),
		this.theme.Name(),
		this.Title(),
		this.Description(),
		this.Documentation(),
		this.Path()
	];
}



module.exports = {
	Layout: Layout
};


