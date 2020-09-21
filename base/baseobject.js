// baseobject.js

const fsutils = require("../kuz-fs");
const fs = require("fs");



function KZBaseObject () {
	//
}

KZBaseObject.prototype = {
	get webapp () {
		return this.getApp();
	},
	get website () {
		return this.getSite();
	},
	get renderables () {
		return this.getSite().All();
	},
	get table () {
		return this.getTable();
	},
	get row () {
		return this.getRow();
	}
};

KZBaseObject.prototype.typeName = "KZBaseObject";

KZBaseObject.prototype.TypeName = function () {
	return this.typeName;
}

KZBaseObject.prototype.TypeNamePlural = function () {
	if (this.typeNamePlural) {
		return this.typeNamePlural;
	}
	return this.typeName + "s";
}

KZBaseObject.prototype.CodeLetter = function () {
	if (this.codeLetter) {
		return this.codeLetter;
	}
	return this.TypeName()[0];
}

KZBaseObject.prototype.CodeName = function () {
	return this.CodeLetter() + this.index;
}



KZBaseObject.prototype.setSite = function (site) {
	if (site != undefined && this.site === undefined) {
		this.site = site;
	}
	return this;
}

KZBaseObject.prototype.getSite = function () {
	if (this.site) {
		return this.site;
	} else if (this.theme) {
		return this.theme.getSite();
	} else {
		return null;
	}
}



KZBaseObject.prototype.setApp = function (app) {
	if (app != undefined && this.app === undefined) {
		this.app = app;
	}
	return this;
}

KZBaseObject.prototype.getApp = function () {
	if (this.app) {
		return this.app;
	}
	return this.getSite().app;
}



KZBaseObject.prototype.setIndex = function (index) {
	if (index != undefined) {
		this.index = index;
	}
	return this;
}

KZBaseObject.prototype.getIndex = function () {
	return this.index;
}



KZBaseObject.prototype.setTitle = function (title) {
	if (title != undefined) {
		this.title = title;
	}
	return this;
}

KZBaseObject.prototype.getTitle = function () {
	return this.title;
}



KZBaseObject.prototype.setName = function (name) {
	if (name != undefined) {
		this.name = name;
	}
	return this;
}

KZBaseObject.prototype.getName = function () {
	return this.name;
}



KZBaseObject.prototype.getNext = function () {
	return this.next;
}

KZBaseObject.prototype.getPrevious = function () {
	return this.previous;
}



KZBaseObject.prototype.IsApp = function () {
	return false;
}

KZBaseObject.prototype.IsSite = function () {
	return false;
}



KZBaseObject.prototype.IsAuthor = function () {
	return false;
}

KZBaseObject.prototype.IsCategory = function () {
	return false;
}

KZBaseObject.prototype.IsCollection = function () {
	return false;
}

KZBaseObject.prototype.IsTag = function () {
	return false;
}

KZBaseObject.prototype.IsPage = function () {
	return false;
}



KZBaseObject.prototype.IsTheme = function () {
	return false;
}

KZBaseObject.prototype.IsLayout = function () {
	return false;
}

KZBaseObject.prototype.IsModule = function () {
	return false;
}

KZBaseObject.prototype.IsProtoFile = function () {
	return false;
}

KZBaseObject.prototype.IsCssFile = function () {
	return false;
}

KZBaseObject.prototype.IsJsFile = function () {
	return false;
}

KZBaseObject.prototype.IsResFile = function () {
	return false;
}



KZBaseObject.prototype.CodeAndName = function () {
	return this.CodeName() + ": " + this.getName();
}



KZBaseObject.prototype.InputFilePath = function (fileName) {
	if (fileName === undefined) {
		return fsutils.JoinPath(this.InputDirectoryPath(), this.InputFileName());
	} else {
		return fsutils.JoinPath(this.InputDirectoryPath(), fileName);
	}
}

KZBaseObject.prototype.InputFileExists = function () {
	return fsutils.FileExists(this.InputFilePath());
}

KZBaseObject.prototype.InputFileMTime = function () {
	fsutils.GetFileMTime(this.InputFilePath());
}

KZBaseObject.prototype.OutputFilePath = function (fileName) {
	if (fileName === undefined) {
		return fsutils.JoinPath(this.OutputDirectoryPath(), this.OutputFileName());
	} else {
		return fsutils.JoinPath(this.OutputDirectoryPath(), fileName);
	}
}

KZBaseObject.prototype.OutputFileExists = function () {
	return fsutils.FileExists(this.OutputFilePath());
}

KZBaseObject.prototype.OutputFileMTime = function () {
	fsutils.GetFileMTime(this.OutputFilePath());
}



KZBaseObject.prototype.buildable = function () {
	if (!this.OutputFileExists()) {
		this.log.green("Can be built.", this.CodeName());
	}
	return this;
}

KZBaseObject.prototype.build = function () {
	if (!this.OutputFileExists()) {
		this.update();
	}
	return this;
}

KZBaseObject.prototype.updatable = function () {
	if (this.needsUpdate()) {
		this.log.green("Can be updated.", this.CodeName());
	}
	return this;
}

KZBaseObject.prototype.update = function () {
	this.log.green("KZBaseObject Update(): " + this.CodeAndName());
	return this;
}

KZBaseObject.prototype.forcedUpdate = function () {
	this.log.green("KZBaseObject ForcedUpdate(): " + this.CodeAndName());
	return this;
}

KZBaseObject.prototype.deleteOutput = function () {
	this.log.green("KZBaseObject deleteOutput(): " + this.CodeAndName());
	return this;
}

KZBaseObject.prototype.deleteExtras = function () {
	this.log.green("KZBaseObject deleteExtras(): " + this.CodeAndName());
	return this;
}

KZBaseObject.prototype.verify = function () {
	this.log.green("KZBaseObject verify(): " + this.CodeAndName());
	return this;
}

KZBaseObject.prototype.watch = function () {
	this.log.green("KZBaseObject watch(): " + this.CodeAndName());
	return this;
}



module.exports = {
	KZBaseObject: KZBaseObject
};


