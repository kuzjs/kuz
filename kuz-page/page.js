// page.js

const fs = require("fs");

const fsutils = require("../kuz-fs");



function KuzPage (site, konfig, entry, isRoot = false) {
	this.isRoot = isRoot;
	this.SetupPage(site, konfig, entry);
}



const KZBaseObject = require("../base/baseobject").KZBaseObject;
KuzPage.prototype = new KZBaseObject();
KuzPage.prototype.typeName = "page";
KuzPage.prototype.typeNamePlural = "pages";
KuzPage.prototype.codeLetter = "p";



KuzPage.prototype.SetupPage = function (site, konfig, entry) {
	this.setSite(site);
	this.setKonfig(konfig);
	this.entry = entry.trim();
	this.configDirpath = (konfig.dirpath === undefined) ? "" : konfig.dirpath;

	this.log = this.site.log.getChild(this.InputFilePath());

	this.totalRenderTime = 0;
	this.totalRenders = 0;

	this.tags = [];

	if (this.InputFileExists()) {
		const KuzMetaData = require("../kuz-metadata").KuzMetaData;
		this.metaData = new KuzMetaData(this, this.InputFilePath());

		const Nss = require("../kuz-nss/nss").Nss;
		this.inputNss = new Nss(this.InputFilePath());
	}
}

KuzPage.prototype.Setup = function () {
	//
}

KuzPage.prototype.Reset = function () {
	//
}

KuzPage.prototype.IsValid = function () {
	if (fsutils.IsFile(this.InputFilePath())) {
		return true;
	}
	return false;
}



KuzPage.prototype.IsPage = function () {
	return (this.GetType() == "page") ? true : false;
}

KuzPage.prototype.IsAuthor = function () {
	return (this.GetType() == "author") ? true : false;
}

KuzPage.prototype.IsCategory = function () {
	return (this.GetType() == "category") ? true : false;
}

KuzPage.prototype.IsCollection = function () {
	return (this.GetType() == "collection") ? true : false;
}

KuzPage.prototype.IsTag = function () {
	return (this.GetType() == "tag") ? true : false;
}



KuzPage.prototype.IsHidden = function () {
	let prop = this.getPropertyCascaded("hidden");
	if (prop.found) {
		return prop.value;
	}
	return false;
}

KuzPage.prototype.IsVisible = function () {
	return !this.IsHidden();
}





KuzPage.prototype.HasInputDirectory = function () {
	if (this.hasInputDirectory === undefined) {
		let inputDirectoryPath = fsutils.JoinPath(this.site.GetInputDirectory(), this.configDirpath, this.entry);
		if (fsutils.IsDirectory(inputDirectoryPath)) {
			this.hasInputDirectory = true;
		}
		this.hasInputDirectory = false;
	}
	return this.hasInputDirectory;
}

KuzPage.prototype.InputDirectoryPath = function () {
	let path;
	if (this.HasInputDirectory()) {
		path = fsutils.JoinPath(this.site.GetInputDirectory(), this.configDirpath, this.entry);
	} else {
		path = fsutils.JoinPath(this.site.GetInputDirectory(), this.configDirpath);
	}
	return path;
}

KuzPage.prototype.InputFileExtension = function () {
	return "kuz";
}

KuzPage.prototype.InputFileName = function () {
	if (this.HasInputDirectory()) {
		return "index.kuz";
	} else {
		return this.entry + "." + this.InputFileExtension();
	}
}

KuzPage.prototype.OutputDirectoryPath = function () {
	return fsutils.JoinPath(this.site.GetOutputDirectory(), this.OutputDirectoryPartialPath());
}

KuzPage.prototype.OutputDirectoryPartialPath = function () {
	if (this.isRoot || !this.HasPrettyURL()) {
		return this.configDirpath;
	} else {
		return fsutils.JoinPath(this.configDirpath, this.entry);
	}
}

KuzPage.prototype.OutputFileName = function () {
	if (this.HasPrettyURL()) {
		return "index.html";
	} else {
		return this.entry + ".html";
	}
}

KuzPage.prototype.getContentString = function () {
	return this.inputNss.getBodyString();
}

KuzPage.prototype.getArticle = function () {
	const Article = require("./pages/article").Article;
	let article = new Article(this, this.getContentString());
	return article;
}

KuzPage.prototype.getContentHtml = function () {
	return this.getArticle().getContentHtml();
}

KuzPage.prototype.OutputFileMTime = function () {
	if (fsutils.IsFile(this.OutputFilePath())) {
		return fs.statSync(this.OutputFilePath()).mtimeMs;
	}
	return 0;
}

KuzPage.prototype.OutputFileExists = function () {
	let mTime = this.OutputFileMTime();
	if (mTime == 0) {
		return false;
	} else {
		return true;
	}
}

