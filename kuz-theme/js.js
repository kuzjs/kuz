// jsfile.js



function ThemeJS (theme, data) {
	this.SetupProto(theme, data);
}

const ProtoFile = require("./protofile").ProtoFile;
ThemeJS.prototype = new ProtoFile("js");
ThemeJS.prototype.typeName = "JavaScript";

ThemeJS.prototype.IsJsFile = function () {
	return true;
}



module.exports = {
	ThemeJS: ThemeJS
};


