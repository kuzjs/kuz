// site.js

const fs = require("fs");

const fsutils = require("../kuz-fsutils");



function KuzSite (kaagazz) {
	this.app = kaagazz;
	this.log = this.app.log.getChild();
	this.setup();
}

KuzSite.prototype.setup = function () {
	this.filenames = this.app.kaagazzJson.filenames;
	this.input_dirs = this.app.kaagazzJson.input;
	this.output_dirs = this.app.kaagazzJson.output;

	this.log.setName(this.filenames.site);

	this.error = false;
	this.errorMessage = null;

	const KuzFile = require("../kuz-kuzfile");
	this.kuzFile = new KuzFile(this, this.filenames.site);
	if (!this.kuzFile.ok()) {
		this.log.red("Site not found");
		return;
	}
	this.kuzFile.turnCacheOn();

	this.log.setName(this.getHomeURL());

	this.konfigs = [];
	this.setupPages();
	this.app.benchmark.recordMilestone("KuzSite.setupPages() complete.");
	this.setupThemes();
	this.app.benchmark.recordMilestone("KuzSite.setupThemes() complete.");
}

KuzSite.prototype.setupPages = function () {
	const utils = require("./utils");
	this.pages = utils.getPages(this);
}

KuzSite.prototype.setupThemes = function () {
	this.themes = [];

	let themeNames = this.kuzFile.getProps().themes;
	if (themeNames === undefined) {
		this.log.red("Themes param not specified.");
	} else if (themeNames.length === 0) {
		this.log.red("Themes param is empty.");
	} else {
		const KuzTheme = require("../kuz-theme");
		for (let themeName of themeNames) {
			let theme = new KuzTheme(themeName, this);
			if (theme.ok()) {
				this.themes.push(theme);
			} else {
				this.log.red("Invalid theme: " + themeName);
			}
		}
	}

	if (this.themes.length === 0) {
		this.log.red("App has no themes.");
	}
}

KuzSite.prototype.ok = function () {
	if (!this.kuzFile.ok()) {
		return false;
	}
	return true;
}



KuzSite.prototype.addKonfig = function (konfig) {
	konfig.setIndex(this.konfigs.length);
	this.konfigs.push(konfig);
}

KuzSite.prototype.getHomeURL = function () {
	return fsutils.trimSlashes(this.kuzFile.getProps().SITE_URL);
}

KuzSite.prototype.getProps = function () {
	return this.kuzFile.getProps();
}

KuzSite.prototype.isSite = function () {
	return true;
}

KuzSite.prototype.causeError = function (errorMessage) {
	this.error = true;
	this.errorMessage = errorMessage;
	this.log.red(this.errorMessage);
}



KuzSite.prototype.getInputDirectory = function () {
	return this.input_dirs.pages;
}

KuzSite.prototype.getThemesInputDirectory = function () {
	return this.input_dirs.themes;
}

KuzSite.prototype.getDataInputDirectory = function () {
	return this.input_dirs.data;
}



KuzSite.prototype.getOutputDirectory = function () {
	return this.output_dirs.root;
}

KuzSite.prototype.getSpecialDirectory = function () {
	return this.output_dirs.special;
}



KuzSite.prototype.getDataFileContents = function (filename) {
	let filepath = fsutils.JoinPath(this.getDataInputDirectory(), filename);
	if (fsutils.isFile(filepath)) {
		return fs.readFileSync(filepath, "utf8");
	} else {
		this.log.badNews("File Not Found: " + filepath);
		return "";
	}
}



KuzSite.prototype.printDirectories = function () {
	this.log.SomeNews("  Input: " + this.getInputDirectory());
	this.log.SomeNews(" Output: " + this.getOutputDirectory());
}



KuzSite.prototype.getAuthors = function () {
	let authors = [];
	for (let page of this.pages) {
		if (page.getType() === "author") {
			authors.push(page);
		}
	}
	return authors;
}

KuzSite.prototype.getDefaultAuthor = function () {
	let authors = this.getAuthors();
	return authors[authors.length-1];
}

KuzSite.prototype.getCategories = function () {
	let categories = [];
	for (let page of this.pages) {
		if (page.getType() === "category") {
			categories.push(page);
		}
	}
	return categories;
}

KuzSite.prototype.getDefaultCategory = function () {
	let categories = this.getCategories();
	return categories[categories.length-1];
}

