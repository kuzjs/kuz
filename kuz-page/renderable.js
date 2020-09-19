// renderable.js

const fs = require("fs");
const log = require("../kuz-log/log");
const fsutils = require("../kuz-fs");

const Article = require("./pages/article").Article;



function Renderable () {
	//
}

const KZBaseObject = require("../base/baseobject").KZBaseObject;
Renderable.prototype = new KZBaseObject();

Renderable.prototype.typeName = "renderable";
Renderable.prototype.typeNamePlural = "renderables";
Renderable.prototype.codeLetter = "r";

Renderable.prototype.SetupRenderable = function (site, configFileObject, entry) {
	this.SetSite(site);
	this.SetConfig(configFileObject);
	this.entry = entry.trim();
	if (this.IsEntity()) {
		const MetaData = require("../metadata/metadata").MetaData;
		this.metaData = new MetaData(this.site, this.InputFilePath());
	}
}

Renderable.prototype.Setup = function () {
	//
}

Renderable.prototype.Reset = function () {
	//
}

Renderable.prototype.Name = function () {
	return this.entry;
}

Renderable.prototype.GetType = function () {
	let type = this.GetPropertyCascaded("type");
	if (type.found) {
		return type.value;
	}
	return "page";
}

Renderable.prototype.GetTable = function () {
	const KZTable = require("../kz-table/table").KZTable;
	let table = new KZTable();
	table.AddColumn("Codename");
	//table.AddColumn("Name");
	table.AddColumn("Conf");
	//table.AddColumn("Title");
	//table.AddColumn("Theme");
	table.AddColumn("Type");
	table.AddColumn("Layout");
	//table.AddColumn("URL");
	table.AddColumn("In");
	table.AddColumn("Out");
	return table;
}

Renderable.prototype.Row = function () {
	return [
		this.CodeName(),
		//this.Name(),
		this.configFileObject.CodeName(),
		//this.Title(),
		//this.Theme().Name(),
		this.GetType(),
		this.Layout().Name(),
		//this.PageURL(),
		this.InputFilePath(),
		this.OutputFilePath()
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
	return this.GetType();
}

Renderable.prototype.Layout = function () {
	return this.GetLayout();
}

Renderable.prototype.GetLayout = function () {
	let theme = this.Theme();
	let layoutName = this.GetLayoutName();
	let layout = theme.GetLayout(layoutName);

	if (layout) {
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
	if (this.GetType() == "author") {
		return this.site.GetPagesByAuthor(this);
	} else if (this.GetType() == "category") {
		return this.site.GetPagesInCategory(this);
	} else if (this.GetType() == "tag") {
		return this.site.GetPagesWithTag(this);
	} else if (this.GetType() == "collection") {
		return this.site.Pages();
	}
	return this.site.pages;
}

Renderable.prototype.GetKuz = function () {
	let article = this.GetArticle();
	let sections = article ? article.sections : null;
	return {
		page: this,
		article: article,
		sections: sections,
		app: this.site.app,
		site: this.site,
		props: this.Props(),
		cprops: this.configFileObject.Props(),
		sprops: this.site.Props(),
		kprops: this.site.app.Props(),
		tprops: this.Theme().Props(),
		lprops: this.GetLayout().Props(),
		ipsum: this.LoremIpsum(),
		kuz: {
			kuz: {
				//
			}
		}
	};
}

Renderable.prototype.GetPagesCount = function () {
	return this.GetPages().length;
}

Renderable.prototype.GetPageOptions = function () {
	return {
		page: this,
		kuz: this.GetKuz(),
		blackadder: this.Blackadder()
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

	fsutils.CreateDirectory(this.OutputDirectoryPath());
	fs.writeFileSync(htmlPath, html);
	this.RenderLog();
}

Renderable.prototype.RenderLog = function () {
	log.Green(this.TypeName() + " rendered: (" + this.InputFilePath() + ") --> [" + this.OutputFilePath() + "]");
}

Renderable.prototype.InputFileExtension = function () {
	return "kuz";
}

Renderable.prototype.InputFileName = function () {
	return this.Name() + "." + this.InputFileExtension();
}

Renderable.prototype.InputDirectoryPath = function () {
	return this.configFileObject.DirPath();
}

Renderable.prototype.OutputFileNesting = function () {
	return (this.OutputFilePath().split("/").length - 2);
}

Renderable.prototype.OutputFileName = function () {
	return "index.html";
}

Renderable.prototype.OutputDirectoryPath = function () {
	return fsutils.JoinPath(this.site.GetOutputDirectory(), this.OutputDirectoryPartialPath());
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
	return this.site.DefaultAuthor();
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
	return this.site.DefaultCategory();
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


