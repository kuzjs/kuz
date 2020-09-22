// theme.js

const fsutils = require("../kuz-fs");

const common = require("../kuz-common");
const defaultText = common.defaultText;

const layoutsDirectory = "layouts";



function Theme (themeName, site) {
	this.themeName = themeName;
	this.site = site;
	this.log = this.site.log.getChild("theme/" + this.themeName);
	this.getApp().themeSetupActon.resetClock();
	this.setupTheme();
	this.getApp().themeSetupActon.record();
}

const KuzBaseObject = require("../kuz-baseobject").KuzBaseObject;
Theme.prototype = new KuzBaseObject();
Theme.prototype.typeName = "Theme";

Theme.prototype.getName = function () {
	return this.themeName;
}

Theme.prototype.getThemesInputDirectory = function () {
	return this.site.getThemesInputDirectory();
}

Theme.prototype.getThemesOutputDirectory = function () {
	return fsutils.JoinPath("docs/x/dist/themes");
}

Theme.prototype.InputDirectory = function () {
	return fsutils.JoinPath(this.getThemesInputDirectory(), this.getName());
}

Theme.prototype.OutputDirectory = function () {
	return fsutils.JoinPath(this.getThemesOutputDirectory(), this.getName());
}

Theme.prototype.getJsonFileName = function () {
	return "theme.json";
}

Theme.prototype.getJsonFilePath = function () {
	return fsutils.JoinPath(this.InputDirectory(), this.getJsonFileName());
}

Theme.prototype.setupTheme = function () {
	if (!fsutils.IsDirectory(this.InputDirectory())) {
		this.log.red("Theme NOT Found: " + this.InputDirectory());
		return;
	}

	if (!fsutils.IsFile(this.getJsonFilePath())) {
		this.log.red("Theme JSON NOT Found: " + this.getJsonFilePath());
		return;
	}

	const KuzJson = require("../kuz-json").KuzJson;
	this.meta = new KuzJson(this.getJsonFilePath());
	this.metaObject = this.meta.json.meta;

	this.setupLayouts();
	this.setupModules();
	this.setupCSS();
	this.setupJS();
	this.setupResources();
	this.setupNextPrevious();

	this.is_valid = true;
}

Theme.prototype.setupElements = function (dataArray, ElementClass) {
	let elements = [];
	if (dataArray) {
		for (let data of dataArray) {
			let element = new ElementClass(this, data);
			if (element.elementIsValid()) {
				elements.push(element);
			}
		}
	}

	return elements;
}

Theme.prototype.setupLayouts = function () {
	const ThemeLayout = require("./layout").ThemeLayout;
	this.layouts = this.setupElements(this.meta.json.layouts, ThemeLayout);
}

Theme.prototype.setupModules = function () {
	const ThemeModule = require("./module").ThemeModule;
	this.modules = this.setupElements(this.meta.json.modules, ThemeModule);
}

Theme.prototype.setupCSS = function () {
	const ThemeCSS = require("./css").ThemeCSS;
	this.cssArray = this.setupElements(this.meta.json.css, ThemeCSS);
}

Theme.prototype.setupJS = function () {
	const ThemeJS = require("./js").ThemeJS;
	this.jsArray = this.setupElements(this.meta.json.js, ThemeJS);
}

Theme.prototype.setupResources = function () {
	const ThemeResource = require("./resource").ThemeResource;
	this.resourceArray = this.setupElements(this.meta.json.resources, ThemeResource);
}

Theme.prototype.setupNextPrevious = function () {
	const setupNextPrevious = require("../kuz-site/utils").setupNextPrevious;
	setupNextPrevious(this.layouts);
	setupNextPrevious(this.modules);
	setupNextPrevious(this.cssArray);
	setupNextPrevious(this.jsArray);
	setupNextPrevious(this.resourceArray);
}

Theme.prototype.getProps = function () {
	return this.meta.json;
}

Theme.prototype.defaultLayout = function () {
	for (let layout of this.layouts) {
		if (layout.default) {
			return layout;
		}
	}
	return this.layouts[0];
}

Theme.prototype.getLayout = function (layoutName) {
	for (let layout of this.layouts) {
		if (layoutName == layout.getName()) {
			return layout;
		}
	}
	return null;
}

Theme.prototype.ok = function () {
	if (this.is_valid === undefined) {
		return false;
	}
	return this.is_valid;
}

Theme.prototype.getName = function () {
	return this.themeName;
}

Theme.prototype.getTitle = function () {
	return this.metaObject.title ? this.metaObject.title : defaultText.title;
}

Theme.prototype.getVersion = function () {
	return this.metaObject.version ? this.metaObject.version : "0.0";
}

Theme.prototype.getDescription = function () {
	return this.metaObject.description ? this.metaObject.description : defaultText.description;
}

Theme.prototype.getDocumentation = function () {
	return this.metaObject.documentation ? this.metaObject.documentation : defaultText.documentation;
}

Theme.prototype.getLayoutCount = function () {
	return this.layouts.length;
}

Theme.prototype.toString = function () {
	return this.getName() + " (" + this.LayoutCount() + " layouts) [v" + this.Version() + "]";
}

Theme.prototype.getPages = function () {
	return [];
}

Theme.prototype.getTable = function () {
	const KuZTable = require("../kuz-table/table").KuZTable;
	let table = new KuZTable();
	table.addColumn("Name");
	table.addColumn("Title");
	table.addColumn("Ver");
	table.addColumn("Description");
	table.addColumn("Documentation");
	table.addColumn("Ls");
	table.addColumn("CSS");
	table.addColumn("JS");
	table.addColumn("Res");
	return table;
}

Theme.prototype.getRow = function () {
	let meta = this.meta.json.meta;
	return [
		this.getName(),
		this.getTitle(),
		this.getVersion(),
		this.getDescription(),
		this.getDocumentation(),
		this.getLayoutCount(),
		this.cssArray.length,
		this.jsArray.length,
		this.resourceArray.length
	];
}

module.exports = {
	Theme: Theme
};


