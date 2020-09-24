// resfile.js



function ThemeResource (theme, data) {
	this.setupProto(theme, data);
}

const ProtoFile = require("./protofile").ProtoFile;
ThemeResource.prototype = new ProtoFile("resources");
ThemeResource.prototype.typeName = "Resource";

ThemeResource.prototype.isResFile = function () {
	return true;
}



module.exports = ThemeResource;


