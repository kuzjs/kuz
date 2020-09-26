// jsfile.js



function ThemeJS (theme, data) {
	this.setupProto(theme, data);
}

const ProtoFile = require("./protofile");
ThemeJS.prototype = new ProtoFile("js");
ThemeJS.prototype.typeName = "JavaScript";

ThemeJS.prototype.isJsFile = function () {
	return true;
}



module.exports = ThemeJS;


