// metadata.js



const fsutils = require("../utils/fsutils");

function MetaData (site, path) {
	this.site = site;
	this.path = path;
	this.Setup();
}

const KZBaseObject = require("../base/baseobject").KZBaseObject;
MetaData.prototype = new KZBaseObject();

MetaData.prototype.Setup = function () {
	this.properties = [];
	if (this.Exists()) {
		const Nss = require("../utils/nss").Nss;
		let metaNss = new Nss(this.path);
		let headerLines = metaNss.GetHeaderLines();
		const Property = require("./property").Property;
		for (let headerLine of headerLines) {
			let property = new Property(headerLine);
			this.properties.push(property);
		}
	} else {
		//
	}
}

MetaData.prototype.Props = function () {
	let props = {};
	for (let property of this.properties) {
		props[property.name] = property.value;
	}
	return props;
}

MetaData.prototype.Exists = function () {
	if (fsutils.IsFile(this.path)) {
		return true;
	}
	return false;
}

MetaData.prototype.GetValue = function (propertyName) {
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

MetaData.prototype.NumberOfProperties = function () {
	return this.properties.length;
}

module.exports = {
	MetaData: MetaData
};


