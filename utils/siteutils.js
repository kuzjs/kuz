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
	let filepath = site.GetAuthorFilePath();

	if (!fs.existsSync(filepath)) {
		site.Error("Author file NOT found: " + filepath);
		return [];
	}

	let authors = [];
	let lines = GetLines(filepath);
	for (let index in lines) {
		let line = lines[index];
		let author = new Author(site, line);
		authors.push(author);
	}
	return authors;
}

function GetCategories (site) {
	let filepath = site.GetCategoryFilePath();

	if (!fs.existsSync(filepath)) {
		site.Error("Category file NOT found: " + filepath);
		return [];
	}

	let categories = [];
	let lines = GetLines(filepath);
	for (let index in lines) {
		let line = lines[index];
		let category = new Category(site, line);
		categories.push(category);
	}

	return categories;
}

function GetTags (site) {
	let filepath = site.GetTagFilePath();

	if (!fs.existsSync(filepath)) {
		site.Error("Tag file NOT found: " + filepath);
		return [];
	}

	let tags = [];
	let lines = GetLines(filepath);
	for (let index in lines) {
		let line = lines[index];
		let tag = new Tag(site, line);
		tags.push(tag);
	}

	return tags;
}

function GetPages (site, dirpath, configFileParentObject) {
	let configFileObject = new ConfigFile(site, dirpath);

	configFileObject.SetParent(configFileParentObject);
	site.configFileObjects.push(configFileObject);

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
			pages.push(page);
		}
	}

	return pages;
}

function GetCollections (site) {
	let filepath = site.GetCollectionFilePath();

	if (!fs.existsSync(filepath)) {
		site.Error("Collection file NOT found: " + filepath);
		return [];
	}

	let collections = [];
	let lines = GetLines(filepath);
	for (let index in lines) {
		let line = lines[index];
		let collection = new Collection(site, line);
		collections.push(collection);
	}

	return collections;
}



module.exports = {
	SetSite: SetSite,
	SetupNextPrevious: SetupNextPrevious,
	GetAuthors: GetAuthors,
	GetCategories: GetCategories,
	GetTags: GetTags,
	GetPages: GetPages,
	GetCollections: GetCollections,
	zzz: false
};


