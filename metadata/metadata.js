// metadata.js



const fsutils = require("../utils/fsutils");

const separators = [];
const commentStarters = [
	"#",
	"//",
	"!",
	"comment",
	"="
];

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
		const Nss = require("../kznss/nss").Nss;
		let metaNss = new Nss(this.path);
		let headerLines = metaNss.GetEvenLines();
		const Property = require("./property").Property;
		for (let headerLine of headerLines) {
			let comment = false;
			for (let commentStarter of commentStarters) {
				if (headerLine.startsWith(commentStarter)) {
					comment = true;
				}
			}
			if (!comment) {
				let property = new Property(headerLine);
				if (property.IsValid()) {
					this.properties.push(property);
				}
			}
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

MetaData.prototype.PrintPropertyTable = function () {
	if (this.properties.length > 0) {
		let table = this.properties[0].GetTable();
		for (let property of this.properties) {
			table.Add(property);
		}
		table.Print();
	}
}

module.exports = {
	MetaData: MetaData
};


