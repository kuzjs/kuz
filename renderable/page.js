// page.js


const fs = require("fs");

const fsutils = require("../utils/fsutils");
const log = require("../utils/log");

const Nss = require("../utils/nss").Nss;
const Renderable = require("./renderable").Renderable;
const MetaData = require("../metadata/metadata").MetaData;

function Page(site, configFileObject, filename, isRoot = false) {
	this.site = site;
	this.configFileObject = configFileObject;
	this.configDirpath = (configFileObject.dirpath === undefined) ? "" : configFileObject.dirpath;
	this.filename = filename;
	this.isRoot = isRoot;
	this.Setup();
}

Page.prototype = new Renderable();
Page.prototype.typeName = "page";
Page.prototype.typeNamePlural = "pages";
Page.prototype.codeLetter = "p";

Page.prototype.Setup = function () {
	this.SetupInput();
	this.tags = [];
	this.metaData = new MetaData(this.site, this.inputFilePath);
	this.inputNss = new Nss(this.inputFilePath);
	let headerLines = this.inputNss.GetHeaderLines();
	for (let index in headerLines) {
		let headerLine = headerLines[index];
		this.AddProperty(headerLine);
	}
}

Page.prototype.IsPage = function () {
	return true;
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

	this.inputFileExtension = this.typeName;
	this.inputFilePath = inputFilePathWithoutExtension + "." + this.inputFileExtension;
	if (fsutils.IsFile(this.inputFilePath)) {
		this.inputFileFound = true;
	}
}

Page.prototype.InputDirectoryPath = function () {
	return fsutils.JoinPath(this.site.GetInputDirectory(), this.configDirpath, this.filename);
}

Page.prototype.OutputDirectoryPartialPath = function () {
	if (this.isRoot) {
		return this.configDirpath;
	} else {
		return fsutils.JoinPath(this.configDirpath, this.filename);
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

Page.prototype.RenderLog = function () {
	log.Green("Page updated: (" + this.inputFilePath + ") --> [" + this.OutputFilePath() + "]");
}

Page.prototype.Author = function () {
	return this.GetAuthor();
}

Page.prototype.GetAuthor = function () {
	let author = this.GetPropertyCascaded("author");
	if (author.found) {
		let authorObject = this.site.GetAuthorFromName(author.value);
		if (authorObject) {
			return authorObject;
		}
	}
	return this.site.defaultAuthor;
}

Page.prototype.Category = function () {
	return this.GetCategory();
}

Page.prototype.GetCategory = function () {
	let category = this.GetPropertyCascaded("category");
	if (category.found) {
		let categoryObject = this.site.GetCategoryFromName(category.value);
		if (categoryObject) {
			return categoryObject;
		}
	}
	return this.site.defaultCategory;
}

Page.prototype.TagsArray = function () {
	let tagsArray = this.GetProperty("tags");
	if (tagsArray.found) {
		return tagsArray.value;
	}
	return [];
}

Page.prototype.Tags = function () {
	return this.GetTags();
}

Page.prototype.GetTags = function () {
	let tagsArray = this.TagsArray();
	return this.site.GetTagsFromNameArray(tagsArray);
}

module.exports = {
	Page: Page
};


