// site/utils.js

const fs = require("fs");

const log = require("../kz-log/log");

const ConfigFile = require("../utils/configfile").ConfigFile;

const Nss = require("../kuz-nss/nss").Nss;
const Page = require("../kuz-page").Page;

function SetupNextPrevious (arr) {
	for (let index=0; index<arr.length; index++) {
		arr[index].index = index;
		arr[index].next = arr[index + 1] ? arr[index + 1] : null;
		arr[index].previous = arr[index - 1] ? arr[index - 1] : null;
	}
}

function GetEntities (site, configDirPath, Entity) {
	let configFileObject = new ConfigFile(site, configDirPath, true);
	if (configFileObject.DoesNotExist()) {
		return [];
	}
	site.AddConfig(configFileObject);

	let entities = [];
	let configEntries = configFileObject.GetEntries();
	for (let entry of configEntries) {
		let entity = new Entity(site, configFileObject, entry);
		configFileObject.AddPage(entity);
		entities.push(entity);
	}

	SetupNextPrevious(entities);
	return entities;
}

function GetPages (site, dirpath, parentConfig) {
	let configFileObject = new ConfigFile(site, dirpath);
	if (configFileObject.DoesNotExist()) {
		return [];
	}

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
	for (let entry of configEntries) {
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



module.exports = {
	SetupNextPrevious: SetupNextPrevious,
	GetPages: GetPages,
	zzz: false
};


