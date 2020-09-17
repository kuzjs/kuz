// cssfile.js



function CssFile (theme, data) {
	this.SetupProto(theme, data);
}

const ProtoFile = require("./protofile").ProtoFile;
CssFile.prototype = new ProtoFile("css");
CssFile.prototype.typeName = "CSS";

CssFile.prototype.IsCssFile = function () {
	return true;
}



module.exports = {
	CssFile: CssFile
};


