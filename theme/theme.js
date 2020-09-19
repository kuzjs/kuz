// theme.js

const log = require("../kuz-log/log");
const fsutils = require("../kuz-fs");

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

	const JsonFile = require("../kuz-json").JsonFile;
	this.meta = new JsonFile(this.JsonFilePath());
	this.metaObject = this.meta.json.meta;

	this.SetupLayouts();
	this.SetupModules();
	this.SetupCSS();
	this.SetupJS();
	this.SetupResources();
	this.SetupNextPrevious();

	this.is_valid = true;
}

Theme.prototype.SetupElements = function (dataArray, ElementClass) {
	let elements = [];
	if (dataArray) {
		for (let data of dataArray) {
			let element = new ElementClass(this, data);
			if (element.ElementIsValid()) {
				elements.push(element);
			}
		}
	}

	return elements;
}

Theme.prototype.SetupLayouts = function () {
	const ThemeLayout = require("./layout").ThemeLayout;
	this.layouts = this.SetupElements(this.meta.json.layouts, ThemeLayout);
}

Theme.prototype.SetupModules = function () {
	const ThemeModule = require("./module").ThemeModule;
	this.modules = this.SetupElements(this.meta.json.modules, ThemeModule);
}

Theme.prototype.SetupCSS = function () {
	const ThemeCSS = require("./css").ThemeCSS;
	this.cssArray = this.SetupElements(this.meta.json.css, ThemeCSS);
}

Theme.prototype.SetupJS = function () {
	const ThemeJS = require("./js").ThemeJS;
	this.jsArray = this.SetupElements(this.meta.json.js, ThemeJS);
}

Theme.prototype.SetupResources = function () {
	const ThemeResource = require("./resource").ThemeResource;
	this.resourceArray = this.SetupElements(this.meta.json.resources, ThemeResource);
}

Theme.prototype.SetupNextPrevious = function () {
	const SetupNextPrevious = require("../kuz-site/utils").SetupNextPrevious;
	SetupNextPrevious(this.layouts);
	SetupNextPrevious(this.modules);
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
	const KZTable = require("../kuz-table/table").KZTable;
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


