// page.js

const fs = require("fs");

const fsutils = require("../kuz-fsutils");



function KuzPage (site, konfig, entry, isRoot = false) {
	this.setSite(site);
	this.log = this.site.log.getChild(entry);
	this.isRoot = isRoot;

	site.app.pageSetupActon.resetClock();
	this.setupPage(konfig, entry);
	site.app.pageSetupActon.record();
}



const KuzBaseObject = require("../kuz-baseobject");
KuzPage.prototype = new KuzBaseObject();
KuzPage.prototype.typeName = "page";
KuzPage.prototype.typeNamePlural = "pages";
KuzPage.prototype.codeLetter = "p";



KuzPage.prototype.setupPage = function (konfig, entry) {
	this.setKonfig(konfig);
	this.entry = entry.trim();
	this.configDirpath = (konfig.dirpath === undefined) ? "" : konfig.dirpath;

	this.log.setName(this.getInputFilePath());

	this.totalRenderTime = BigInt(0);
	this.totalRenders = 0;

	this.tags = [];

	const KuzFile = require("../kuz-kuzfile");
	this.kuzFile = new KuzFile(this, this.getInputFilePath());
}

KuzPage.prototype.setup = function () {
	//
}

KuzPage.prototype.reset = function () {
	//
}

KuzPage.prototype.ok = function () {
	if (fsutils.isFile(this.getInputFilePath())) {
		return true;
	}
	return false;
}



KuzPage.prototype.isPage = function () {
	return true;
}

KuzPage.prototype.isPost = function () {
	return (this.getType() === "post") ? true : false;
}

KuzPage.prototype.isAuthor = function () {
	return (this.getType() === "author") ? true : false;
}

KuzPage.prototype.isCategory = function () {
	return (this.getType() === "category") ? true : false;
}

KuzPage.prototype.isTag = function () {
	return (this.getType() === "tag") ? true : false;
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
		if (fsutils.isDirectory(inputDirectoryPath)) {
			this.hasInputDirectory = true;
		} else {
			this.hasInputDirectory = false;
		}
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

KuzPage.prototype.getOutputFileMTime = function () {
	if (fsutils.isFile(this.getOutputFilePath())) {
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
	// if (outputFileMTime < this.site.meta.mtimeMs) {
	// 	return true;
	// }
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
	return this.kuzFile.getProps();
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
	if (this.kuzFile) {
		return this.kuzFile.getProperty(propertyName);
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

	if (this.konfig && this.konfig.kuzFile) {
		return this.konfig.kuzFile.getProperty(propertyName);
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
	return this.getType();
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
	if (this.getType() === "author") {
		return this.site.getPagesByAuthor(this);
	} else if (this.getType() === "category") {
		return this.site.getPagesInCategory(this);
	} else if (this.getType() === "tag") {
		return this.site.getPagesWithTag(this);
	}
	return [];
}

KuzPage.prototype.getPagesCount = function () {
	return this.getPages().length;
}

KuzPage.prototype.toString = function () {
	return this.getType() + ": (" + this.getName() +") [" + this.getOutputFilePath() + "]";
}





KuzPage.prototype.getKuz = function () {
	return {
		page: this,
		site: this.getSite(),
		app: this.getApp(),

		layout: this.getLayout(),
		theme: this.getTheme(),

		meta: this.kuzFile.getMetaSections(),
		content: this.kuzFile.getContentSections(),

		props: this.getProps(),

		p: this.kuzFile.getCachedItems(),
		k: this.konfig.kuzFile.getCachedItems(),
		s: this.site.kuzFile.getCachedItems(),

		l: {
			props: this.getLayout().getProps(),
		},

		t: {
			props: this.getTheme().getProps(),
		},

		ipsum: this.getApp().getIpsum(),
		kuzz: {
			//
		}
	};
}

KuzPage.prototype.getPageOptions = function () {
	return {
		page: this,
		kuz: this.getKuz(),
		blackadder: this.getApp().getBlackadder(),
		filename: this.site.getThemesInputDirectory() + "/x.pug"
	};
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
	let t1 = process.hrtime.bigint();

	let htmlPath = this.getOutputFilePath();
	let layout = this.getLayout();
	let pugLayout = layout.getCompiledPug();
	let html = pugLayout(options = this.getPageOptions());

	fsutils.createDirectory(this.getOutputDirectoryPath());
	fs.writeFileSync(htmlPath, html);

	this.site.app.pageRenderActon.record();
	let t2 = process.hrtime.bigint();
	this.totalRenderTime += (t2-t1);
	this.totalRenders++;
}

KuzPage.prototype.averageRenderTimeUS = function () {
	if (this.totalRenders) {
		return this.totalRenderTime / BigInt(this.totalRenders * 1000);
	}
	return BigInt(0);
}

KuzPage.prototype.averageRenderTimeString = function () {
	return this.averageRenderTimeUS() + "us";
}

KuzPage.prototype.RenderLog = function () {
	this.log.greenYellow(`Rendered ${this.averageRenderTimeString()}:`, this.getOutputFilePath());
}





KuzPage.prototype.getType = function () {
	let type = this.getPropertyCascaded("type");
	if (type.found) {
		return type.value;
	}
	return "post";
}

KuzPage.prototype.printDetails = function () {
	//
}

KuzPage.prototype.getTable = function () {
	const KuzTable = require("../kuz-table");
	let table = new KuzTable();
	table.addColumn("Codename");
	//table.addColumn("Name");
	table.addColumn("Konf");
	//table.addColumn("Title");
	table.addColumn("Theme");
	table.addColumn("Type");
	table.addColumn("Layout");
	table.addColumn("Pages");
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
		this.getTheme().getName(),
		this.getType(),
		this.getLayout().getName(),
		this.getPagesCount(),
		//this.PageURL(),
		this.getInputFilePath(),
		this.getOutputFilePath()
	];
}

module.exports = KuzPage;


