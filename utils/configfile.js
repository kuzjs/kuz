// configfile.js



const MetaData = require("../metadata/metadata").MetaData;

const Nss = require("./nss").Nss;
const fsutils = require("./fsutils");

function ConfigFile(site, dirpath) {
	this.site = site;
	this.dirpath = dirpath;

	if (this.dirpath === undefined) {
		this.configDirpath = site.GetInputDirectory();
	} else {
		this.configDirpath = site.GetInputDirectory() + "/" + dirpath;
	}

	let configFileName = site.GetNestedValueFromCascade("filenames", "config");
	this.configFilePath = this.configDirpath + "/" + configFileName;
	this.root = null;
	this.metaData = new MetaData(this.site, this.configFilePath);
}

ConfigFile.prototype.SetParent = function (configFileParentObject) {
	if (configFileParentObject) {
		this.parent = configFileParentObject;
	} else {
		this.parent = null;
	}
}

ConfigFile.prototype.Exists = function () {
	if (fsutils.IsFile(this.configFilePath)) {
		return true;
	}
	return false;
}

ConfigFile.prototype.GetEntries = function () {
	this.nss = new Nss(this.configFilePath);
	return this.nss.GetBodyLines();
}

ConfigFile.prototype.GetPages = function () {
	return [];
}

ConfigFile.prototype.GetStringValue = function (propertyName) {
	return this.metaData.GetValue(propertyName);
}

module.exports = {
	ConfigFile: ConfigFile
};


