// theme.js

const log = require("../utils/log");
const fsutils = require("../utils/fsutils");
const JsonFile = require("../utils/jsonfile").JsonFile;

const Template = require("./template").Template;

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

Theme.prototype.InputDirectory = function () {
	return fsutils.JoinPath(this.ThemesInputDirectory(), this.Name());
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
	return this.Name() + ".json";
}

Theme.prototype.JsonFilePath = function () {
	return fsutils.JoinPath(this.InputDirectory(), this.JsonFileName());
}

Theme.prototype.ThemesOutputDirectory = function () {
	return "kaagazz_themes";
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

	this.is_valid = true;
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

module.exports = {
	Theme: Theme
};


