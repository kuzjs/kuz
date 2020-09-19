// renderable.js

const fs = require("fs");
const log = require("../kuz-log/log");
const fsutils = require("../kuz-fs");



function Renderable () {
	//
}

const KZBaseObject = require("../base/baseobject").KZBaseObject;
Renderable.prototype = new KZBaseObject();

Renderable.prototype.typeName = "renderable";
Renderable.prototype.typeNamePlural = "renderables";
Renderable.prototype.codeLetter = "r";

Renderable.prototype.SetupRenderable = function (site, configFileObject, entry) {
	this.SetSite(site);
	this.SetConfig(configFileObject);
	this.entry = entry.trim();
	if (this.IsEntity()) {
		const MetaData = require("../kuz-metadata").MetaData;
		this.metaData = new MetaData(this.site, this.InputFilePath());
	}
}

module.exports = {
	Renderable: Renderable
};


