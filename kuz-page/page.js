// page.js

const fs = require("fs");

const fsutils = require("../kuz-fs");



function KuzPage (site, konfig, entry, isRoot = false) {
	this.isRoot = isRoot;
	site.app.pageSetupActon.resetClock();
	this.setupPage(site, konfig, entry);
	site.app.pageSetupActon.record();
}



const KuzBaseObject = require("../kuz-baseobject").KuzBaseObject;
KuzPage.prototype = new KuzBaseObject();
KuzPage.prototype.typeName = "page";
KuzPage.prototype.typeNamePlural = "pages";
KuzPage.prototype.codeLetter = "p";



KuzPage.prototype.setupPage = function (site, konfig, entry) {
	this.setSite(site);
	this.setKonfig(konfig);
	this.entry = entry.trim();
	this.configDirpath = (konfig.dirpath === undefined) ? "" : konfig.dirpath;

	this.log = this.site.log.getChild(this.getInputFilePath());

	this.totalRenderTime = 0;
	this.totalRenders = 0;

	this.tags = [];

	if (this.doesInputFileExist()) {

		const KuzFile = require("../kuz-kuzfile").KuzFile;
		this.kuzFile = new KuzFile(this, this.getInputFilePath());

		this.metaData = this.kuzFile.getMetaData();
	}
}

KuzPage.prototype.setup = function () {
	//
}

KuzPage.prototype.reset = function () {
	//
}

KuzPage.prototype.ok = function () {
	if (fsutils.IsFile(this.getInputFilePath())) {
		return true;
	}
	return false;
}



KuzPage.prototype.isPage = function () {
	return (this.GetType() === "page") ? true : false;
}

KuzPage.prototype.isAuthor = function () {
	return (this.GetType() === "author") ? true : false;
}

KuzPage.prototype.isCategory = function () {
	return (this.GetType() === "category") ? true : false;
}

KuzPage.prototype.isTag = function () {
	return (this.GetType() === "tag") ? true : false;
}



KuzPage.prototype.isHidden = function () {
	let prop = this.getPropertyCascaded("hidden");
	if (prop.found) {
		return prop.value;
	}
	return false;
}

KuzPage.prototype.isVisible = function () {
	return !this.isHidden();
}





KuzPage.prototype.HasInputDirectory = function () {
	if (this.hasInputDirectory === undefined) {
		let inputDirectoryPath = fsutils.JoinPath(this.site.getInputDirectory(), this.configDirpath, this.entry);
		if (fsutils.IsDirectory(inputDirectoryPath)) {
			this.hasInputDirectory = true;
		}
		this.hasInputDirectory = false;
	}
	return this.hasInputDirectory;
}

KuzPage.prototype.getInputDirectoryPath = function () {
	let path;
	if (this.HasInputDirectory()) {
		path = fsutils.JoinPath(this.site.getInputDirectory(), this.configDirpath, this.entry);
	} else {
		path = fsutils.JoinPath(this.site.getInputDirectory(), this.configDirpath);
	}
	return path;
}

KuzPage.prototype.getInputFileExtension = function () {
	return "kuz";
}

KuzPage.prototype.getInputFileName = function () {
	if (this.HasInputDirectory()) {
		return "index.kuz";
	} else {
		return this.entry + "." + this.getInputFileExtension();
	}
}

KuzPage.prototype.getOutputDirectoryPath = function () {
	return fsutils.JoinPath(this.site.getOutputDirectory(), this.getOutputDirectoryPartialPath());
}

KuzPage.prototype.getOutputDirectoryPartialPath = function () {
	if (this.isRoot || !this.HasPrettyURL()) {
		return this.configDirpath;
	} else {
		return fsutils.JoinPath(this.configDirpath, this.entry);
	}
}

KuzPage.prototype.getOutputFileName = function () {
	if (this.HasPrettyURL()) {
		return "index.html";
	} else {
		return this.entry + ".html";
	}
}

KuzPage.prototype.getContentString = function () {
	return this.kuzFile.getBodyString();
}

KuzPage.prototype.getArticle = function () {
	const Article = require("./pages/article").Article;
	let article = new Article(this, this.getContentString());
	return article;
}

KuzPage.prototype.getContentHtml = function () {
	return this.getArticle().getContentHtml();
}

KuzPage.prototype.getOutputFileMTime = function () {
	if (fsutils.IsFile(this.getOutputFilePath())) {
		return fs.statSync(this.getOutputFilePath()).mtimeMs;
	}
	return 0;
}

KuzPage.prototype.doesOutputFileExist = function () {
	let mTime = this.getOutputFileMTime();
	if (mTime === 0) {
		return false;
	} else {
		return true;
	}
}

