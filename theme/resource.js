// resfile.js



function ThemeResource (theme, data) {
	this.SetupProto(theme, data);
}

const ProtoFile = require("./protofile").ProtoFile;
ThemeResource.prototype = new ProtoFile("res");
ThemeResource.prototype.typeName = "Resource";

ThemeResource.prototype.IsResFile = function () {
	return true;
}



module.exports = {
	ThemeResource: ThemeResource
};


