// konfig.js

const fsutils = require("../kuz-fs");



function KuzKonfig (site, dirpath) {
	this.site = site;
	this.dirpath = dirpath;
	this.pages = [];

	if (this.dirpath === undefined) {
		this.configDirpath = site.getInputDirectory();
	} else {
		this.configDirpath = site.getInputDirectory() + "/" + this.dirpath;
	}

	this.path = fsutils.JoinPath(this.configDirpath, this.site.filenames.konfig);
	this.log = this.site.log.getChild(this.path);

	this.root = null;
	this.parent = null;
	this.children = [];
	this.index = 0;

	const KuzFile = require("../kuz-kuzfile");
	this.kuzFile = new KuzFile(this, this.path);
	this.kuzFile.turnCacheOn();
}

const KuzBaseObject = require("../kuz-baseobject");
KuzKonfig.prototype = new KuzBaseObject();
KuzKonfig.prototype.codeLetter = "g";



KuzKonfig.prototype.setParent = function (configFileParentObject) {
	if (configFileParentObject) {
		this.parent = configFileParentObject;
	} else {
		this.parent = null;
	}
}

KuzKonfig.prototype.addChild = function (configFileChildObject) {
	this.children.push(configFileChildObject);
}

KuzKonfig.prototype.addPage = function (page) {
	this.pages.push(page);
}



KuzKonfig.prototype.getDirPath = function () {
	return this.configDirpath;
}

KuzKonfig.prototype.getProps = function () {
	return this.kuzFile.getProps();
}

KuzKonfig.prototype.getPath = function () {
	return this.path;
}



KuzKonfig.prototype.exists = function () {
	if (fsutils.isFile(this.path)) {
		return true;
	}
	return false;
}

KuzKonfig.prototype.doesNotExist = function () {
	return !this.exists();
}



KuzKonfig.prototype.getEntriesObject = function () {
	let lines = this.kuzFile.getContentLines();
	let entries = {
		root: false,
		nonroot: []
	};
	for (let line of lines) {
		let lineNumber = line[0];
		let lineText = line[1].trim();
		if (lineText.startsWith("(") && lineText.endsWith(")")) {
			if (entries.root) {
				this.log.red(`Multiple roots specified on L${lineNumber}: ${lineText}`);
			} else {
				entries.root = lineText.slice(1, -1);
			}
		} else {
			entries.nonroot.push(lineText);
		}
	}
	return entries;
}



KuzKonfig.prototype.getPages = function () {
	return this.pages;
}

KuzKonfig.prototype.getNumberOfPages = function () {
	return this.pages.length;
}

KuzKonfig.prototype.getNumberOfChildren = function () {
	return this.children.length;
}



KuzKonfig.prototype.parentString = function () {
	if (this.parent) {
		return this.parent.getCodeName();
	} else {
		return "";
	}
}

KuzKonfig.prototype.rootString = function () {
	if (this.root) {
		return "@";
	} else {
		return "";
	}
}



KuzKonfig.prototype.getTable = function () {
	const KuzTable = require("../kuz-table");
	let table = new KuzTable();
	table.addColumn("CodeName");
	table.addColumn("Path");
	table.addColumn("Parent");
	table.addColumn("@");
	table.addColumn("Dirs");
	table.addColumn("Pages");
	table.addColumn("Props");
	return table;
}

KuzKonfig.prototype.getRow = function () {
	return [
		this.getCodeName(),
		this.path,
		this.parentString(),
		this.rootString(),
		this.getNumberOfChildren(),
		this.getNumberOfPages(),
		this.kuzFile.numberOfProperties()
	];
}



module.exports = KuzKonfig;


