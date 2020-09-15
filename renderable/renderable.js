// renderable.js

const fs = require("fs");
const log = require("../utils/log");
const fsutils = require("../utils/fsutils");

const KZBaseObject = require("../base/baseobject").KZBaseObject;

const Article = require("./pages/article").Article;

const KZTable = require("../utils/table").KZTable;



function Renderable () {
	//
}

Renderable.prototype = new KZBaseObject();

Renderable.prototype.typeName = "renderable";
Renderable.prototype.typeNamePlural = "renderables";
Renderable.prototype.codeLetter = "r";

Renderable.prototype.Setup = function () {
	//
}

Renderable.prototype.Reset = function () {
	//
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

Renderable.prototype.GetTable = function () {
	let table = new KZTable();
	table.AddColumn("Codename");
	table.AddColumn("Name");
	table.AddColumn("Title");
	table.AddColumn("Theme");
	table.AddColumn("Layout");
	table.AddColumn("URL");
	return table;
}

Renderable.prototype.Row = function () {
	return [
		this.CodeName(),
		this.Name(),
		this.Title(),
		this.Theme().Name(),
		this.Layout().Name(),
		this.PageURL()
	];
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

Renderable.prototype.SetConfig = function (configFileObject) {
	this.configFileObject = configFileObject;
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

Renderable.prototype.GetLayoutName = function () {
	let layout = this.GetPropertyCascaded("layout");
	if (layout.found) {
		return layout.value;
	}
	return this.typeName;
}

Renderable.prototype.Layout = function () {
	return this.GetLayout();
}

Renderable.prototype.GetLayout = function () {
	let theme = this.Theme();
	let layoutName = this.GetLayoutName();
	let layout = theme.GetLayout(layoutName);

	if (layout === null) {
		log.Red(theme.Name() + " has no layout for: " + this.typeName);
	} else {
		return layout;
	}

	return theme.DefaultLayout();
}

Renderable.prototype.GetContentString = function () {
	return this.inputNss.GetBodyString();
}

Renderable.prototype.GetArticle = function () {
	if (this.IsEntity()) {
		return null;
	}
	let article = new Article(this, this.GetContentString());
	return article;
}

Renderable.prototype.GetContentHtml = function () {
	let article = new Article(this, this.GetContentString());
	return this.GetArticle().ContentHtml();
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
	let article = this.GetArticle();
	let sections = article ? article.sections : null;
	return {
		page: this,
		article: article,
		sections: sections,
		props: this.Props(),
		cprops: this.configFileObject.props,
		sprops: this.site.meta.json,
		kprops: this.site.app.meta.json,
		blackadder: this.Blackadder(),
		ipsum: this.LoremIpsum()
	};
}

Renderable.prototype.GetPageOptionsFN = function () {
	let options = this.GetPageOptions();
	options.filename = this.site.GetThemesDirectory() + "/x.pug";
	return options;
}

Renderable.prototype.toString = function () {
	return this.typeName + ": (" + this.Name() +") [" + this.OutputFilePath() + "]";
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

Renderable.prototype.IsRenderable = function () {
	return true;
}

Renderable.prototype.IsHidden = function () {
	let prop = this.GetPropertyCascaded("hidden");
	if (prop.found) {
		return prop.value;
	}
	return false;
}

Renderable.prototype.IsVisible = function () {
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
	return this.name + "." + this.typeName;
}

Renderable.prototype.InputDirectoryPath = function () {
	return fsutils.JoinPath(this.site.GetMetaDirectory(), this.typeNamePlural);
}

Renderable.prototype.InputFilePath = function () {
	return fsutils.JoinPath(this.InputDirectoryPath(), this.InputFileName());
}

Renderable.prototype.Description = function () {
	return this.GetDescription();
}

Renderable.prototype.PageURL = function () {
	return fsutils.JoinPath(this.site.HomeURL(), this.OutputDirectoryPartialPath());
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

Renderable.prototype.Props = function () {
	return this.metaData.Props();
}

Renderable.prototype.Author = function () {
	return this.GetAuthor();
}

Renderable.prototype.GetAuthor = function () {
	let author = this.GetPropertyCascaded("author");
	if (author.found) {
		let authorObject = this.site.GetAuthorFromName(author.value);
		if (authorObject) {
			return authorObject;
		}
	}
	return this.site.defaultAuthor;
}

Renderable.prototype.Category = function () {
	return this.GetCategory();
}

Renderable.prototype.GetCategory = function () {
	let category = this.GetPropertyCascaded("category");
	if (category.found) {
		let categoryObject = this.site.GetCategoryFromName(category.value);
		if (categoryObject) {
			return categoryObject;
		}
	}
	return this.site.defaultCategory;
}

Renderable.prototype.Tags = function () {
	let tagsArray = this.GetProperty("tags");
	if (tagsArray.found) {
		return tagsArray.value;
	}
	return [];
}

Renderable.prototype.TagObjects = function () {
	return this.GetTagObjects();
}

Renderable.prototype.GetTagObjects = function () {
	let tagsArray = this.Tags();
	return this.site.GetTagsFromNameArray(tagsArray);
}

module.exports = {
	Renderable: Renderable
};