KuzPage.prototype.OutputFileIsOlderThanMeta = function () {
	let outputFileMTime = this.OutputFileMTime();
	if (outputFileMTime < this.site.meta.mtimeMs) {
		return true;
	} else if (outputFileMTime < this.site.app.meta.mtimeMs) {
		return true;
	}
	return false;
}

KuzPage.prototype.OutputFileNesting = function () {
	return (this.OutputFilePath().split("/").length - 2);
}

KuzPage.prototype.getPageURL = function () {
	return fsutils.JoinPath(this.site.getHomeURL(), this.OutputDirectoryPartialPath());
}

KuzPage.prototype.getBase = function () {
	let outputFileNesting = this.OutputFileNesting();
	let base = "";
	for (let index = 0; index < outputFileNesting; index++) {
		base += "../";
	}
	return base;
}

KuzPage.prototype.getRelativeURL = function () {
	if (this.HasPrettyURL()) {
		return this.OutputDirectoryPartialPath();
	} else {
		return fsutils.JoinPath(this.OutputDirectoryPartialPath(), this.OutputFileName());
	}
}





KuzPage.prototype.getName = function () {
	if (this.isRoot) {
		return this.OutputDirectoryPartialPath() + "@root";
	} else {
		return this.OutputDirectoryPartialPath();
	}
}

KuzPage.prototype.getTitle = function () {
	let property = this.getProperty("title");
	if (property.found) {
		return property.value;
	}
	return "Not Found";
}

KuzPage.prototype.getDescription = function () {
	let property = this.getProperty("description");
	if (property.found) {
		return property.value;
	}
	return "";
}





KuzPage.prototype.setKonfig = function (konfig) {
	this.konfig = konfig;
}

KuzPage.prototype.getProps = function () {
	return this.metaData.getProps();
}

KuzPage.prototype.getAuthor = function () {
	let author = this.getPropertyCascaded("author");
	if (author.found) {
		let authorObject = this.site.getAuthorFromName(author.value);
		if (authorObject) {
			return authorObject;
		}
	}
	return this.site.getDefaultAuthor();
}

KuzPage.prototype.getCategory = function () {
	let category = this.getPropertyCascaded("category");
	if (category.found) {
		let categoryObject = this.site.getCategoryFromName(category.value);
		if (categoryObject) {
			return categoryObject;
		}
	}
	return this.site.getDefaultCategory();
}

KuzPage.prototype.Tags = function () {
	let tagsArray = this.getProperty("tags");
	if (tagsArray.found) {
		return tagsArray.value;
	}
	return [];
}

KuzPage.prototype.getTagObjects = function () {
	let tagsArray = this.Tags();
	return this.site.getTagsFromNameArray(tagsArray);
}





KuzPage.prototype.getProperty = function (propertyName) {
	if (this.metaData) {
		return this.metaData.getValue(propertyName);
	}
	return {
		found: false
	};
}

KuzPage.prototype.getPropertyCascaded = function (propertyName) {
	let property = this.getProperty(propertyName);
	if (property.found) {
		return property;
	}

	if (this.konfig && this.konfig.metaData) {
		return this.konfig.metaData.getValue(propertyName);
	}

	return {
		found: false
	};
}

KuzPage.prototype.getBooleanValueCascaded = function (name) {
	let property = this.getPropertyCascaded(name);
	if (property.found) {
		return property.value;
	}
	return true;
}





KuzPage.prototype.Show = function (name) {
	let propertyName = "show_" + name;
	return this.getBooleanValueCascaded(propertyName);
}

KuzPage.prototype.Hide = function (name) {
	let propertyName = "hide_" + name;
	return this.getBooleanValueCascaded(propertyName);
}

KuzPage.prototype.HasRelativeBase = function () {
	return this.getBooleanValueCascaded("relative_base");
}

KuzPage.prototype.HasPrettyURL = function () {
	return this.getBooleanValueCascaded("pretty_url");
}





KuzPage.prototype.getRoot = function () {
	return this.konfig.root;
}

KuzPage.prototype.getTheme = function () {
	let themeNameProperty = this.getPropertyCascaded("theme");
	if (themeNameProperty.found) {
		let themeName = themeNameProperty.value;
		let theme = this.site.GetThemeFromName(themeName);
		if (theme) {
			return theme;
		}
	}

	return this.site.DefaultTheme();
}

KuzPage.prototype.getLayoutName = function () {
	let layout = this.getPropertyCascaded("layout");
	if (layout.found) {
		return layout.value;
	}
	return this.GetType();
}

KuzPage.prototype.getLayout = function () {
	let theme = this.getTheme();
	let layoutName = this.getLayoutName();
	let layout = theme.getLayout(layoutName);

	if (layout) {
		return layout;
	}

	return theme.defaultLayout();
}

