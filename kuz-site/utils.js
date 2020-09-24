// site/utils.js

const fs = require("fs");

const KuzPage = require("../kuz-page");

function setupNextPrevious (arr) {
	for (let index=0; index<arr.length; index++) {
		arr[index].index = index;
		arr[index].next = arr[index + 1] ? arr[index + 1] : null;
		arr[index].previous = arr[index - 1] ? arr[index - 1] : null;
	}
}

function getPages (site, dirpath, parentKonfig) {
	const KuzKonfig = require("../kuz-konfig").KuzKonfig;
	let konfig = new KuzKonfig(site, dirpath);
	if (konfig.doesNotExist()) {
		site.error("Config file NOT found: " + configPath);
		return [];
	}

	konfig.kuzFile.turnCacheOn();

	let root = null;
	if (parentKonfig) {
		parentKonfig.addChild(konfig);
		konfig.setParent(parentKonfig);
		root = parentKonfig.root;
	}

	site.addKonfig(konfig);

	let pages = [];
	let entries = konfig.getEntriesObject();

	if (entries.root) {
		root = new KuzPage(site, konfig, entries.root, true);
		if (root.ok()) {
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
			pages = pages.concat(getPages(site, entryDirpath, konfig));
		} else {
			let page = new KuzPage(site, konfig, entry);
			if (page.ok()) {
				konfig.addPage(page);
				pages.push(page);
			}
		}
	}

	if (dirpath === undefined) {
		setupNextPrevious(pages);
	}
	return pages;
}



module.exports = {
	setupNextPrevious: setupNextPrevious,
	getPages: getPages,
	zzz: false
};


