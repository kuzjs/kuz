// site/utils.js

const fs = require("fs");

const log = require("./log");

const ConfigFile = require("./configfile").ConfigFile;

const Nss = require("./nss").Nss;
const Author = require("../renderable/author").Author;
const Category = require("../renderable/category").Category;
const Collection = require("../renderable/collection").Collection;
const Tag = require("../renderable/tag").Tag;
const Page = require("../renderable/page").Page;

const site = null;

function SetSite (mySite) {
	site = mySite;
}

function SetupNextPrevious (arr) {
	for (let index=0; index<arr.length; index++) {
		arr[index].index = index;
		arr[index].next = arr[index + 1] ? arr[index + 1] : null;
		arr[index].previous = arr[index - 1] ? arr[index - 1] : null;
	}
}

function GetLines (filename) {
	let fileNss = new Nss(filename);
	return fileNss.GetLinesArray();
}

function GetAuthors (site) {
	let configPath = site.GetAuthorConfigPath();

	if (!fs.existsSync(configPath)) {
		site.Error("Author file NOT found: " + configPath);
		return [];
	}

	let configFileObject = new ConfigFile(site, configPath, true);
	site.AddConfig(configFileObject);

	let authors = [];
	let configEntries = configFileObject.GetEntries();
	for (let index in configEntries) {
		let entry = configEntries[index];
		let author = new Author(site, entry);
		authors.push(author);
	}

	SetupNextPrevious(authors);
	return authors;
}

function GetCategories (site) {
	let configPath = site.GetCategoryConfigPath();

	if (!fs.existsSync(configPath)) {
		site.Error("Category file NOT found: " + configPath);
		return [];
	}

	let configFileObject = new ConfigFile(site, configPath, true);
	site.AddConfig(configFileObject);

	let categories = [];
	let configEntries = configFileObject.GetEntries();
	for (let index in configEntries) {
		let entry = configEntries[index];
		let category = new Category(site, entry);
		categories.push(category);
	}

	SetupNextPrevious(categories);
	return categories;
}

function GetTags (site) {
	let configPath = site.GetTagConfigPath();

	if (!fs.existsSync(configPath)) {
		site.Error("Tag file NOT found: " + configPath);
		return [];
	}

	let configFileObject = new ConfigFile(site, configPath, true);
	site.AddConfig(configFileObject);

	let tags = [];
	let configEntries = configFileObject.GetEntries();
	for (let index in configEntries) {
		let entry = configEntries[index];
		let tag = new Tag(site, entry);
		tags.push(tag);
	}

	SetupNextPrevious(tags);
	return tags;
}

function GetPages (site, dirpath, parentConfig) {
	let configFileObject = new ConfigFile(site, dirpath);

	if (parentConfig) {
		parentConfig.AddChild(configFileObject);
		configFileObject.SetParent(parentConfig);
	}

	site.AddConfig(configFileObject);

	if (!configFileObject.Exists()) {
		site.Error("Config file NOT found: " + configPath);
		return [];
	}

	let pages = [];
	let configEntries = configFileObject.GetEntries();

	let root = null;
	for (let index in configEntries) {
		let entry = configEntries[index];
		if (entry.startsWith("[") && entry.endsWith("]")) {
			if (root === null) {
				entry = entry.slice(1, -1);
				root = new Page(site, configFileObject, entry, true);
				configFileObject.root = root;
				pages.push(root);
			} else {
				site.Error("Multiple roots specified: " + configPath);
				return [];
			}
		} else if (entry.endsWith("/")) {
			entry = entry.slice(0, -1);
			if (dirpath === undefined) {
				entryDirpath = entry;
			} else {
				entryDirpath = dirpath + "/" + entry;
			}
			pages = pages.concat(GetPages(site, entryDirpath, configFileObject));
		} else {
			let page = new Page(site, configFileObject, entry);
			configFileObject.pages.push(pages);
			pages.push(page);
		}
	}

	if (dirpath === undefined) {
		SetupNextPrevious(pages);
	}
	return pages;
}

function GetCollections (site) {
	let configPath = site.GetCollectionConfigPath();

	if (!fs.existsSync(configPath)) {
		site.Error("Collection file NOT found: " + configPath);
		return [];
	}

	let configFileObject = new ConfigFile(site, configPath, true);
	site.AddConfig(configFileObject);

	let collections = [];
	let configEntries = configFileObject.GetEntries();
	for (let index in configEntries) {
		let entry = configEntries[index];
		let collection = new Collection(site, entry);
		collections.push(collection);
	}

	SetupNextPrevious(collections);
	return collections;
}



module.exports = {
	SetSite: SetSite,
	GetAuthors: GetAuthors,
	GetCategories: GetCategories,
	GetTags: GetTags,
	GetPages: GetPages,
	GetCollections: GetCollections,
	zzz: false
};


