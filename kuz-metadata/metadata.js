// metadata.js



const fsutils = require("../kuz-fs");

const separators = [];

function KuzMetaData (kuz, path) {
	this.kuz = kuz;
	this.path = path;
	this.log = this.kuz.log.getChild(this.path);
	this.Setup();
}

const KZBaseObject = require("../base/baseobject").KZBaseObject;
KuzMetaData.prototype = new KZBaseObject();

KuzMetaData.prototype.Setup = function () {
	this.properties = [];
	this.sections = {};
	if (this.Exists()) {
		const Nss = require("../kuz-nss/nss").Nss;
		let metaNss = new Nss(this.path);
		let headerLines = metaNss.GetMetaLines();

		const KuzSections = require("../kuz-sections").KuzSections;
		let kuzSections = new KuzSections(headerLines);

		const Property = require("./property").Property;
		for (let section of kuzSections.sections) {
			this.sections[section.name] = {};
			this.sections[section.name].mods = section.mods;
			for (let line of section.lines) {
				let property = new Property(line);
				if (property.IsValid()) {
					this.sections[section.name][property.name] = property.value;
				}
			}
		}

		for (let headerLine of headerLines) {
			let property = new Property(headerLine);
			if (property.IsValid()) {
				this.properties.push(property);
			}
		}
	} else {
		//
	}
}



KuzMetaData.prototype.Props = function () {
	if (this.sections.main) {
		return this.sections.main;
	}
	return {};
}



KuzMetaData.prototype.Code = function () {
	if (this.sections.code) {
		return this.sections.code;
	}
	return {};
}

KuzMetaData.prototype.Json = function () {
	if (this.sections.json) {
		return this.sections.json;
	}
	return {};
}

KuzMetaData.prototype.Kuz = function () {
	if (this.sections.kuz) {
		return this.sections.kuz;
	}
	return {};
}

KuzMetaData.prototype.Reqs = function () {
	let reqs = {};
	if (this.sections.reqs) {
		for (let key in this.sections.reqs) {
			try {
				let modName = this.sections.reqs[key];
				reqs[key] = require(modName);
			} catch (c) {
				reqs[key] = null;
			}
		}
	}
	return reqs;
}



KuzMetaData.prototype.Exists = function () {
	if (fsutils.IsFile(this.path)) {
		return true;
	}
	return false;
}

KuzMetaData.prototype.GetValue = function (propertyName) {
	for (let property of this.properties) {
		if (propertyName == property.Name()) {
			return {
				found: true,
				value: property.Value()
			}
		}
	}

	return {
		found: false
	};
}

KuzMetaData.prototype.NumberOfProperties = function () {
	return this.properties.length;
}

KuzMetaData.prototype.PrintPropertyTable = function () {
	if (this.properties.length > 0) {
		let table = this.properties[0].GetTable();
		for (let property of this.properties) {
			table.Add(property);
		}
		table.Print();
	}
}

module.exports = {
	KuzMetaData: KuzMetaData
};


