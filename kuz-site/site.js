// site.js

const fs = require("fs");

const log = require("../kz-log/log");
const fsutils = require("../kz-fs");



function Site (kaagazz) {
	this.app = kaagazz;
	this.filenames = this.app.meta.json.filenames;
	this.input_dirs = this.app.meta.json.input;
	this.output_dirs = this.app.meta.json.output;
	this.Setup();
}

Site.prototype.Setup = function (kaagazz) {
	this.error = false;
	this.errorMessage = null;
	this.siteJsonPath = this.app.GetSiteJsonPath();

	const JsonFile = require("../kuz-json").JsonFile;
	this.meta = new JsonFile(this.siteJsonPath);

	this.configFileObjects = [];
	this.SetupThemes();
	this.SetupPages();
}

Site.prototype.AddConfig = function (configFileObject) {
	configFileObject.SetIndex(this.configFileObjects.length);
	this.configFileObjects.push(configFileObject);
}

Site.prototype.HomeURL = function () {
	return fsutils.TrimSlashes(this.meta.json.meta.SITE_URL);
}

Site.prototype.Props = function () {
	return this.meta.json;
}

Site.prototype.IsSite = function () {
	return true;
}

Site.prototype.HelloWorld = function () {
	log.Red("Hello, Site!");
}

Site.prototype.Error = function (errorMessage) {
	this.error = true;
	this.errorMessage = errorMessage;
	log.Red(this.errorMessage);
}

Site.prototype.SetupPages = function () {
	const utils = require("./utils");
	this.pages = utils.GetPages(this);
}

Site.prototype.SetupThemes = function () {
	this.themes = [];

	let themeNames = this.meta.json.themes;
	if (themeNames === undefined) {
		log.Red("Themes param not specified.");
	} else if (themeNames.length == 0) {
		log.Red("Themes param is empty.");
	} else {
		const Theme = require("../theme/theme").Theme;
		for (let themeName of themeNames) {
			let theme = new Theme(themeName, this);
			if (theme.IsValid()) {
				this.themes.push(theme);
			} else {
				log.Red("Invalid theme: " + themeName);
			}
		}
	}

	if (this.themes.length == 0) {
		log.Red("App has no themes.");
	}
}

Site.prototype.GetNestedValueFromCascade = function (parent, child) {
	let retVal = this.meta.GetNestedValueFromName(parent, child);
	if (retVal.found) {
		return retVal.value;
	} else {
		return this.app.meta.GetNestedValueFromName(parent, child).value;
	}
}

Site.prototype.GetInputDirectoryFromJson = function (dirName) {
	return this.app.meta.json.input[dirName];
}

Site.prototype.GetOutputDirectoryFromJson = function (dirName) {
	return this.GetNestedValueFromCascade("output", dirName);
}

Site.prototype.GetInputDirectory = function () {
	return this.GetInputDirectoryFromJson("pages");
}

Site.prototype.GetOutputDirectory = function () {
	return this.GetOutputDirectoryFromJson("root");
}

Site.prototype.GetSpecialDirectory = function () {
	return this.GetOutputDirectoryFromJson("special");
}

Site.prototype.GetMetaDirectory = function () {
	return this.GetInputDirectoryFromJson("meta");
}

Site.prototype.GetThemesDirectory = function () {
	return this.GetInputDirectoryFromJson("themes");
}

Site.prototype.GetDataDirectory = function () {
	return this.GetInputDirectoryFromJson("data");
}

Site.prototype.GetCollectionsDirectory = function () {
	return this.GetInputDirectoryFromJson("collections");
}

Site.prototype.GetDataFileContents = function (filename) {
	let filepath = fsutils.JoinPath(this.GetDataDirectory(), filename);
	if (fsutils.IsFile(filepath)) {
		return fs.readFileSync(filepath, "utf8");
	} else {
		log.BadNews("File Not Found: " + filepath);
		return "";
	}
}

Site.prototype.GetThemeFromName = function (themeName) {
	for (let theme of this.site.themes) {
		if (theme.themeName == themeName) {
			return theme;
		}
	}

	return null;
}

Site.prototype.DefaultTheme = function () {
	return this.themes[0];
}

