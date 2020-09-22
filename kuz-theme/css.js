// cssfile.js



function ThemeCSS (theme, data) {
	this.setupProto(theme, data);
}

const ProtoFile = require("./protofile").ProtoFile;
ThemeCSS.prototype = new ProtoFile("css");
ThemeCSS.prototype.typeName = "CSS";

ThemeCSS.prototype.isCssFile = function () {
	return true;
}



module.exports = {
	ThemeCSS: ThemeCSS
};


