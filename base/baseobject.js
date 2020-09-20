// baseobject.js

const fsutils = require("../kuz-fs");
const fs = require("fs");



function KZBaseObject () {
	//
}

KZBaseObject.prototype = {
	get webapp () {
		return this.GetApp();
	},
	get website () {
		return this.GetSite();
	},
	get renderables () {
		return this.GetSite().All();
	},
	get table () {
		return this.GetTable();
	},
	get row () {
		return this.GetRow();
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



KZBaseObject.prototype.Site = function (site) {
	this.SetSite(site);
	return this.GetSite();
}

KZBaseObject.prototype.SetSite = function (site) {
	if (site != undefined && this.site === undefined) {
		this.site = site;
	}
	return this;
}

KZBaseObject.prototype.GetSite = function () {
	if (this.site) {
		return this.site;
	} else if (this.theme) {
		return this.theme.GetSite();
	} else {
		return null;
	}
}



KZBaseObject.prototype.App = function (app) {
	this.SetApp(app);
	return this.GetApp();
}

KZBaseObject.prototype.SetApp = function (app) {
	if (app != undefined && this.app === undefined) {
		this.app = app;
	}
	return this;
}

KZBaseObject.prototype.GetApp = function () {
	if (this.app) {
		return this.app;
	}
	return this.GetSite().app;
}



KZBaseObject.prototype.Blackadder = function () {
	return this.GetApp().Blackadder();
}

KZBaseObject.prototype.LoremIpsum = function () {
	return this.GetApp().LoremIpsum();
}



KZBaseObject.prototype.Index = function (index) {
	this.SetIndex(index);
	return this.GetIndex();
}

KZBaseObject.prototype.SetIndex = function (index) {
	if (index != undefined) {
		this.index = index;
	}
	return this;
}

KZBaseObject.prototype.GetIndex = function () {
	return this.index;
}



KZBaseObject.prototype.Title = function (title) {
	this.SetTitle(title);
	return this.GetTitle();
}

KZBaseObject.prototype.SetTitle = function (title) {
	if (title != undefined) {
		this.title = title;
	}
	return this;
}

KZBaseObject.prototype.GetTitle = function () {
	return this.title;
}



KZBaseObject.prototype.Name = function (name) {
	this.SetName(name);
	return this.GetName();
}

KZBaseObject.prototype.SetName = function (name) {
	if (name != undefined) {
		this.name = name;
	}
	return this;
}

KZBaseObject.prototype.GetName = function () {
	return this.name;
}



KZBaseObject.prototype.Next = function () {
	return this.next;
}

KZBaseObject.prototype.Previous = function () {
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
	return this.CodeName() + ": " + this.Name();
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



KZBaseObject.prototype.Buildable = function () {
	this.log.Green("KZBaseObject Buildable(): " + this.CodeAndName());
	return this;
}

KZBaseObject.prototype.Build = function () {
	this.log.Green("KZBaseObject Build(): " + this.CodeAndName());
	return this;
}

KZBaseObject.prototype.Updatable = function () {
	this.log.Green("KZBaseObject Updatable(): " + this.CodeAndName());
	return this;
}

KZBaseObject.prototype.Update = function () {
	this.log.Green("KZBaseObject Update(): " + this.CodeAndName());
	return this;
}

KZBaseObject.prototype.ForcedUpdate = function () {
	this.log.Green("KZBaseObject ForcedUpdate(): " + this.CodeAndName());
	return this;
}

KZBaseObject.prototype.DeleteOutput = function () {
	this.log.Green("KZBaseObject DeleteOutput(): " + this.CodeAndName());
	return this;
}

KZBaseObject.prototype.DeleteExtras = function () {
	this.log.Green("KZBaseObject DeleteExtras(): " + this.CodeAndName());
	return this;
}

KZBaseObject.prototype.Verify = function () {
	this.log.Green("KZBaseObject Verify(): " + this.CodeAndName());
	return this;
}

KZBaseObject.prototype.Watch = function () {
	this.log.Green("KZBaseObject Watch(): " + this.CodeAndName());
	return this;
}



module.exports = {
	KZBaseObject: KZBaseObject
};