Site.prototype.GetEntityConfigDirectory = function (typeNamePlural) {
	return this.GetMetaDirectory() + "/" + typeNamePlural;
}

Site.prototype.PrintDirectories = function () {
	log.SomeNews("  Input: " + this.GetInputDirectory());
	log.SomeNews(" Output: " + this.GetOutputDirectory());
	log.SomeNews("   Meta: " + this.GetMetaDirectory());
	log.SomeNews("  Colls: " + this.GetCollectionsDirectory());
	log.SomeNews("Special: " + this.GetSpecialDirectory());
}

Site.prototype.Authors = function () {
	let authors = [];
	for (let page of this.pages) {
		if (page.GetType() == "author") {
			authors.push(page);
		}
	}
	return authors;
}

Site.prototype.DefaultAuthor = function () {
	let authors = this.Authors();
	return authors[authors.length-1];
}

Site.prototype.Categories = function () {
	let categories = [];
	for (let page of this.pages) {
		if (page.GetType() == "category") {
			categories.push(page);
		}
	}
	return categories;
}

Site.prototype.DefaultCategory = function () {
	let categories = this.Categories();
	return categories[categories.length-1];
}

Site.prototype.Tags = function () {
	let tags = [];
	for (let page of this.pages) {
		if (page.GetType() == "tag") {
			tags.push(page);
		}
	}
	return tags;
}

Site.prototype.Pages = function () {
	let pages = [];
	for (let page of this.pages) {
		if (page.GetType() == "page") {
			pages.push(page);
		}
	}
	return pages;
}

Site.prototype.Collections = function () {
	let collections = [];
	for (let page of this.pages) {
		if (page.GetType() == "collection") {
			collections.push(page);
		}
	}
	return collections;
}

Site.prototype.Entities = function () {
	let entities = [];
	entities = entities.concat(this.Authors());
	entities = entities.concat(this.Categories());
	entities = entities.concat(this.Tags());
	entities = entities.concat(this.Collections());
	return entities;
}

Site.prototype.Renderables = function () {
	return this.pages;
}

Site.prototype.Themes = function () {
	return this.themes;
}

Site.prototype.LayoutsArray = function () {
	let layouts = [];
	for (let theme of this.themes) {
		layouts = layouts.concat(theme.layouts);
	}
	return layouts;
}

Site.prototype.ModulesArray = function () {
	let modules = [];
	for (let theme of this.themes) {
		modules = modules.concat(theme.modules);
	}
	return modules;
}

Site.prototype.CSSArray = function () {
	let cssArray = [];
	for (let theme of this.themes) {
		cssArray = cssArray.concat(theme.cssArray);
	}
	return cssArray;
}

Site.prototype.JsArray = function () {
	let jsArray = [];
	for (let theme of this.themes) {
		jsArray = jsArray.concat(theme.jsArray);
	}
	return jsArray;
}

Site.prototype.ResourceArray = function () {
	let resourceArray = [];
	for (let theme of this.themes) {
		resourceArray = resourceArray.concat(theme.resourceArray);
	}
	return resourceArray;
}

Site.prototype.EveryThing = function () {
	let everyThing = this.Renderables();
	everyThing = everyThing.concat(this.LayoutsArray());
	everyThing = everyThing.concat(this.ModulesArray());
	everyThing = everyThing.concat(this.CSSArray());
	everyThing = everyThing.concat(this.JsArray());
	everyThing = everyThing.concat(this.ResourceArray());
	return everyThing;
}

Site.prototype.PrintArrayAsTable = function (arr) {
	if (arr.length == 0) {
		log.Red("No elements in array.");
		return;
	}

	let table = arr[0].GetTable();
	for (let item of arr) {
		table.Add(item);
	}
	table.Print();
}

Site.prototype.PrintAuthors = function () {
	this.PrintArrayAsTable(this.authors);
}

Site.prototype.PrintCategories = function () {
	this.PrintArrayAsTable(this.categories);
}

Site.prototype.PrintTags = function () {
	this.PrintArrayAsTable(this.tags);
}

Site.prototype.PrintPages = function () {
	this.PrintArrayAsTable(this.pages);
}

Site.prototype.PrintCollections = function () {
	this.PrintArrayAsTable(this.collections);
}

