// theme.js

const log = require("../utils/log");
const fsutils = require("../utils/fsutils");
const JsonFile = require("../utils/jsonfile").JsonFile;

const Table = require("../utils/table").Table;

const Template = require("./template").Template;

const CssFile = require("./cssfile").CssFile;
const JsFile = require("./jsfile").JsFile;
const ResFile = require("./resfile").ResFile;

const themesDirectory = "kaagazz_themes";
const templatesDirectory = "templates";



function Theme(themeName, site) {
	this.themeName = themeName;
	this.site = site;
	this.SetupPaths();
}

Theme.prototype.Name = function () {
	return this.themeName;
}

Theme.prototype.ThemesInputDirectory = function () {
	return "kaagazz_themes";
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

Theme.prototype.TemplatesInputDirectory = function () {
	return fsutils.JoinPath(this.InputDirectory(), "templates");
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
	this.templateCount = 0;
	this.templates = {};
	for (let templateName in this.meta.json.templates) {
		let templateFileName = this.meta.json.templates[templateName];
		let templateFilePath = fsutils.JoinPath(this.TemplatesInputDirectory(), templateFileName);
		if (fsutils.IsFile(templateFilePath)) {
			let template = new Template(this, templateFilePath);
			this.templates[templateName] = template;
			this.templateCount++;
		} else {
			log.Red("Template NOT found: " + templateFilePath);
		}
	}

	if (this.templateCount == 0) {
		let templateFileName = this.Name() + ".pug";
		let templateFilePath = fsutils.JoinPath(this.TemplatesInputDirectory(), templateFileName);
		let defaultTemplate = new Template(this, templateFilePath);
		this.templates[this.Name()] = defaultTemplate;
	}

	this.SetupCssFiles();
	this.SetupJsFiles();
	this.SetupResFiles();

	this.is_valid = true;
}

Theme.prototype.SetupCssFiles = function () {
	this.cssFiles = [];
	for (let index in this.meta.json.css) {
		let fileName = this.meta.json.css[index];
		let cssFile = new CssFile(this, fileName);
		this.cssFiles.push(cssFile);
	}
}

Theme.prototype.SetupJsFiles = function () {
	this.jsFiles = [];
	for (let index in this.meta.json.js) {
		let fileName = this.meta.json.js[index];
		let jsFile = new JsFile(this, fileName);
		this.jsFiles.push(jsFile);
	}
}

Theme.prototype.SetupResFiles = function () {
	this.resFiles = [];
	for (let index in this.meta.json.res) {
		let fileName = this.meta.json.res[index];
		let resFile = new ResFile(this, fileName);
		this.resFiles.push(resFile);
	}
}

Theme.prototype.DefaultTemplate = function () {
	return this.templates[this.Name()];
}

Theme.prototype.IsValid = function () {
	if (this.is_valid === undefined) {
		return false;
	}
	return this.is_valid;
}

Theme.prototype.FullName = function () {
	return this.meta.json.meta.name;
}

Theme.prototype.Version = function () {
	return this.meta.json.meta.version;
}

Theme.prototype.TemplateCount = function () {
	return this.templateCount;
}

Theme.prototype.toString = function () {
	return this.Name() + " (" + this.TemplateCount() + " templates) [v" + this.Version() + "]";
}

Theme.prototype.GetPages = function () {
	return [];
}

Theme.prototype.GetTable = function () {
	let table = new Table();
	table.AddColumn("Name");
	table.AddColumn("Ls");
	table.AddColumn("CSS");
	table.AddColumn("JS");
	table.AddColumn("Res");
	return table;
}

Theme.prototype.Row = function () {
	return [
		this.themeName,
		this.TemplateCount(),
		this.cssFiles.length,
		this.jsFiles.length,
		this.resFiles.length
	];
}

module.exports = {
	Theme: Theme
};


