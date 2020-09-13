// renderable.js

const fs = require("fs");
const log = require("../utils/log");
const fsutils = require("../utils/fsutils");



function Renderable () {
	//
}

Renderable.prototype.typename = "renderable";
Renderable.prototype.typenamePlural = "renderables";
Renderable.prototype.codeLetter = "r";

Renderable.prototype.Setup = function () {
	//
}

Renderable.prototype.Reset = function () {
	//
}

Renderable.prototype.AddProperty = function (headerLine) {
	if (headerLine.length == 0) {
		return;
	}
	let pair = headerLine.split(":");
	let name = pair[0].trim();
	let value = pair[1].trim();
	switch (name) {
		case "author":
		case "category":
		case "description":
		case "title":
			this[name] = value;
			break;
		case "hidden":
		case "published":
			this[name] = (value == "false") ? false : true;
			break;
		case "tags":
			let tags = value.split(",");
			for (let index in tags) {
				this.tags.push(tags[index].trim());
			}
			break;
		default:
			break;
	}
}

Renderable.prototype.App = function () {
	return this.GetApp();
}

Renderable.prototype.GetApp = function () {
	return this.site.app;
}

Renderable.prototype.Blackadder = function () {
	return this.App().Blackadder();
}

Renderable.prototype.LoremIpsum = function () {
	return this.App().LoremIpsum();
}

Renderable.prototype.Site = function () {
	return this.GetSite();
}

Renderable.prototype.GetSite = function () {
	return this.site;
}

Renderable.prototype.SetSite = function (site) {
	this.site = site;
}

Renderable.prototype.Name = function () {
	return this.GetName();
}

Renderable.prototype.GetName = function () {
	return this.name;
}

Renderable.prototype.SetName = function (name) {
	this.name = name.trim().replace(" ", "-").replace("_", "-");
}

Renderable.prototype.CodeName = function () {
	return this.codeLetter + this.index;
}

Renderable.prototype.Row = function () {
	return [this.CodeName(), this.Name(), this.Title()];
}

Renderable.prototype.Title = function () {
	return this.GetTitle();
}

Renderable.prototype.GetTitle = function () {
	let property = this.GetProperty("title");
	if (property.found) {
		return property.value;
	}
	return "Not Found";
}

Renderable.prototype.SetTitle = function (title) {
	this.title = title.trim();
}

Renderable.prototype.Next = function () {
	return this.next;
}

Renderable.prototype.Previous = function () {
	return this.previous;
}

Renderable.prototype.Root = function () {
	if (this.IsEntity()) {
		return this.site.pages[0];
	} else {
		this.configFileObject.root;
	}
}

Renderable.prototype.Theme = function () {
	let themeNameProperty = this.GetPropertyCascaded("theme");
	if (themeNameProperty.found) {
		let themeName = themeNameProperty.value;
		let theme = this.site.GetThemeFromName(themeName);
		if (theme) {
			return theme;
		}
	}

	return this.site.DefaultTheme();
}

Renderable.prototype.Layout = function () {
	return this.GetLayout();
}

Renderable.prototype.GetLayout = function () {
	let theme = this.Theme();
	let layout = theme.GetLayout(this.typename);

	if (layout === null) {
		log.Red(theme.FullName() + " has no layout for: " + this.typename);
	} else {
		return layout;
	}

	return theme.DefaultLayout();
}

Renderable.prototype.Pages = function () {
	return this.GetPages();
}

Renderable.prototype.GetPages = function () {
	return this.site.pages;
}

Renderable.prototype.GetPagesCount = function () {
	return this.GetPages().length;
}

Renderable.prototype.GetPageOptions = function () {
	return {
		page: this,
		blackadder: this.Blackadder(),
		ipsum: this.LoremIpsum()
	};
}

Renderable.prototype.GetPageOptionsFN = function () {
	let options = this.GetPageOptions();
	options.filename = "kaagazz_themes/x.pug";
	return options;
}

Renderable.prototype.toString = function () {
	return this.typename + ": (" + this.Name() +") [" + this.OutputFilePath() + "]";
}

Renderable.prototype.OutputFileMTime = function () {
	if (fsutils.IsFile(this.OutputFilePath())) {
		return fs.statSync(this.OutputFilePath()).mtimeMs;
	}
	return 0;
}

Renderable.prototype.OutputFileExists = function () {
	let mTime = this.OutputFileMTime();
	if (mTime == 0) {
		return false;
	} else {
		return true;
	}
}

Renderable.prototype.IsHidden = function () {
	if (this.hidden === true) {
		return true;
	}
	return false;
}

