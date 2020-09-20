// site.js

const fs = require("fs");

const fsutils = require("../kuz-fs");



function KuzSite (kaagazz) {
	this.app = kaagazz;
	this.log = this.app.log.GetChild();
	this.Setup();
}

KuzSite.prototype.Setup = function () {
	this.filenames = this.app.meta.json.filenames;
	this.input_dirs = this.app.meta.json.input;
	this.output_dirs = this.app.meta.json.output;

	this.error = false;
	this.errorMessage = null;
	this.siteJsonPath = this.app.GetSiteJsonPath();

	const JsonFile = require("../kuz-json").JsonFile;
	this.meta = new JsonFile(this.siteJsonPath);
	this.log.SetName(this.HomeURL());

	this.konfigs = [];
	this.SetupThemes();
	this.SetupPages();
}

KuzSite.prototype.AddKonfig = function (konfig) {
	konfig.SetIndex(this.konfigs.length);
	this.konfigs.push(konfig);
}

KuzSite.prototype.HomeURL = function () {
	return fsutils.TrimSlashes(this.meta.json.meta.SITE_URL);
}

KuzSite.prototype.Props = function () {
	return this.meta.json;
}

KuzSite.prototype.IsSite = function () {
	return true;
}

KuzSite.prototype.HelloWorld = function () {
	this.log.Red("Hello, KuzSite!");
}

KuzSite.prototype.Error = function (errorMessage) {
	this.error = true;
	this.errorMessage = errorMessage;
	this.log.Red(this.errorMessage);
}

KuzSite.prototype.SetupPages = function () {
	const utils = require("./utils");
	this.pages = utils.GetPages(this);
}

KuzSite.prototype.SetupThemes = function () {
	this.themes = [];

	let themeNames = this.meta.json.themes;
	if (themeNames === undefined) {
		this.log.Red("Themes param not specified.");
	} else if (themeNames.length == 0) {
		this.log.Red("Themes param is empty.");
	} else {
		const Theme = require("../kuz-theme").Theme;
		for (let themeName of themeNames) {
			let theme = new Theme(themeName, this);
			if (theme.IsValid()) {
				this.themes.push(theme);
			} else {
				this.log.Red("Invalid theme: " + themeName);
			}
		}
	}

	if (this.themes.length == 0) {
		this.log.Red("App has no themes.");
	}
}

KuzSite.prototype.GetNestedValueFromCascade = function (parent, child) {
	let retVal = this.meta.GetNestedValueFromName(parent, child);
	if (retVal.found) {
		return retVal.value;
	} else {
		return this.app.meta.GetNestedValueFromName(parent, child).value;
	}
}

KuzSite.prototype.GetInputDirectoryFromJson = function (dirName) {
	return this.app.meta.json.input[dirName];
}

KuzSite.prototype.GetOutputDirectoryFromJson = function (dirName) {
	return this.GetNestedValueFromCascade("output", dirName);
}

KuzSite.prototype.GetInputDirectory = function () {
	return this.GetInputDirectoryFromJson("pages");
}

KuzSite.prototype.GetOutputDirectory = function () {
	return this.GetOutputDirectoryFromJson("root");
}

KuzSite.prototype.GetSpecialDirectory = function () {
	return this.GetOutputDirectoryFromJson("special");
}

KuzSite.prototype.GetThemesDirectory = function () {
	return this.GetInputDirectoryFromJson("themes");
}

KuzSite.prototype.GetDataDirectory = function () {
	return this.GetInputDirectoryFromJson("data");
}

KuzSite.prototype.GetCollectionsDirectory = function () {
	return this.GetInputDirectoryFromJson("collections");
}

KuzSite.prototype.GetDataFileContents = function (filename) {
	let filepath = fsutils.JoinPath(this.GetDataDirectory(), filename);
	if (fsutils.IsFile(filepath)) {
		return fs.readFileSync(filepath, "utf8");
	} else {
		this.log.BadNews("File Not Found: " + filepath);
		return "";
	}
}

KuzSite.prototype.GetThemeFromName = function (themeName) {
	for (let theme of this.site.themes) {
		if (theme.themeName == themeName) {
			return theme;
		}
	}

	return null;
}

KuzSite.prototype.DefaultTheme = function () {
	return this.themes[0];
}

KuzSite.prototype.PrintDirectories = function () {
	this.log.SomeNews("  Input: " + this.GetInputDirectory());
	this.log.SomeNews(" Output: " + this.GetOutputDirectory());
	this.log.SomeNews("  Colls: " + this.GetCollectionsDirectory());
	this.log.SomeNews("Special: " + this.GetSpecialDirectory());
}

