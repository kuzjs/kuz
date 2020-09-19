// site/utils.js

const fs = require("fs");

const log = require("../kuz-log/log");

const Nss = require("../kuz-nss/nss").Nss;
const Page = require("../kuz-page").Page;

function SetupNextPrevious (arr) {
	for (let index=0; index<arr.length; index++) {
		arr[index].index = index;
		arr[index].next = arr[index + 1] ? arr[index + 1] : null;
		arr[index].previous = arr[index - 1] ? arr[index - 1] : null;
	}
}

function GetPages (site, dirpath, parentKonfig) {
	const KuzKonfig = require("../kuz-konfig").KuzKonfig;
	let konfig = new KuzKonfig(site, dirpath);
	if (konfig.DoesNotExist()) {
		site.Error("Config file NOT found: " + configPath);
		return [];
	}

	if (parentKonfig) {
		parentKonfig.AddChild(konfig);
		konfig.SetParent(parentKonfig);
	}

	site.AddKonfig(konfig);

	let pages = [];
	let configEntries = konfig.GetEntries();

	let root = null;
	for (let entry of configEntries) {
		if (entry.startsWith("[") && entry.endsWith("]")) {
			if (root === null) {
				entry = entry.slice(1, -1);
				root = new Page(site, konfig, entry, true);
				konfig.root = root;
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
			pages = pages.concat(GetPages(site, entryDirpath, konfig));
		} else {
			let page = new Page(site, konfig, entry);
			if (page.IsValid()) {
				konfig.AddPage(page);
				pages.push(page);
			}
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


