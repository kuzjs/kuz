// theme.js

const log = require("../kz-log/log");
const fsutils = require("../kz-fs");

const common = require("../base/common");
const defaultText = common.defaultText;

const layoutsDirectory = "layouts";



function Theme (themeName, site) {
	this.themeName = themeName;
	this.site = site;
	this.SetupPaths();
}

const KZBaseObject = require("../base/baseobject").KZBaseObject;
Theme.prototype = new KZBaseObject();
Theme.prototype.typeName = "Theme";

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

	const JsonFile = require("../kz-json").JsonFile;
	this.meta = new JsonFile(this.JsonFilePath());
	this.metaObject = this.meta.json.meta;

	this.SetupLayouts();
	this.SetupCSS();
	this.SetupJS();
	this.SetupResources();
	this.SetupNextPrevious();

	this.is_valid = true;
}

Theme.prototype.SetupLayouts = function () {
	this.layouts = [];
	if (this.meta.json.layouts) {
		const ThemeLayout = require("./layout").ThemeLayout;
		for (let data of this.meta.json.layouts) {
			let layoutFilePath = fsutils.JoinPath(this.LayoutsInputDirectory(), data.path);
			if (fsutils.IsFile(layoutFilePath)) {
				let layout = new ThemeLayout(this, data);
				this.layouts.push(layout);
			} else {
				log.Red("Layout NOT found: " + layoutFilePath);
			}
		}
	}
}

Theme.prototype.SetupCSS = function () {
	this.cssArray = [];
	if (this.meta.json.css) {
		const ThemeCSS = require("./css").ThemeCSS;
		for (let data of this.meta.json.css) {
			let cssFile = new ThemeCSS(this, data);
			this.cssArray.push(cssFile);
		}
	}
}

Theme.prototype.SetupJS = function () {
	this.jsArray = [];
	if (this.meta.json.js) {
		const ThemeJS = require("./js").ThemeJS;
		for (let data of this.meta.json.js) {
			let jsFile = new ThemeJS(this, data);
			this.jsArray.push(jsFile);
		}
	}
}

Theme.prototype.SetupResources = function () {
	this.resourceArray = [];
	if (this.meta.json.res) {
		const ThemeResource = require("./resource").ThemeResource;
		for (let data of this.meta.json.res) {
			let resFile = new ThemeResource(this, data);
			this.resourceArray.push(resFile);
		}
	}
}

Theme.prototype.SetupNextPrevious = function () {
	const SetupNextPrevious = require("../utils/siteutils").SetupNextPrevious;
	SetupNextPrevious(this.layouts);
	SetupNextPrevious(this.cssArray);
	SetupNextPrevious(this.jsArray);
	SetupNextPrevious(this.resourceArray);
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
	const KZTable = require("../kz-table/table").KZTable;
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
		this.css.length,
		this.js.length,
		this.resources.length
	];
}

module.exports = {
	Theme: Theme
};