KuzSite.prototype.Authors = function () {
	let authors = [];
	for (let page of this.pages) {
		if (page.GetType() == "author") {
			authors.push(page);
		}
	}
	return authors;
}

KuzSite.prototype.DefaultAuthor = function () {
	let authors = this.Authors();
	return authors[authors.length-1];
}

KuzSite.prototype.Categories = function () {
	let categories = [];
	for (let page of this.pages) {
		if (page.GetType() == "category") {
			categories.push(page);
		}
	}
	return categories;
}

KuzSite.prototype.DefaultCategory = function () {
	let categories = this.Categories();
	return categories[categories.length-1];
}

KuzSite.prototype.Tags = function () {
	let tags = [];
	for (let page of this.pages) {
		if (page.GetType() == "tag") {
			tags.push(page);
		}
	}
	return tags;
}

KuzSite.prototype.Pages = function () {
	let pages = [];
	for (let page of this.pages) {
		if (page.GetType() == "page") {
			pages.push(page);
		}
	}
	return pages;
}

KuzSite.prototype.Collections = function () {
	let collections = [];
	for (let page of this.pages) {
		if (page.GetType() == "collection") {
			collections.push(page);
		}
	}
	return collections;
}

KuzSite.prototype.Entities = function () {
	let entities = [];
	entities = entities.concat(this.Authors());
	entities = entities.concat(this.Categories());
	entities = entities.concat(this.Tags());
	entities = entities.concat(this.Collections());
	return entities;
}

KuzSite.prototype.Renderables = function () {
	return this.pages;
}

KuzSite.prototype.Themes = function () {
	return this.themes;
}

KuzSite.prototype.LayoutsArray = function () {
	let layouts = [];
	for (let theme of this.themes) {
		layouts = layouts.concat(theme.layouts);
	}
	return layouts;
}

KuzSite.prototype.ModulesArray = function () {
	let modules = [];
	for (let theme of this.themes) {
		modules = modules.concat(theme.modules);
	}
	return modules;
}

KuzSite.prototype.CSSArray = function () {
	let cssArray = [];
	for (let theme of this.themes) {
		cssArray = cssArray.concat(theme.cssArray);
	}
	return cssArray;
}

KuzSite.prototype.JsArray = function () {
	let jsArray = [];
	for (let theme of this.themes) {
		jsArray = jsArray.concat(theme.jsArray);
	}
	return jsArray;
}

KuzSite.prototype.ResourceArray = function () {
	let resourceArray = [];
	for (let theme of this.themes) {
		resourceArray = resourceArray.concat(theme.resourceArray);
	}
	return resourceArray;
}

KuzSite.prototype.EveryThing = function () {
	let everyThing = this.Renderables();
	everyThing = everyThing.concat(this.LayoutsArray());
	everyThing = everyThing.concat(this.ModulesArray());
	everyThing = everyThing.concat(this.CSSArray());
	everyThing = everyThing.concat(this.JsArray());
	everyThing = everyThing.concat(this.ResourceArray());
	return everyThing;
}

KuzSite.prototype.PrintArrayAsTable = function (arr) {
	if (arr.length == 0) {
		this.log.Red("No elements in array.");
		return;
	}

	let table = arr[0].GetTable();
	for (let item of arr) {
		table.Add(item);
	}
	table.Print();
}

KuzSite.prototype.PrintAuthors = function () {
	this.PrintArrayAsTable(this.authors);
}

KuzSite.prototype.PrintCategories = function () {
	this.PrintArrayAsTable(this.categories);
}

KuzSite.prototype.PrintTags = function () {
	this.PrintArrayAsTable(this.tags);
}

KuzSite.prototype.PrintPages = function () {
	this.PrintArrayAsTable(this.pages);
}

KuzSite.prototype.PrintCollections = function () {
	this.PrintArrayAsTable(this.collections);
}

KuzSite.prototype.PrintEntities = function () {
	this.PrintArrayAsTable(this.Entities());
}

KuzSite.prototype.PrintAll = function () {
	this.PrintArrayAsTable(this.Renderables());
}

KuzSite.prototype.PrintThemes = function () {
	this.PrintArrayAsTable(this.themes);
}

KuzSite.prototype.PrintLayouts = function () {
	let arr = this.LayoutsArray();
	this.PrintArrayAsTable(arr);
}

