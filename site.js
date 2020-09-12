// site.js

const fs = require("fs");

const log = require("./utils/log");
const siteutils = require("./utils/siteutils");
const fsutils = require("./utils/fsutils");

const Table = require("./utils/table").Table;

const Theme = require("./theme/theme").Theme;

const JsonFile = require("./utils/jsonfile").JsonFile;



function Site (kaagazz) {
	this.app = kaagazz;
	this.Setup();
}

Site.prototype.Setup = function (kaagazz) {
	this.error = false;
	this.errorMessage = null;
	this.siteJsonPath = this.app.GetSiteJsonPath();
	this.meta = new JsonFile(this.siteJsonPath);
	this.SetAllDirectoryPaths();
	this.SetupThemes();
	this.SetupTable();
	this.SetupRenderables();
}

Site.prototype.Blackadder = function () {
	return this.app.Blackadder();
}

Site.prototype.LoremIpsum = function () {
	return this.app.LoremIpsum();
}

Site.prototype.HelloWorld = function () {
	log.Red("Hello, Site!");
}

Site.prototype.Error = function (errorMessage) {
	this.error = true;
	this.errorMessage = errorMessage;
	log.Red(this.errorMessage);
}

Site.prototype.SetAllDirectoryPaths = function () {
	this.SetInputDirectory();
	this.SetOutputDirectory();
	this.SetSpecialDirectory();
	this.SetMetaDirectory();
	this.SetDataDirectory();
	this.SetCollectionsDirectory();
}

Site.prototype.SetupRenderables = function () {
	this.authors = siteutils.GetAuthors(this);
	this.defaultAuthor = this.authors[this.authors.length - 1];
	this.categories = siteutils.GetCategories(this);
	this.defaultCategory = this.categories[this.categories.length - 1];
	this.tags = siteutils.GetTags(this);
	this.pages = siteutils.GetPages(this);
	this.collections = siteutils.GetCollections(this);
	this.SetupNextPrevious();
}

Site.prototype.SetupNextPrevious = function () {
	siteutils.SetupNextPrevious(this.authors);
	siteutils.SetupNextPrevious(this.categories);
	siteutils.SetupNextPrevious(this.tags);
	siteutils.SetupNextPrevious(this.pages);
	siteutils.SetupNextPrevious(this.collections);
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
	return this.GetNestedValueFromCascade("input", dirName);
}

Site.prototype.GetOutputDirectoryFromJson = function (dirName) {
	return this.GetNestedValueFromCascade("output", dirName);
}

Site.prototype.GetInputDirectory = function () {
	return this.inputDirectoryPath;
}

Site.prototype.SetInputDirectory = function () {
	this.inputDirectoryPath = this.GetInputDirectoryFromJson("pages");
}

Site.prototype.GetOutputDirectory = function () {
	return this.outputDirectoryPath;
}

Site.prototype.SetOutputDirectory = function () {
	this.outputDirectoryPath = this.GetOutputDirectoryFromJson("root");
}

Site.prototype.GetSpecialDirectory = function () {
	return this.specialDirectoryPath;
}

Site.prototype.SetSpecialDirectory = function () {
	this.specialDirectoryPath = this.GetOutputDirectoryFromJson("special");
}

Site.prototype.GetMetaDirectory = function () {
	return this.metaDirectoryPath;
}

Site.prototype.SetMetaDirectory = function () {
	this.metaDirectoryPath = this.GetInputDirectoryFromJson("meta");
}

Site.prototype.GetDataDirectory = function () {
	return this.dataDirectoryPath;
}

Site.prototype.SetDataDirectory = function () {
	this.dataDirectoryPath = this.GetInputDirectoryFromJson("data");
}

Site.prototype.GetCollectionsDirectory = function () {
	return this.collectionsDirectoryPath;
}

