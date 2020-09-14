// site.js

const fs = require("fs");

const log = require("./utils/log");
const siteutils = require("./utils/siteutils");
const fsutils = require("./utils/fsutils");

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
	this.configFileObjects = [];
	this.SetupThemes();
	this.SetupRenderables();
}

Site.prototype.AddConfig = function (configFileObject) {
	configFileObject.SetIndex(this.configFileObjects.length);
	this.configFileObjects.push(configFileObject);
}

Site.prototype.Blackadder = function () {
	return this.app.Blackadder();
}

Site.prototype.LoremIpsum = function () {
	return this.app.LoremIpsum();
}

Site.prototype.HomeURL = function () {
	return fsutils.RemoveSlashes(this.meta.json.meta.SITE_URL);
}

Site.prototype.HelloWorld = function () {
	log.Red("Hello, Site!");
}

Site.prototype.Error = function (errorMessage) {
	this.error = true;
	this.errorMessage = errorMessage;
	log.Red(this.errorMessage);
}

Site.prototype.SetupRenderables = function () {
	this.authors = siteutils.GetAuthors(this);
	this.defaultAuthor = this.authors[this.authors.length - 1];
	this.categories = siteutils.GetCategories(this);
	this.defaultCategory = this.categories[this.categories.length - 1];
	this.tags = siteutils.GetTags(this);
	this.pages = siteutils.GetPages(this);
	this.collections = siteutils.GetCollections(this);
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

Site.prototype.GetEntityConfigPath = function (typenamePlural) {
	return this.GetMetaDirectory() + "/" + typenamePlural + "/config.txt";
}

Site.prototype.GetAuthorConfigPath = function () {
	return this.GetEntityConfigPath("authors");
}

Site.prototype.GetCategoryConfigPath = function () {
	return this.GetEntityConfigPath("categories");
}

Site.prototype.GetCollectionConfigPath = function () {
	return this.GetEntityConfigPath("collections");
}

Site.prototype.GetTagConfigPath = function () {
	return this.GetEntityConfigPath("tags");
}

Site.prototype.PrintDirectories = function () {
	log.SomeNews("  Input: " + this.GetInputDirectory());
	log.SomeNews(" Output: " + this.GetOutputDirectory());
	log.SomeNews("   Meta: " + this.GetMetaDirectory());
	log.SomeNews("  Colls: " + this.GetCollectionsDirectory());
	log.SomeNews("Special: " + this.GetSpecialDirectory());
}

Site.prototype.Authors = function () {
	return this.authors;
}

Site.prototype.Categories = function () {
	return this.categories;
}

Site.prototype.Tags = function () {
	return this.tags;
}

Site.prototype.Pages = function () {
	return this.pages;
}

Site.prototype.Collections = function () {
	return this.collections;
}

Site.prototype.Entities = function () {
	let entities = [];
	entities = entities.concat(this.authors);
	entities = entities.concat(this.categories);
	entities = entities.concat(this.tags);
	entities = entities.concat(this.collections);
	return entities;
}

Site.prototype.All = function () {
	return this.Entities().concat(this.pages);
}

Site.prototype.LayoutsArray = function () {
	let layouts = [];
	for (let index in this.themes) {
		layouts = layouts.concat(this.themes[index].layouts);
	}
	return layouts;
}

Site.prototype.CssFilesArray = function () {
	let cssFiles = [];
	for (let index in this.themes) {
		cssFiles = cssFiles.concat(this.themes[index].cssFiles);
	}
	return cssFiles;
}

Site.prototype.JsFilesArray = function () {
	let jsFiles = [];
	for (let index in this.themes) {
		jsFiles = jsFiles.concat(this.themes[index].jsFiles);
	}
	return jsFiles;
}

Site.prototype.ResFilesArray = function () {
	let resFiles = [];
	for (let index in this.themes) {
		resFiles = resFiles.concat(this.themes[index].resFiles);
	}
	return resFiles;
}

Site.prototype.PrintArrayAsTable = function (arr) {
	if (arr.length == 0) {
		log.Red("No elements in array.");
		return;
	}

	let table = arr[0].GetTable();
	for (let index in arr) {
		table.Add(arr[index]);
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
	this.PrintArrayAsTable(this.All());
}

Site.prototype.PrintThemes = function () {
	let table = this.themes[0].GetTable();
	for (let index in this.themes) {
		table.Add(this.themes[index]);
	}
	table.Print();
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

Site.prototype.ForcedUpdateArray = function (arr) {
	for (let index in arr) {
		arr[index].ForcedUpdate();
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
	this.ForcedUpdateArray(this.All());
}

Site.prototype.UpdateArray = function (arr) {
	for (let index in arr) {
		arr[index].Update();
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
	this.UpdateArray(this.All());
}

module.exports = {
	Site: Site
};


