// page.js


const fs = require("fs");

const Article = require("./pages/article").Article;

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
Page.prototype.typename = "page";
Page.prototype.typenamePlural = "pages";

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

	this.contentString = this.inputNss.GetBodyString();
}

Page.prototype.ContentHtml = function () {
	let article = new Article(this, this.contentString);
	return article.ContentHtml();
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

	let inputFilePath;
	let extensions = this.site.app.meta.json.extensions;
	for (let index in extensions) {
		let extension = extensions[index];
		inputFilePath = inputFilePathWithoutExtension + "." + extension;
		if (fsutils.IsFile(inputFilePath)) {
			this.inputFileFound = true;
			this.inputFileExtension = extension;
			break;
		}
	}

	this.inputFilePath = inputFilePath;
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
	if (this.author) {
		let author = this.site.GetAuthorFromName(this.author);
		if (author) {
			return author;
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

Page.prototype.Tags = function () {
	return this.GetTags();
}

Page.prototype.GetTags = function () {
	return this.site.GetTagsFromNameArray(this.tags);
}

module.exports = {
	Page: Page
};


