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



KuzLogger.prototype.DebugIsOn = function () {
	if (this.parent) {
		return this.parent.DebugIsOn();
	}
	return this.debug;
}

KuzLogger.prototype.DebugIsOff = function () {
	return !this.DebugIsOn();
}



KuzLogger.prototype.TurnOffDisk = function () {
	this.disk = false;
}

KuzLogger.prototype.TurnOnDisk = function () {
	this.disk = true;
}



KuzLogger.prototype.DiskIsOn = function () {
	if (this.parent) {
		return this.parent.DiskIsOn();
	}
	return this.disk;
}

KuzLogger.prototype.DiskIsOff = function () {
	return !this.DiskIsOn();
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