KuzSite.prototype.getTags = function () {
	let tags = [];
	for (let page of this.pages) {
		if (page.getType() === "tag") {
			tags.push(page);
		}
	}
	return tags;
}

KuzSite.prototype.getPosts = function () {
	let pages = [];
	for (let page of this.pages) {
		if (page.getType() === "post") {
			pages.push(page);
		}
	}
	return pages;
}

KuzSite.prototype.getPages = function () {
	return this.pages;
}

KuzSite.prototype.getThemes = function () {
	return this.themes;
}

KuzSite.prototype.getDefaultTheme = function () {
	return this.themes[0];
}

KuzSite.prototype.getLayouts = function () {
	let layouts = [];
	for (let theme of this.themes) {
		layouts = layouts.concat(theme.layouts);
	}
	return layouts;
}

KuzSite.prototype.getModules = function () {
	let modules = [];
	for (let theme of this.themes) {
		modules = modules.concat(theme.modules);
	}
	return modules;
}

KuzSite.prototype.getCssArray = function () {
	let cssArray = [];
	for (let theme of this.themes) {
		cssArray = cssArray.concat(theme.cssArray);
	}
	return cssArray;
}

KuzSite.prototype.getJsArray = function () {
	let jsArray = [];
	for (let theme of this.themes) {
		jsArray = jsArray.concat(theme.jsArray);
	}
	return jsArray;
}

KuzSite.prototype.getResources = function () {
	let resourceArray = [];
	for (let theme of this.themes) {
		resourceArray = resourceArray.concat(theme.resourceArray);
	}
	return resourceArray;
}

KuzSite.prototype.getEveryThing = function () {
	let everyThing = this.getPages();
	everyThing = everyThing.concat(this.getLayouts());
	everyThing = everyThing.concat(this.getModules());
	everyThing = everyThing.concat(this.getCssArray());
	everyThing = everyThing.concat(this.getJsArray());
	everyThing = everyThing.concat(this.getResources());
	return everyThing;
}



KuzSite.prototype.getPagesByAuthor = function (author) {
	let pages = [];
	for (let page of this.pages) {
		let pageAuthor = page.getPropertyCascaded("author");
		if (pageAuthor.found) {
			if (pageAuthor.value === author.entry) {
				pages.push(page);
			}
		}
	}
	return pages;
}

KuzSite.prototype.getPagesInCategory = function (category) {
	let pages = [];
	for (let page of this.pages) {
		let pageCategory = page.getPropertyCascaded("category");
		if (pageCategory.found) {
			if (pageCategory.value === category.entry) {
				pages.push(page);
			}
		}
	}
	return pages;
}

KuzSite.prototype.getPagesWithTag = function (tag) {
	let pages = [];
	for (let page of this.pages) {
		if (page.getTagNames().includes(tag.entry)) {
			pages.push(page);
		}
	}
	return pages;
}



KuzSite.prototype.getAuthorFromName = function (authorName) {
	for (let author of this.getAuthors()) {
		if (author.name === authorName) {
			return author;
		}
	}
	return null;
}

KuzSite.prototype.getCategoryFromName = function (categoryName) {
	for (let category of this.getCategories()) {
		if (category.entry === categoryName) {
			return category;
		}
	}
	return null;
}

KuzSite.prototype.getTagFromName = function (tagName) {
	for (let tag of this.getTags()) {
		if (tag.entry === tagName) {
			return tag;
		}
	}
	return null;
}

KuzSite.prototype.getTagsFromNameArray = function (tagNameArray) {
	let tags = [];
	for (let tagName of tagNameArray) {
		let tag = this.getTagFromName(tagName);
		if (tag) {
			tags.push(tag);
		}
	}
	return tags;
}

KuzSite.prototype.getThemeFromName = function (themeName) {
	for (let theme of this.site.themes) {
		if (theme.themeName === themeName) {
			return theme;
		}
	}

	return null;
}



KuzSite.prototype.printArrayAsTable = function (arr) {
	if (arr.length === 0) {
		this.log.red("No elements in array.");
		return;
	}

	let table = arr[0].getTable();
	for (let item of arr) {
		table.add(item);
	}
	table.print();
}



KuzSite.prototype.forcedUpdateArray = function (arr) {
	for (let elem of arr) {
		elem.forcedUpdate();
	}
}

KuzSite.prototype.updateArray = function (arr) {
	for (let elem of arr) {
		elem.update();
	}
}



module.exports = KuzSite;