KuzSite.prototype.PrintCssFiles = function () {
	let arr = this.CssFilesArray();
	this.PrintArrayAsTable(arr);
}

KuzSite.prototype.PrintJsFiles = function () {
	let arr = this.JsFilesArray();
	this.PrintArrayAsTable(arr);
}

KuzSite.prototype.PrintResFiles = function () {
	let arr = this.ResFilesArray();
	this.PrintArrayAsTable(arr);
}

KuzSite.prototype.PrintKuzKonfigs = function () {
	let arr = this.konfigs;
	this.PrintArrayAsTable(arr);
}

KuzSite.prototype.PrintConfiguration = function () {
	this.PrintDirectories();
	this.PrintAuthors();
	this.PrintCategories();
	this.PrintTags();
	this.PrintPages();
	this.PrintCollections();
}

KuzSite.prototype.GetPagesByAuthor = function (author) {
	let pages = [];
	for (let page of this.pages) {
		let pageAuthor = page.GetPropertyCascaded("author");
		if (pageAuthor.found) {
			if (pageAuthor.value == author.entry) {
				pages.push(page);
			}
		}
	}
	return pages;
}

KuzSite.prototype.GetPagesInCategory = function (category) {
	let pages = [];
	for (let page of this.pages) {
		let pageCategory = page.GetPropertyCascaded("category");
		if (pageCategory.found) {
			if (pageCategory.value == category.entry) {
				pages.push(page);
			}
		}
	}
	return pages;
}

KuzSite.prototype.GetPagesWithTag = function (tag) {
	let pages = [];
	for (let page of this.pages) {
		if (page.Tags().includes(tag.entry)) {
			pages.push(page);
		}
	}
	return pages;
}

KuzSite.prototype.GetAuthorFromName = function (authorName) {
	for (let author of this.authors) {
		if (author.name == authorName) {
			return author;
		}
	}
	return null;
}

KuzSite.prototype.GetCategoryFromName = function (categoryName) {
	for (let category of this.Categories()) {
		if (category.entry == categoryName) {
			return category;
		}
	}
	return null;
}

KuzSite.prototype.GetTagFromName = function (tagName) {
	for (let tag of this.Tags()) {
		if (tag.entry == tagName) {
			return tag;
		}
	}
	return null;
}

KuzSite.prototype.GetTagsFromNameArray = function (tagNameArray) {
	let tags = [];
	for (let tagName of tagNameArray) {
		let tag = this.GetTagFromName(tagName);
		if (tag) {
			tags.push(tag);
		}
	}
	return tags;
}

KuzSite.prototype.ForcedUpdateArray = function (arr) {
	for (let elem of arr) {
		elem.ForcedUpdate();
	}
}

KuzSite.prototype.ForcedUpdateAuthors = function () {
	this.ForcedUpdateArray(this.authors);
}

KuzSite.prototype.ForcedUpdateCategories = function () {
	this.ForcedUpdateArray(this.categories);
}

KuzSite.prototype.ForcedUpdateTags = function () {
	this.ForcedUpdateArray(this.tags);
}

KuzSite.prototype.ForcedUpdatePages = function () {
	this.ForcedUpdateArray(this.pages);
}

KuzSite.prototype.ForcedUpdateCollections = function () {
	this.ForcedUpdateArray(this.collections);
}

KuzSite.prototype.ForcedUpdateEntities = function () {
	this.ForcedUpdateArray(this.Entities());
}

KuzSite.prototype.ForcedUpdateAll = function () {
	this.ForcedUpdateArray(this.Renderables());
}

KuzSite.prototype.UpdateArray = function (arr) {
	for (let elem of arr) {
		elem.Update();
	}
}

KuzSite.prototype.UpdateAuthors = function () {
	this.UpdateArray(this.authors);
}

KuzSite.prototype.UpdateCategories = function () {
	this.UpdateArray(this.categories);
}

KuzSite.prototype.UpdateTags = function () {
	this.UpdateArray(this.tags);
}

KuzSite.prototype.UpdatePages = function () {
	this.UpdateArray(this.pages);
}

KuzSite.prototype.UpdateCollections = function () {
	this.UpdateArray(this.collections);
}

KuzSite.prototype.UpdateEntities = function () {
	this.UpdateArray(this.Entities());
}

KuzSite.prototype.UpdateAll = function () {
	this.UpdateArray(this.Renderables());
}

module.exports = {
	KuzSite: KuzSite
};


