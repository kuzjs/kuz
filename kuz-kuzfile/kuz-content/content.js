// content.js



function KuzContent (kuz, path) {
	this.kuz = kuz;
	this.path = path;
	this.log = this.kuz.log;
	this.setup();
}

KuzContent.prototype.setup = function () {
	this.sections = {};
}



module.exports = KuzContent;


