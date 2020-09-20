// page.js

const fs = require("fs");

const fsutils = require("../kuz-fs");
const log = require("../kuz-log");



function Page (site, konfig, entry, isRoot = false) {
	this.isRoot = isRoot;
	this.SetupPage(site, konfig, entry);
}



const KZBaseObject = require("../base/baseobject").KZBaseObject;
Page.prototype = new KZBaseObject();
Page.prototype.typeName = "page";
Page.prototype.typeNamePlural = "pages";
Page.prototype.codeLetter = "p";



Page.prototype.SetupPage = function (site, konfig, entry) {
	this.SetSite(site);
	this.SetKonfig(konfig);
	this.entry = entry.trim();
	this.configDirpath = (konfig.dirpath === undefined) ? "" : konfig.dirpath;

	this.SetupInput();
	this.tags = [];

	const KuzMetaData = require("../kuz-metadata").KuzMetaData;
	this.metaData = new KuzMetaData(this.site, this.inputFilePath);

	const Nss = require("../kuz-nss/nss").Nss;
	this.inputNss = new Nss(this.inputFilePath);
}

Page.prototype.Setup = function () {
	//
}

Page.prototype.Reset = function () {
	//
}

Page.prototype.SetupInput = function () {
	this.inputFileFound = false;
	this.inputFilePath = null;

	let inputFilePathWithoutExtension;
	if (fsutils.IsDirectory(this.InputDirectoryPath())) {
		this.hasInputDirectory = true;
		inputFilePathWithoutExtension = fsutils.JoinPath(this.InputDirectoryPath(), "index");
	} else {
		this.hasInputDirectory = false;
		inputFilePathWithoutExtension = this.InputDirectoryPath();
	}

	this.inputFilePath = inputFilePathWithoutExtension + "." + this.InputFileExtension();
	if (fsutils.IsFile(this.inputFilePath)) {
		this.inputFileFound = true;
	}
}

Page.prototype.IsValid = function () {
	if (this.inputFileFound) {
		return true;
	}
	return false;
}



Page.prototype.IsPage = function () {
	return (this.GetType() == "page") ? true : false;
}

Page.prototype.IsAuthor = function () {
	return (this.GetType() == "author") ? true : false;
}

Page.prototype.IsCategory = function () {
	return (this.GetType() == "category") ? true : false;
}

Page.prototype.IsCollection = function () {
	return (this.GetType() == "collection") ? true : false;
}

Page.prototype.IsTag = function () {
	return (this.GetType() == "tag") ? true : false;
}



Page.prototype.IsHidden = function () {
	let prop = this.GetPropertyCascaded("hidden");
	if (prop.found) {
		return prop.value;
	}
	return false;
}

Page.prototype.IsVisible = function () {
	return !this.IsHidden();
}





Page.prototype.InputDirectoryPath = function () {
	return fsutils.JoinPath(this.site.GetInputDirectory(), this.configDirpath, this.entry);
}

Page.prototype.InputFileExtension = function () {
	return "kuz";
}

Page.prototype.InputFileName = function () {
	return this.Name() + "." + this.InputFileExtension();
}

Page.prototype.OutputDirectoryPartialPath = function () {
	if (this.isRoot) {
		return this.configDirpath;
	} else {
		return fsutils.JoinPath(this.configDirpath, this.entry);
	}
}

Page.prototype.OutputFilePath = function () {
	if (this.HasPrettyURL()) {
		return this.OutputDirectoryPath() + "/index.html";
	} else {
		return this.OutputDirectoryPath() + ".html";
	}
}

Page.prototype.GetContentString = function () {
	return this.inputNss.GetBodyString();
}

Page.prototype.GetArticle = function () {
	const Article = require("./pages/article").Article;
	let article = new Article(this, this.GetContentString());
	return article;
}

Page.prototype.GetContentHtml = function () {
	let article = new Article(this, this.GetContentString());
	return this.GetArticle().ContentHtml();
}

Page.prototype.OutputFileMTime = function () {
	if (fsutils.IsFile(this.OutputFilePath())) {
		return fs.statSync(this.OutputFilePath()).mtimeMs;
	}
	return 0;
}

Page.prototype.OutputFileExists = function () {
	let mTime = this.OutputFileMTime();
	if (mTime == 0) {
		return false;
	} else {
		return true;
	}
}