Site.prototype.PrintEntities = function () {
	this.PrintArrayAsTable(this.Entities());
}

Site.prototype.PrintAll = function () {
	this.PrintArrayAsTable(this.Renderables());
}

Site.prototype.PrintThemes = function () {
	this.PrintArrayAsTable(this.themes);
}

Site.prototype.PrintLayouts = function () {
	let arr = this.LayoutsArray();
	this.PrintArrayAsTable(arr);
}

Site.prototype.PrintCssFiles = function () {
	let arr = this.CssFilesArray();
	this.PrintArrayAsTable(arr);
}

Site.prototype.PrintJsFiles = function () {
	let arr = this.JsFilesArray();
	this.PrintArrayAsTable(arr);
}

Site.prototype.PrintResFiles = function () {
	let arr = this.ResFilesArray();
	this.PrintArrayAsTable(arr);
}

Site.prototype.PrintConfigFiles = function () {
	let arr = this.configFileObjects;
	this.PrintArrayAsTable(arr);
}

Site.prototype.PrintConfiguration = function () {
	this.PrintDirectories();
	this.PrintAuthors();
	this.PrintCategories();
	this.PrintTags();
	this.PrintPages();
	this.PrintCollections();
}

Site.prototype.GetPagesByAuthor = function (author) {
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

Site.prototype.GetPagesInCategory = function (category) {
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

Site.prototype.GetPagesWithTag = function (tag) {
	let pages = [];
	for (let page of this.pages) {
		if (page.Tags().includes(tag.entry)) {
			pages.push(page);
		}
	}
	return pages;
}

Site.prototype.GetAuthorFromName = function (authorName) {
	for (let author of this.authors) {
		if (author.name == authorName) {
			return author;
		}
	}
	return null;
}

Site.prototype.GetCategoryFromName = function (categoryName) {
	for (let category of this.Categories()) {
		if (category.entry == categoryName) {
			return category;
		}
	}
	return null;
}

Site.prototype.GetTagFromName = function (tagName) {
	for (let tag of this.Tags()) {
		if (tag.entry == tagName) {
			return tag;
		}
	}
	return null;
}

Site.prototype.GetTagsFromNameArray = function (tagNameArray) {
	let tags = [];
	for (let tagName of tagNameArray) {
		let tag = this.GetTagFromName(tagName);
		if (tag) {
			tags.push(tag);
		}
	}
	return tags;
}

Site.prototype.ForcedUpdateArray = function (arr) {
	for (let elem of arr) {
		elem.ForcedUpdate();
	}
}

Site.prototype.ForcedUpdateAuthors = function () {
	this.ForcedUpdateArray(this.authors);
}

Site.prototype.ForcedUpdateCategories = function () {
	this.ForcedUpdateArray(this.categories);
}

Site.prototype.ForcedUpdateTags = function () {
	this.ForcedUpdateArray(this.tags);
}

Site.prototype.ForcedUpdatePages = function () {
	this.ForcedUpdateArray(this.pages);
}

Site.prototype.ForcedUpdateCollections = function () {
	this.ForcedUpdateArray(this.collections);
}

Site.prototype.ForcedUpdateEntities = function () {
	this.ForcedUpdateArray(this.Entities());
}

Site.prototype.ForcedUpdateAll = function () {
	this.ForcedUpdateArray(this.Renderables());
}

Site.prototype.UpdateArray = function (arr) {
	for (let elem of arr) {
		elem.Update();
	}
}

Site.prototype.UpdateAuthors = function () {
	this.UpdateArray(this.authors);
}

Site.prototype.UpdateCategories = function () {
	this.UpdateArray(this.categories);
}

Site.prototype.UpdateTags = function () {
	this.UpdateArray(this.tags);
}

Site.prototype.UpdatePages = function () {
	this.UpdateArray(this.pages);
}

Site.prototype.UpdateCollections = function () {
	this.UpdateArray(this.collections);
}

Site.prototype.UpdateEntities = function () {
	this.UpdateArray(this.Entities());
}

Site.prototype.UpdateAll = function () {
	this.UpdateArray(this.Renderables());
}

module.exports = {
	Site: Site
};

