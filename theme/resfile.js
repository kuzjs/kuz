// resfile.js



function ResFile (theme, data) {
	this.SetupProto(theme, data);
}

const ProtoFile = require("./protofile").ProtoFile;
ResFile.prototype = new ProtoFile("res");
ResFile.prototype.typeName = "Resource";

ResFile.prototype.IsResFile = function () {
	return true;
}



module.exports = {
	ResFile: ResFile
};


