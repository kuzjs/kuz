// baseobject.js

const fsutils = require("../kuz-fs");
const fs = require("fs");



function KuZBaseObject () {
	//
}

KuZBaseObject.prototype = {
	get webapp () {
		return this.getApp();
	},
	get website () {
		return this.getSite();
	}
};

KuZBaseObject.prototype.typeName = "KuZBaseObject";

KuZBaseObject.prototype.TypeName = function () {
	return this.typeName;
}

KuZBaseObject.prototype.TypeNamePlural = function () {
	if (this.typeNamePlural) {
		return this.typeNamePlural;
	}
	return this.typeName + "s";
}

KuZBaseObject.prototype.CodeLetter = function () {
	if (this.codeLetter) {
		return this.codeLetter;
	}
	return this.TypeName()[0];
}

KuZBaseObject.prototype.getCodeName = function () {
	return this.CodeLetter() + this.index;
}



KuZBaseObject.prototype.setSite = function (site) {
	if (site != undefined && this.site === undefined) {
		this.site = site;
	}
	return this;
}

KuZBaseObject.prototype.getSite = function () {
	if (this.site) {
		return this.site;
	} else if (this.theme) {
		return this.theme.getSite();
	} else {
		return null;
	}
}



KuZBaseObject.prototype.setApp = function (app) {
	if (app != undefined && this.app === undefined) {
		this.app = app;
	}
	return this;
}

KuZBaseObject.prototype.getApp = function () {
	if (this.app) {
		return this.app;
	}
	return this.getSite().app;
}



KuZBaseObject.prototype.setIndex = function (index) {
	if (index != undefined) {
		this.index = index;
	}
	return this;
}

KuZBaseObject.prototype.getIndex = function () {
	return this.index;
}



KuZBaseObject.prototype.setTitle = function (title) {
	if (title != undefined) {
		this.title = title;
	}
	return this;
}

KuZBaseObject.prototype.getTitle = function () {
	return this.title;
}



KuZBaseObject.prototype.setName = function (name) {
	if (name != undefined) {
		this.name = name;
	}
	return this;
}

KuZBaseObject.prototype.getName = function () {
	return this.name;
}



KuZBaseObject.prototype.getNext = function () {
	return this.next;
}

KuZBaseObject.prototype.getPrevious = function () {
	return this.previous;
}



KuZBaseObject.prototype.isApp = function () {
	return false;
}

KuZBaseObject.prototype.isSite = function () {
	return false;
}



KuZBaseObject.prototype.isAuthor = function () {
	return false;
}

KuZBaseObject.prototype.isCategory = function () {
	return false;
}

KuZBaseObject.prototype.isCollection = function () {
	return false;
}

KuZBaseObject.prototype.isTag = function () {
	return false;
}

KuZBaseObject.prototype.isPage = function () {
	return false;
}



KuZBaseObject.prototype.isTheme = function () {
	return false;
}

KuZBaseObject.prototype.isLayout = function () {
	return false;
}

KuZBaseObject.prototype.isModule = function () {
	return false;
}

KuZBaseObject.prototype.isProtoFile = function () {
	return false;
}

KuZBaseObject.prototype.isCssFile = function () {
	return false;
}

KuZBaseObject.prototype.isJsFile = function () {
	return false;
}

KuZBaseObject.prototype.isResFile = function () {
	return false;
}



KuZBaseObject.prototype.CodeAndName = function () {
	return this.getCodeName() + ": " + this.getName();
}



KuZBaseObject.prototype.InputFilePath = function (fileName) {
	if (fileName === undefined) {
		return fsutils.JoinPath(this.InputDirectoryPath(), this.InputFileName());
	} else {
		return fsutils.JoinPath(this.InputDirectoryPath(), fileName);
	}
}

KuZBaseObject.prototype.InputFileExists = function () {
	return fsutils.FileExists(this.InputFilePath());
}

KuZBaseObject.prototype.InputFileMTime = function () {
	fsutils.GetFileMTime(this.InputFilePath());
}

KuZBaseObject.prototype.OutputFilePath = function (fileName) {
	if (fileName === undefined) {
		return fsutils.JoinPath(this.OutputDirectoryPath(), this.OutputFileName());
	} else {
		return fsutils.JoinPath(this.OutputDirectoryPath(), fileName);
	}
}

KuZBaseObject.prototype.OutputFileExists = function () {
	return fsutils.FileExists(this.OutputFilePath());
}

KuZBaseObject.prototype.OutputFileMTime = function () {
	fsutils.GetFileMTime(this.OutputFilePath());
}



KuZBaseObject.prototype.buildable = function () {
	if (!this.OutputFileExists()) {
		this.log.green("Can be built.", this.getCodeName());
	}
	return this;
}

KuZBaseObject.prototype.build = function () {
	if (!this.OutputFileExists()) {
		this.update();
	}
	return this;
}

KuZBaseObject.prototype.updatable = function () {
	if (this.needsUpdate()) {
		this.log.green("Can be updated.", this.getCodeName());
	}
	return this;
}

KuZBaseObject.prototype.update = function () {
	this.log.green("KuZBaseObject Update(): " + this.CodeAndName());
	return this;
}

KuZBaseObject.prototype.forcedUpdate = function () {
	this.log.green("KuZBaseObject ForcedUpdate(): " + this.CodeAndName());
	return this;
}

KuZBaseObject.prototype.deleteOutput = function () {
	this.log.green("KuZBaseObject deleteOutput(): " + this.CodeAndName());
	return this;
}

KuZBaseObject.prototype.deleteExtras = function () {
	this.log.green("KuZBaseObject deleteExtras(): " + this.CodeAndName());
	return this;
}

KuZBaseObject.prototype.verify = function () {
	this.log.green("KuZBaseObject verify(): " + this.CodeAndName());
	return this;
}

KuZBaseObject.prototype.watch = function () {
	this.log.green("KuZBaseObject watch(): " + this.CodeAndName());
	return this;
}



module.exports = {
	KuZBaseObject: KuZBaseObject
};


