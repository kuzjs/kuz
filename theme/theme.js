// theme.js

const log = require("../utils/log");
const fsutils = require("../utils/fsutils");
const JsonFile = require("../utils/jsonfile").JsonFile;

const KZTable = require("../utils/table").KZTable;

const KZBaseObject = require("../base/baseobject").KZBaseObject;

const common = require("../base/common");
const defaultText = common.defaultText;

const Layout = require("./layout").Layout;

const CssFile = require("./cssfile").CssFile;
const JsFile = require("./jsfile").JsFile;
const ResFile = require("./resfile").ResFile;

const layoutsDirectory = "layouts";



function Theme (themeName, site) {
	this.themeName = themeName;
	this.site = site;
	this.SetupPaths();
}

Theme.prototype = new KZBaseObject();

Theme.prototype.Name = function () {
	return this.themeName;
}

Theme.prototype.ThemesInputDirectory = function () {
	return this.site.GetThemesDirectory();
}

Theme.prototype.ThemesOutputDirectory = function () {
	return fsutils.JoinPath("docs/x/dist/themes");
}

Theme.prototype.InputDirectory = function () {
	return fsutils.JoinPath(this.ThemesInputDirectory(), this.Name());
}

Theme.prototype.OutputDirectory = function () {
	return fsutils.JoinPath(this.ThemesOutputDirectory(), this.Name());
}

Theme.prototype.LayoutsInputDirectory = function () {
	return fsutils.JoinPath(this.InputDirectory(), "layouts");
}

Theme.prototype.CssInputDirectory = function () {
	return fsutils.JoinPath(this.InputDirectory(), "css");
}

Theme.prototype.JsInputDirectory = function () {
	return fsutils.JoinPath(this.InputDirectory(), "js");
}

Theme.prototype.JsonFileName = function () {
	return "theme.json";
}

Theme.prototype.JsonFilePath = function () {
	return fsutils.JoinPath(this.InputDirectory(), this.JsonFileName());
}

Theme.prototype.SetupPaths = function () {
	if (!fsutils.IsDirectory(this.InputDirectory())) {
		log.Red("Theme NOT Found: " + this.InputDirectory());
		return;
	}

	if (!fsutils.IsFile(this.JsonFilePath())) {
		log.Red("Theme JSON NOT Found: " + this.JsonFilePath());
		return;
	}

	this.meta = new JsonFile(this.JsonFilePath());
	this.metaObject = this.meta.json.meta;

	this.SetupLayouts();
	this.SetupCssFiles();
	this.SetupJsFiles();
	this.SetupResFiles();
	this.SetupNextPrevious();

	this.is_valid = true;
}

Theme.prototype.SetupLayouts = function () {
	this.layouts = [];
	if (this.meta.json.layouts) {
		for (let data of this.meta.json.layouts) {
			let layoutFilePath = fsutils.JoinPath(this.LayoutsInputDirectory(), data.path);
			if (fsutils.IsFile(layoutFilePath)) {
				let layout = new Layout(this, data);
				this.layouts.push(layout);
			} else {
				log.Red("Layout NOT found: " + layoutFilePath);
			}
		}
	}
}

Theme.prototype.SetupCssFiles = function () {
	this.cssFiles = [];
	if (this.meta.json.css) {
		for (let data of this.meta.json.css) {
			let cssFile = new CssFile(this, data);
			this.cssFiles.push(cssFile);
		}
	}
}

Theme.prototype.SetupJsFiles = function () {
	this.jsFiles = [];
	if (this.meta.json.js) {
		for (let data of this.meta.json.js) {
			let jsFile = new JsFile(this, data);
			this.jsFiles.push(jsFile);
		}
	}
}

Theme.prototype.SetupResFiles = function () {
	this.resFiles = [];
	if (this.meta.json.res) {
		for (let data of this.meta.json.res) {
			let resFile = new ResFile(this, data);
			this.resFiles.push(resFile);
		}
	}
}

Theme.prototype.SetupNextPrevious = function () {
	const SetupNextPrevious = require("../utils/siteutils").SetupNextPrevious;
	SetupNextPrevious(this.layouts);
	SetupNextPrevious(this.cssFiles);
	SetupNextPrevious(this.jsFiles);
	SetupNextPrevious(this.resFiles);
}

Theme.prototype.Props = function () {
	return this.meta.json;
}

Theme.prototype.DefaultLayout = function () {
	for (let layout of this.layouts) {
		if (layout.default) {
			return layout;
		}
	}
	return this.layouts[0];
}

Theme.prototype.GetLayout = function (layoutName) {
	for (let layout of this.layouts) {
		if (layoutName == layout.Name()) {
			return layout;
		}
	}
	return null;
}

Theme.prototype.IsValid = function () {
	if (this.is_valid === undefined) {
		return false;
	}
	return this.is_valid;
}

Theme.prototype.Name = function () {
	return this.themeName;
}

Theme.prototype.Title = function () {
	return this.metaObject.title ? this.metaObject.title : defaultText.title;
}

Theme.prototype.Version = function () {
	return this.metaObject.version ? this.metaObject.version : "0.0";
}

Theme.prototype.Description = function () {
	return this.metaObject.description ? this.metaObject.description : defaultText.description;
}

Theme.prototype.Documentation = function () {
	return this.metaObject.documentation ? this.metaObject.documentation : defaultText.documentation;
}

Theme.prototype.LayoutCount = function () {
	return this.layouts.length;
}

Theme.prototype.toString = function () {
	return this.Name() + " (" + this.LayoutCount() + " layouts) [v" + this.Version() + "]";
}

Theme.prototype.GetPages = function () {
	return [];
}

Theme.prototype.GetTable = function () {
	let table = new KZTable();
	table.AddColumn("Name");
	table.AddColumn("Title");
	table.AddColumn("Ver");
	table.AddColumn("Description");
	table.AddColumn("Documentation");
	table.AddColumn("Ls");
	table.AddColumn("CSS");
	table.AddColumn("JS");
	table.AddColumn("Res");
	return table;
}

Theme.prototype.Row = function () {
	let meta = this.meta.json.meta;
	return [
		this.Name(),
		this.Title(),
		this.Version(),
		this.Description(),
		this.Documentation(),
		this.LayoutCount(),
		this.cssFiles.length,
		this.jsFiles.length,
		this.resFiles.length
	];
}

module.exports = {
	Theme: Theme
};


