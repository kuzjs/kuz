// theme.js

const fsutils = require("../kuz-fs");

const common = require("../kuz-common");
const defaultText = common.defaultText;

const layoutsDirectory = "layouts";



function KuzTheme (themeName, site) {
	this.themeName = themeName;
	this.site = site;
	this.log = this.site.log.getChild("theme/" + this.themeName);
	this.getApp().themeSetupActon.resetClock();
	this.setupTheme();
	this.getApp().themeSetupActon.record();
}

const KuzBaseObject = require("../kuz-baseobject");
KuzTheme.prototype = new KuzBaseObject();
KuzTheme.prototype.typeName = "Theme";

KuzTheme.prototype.getName = function () {
	return this.themeName;
}

KuzTheme.prototype.getThemesInputDirectory = function () {
	return this.site.getThemesInputDirectory();
}

KuzTheme.prototype.getThemesOutputDirectory = function () {
	return fsutils.JoinPath("docs/x/dist/themes");
}

KuzTheme.prototype.InputDirectory = function () {
	return fsutils.JoinPath(this.getThemesInputDirectory(), this.getName());
}

KuzTheme.prototype.OutputDirectory = function () {
	return fsutils.JoinPath(this.getThemesOutputDirectory(), this.getName());
}

KuzTheme.prototype.getJsonFileName = function () {
	return "theme.json";
}

KuzTheme.prototype.getJsonFilePath = function () {
	return fsutils.JoinPath(this.InputDirectory(), this.getJsonFileName());
}

KuzTheme.prototype.setupTheme = function () {
	if (!fsutils.IsDirectory(this.InputDirectory())) {
		this.log.red("Theme NOT Found: " + this.InputDirectory());
		return;
	}

	if (!fsutils.IsFile(this.getJsonFilePath())) {
		this.log.red("Theme JSON NOT Found: " + this.getJsonFilePath());
		return;
	}

	const KuzJson = require("../kuz-json");
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

KuzTheme.prototype.setupElements = function (dataArray, ElementClass) {
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

KuzTheme.prototype.setupLayouts = function () {
	const ThemeLayout = require("./layout");
	this.layouts = this.setupElements(this.meta.json.layouts, ThemeLayout);
}

KuzTheme.prototype.setupModules = function () {
	const ThemeModule = require("./module");
	this.modules = this.setupElements(this.meta.json.modules, ThemeModule);
}

KuzTheme.prototype.setupCSS = function () {
	const ThemeCSS = require("./css");
	this.cssArray = this.setupElements(this.meta.json.css, ThemeCSS);
}

KuzTheme.prototype.setupJS = function () {
	const ThemeJS = require("./js");
	this.jsArray = this.setupElements(this.meta.json.js, ThemeJS);
}

KuzTheme.prototype.setupResources = function () {
	const ThemeResource = require("./resource");
	this.resourceArray = this.setupElements(this.meta.json.resources, ThemeResource);
}

KuzTheme.prototype.setupNextPrevious = function () {
	const setupNextPrevious = require("../kuz-site/utils").setupNextPrevious;
	setupNextPrevious(this.layouts);
	setupNextPrevious(this.modules);
	setupNextPrevious(this.cssArray);
	setupNextPrevious(this.jsArray);
	setupNextPrevious(this.resourceArray);
}

KuzTheme.prototype.getProps = function () {
	return this.meta.json;
}

KuzTheme.prototype.defaultLayout = function () {
	for (let layout of this.layouts) {
		if (layout.default) {
			return layout;
		}
	}
	return this.layouts[0];
}

KuzTheme.prototype.getLayout = function (layoutName) {
	for (let layout of this.layouts) {
		if (layoutName === layout.getName()) {
			return layout;
		}
	}
	return null;
}

KuzTheme.prototype.ok = function () {
	if (this.is_valid === undefined) {
		return false;
	}
	return this.is_valid;
}

KuzTheme.prototype.getName = function () {
	return this.themeName;
}

KuzTheme.prototype.getTitle = function () {
	return this.metaObject.title ? this.metaObject.title : defaultText.title;
}

KuzTheme.prototype.getVersion = function () {
	return this.metaObject.version ? this.metaObject.version : "0.0";
}

KuzTheme.prototype.getDescription = function () {
	return this.metaObject.description ? this.metaObject.description : defaultText.description;
}

KuzTheme.prototype.getDocumentation = function () {
	return this.metaObject.documentation ? this.metaObject.documentation : defaultText.documentation;
}

KuzTheme.prototype.getLayoutCount = function () {
	return this.layouts.length;
}

KuzTheme.prototype.toString = function () {
	return this.getName() + " (" + this.LayoutCount() + " layouts) [v" + this.Version() + "]";
}

KuzTheme.prototype.getPages = function () {
	return [];
}

KuzTheme.prototype.getTable = function () {
	const KuzTable = require("../kuz-table");
	let table = new KuzTable();
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

KuzTheme.prototype.getRow = function () {
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

module.exports = KuzTheme;


