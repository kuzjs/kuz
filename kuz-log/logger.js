// logger.js



function KuzLogger () {
	this.debug = false;
	this.disk = false;
	this.parent = null;
	this.children = [];
}



KuzLogger.prototype.TurnOffDebug = function () {
	this.debug = false;
}

KuzLogger.prototype.TurnOnDebug = function () {
	this.debug = true;
}



KuzLogger.prototype.TurnOffDisk = function () {
	this.disk = false;
}

KuzLogger.prototype.TurnOnDisk = function () {
	this.disk = true;
}



KuzLogger.prototype.SetParent = function (parent) {
	this.parent = parent;
}

KuzLogger.prototype.GetParent = function () {
	return this.parent;
}



KuzLogger.prototype.GetChild = function () {
	let child = new KuzLogger();

	child.SetParent(this);
	this.children.push(child);

	return child;
}



module.exports = {
	KuzLogger: KuzLogger
};


