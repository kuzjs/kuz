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

function GetEntities (site, configPath, Entity) {
	if (!fs.existsSync(configPath)) {
		site.Error("Entity config file NOT found: " + configPath);
		return [];
	}

	let configFileObject = new ConfigFile(site, configPath, true);
	site.AddConfig(configFileObject);

	let entities = [];
	let configEntries = configFileObject.GetEntries();
	for (let index in configEntries) {
		let entry = configEntries[index];
		let entity = new Entity(site, entry);
		configFileObject.AddPage(entity);
		entity.SetConfig(configFileObject);
		entities.push(entity);
	}

	SetupNextPrevious(entities);
	return entities;
}

function GetAuthors (site) {
	let configPath = site.GetAuthorConfigPath();
	return GetEntities(site, configPath, Author);
}

function GetCategories (site) {
	let configPath = site.GetCategoryConfigPath();
	return GetEntities(site, configPath, Category);
}

function GetTags (site) {
	let configPath = site.GetTagConfigPath();
	return GetEntities(site, configPath, Tag);
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
			configFileObject.AddPage(page);
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
	return GetEntities(site, configPath, Collection);
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