KuzPage.prototype.outputFileIsOlderThanMeta = function () {
	let outputFileMTime = this.getOutputFileMTime();
	if (outputFileMTime < this.site.meta.mtimeMs) {
		return true;
	} else if (outputFileMTime < this.site.app.meta.mtimeMs) {
		return true;
	}
	return false;
}

KuzPage.prototype.getOutputFileNesting = function () {
	return (this.getOutputFilePath().split("/").length - 2);
}

KuzPage.prototype.getPageURL = function () {
	return fsutils.JoinPath(this.site.getHomeURL(), this.getOutputDirectoryPartialPath());
}

KuzPage.prototype.getBase = function () {
	let outputFileNesting = this.getOutputFileNesting();
	let base = "";
	for (let index = 0; index < outputFileNesting; index++) {
		base += "../";
	}
	return base;
}

KuzPage.prototype.getRelativeURL = function () {
	if (this.HasPrettyURL()) {
		return this.getOutputDirectoryPartialPath();
	} else {
		return fsutils.JoinPath(this.getOutputDirectoryPartialPath(), this.getOutputFileName());
	}
}





KuzPage.prototype.getName = function () {
	if (this.isRoot) {
		return this.getOutputDirectoryPartialPath() + "@root";
	} else {
		return this.getOutputDirectoryPartialPath();
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

KuzPage.prototype.getTagNames = function () {
	let tagsArray = this.getProperty("tags");
	if (tagsArray.found) {
		return tagsArray.value;
	}
	return [];
}

KuzPage.prototype.getTags = function () {
	let tagsArray = this.getTagNames();
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
		let theme = this.site.getThemeFromName(themeName);
		if (theme) {
			return theme;
		}
	}

	return this.site.getDefaultTheme();
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
	if (this.GetType() === "author") {
		return this.site.getPagesByAuthor(this);
	} else if (this.GetType() === "category") {
		return this.site.getPagesInCategory(this);
	} else if (this.GetType() === "tag") {
		return this.site.getPagesWithTag(this);
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

		ipsum: this.getApp().getIpsum(),
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
		blackadder: this.getApp().getBlackadder()
	};
}

KuzPage.prototype.getPageOptionsFN = function () {
	let options = this.getPageOptions();
	options.filename = this.site.getThemesInputDirectory() + "/x.pug";
	return options;
}

KuzPage.prototype.toString = function () {
	return this.typeName + ": (" + this.Name() +") [" + this.getOutputFilePath() + "]";
}





KuzPage.prototype.needsUpdate = function () {
	if (this.outputFileIsOlderThanMeta()) {
		return true;
	}

	if (fsutils.IsNewerThan(this.konfig.getPath(), this.getOutputFilePath())) {
		return true;
	}

	if (this.HasInputDirectory()) {
		if (fsutils.DirectoryHasNewerFiles(this.getInputDirectoryPath(), this.getOutputFilePath())) {
			return true;
		}
	} else {
		if (fsutils.IsNewerThan(this.getInputFilePath(), this.getOutputFilePath())) {
			return true;
		}
	}

	return false;
}

KuzPage.prototype.build = function () {
	if (!this.doesOutputFileExist()) {
		this.render();
		this.log.greenYellow(`Built in ${this.averageRenderTimeString()}:`, this.getOutputFilePath());
	}
	return this;
}

KuzPage.prototype.update = function () {
	if (this.needsUpdate()) {
		this.reset();
		this.setup();
		this.render();
		this.log.greenYellow(`Updated in ${this.averageRenderTimeString()}:`, this.getOutputFilePath());
	}
}

KuzPage.prototype.forcedUpdate = function () {
	this.render();
	this.log.greenYellow(`Forced-updated in ${this.averageRenderTimeString()}:`, this.getOutputFilePath());
}

KuzPage.prototype.render = function () {
	this.site.app.pageRenderActon.resetClock();
	let t1 = Date.now();

	let htmlPath = this.getOutputFilePath();
	let layout = this.getLayout();
	let html = layout.pug(options = this.getPageOptions());

	fsutils.CreateDirectory(this.getOutputDirectoryPath());
	fs.writeFileSync(htmlPath, html);

	this.site.app.pageRenderActon.record();
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
	this.log.greenYellow(`Rendered ${this.averageRenderTimeString()}:`, this.getOutputFilePath());
}





KuzPage.prototype.GetType = function () {
	let type = this.getPropertyCascaded("type");
	if (type.found) {
		return type.value;
	}
	return "page";
}

KuzPage.prototype.getTable = function () {
	const KuZTable = require("../kuz-table/table").KuZTable;
	let table = new KuZTable();
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
		this.getCodeName(),
		//this.Name(),
		this.konfig.getCodeName(),
		//this.Title(),
		//this.Theme().Name(),
		this.GetType(),
		this.getLayout().getName(),
		//this.PageURL(),
		this.getInputFilePath(),
		this.getOutputFilePath()
	];
}

module.exports = {
	KuzPage: KuzPage
};


