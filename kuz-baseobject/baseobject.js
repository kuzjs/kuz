// baseobject.js

const fsutils = require("../kuz-fs");
const fs = require("fs");



function KuzBaseObject () {
	//
}

KuzBaseObject.prototype = {
	get webapp () {
		return this.getApp();
	},
	get website () {
		return this.getSite();
	}
};

KuzBaseObject.prototype.typeName = "KuzBaseObject";

KuzBaseObject.prototype.getTypeName = function () {
	return this.typeName;
}

KuzBaseObject.prototype.getTypeNamePlural = function () {
	if (this.typeNamePlural) {
		return this.typeNamePlural;
	}
	return this.typeName + "s";
}

KuzBaseObject.prototype.getCodeLetter = function () {
	if (this.codeLetter) {
		return this.codeLetter;
	}
	return this.getTypeName()[0];
}

KuzBaseObject.prototype.getCodeName = function () {
	return this.getCodeLetter() + this.index;
}



KuzBaseObject.prototype.setSite = function (site) {
	if (site != undefined && this.site === undefined) {
		this.site = site;
	}
	return this;
}

KuzBaseObject.prototype.getSite = function () {
	if (this.site) {
		return this.site;
	} else if (this.theme) {
		return this.theme.getSite();
	} else {
		return null;
	}
}



KuzBaseObject.prototype.setApp = function (app) {
	if (app != undefined && this.app === undefined) {
		this.app = app;
	}
	return this;
}

KuzBaseObject.prototype.getApp = function () {
	if (this.app) {
		return this.app;
	}
	return this.getSite().app;
}



KuzBaseObject.prototype.setIndex = function (index) {
	if (index != undefined) {
		this.index = index;
	}
	return this;
}

KuzBaseObject.prototype.getIndex = function () {
	return this.index;
}



KuzBaseObject.prototype.setTitle = function (title) {
	if (title != undefined) {
		this.title = title;
	}
	return this;
}

KuzBaseObject.prototype.getTitle = function () {
	return this.title;
}



KuzBaseObject.prototype.setName = function (name) {
	if (name != undefined) {
		this.name = name;
	}
	return this;
}

KuzBaseObject.prototype.getName = function () {
	return this.name;
}



KuzBaseObject.prototype.getNext = function () {
	return this.next;
}

KuzBaseObject.prototype.getPrevious = function () {
	return this.previous;
}



KuzBaseObject.prototype.isApp = function () {
	return false;
}

KuzBaseObject.prototype.isSite = function () {
	return false;
}



KuzBaseObject.prototype.isAuthor = function () {
	return false;
}

KuzBaseObject.prototype.isCategory = function () {
	return false;
}

KuzBaseObject.prototype.isCollection = function () {
	return false;
}

KuzBaseObject.prototype.isTag = function () {
	return false;
}

KuzBaseObject.prototype.isPage = function () {
	return false;
}



KuzBaseObject.prototype.isTheme = function () {
	return false;
}

KuzBaseObject.prototype.isLayout = function () {
	return false;
}

KuzBaseObject.prototype.isModule = function () {
	return false;
}

KuzBaseObject.prototype.isProtoFile = function () {
	return false;
}

KuzBaseObject.prototype.isCssFile = function () {
	return false;
}

KuzBaseObject.prototype.isJsFile = function () {
	return false;
}

KuzBaseObject.prototype.isResFile = function () {
	return false;
}



KuzBaseObject.prototype.getCodeAndName = function () {
	return `(${this.getCodeName()}) ${this.getName()}`;
}



KuzBaseObject.prototype.InputFilePath = function (fileName) {
	if (fileName === undefined) {
		return fsutils.JoinPath(this.getInputDirectoryPath(), this.getInputFileName());
	} else {
		return fsutils.JoinPath(this.getInputDirectoryPath(), fileName);
	}
}

KuzBaseObject.prototype.InputFileExists = function () {
	return fsutils.FileExists(this.InputFilePath());
}

KuzBaseObject.prototype.getInputFileMTime = function () {
	fsutils.GetFileMTime(this.InputFilePath());
}

KuzBaseObject.prototype.OutputFilePath = function (fileName) {
	if (fileName === undefined) {
		return fsutils.JoinPath(this.getOutputDirectoryPath(), this.getOutputFileName());
	} else {
		return fsutils.JoinPath(this.getOutputDirectoryPath(), fileName);
	}
}

KuzBaseObject.prototype.OutputFileExists = function () {
	return fsutils.FileExists(this.OutputFilePath());
}

KuzBaseObject.prototype.getOutputFileMTime = function () {
	fsutils.GetFileMTime(this.OutputFilePath());
}



KuzBaseObject.prototype.buildable = function () {
	if (!this.OutputFileExists()) {
		this.log.green("Can be built.", this.getCodeName());
	}
	return this;
}

KuzBaseObject.prototype.build = function () {
	if (!this.OutputFileExists()) {
		this.update();
	}
	return this;
}

KuzBaseObject.prototype.updatable = function () {
	if (this.needsUpdate()) {
		this.log.green("Can be updated.", this.getCodeName());
	}
	return this;
}

KuzBaseObject.prototype.update = function () {
	this.log.green("KuzBaseObject Update(): " + this.getCodeAndName());
	return this;
}

KuzBaseObject.prototype.forcedUpdate = function () {
	this.log.green("KuzBaseObject ForcedUpdate(): " + this.getCodeAndName());
	return this;
}

KuzBaseObject.prototype.deleteOutput = function () {
	this.log.green("KuzBaseObject deleteOutput(): " + this.getCodeAndName());
	return this;
}

KuzBaseObject.prototype.deleteExtras = function () {
	this.log.green("KuzBaseObject deleteExtras(): " + this.getCodeAndName());
	return this;
}

KuzBaseObject.prototype.verify = function () {
	this.log.green("KuzBaseObject verify(): " + this.getCodeAndName());
	return this;
}

KuzBaseObject.prototype.watch = function () {
	this.log.green("KuzBaseObject watch(): " + this.getCodeAndName());
	return this;
}



module.exports = {
	KuzBaseObject: KuzBaseObject
};