Renderable.prototype.IsToBeShown = function () {
	return !this.IsHidden();
}

Renderable.prototype.OutputFileIsOlderThanMeta = function () {
	let outputFileMTime = this.OutputFileMTime();
	if (outputFileMTime < this.site.meta.mtimeMs) {
		return true;
	} else if (outputFileMTime < this.site.app.meta.mtimeMs) {
		return true;
	}
	return false;
}

Renderable.prototype.NeedsUpdate = function () {
	if (this.OutputFileExists()) {
		if (this.OutputFileIsOlderThanMeta()) {
			return true;
		} else {
			return false;
		}
	} else {
		return true;
	}
}

Renderable.prototype.Update = function () {
	if (this.NeedsUpdate()) {
		this.Reset();
		this.Setup();
		this.Render();
	}
}

Renderable.prototype.ForcedUpdate = function () {
	this.Render();
}

Renderable.prototype.Render = function () {
	let htmlPath = this.OutputFilePath();
	let layout = this.GetLayout();
	let html = layout.pug(options = this.GetPageOptions());

	if (!fs.existsSync(this.OutputDirectoryPath())) {
		fs.mkdirSync(this.OutputDirectoryPath(), {
			recursive: true
		});
	}

	fs.writeFileSync(htmlPath, html);
	this.RenderLog();
}

Renderable.prototype.RenderLog = function () {
	log.Green("Rendered: (" + this.InputFilePath() + ") --> [" + this.OutputFilePath() + "]");
}

Renderable.prototype.OutputFileNesting = function () {
	return (this.OutputFilePath().split("/").length - 2);
}

Renderable.prototype.OutputFilePath = function () {
	return this.OutputDirectoryPath() + "/index.html";
}

Renderable.prototype.OutputDirectoryPath = function () {
	return fsutils.JoinPath(this.site.GetOutputDirectory(), this.OutputDirectoryPartialPath());
}

Renderable.prototype.InputFileName = function () {
	return this.name + "." + this.typename;
}

Renderable.prototype.InputDirectoryPath = function () {
	return fsutils.JoinPath(this.site.GetMetaDirectory(), this.typenamePlural);
}

Renderable.prototype.InputFilePath = function () {
	return fsutils.JoinPath(this.InputDirectoryPath(), this.InputFileName());
}

Renderable.prototype.Description = function () {
	return this.GetDescription();
}

Renderable.prototype.GetDescription = function () {
	let property = this.GetProperty("description");
	if (property.found) {
		return property.value;
	}
	return "";
}

Renderable.prototype.GetProperty = function (propertyName) {
	if (this.metaData) {
		return this.metaData.GetValue(propertyName);
	}
	return {
		found: false
	};
}

Renderable.prototype.GetPropertyCascaded = function (propertyName) {
	let property = this.GetProperty(propertyName);
	if (property.found) {
		return property;
	}

	if (this.configFileObject && this.configFileObject.metaData) {
		return this.configFileObject.metaData.GetValue(propertyName);
	}

	return {
		found: false
	};
}

Renderable.prototype.GetBooleanValueCascaded = function (name) {
	let property = this.GetPropertyCascaded(name);
	if (property.found) {
		return property.value;
	}
	return true;
}

Renderable.prototype.Show = function (name) {
	let propertyName = "show_" + name;
	return this.GetBooleanValueCascaded(propertyName);
}

Renderable.prototype.Hide = function (name) {
	let propertyName = "hide_" + name;
	return this.GetBooleanValueCascaded(propertyName);
}

Renderable.prototype.HasRelativeBase = function () {
	return this.GetBooleanValueCascaded("relative_base");
}

Renderable.prototype.HasPrettyURL = function () {
	return this.GetBooleanValueCascaded("pretty_url");
}

Renderable.prototype.Base = function () {
	return this.GetBase();
}

Renderable.prototype.GetBase = function () {
	let outputFileNesting = this.OutputFileNesting();
	let base = "";
	for (let index = 0; index < outputFileNesting; index++) {
		base += "../";
	}
	return base;
}

Renderable.prototype.RelativeURL = function () {
	return this.OutputDirectoryPartialPath();
}

Renderable.prototype.IsEntity = function () {
	return false;
}

Renderable.prototype.IsAuthor = function () {
	return false;
}

Renderable.prototype.IsCategory = function () {
	return false;
}

Renderable.prototype.IsTag = function () {
	return false;
}

Renderable.prototype.IsPage = function () {
	return false;
}

Renderable.prototype.IsCollection = function () {
	return false;
}

module.exports = {
	Renderable: Renderable
};


