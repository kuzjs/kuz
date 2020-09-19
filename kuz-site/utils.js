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

	let root = null;
	if (parentKonfig) {
		parentKonfig.AddChild(konfig);
		konfig.SetParent(parentKonfig);
		root = parentKonfig.root;
	}

	site.AddKonfig(konfig);

	let pages = [];
	let entries = konfig.GetEntriesObject();

	if (entries.root) {
		root = new Page(site, konfig, entries.root, true);
		if (root.IsValid()) {
			konfig.root = root;
			pages.push(root);
		}
	}

	for (let entry of entries.nonroot) {
		if (entry.endsWith("/")) {
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