KuzPage.prototype.getPages = function () {
	if (this.GetType() == "author") {
		return this.site.getPagesByAuthor(this);
	} else if (this.GetType() == "category") {
		return this.site.getPagesInCategory(this);
	} else if (this.GetType() == "tag") {
		return this.site.getPagesWithTag(this);
	} else if (this.GetType() == "collection") {
		return this.site.getPages();
	}
	return this.site.pages;
}





KuzPage.prototype.getKuz = function () {
	let article = this.getArticle();
	let sections = article ? article.sections : null;
	return {
		page: this,
		article: article,
		sections: sections,
		app: this.site.app,
		site: this.site,

		props: this.getProps(),
		cprops: this.konfig.getProps(),
		sprops: this.site.getProps(),
		kprops: this.site.app.getProps(),
		tprops: this.getTheme().getProps(),
		lprops: this.getLayout().getProps(),

		code: this.metaData.getCodeFiles(),
		json: this.metaData.getJsons(),
		kuz: this.metaData.getKuzs(),
		reqs: this.metaData.getReqs(),

		ipsum: this.getApp().LoremIpsum(),
		kuzz: {
			//
		}
	};
}

KuzPage.prototype.getPagesCount = function () {
	return this.getPages().length;
}

KuzPage.prototype.getPageOptions = function () {
	return {
		page: this,
		kuz: this.getKuz(),
		blackadder: this.getApp().Blackadder()
	};
}

KuzPage.prototype.getPageOptionsFN = function () {
	let options = this.getPageOptions();
	options.filename = this.site.GetThemesDirectory() + "/x.pug";
	return options;
}

KuzPage.prototype.toString = function () {
	return this.typeName + ": (" + this.Name() +") [" + this.OutputFilePath() + "]";
}





KuzPage.prototype.needsUpdate = function () {
	if (this.OutputFileIsOlderThanMeta()) {
		return true;
	}

	if (this.HasInputDirectory()) {
		if (fsutils.DirectoryHasNewerFiles(this.InputDirectoryPath(), this.OutputFilePath())) {
			return true;
		} else {
			return false;
		}
	} else {
		if (fsutils.IsNewerThan(this.OutputFilePath(), this.InputFilePath())) {
			return false;
		} else {
			return true;
		}
	}
}

KuzPage.prototype.build = function () {
	if (!this.OutputFileExists()) {
		this.render();
		this.log.greenYellow(`Built in ${this.averageRenderTimeString()}:`, this.OutputFilePath());
	}
	return this;
}

KuzPage.prototype.update = function () {
	if (this.needsUpdate()) {
		this.Reset();
		this.Setup();
		this.render();
		this.log.greenYellow(`Updated in ${this.averageRenderTimeString()}:`, this.OutputFilePath());
	}
}

KuzPage.prototype.forcedUpdate = function () {
	this.render();
	this.log.greenYellow(`Forced-updated in ${this.averageRenderTimeString()}:`, this.OutputFilePath());
}

KuzPage.prototype.render = function () {
	let t1 = Date.now();

	let htmlPath = this.OutputFilePath();
	let layout = this.getLayout();
	let html = layout.pug(options = this.getPageOptions());

	fsutils.CreateDirectory(this.OutputDirectoryPath());
	fs.writeFileSync(htmlPath, html);

	let t2 = Date.now();
	this.totalRenderTime += (t2-t1);
	this.totalRenders++;
}

KuzPage.prototype.averageRenderTime = function () {
	if (this.totalRenders) {
		return this.totalRenderTime / this.totalRenders;
	}
	return 0;
}

KuzPage.prototype.averageRenderTimeString = function () {
	return this.averageRenderTime().toPrecision(4) + "ms";
}

KuzPage.prototype.RenderLog = function () {
	this.log.greenYellow(`Rendered ${this.averageRenderTimeString()}:`, this.OutputFilePath());
}





KuzPage.prototype.GetType = function () {
	let type = this.getPropertyCascaded("type");
	if (type.found) {
		return type.value;
	}
	return "page";
}

KuzPage.prototype.getTable = function () {
	const KZTable = require("../kuz-table/table").KZTable;
	let table = new KZTable();
	table.addColumn("Codename");
	//table.addColumn("Name");
	table.addColumn("Conf");
	//table.addColumn("Title");
	//table.addColumn("Theme");
	table.addColumn("Type");
	table.addColumn("Layout");
	//table.addColumn("URL");
	table.addColumn("In");
	table.addColumn("Out");
	return table;
}

KuzPage.prototype.getRow = function () {
	return [
		this.CodeName(),
		//this.Name(),
		this.konfig.CodeName(),
		//this.Title(),
		//this.Theme().Name(),
		this.GetType(),
		this.getLayout().getName(),
		//this.PageURL(),
		this.InputFilePath(),
		this.OutputFilePath()
	];
}

module.exports = {
	KuzPage: KuzPage
};