Page.prototype.OutputFileIsOlderThanMeta = function () {
	let outputFileMTime = this.OutputFileMTime();
	if (outputFileMTime < this.site.meta.mtimeMs) {
		return true;
	} else if (outputFileMTime < this.site.app.meta.mtimeMs) {
		return true;
	}
	return false;
}

Page.prototype.OutputFileNesting = function () {
	return (this.OutputFilePath().split("/").length - 2);
}

Page.prototype.OutputFileName = function () {
	return "index.html";
}

Page.prototype.OutputDirectoryPath = function () {
	return fsutils.JoinPath(this.site.GetOutputDirectory(), this.OutputDirectoryPartialPath());
}

Page.prototype.PageURL = function () {
	return fsutils.JoinPath(this.site.HomeURL(), this.OutputDirectoryPartialPath());
}

Page.prototype.Base = function () {
	return this.GetBase();
}

Page.prototype.GetBase = function () {
	let outputFileNesting = this.OutputFileNesting();
	let base = "";
	for (let index = 0; index < outputFileNesting; index++) {
		base += "../";
	}
	return base;
}

Page.prototype.RelativeURL = function () {
	if (this.HasPrettyURL()) {
		return this.OutputDirectoryPartialPath();
	} else {
		return this.OutputDirectoryPartialPath() + ".html";
	}
}





Page.prototype.Name = function () {
	if (this.isRoot) {
		return this.OutputDirectoryPartialPath() + "@root";
	} else {
		return this.OutputDirectoryPartialPath();
	}
}

Page.prototype.Title = function () {
	return this.GetTitle();
}

Page.prototype.GetTitle = function () {
	let property = this.GetProperty("title");
	if (property.found) {
		return property.value;
	}
	return "Not Found";
}

Page.prototype.Description = function () {
	return this.GetDescription();
}

Page.prototype.GetDescription = function () {
	let property = this.GetProperty("description");
	if (property.found) {
		return property.value;
	}
	return "";
}





Page.prototype.SetKonfig = function (konfig) {
	this.konfig = konfig;
}

Page.prototype.Props = function () {
	return this.metaData.Props();
}

Page.prototype.Author = function () {
	return this.GetAuthor();
}

Page.prototype.GetAuthor = function () {
	let author = this.GetPropertyCascaded("author");
	if (author.found) {
		let authorObject = this.site.GetAuthorFromName(author.value);
		if (authorObject) {
			return authorObject;
		}
	}
	return this.site.DefaultAuthor();
}

Page.prototype.Category = function () {
	return this.GetCategory();
}

Page.prototype.GetCategory = function () {
	let category = this.GetPropertyCascaded("category");
	if (category.found) {
		let categoryObject = this.site.GetCategoryFromName(category.value);
		if (categoryObject) {
			return categoryObject;
		}
	}
	return this.site.DefaultCategory();
}

Page.prototype.Tags = function () {
	let tagsArray = this.GetProperty("tags");
	if (tagsArray.found) {
		return tagsArray.value;
	}
	return [];
}

Page.prototype.TagObjects = function () {
	return this.GetTagObjects();
}

Page.prototype.GetTagObjects = function () {
	let tagsArray = this.Tags();
	return this.site.GetTagsFromNameArray(tagsArray);
}





Page.prototype.GetProperty = function (propertyName) {
	if (this.metaData) {
		return this.metaData.GetValue(propertyName);
	}
	return {
		found: false
	};
}

Page.prototype.GetPropertyCascaded = function (propertyName) {
	let property = this.GetProperty(propertyName);
	if (property.found) {
		return property;
	}

	if (this.konfig && this.konfig.metaData) {
		return this.konfig.metaData.GetValue(propertyName);
	}

	return {
		found: false
	};
}

Page.prototype.GetBooleanValueCascaded = function (name) {
	let property = this.GetPropertyCascaded(name);
	if (property.found) {
		return property.value;
	}
	return true;
}





Page.prototype.Show = function (name) {
	let propertyName = "show_" + name;
	return this.GetBooleanValueCascaded(propertyName);
}

Page.prototype.Hide = function (name) {
	let propertyName = "hide_" + name;
	return this.GetBooleanValueCascaded(propertyName);
}

