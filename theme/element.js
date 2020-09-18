// element.js

const common = require("../base/common");
const defaultText = common.defaultText;



function ThemeElement () {
	//
}

const KZBaseObject = require("../base/baseobject").KZBaseObject;
ThemeElement.prototype = new KZBaseObject();
ThemeElement.prototype.typeName = "ThemeElement";

ThemeElement.prototype.SetupThemeElement = function (theme, data) {
	this.theme = theme;
	this.data = data;
}

ThemeElement.prototype.Name = function () {
	return this.data.name;
}

ThemeElement.prototype.Path = function () {
	return this.data.path;
}

ThemeElement.prototype.Description = function () {
	return this.data.description ? this.data.description : defaultText.description;
}

ThemeElement.prototype.Documentation = function () {
	return this.data.documentation ? this.data.documentation : defaultText.documentation;
}

ThemeElement.prototype.Title = function () {
	return this.data.title ? this.data.title : defaultText.title;
}



module.exports = {
	ThemeElement: ThemeElement
};