Site.prototype.SetCollectionsDirectory = function () {
	this.collectionsDirectoryPath = this.GetInputDirectoryFromJson("collections");
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

Site.prototype.SetupThemes = function () {
	this.themes = [];

	let themeNames = this.meta.json.themes;
	if (themeNames === undefined) {
		log.Red("Themes param not specified.");
	} else if (themeNames.length == 0) {
		log.Red("Themes param is empty.");
	} else {
		for (let index in themeNames) {
			let themeName = themeNames[index];
			let theme = new Theme(themeName);
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

Site.prototype.SetupTable = function (arr) {
	this.table = new Table();
	this.table.AddColumn("Codename", 5);
	this.table.AddColumn("Name", 10);
	this.table.AddColumn("Title", 20);
}

Site.prototype.GetThemeFromName = function (themeName) {
	for (let index in this.site.themes) {
		let theme = this.site.themes[index];
		if (theme.themeName == themeName) {
			return theme;
		}
	}

	return null;
}

Site.prototype.DefaultTheme = function () {
	return this.themes[0];
}

Site.prototype.GetEntityFilePath = function (typenamePlural) {
	return this.GetMetaDirectory() + "/" + this.GetNestedValueFromCascade("filenames", typenamePlural);
}

Site.prototype.GetAuthorFilePath = function () {
	return this.GetEntityFilePath("authors");
}

Site.prototype.GetCategoryFilePath = function () {
	return this.GetEntityFilePath("categories");
}

Site.prototype.GetCollectionFilePath = function () {
	return this.GetEntityFilePath("collections");
}

Site.prototype.GetTagFilePath = function () {
	return this.GetEntityFilePath("tags");
}

Site.prototype.PrintDirectories = function () {
	log.SomeNews("  Input: " + this.GetInputDirectory());
	log.SomeNews(" Output: " + this.GetOutputDirectory());
	log.SomeNews("   Meta: " + this.GetMetaDirectory());
	log.SomeNews("  Colls: " + this.GetCollectionsDirectory());
	log.SomeNews("Special: " + this.GetSpecialDirectory());
}

Site.prototype.PrintArrayAsTable = function (arr) {
	this.table.AddArray(arr).Print().Clear();
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

Site.prototype.PrintConfiguration = function () {
	this.PrintDirectories();
	this.PrintAuthors();
	this.PrintCategories();
	this.PrintTags();
	this.PrintPages();
	this.PrintCollections();
}

Site.prototype.GetAuthorFromName = function (authorName) {
	for (let index in this.authors) {
		if (this.authors[index].name == authorName) {
			return this.authors[index];
		}
	}
	return null;
}

Site.prototype.GetCategoryFromName = function (categoryName) {
	for (let index in this.categories) {
		if (this.categories[index].name == categoryName) {
			return this.categories[index];
		}
	}
	return null;
}

Site.prototype.GetTagFromName = function (tagName) {
	for (let index in this.tags) {
		if (this.tags[index].name == tagName) {
			return this.tags[index];
		}
	}
	return null;
}

Site.prototype.GetTagsFromNameArray = function (tagNameArray) {
	let tags = [];
	for (let index in tagNameArray) {
		let tagName = tagNameArray[index];
		let tag = this.GetTagFromName(tagName);
		if (tag) {
			tags.push(tag);
		}
	}
	return tags;
}

Site.prototype.UpdateAuthors = function () {
	for (let index in this.authors) {
		this.authors[index].Update();
	}
}

Site.prototype.UpdateCategories = function () {
	for (let index in this.categories) {
		this.categories[index].Update();
	}
}

Site.prototype.UpdateTags = function () {
	for (let index in this.tags) {
		this.tags[index].Update();
	}
}

Site.prototype.UpdatePages = function () {
	for (let index in this.pages) {
		this.pages[index].Update();
	}
}

Site.prototype.UpdateCollections = function () {
	for (let index in this.collections) {
		this.collections[index].Update();
	}
}

Site.prototype.Update = function () {
	this.UpdateAuthors();
	this.UpdateCategories();
	this.UpdateTags();
	this.UpdatePages();
	this.UpdateCollections();
}

module.exports = {
	Site: Site
};