Page.prototype.HasRelativeBase = function () {
	return this.GetBooleanValueCascaded("relative_base");
}

Page.prototype.HasPrettyURL = function () {
	return this.GetBooleanValueCascaded("pretty_url");
}





Page.prototype.Root = function () {
	return this.GetRoot();
}

Page.prototype.GetRoot = function () {
	return this.konfig.root;
}

Page.prototype.Theme = function () {
	return this.GetTheme();
}

Page.prototype.GetTheme = function () {
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

Page.prototype.GetLayoutName = function () {
	let layout = this.GetPropertyCascaded("layout");
	if (layout.found) {
		return layout.value;
	}
	return this.GetType();
}

Page.prototype.Layout = function () {
	return this.GetLayout();
}

Page.prototype.GetLayout = function () {
	let theme = this.Theme();
	let layoutName = this.GetLayoutName();
	let layout = theme.GetLayout(layoutName);

	if (layout) {
		return layout;
	}

	return theme.DefaultLayout();
}

Page.prototype.Pages = function () {
	return this.GetPages();
}

Page.prototype.GetPages = function () {
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





Page.prototype.GetKuz = function () {
	let article = this.GetArticle();
	let sections = article ? article.sections : null;
	return {
		page: this,
		article: article,
		sections: sections,
		app: this.site.app,
		site: this.site,

		props: this.Props(),
		cprops: this.konfig.Props(),
		sprops: this.site.Props(),
		kprops: this.site.app.Props(),
		tprops: this.Theme().Props(),
		lprops: this.GetLayout().Props(),

		code: this.metaData.Code(),
		json: this.metaData.Json(),
		kuz: this.metaData.Kuz(),
		reqs: this.metaData.Reqs(),

		ipsum: this.LoremIpsum(),
		kuzz: {
			//
		}
	};
}

Page.prototype.GetPagesCount = function () {
	return this.GetPages().length;
}

Page.prototype.GetPageOptions = function () {
	return {
		page: this,
		kuz: this.GetKuz(),
		blackadder: this.Blackadder()
	};
}

Page.prototype.GetPageOptionsFN = function () {
	let options = this.GetPageOptions();
	options.filename = this.site.GetThemesDirectory() + "/x.pug";
	return options;
}

Page.prototype.toString = function () {
	return this.typeName + ": (" + this.Name() +") [" + this.OutputFilePath() + "]";
}





Page.prototype.NeedsUpdate = function () {
	if (this.OutputFileIsOlderThanMeta()) {
		return true;
	}

	let outputFilePath = this.OutputFilePath();
	if (this.hasInputDirectory) {
		let inputDirectoryPath = this.InputDirectoryPath();
		if (fsutils.DirectoryHasNewerFiles(inputDirectoryPath, outputFilePath)) {
			return true;
		} else {
			return false;
		}
	} else {
		if (fsutils.IsNewerThan(outputFilePath, this.inputFilePath)) {
			return false;
		} else {
			return true;
		}
	}
}

Page.prototype.Update = function () {
	if (this.NeedsUpdate()) {
		this.Reset();
		this.Setup();
		this.Render();
	}
}

Page.prototype.ForcedUpdate = function () {
	this.Render();
}

Page.prototype.Render = function () {
	let htmlPath = this.OutputFilePath();
	let layout = this.GetLayout();
	let html = layout.pug(options = this.GetPageOptions());

	fsutils.CreateDirectory(this.OutputDirectoryPath());
	fs.writeFileSync(htmlPath, html);
	this.RenderLog();
}

Page.prototype.RenderLog = function () {
	log.Green(this.TypeName() + " rendered: (" + this.InputFilePath() + ") --> [" + this.OutputFilePath() + "]");
}





Page.prototype.GetType = function () {
	let type = this.GetPropertyCascaded("type");
	if (type.found) {
		return type.value;
	}
	return "page";
}

Page.prototype.GetTable = function () {
	const KZTable = require("../kuz-table/table").KZTable;
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

Page.prototype.Row = function () {
	return [
		this.CodeName(),
		//this.Name(),
		this.konfig.CodeName(),
		//this.Title(),
		//this.Theme().Name(),
		this.GetType(),
		this.Layout().Name(),
		//this.PageURL(),
		this.InputFilePath(),
		this.OutputFilePath()
	];
}

module.exports = {
	Page: Page
};


