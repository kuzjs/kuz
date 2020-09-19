// page.js


const fs = require("fs");

const fsutils = require("../kz-fs");
const log = require("../kz-log/log");

function Page (site, configFileObject, entry, isRoot = false) {
	this.SetupRenderable(site, configFileObject, entry);
	this.configDirpath = (configFileObject.dirpath === undefined) ? "" : configFileObject.dirpath;
	this.isRoot = isRoot;
	this.SetupPage();
}

const Renderable = require("./renderable").Renderable;
Page.prototype = new Renderable();
Page.prototype.typeName = "page";
Page.prototype.typeNamePlural = "pages";
Page.prototype.codeLetter = "p";

Page.prototype.SetupPage = function () {
	this.SetupInput();
	this.tags = [];

	const MetaData = require("../metadata/metadata").MetaData;
	this.metaData = new MetaData(this.site, this.inputFilePath);

	const Nss = require("../kuz-nss/nss").Nss;
	this.inputNss = new Nss(this.inputFilePath);
}

Page.prototype.IsPage = function () {
	if (this.GetType() == "page") {
		return true;
	}
	return false;
}

Page.prototype.SetupInput = function () {
	this.inputFileFound = false;
	this.inputFileExtension = null;
	this.inputFilePath = null;

	let inputFilePathWithoutExtension;
	if (fsutils.IsDirectory(this.InputDirectoryPath())) {
		this.hasInputDirectory = true;
		inputFilePathWithoutExtension = fsutils.JoinPath(this.InputDirectoryPath(), "index");
	} else {
		this.hasInputDirectory = false;
		inputFilePathWithoutExtension = this.InputDirectoryPath();
	}

	this.inputFileExtension = this.InputFileExtension();
	this.inputFilePath = inputFilePathWithoutExtension + "." + this.inputFileExtension;
	if (fsutils.IsFile(this.inputFilePath)) {
		this.inputFileFound = true;
	}
}

Page.prototype.InputDirectoryPath = function () {
	return fsutils.JoinPath(this.site.GetInputDirectory(), this.configDirpath, this.entry);
}

Page.prototype.OutputDirectoryPartialPath = function () {
	if (this.isRoot) {
		return this.configDirpath;
	} else {
		return fsutils.JoinPath(this.configDirpath, this.entry);
	}
}

Page.prototype.OutputFilePath = function () {
	if (this.HasPrettyURL()) {
		return this.OutputDirectoryPath() + "/index.html";
	} else {
		return this.OutputDirectoryPath() + ".html";
	}
}

Page.prototype.RelativeURL = function () {
	if (this.HasPrettyURL()) {
		return this.OutputDirectoryPartialPath();
	} else {
		return this.OutputDirectoryPartialPath() + ".html";
	}
}

Page.prototype.Name = function () {
	if (this.isRoot) {
		return this.OutputDirectoryPartialPath() + "@root";
	} else {
		return this.OutputDirectoryPartialPath();
	}
}

Page.prototype.NeedsUpdate = function () {
	if (this.OutputFileIsOlderThanMeta()) {
		return true;
	}

	let outputFilePath = this.OutputFilePath();
	if (this.hasInputDirectory) {
		let inputDirectoryPath = this.InputDirectoryPath();
		if (fsutils.DirectoryHasNewerFiles(inputDirectoryPath, outputFilePath)) {
			return true;
		} else {
			return false;
		}
	} else {
		if (fsutils.IsNewerThan(outputFilePath, this.inputFilePath)) {
			return false;
		} else {
			return true;
		}
	}
}

module.exports = {
	Page: Page
};


