// flagmanager.js

const KuzFlag = require("./flag").KuzFlag;



function KuzFlagManager (flagObjects) {
	this.flagObjects = flagObjects;
	this.setup();
	this.flagObjects = null;
}

KuzFlagManager.prototype.setup = function () {
	this.setupFlagArray();
	this.setupFlagsObject();
	this.setupCounters();
}

KuzFlagManager.prototype.setupFlagArray = function () {
	this.flags = [];
	this.args = [];
	for (let flagObject of this.flagObjects) {
		let flag = new KuzFlag(flagObject);
		this.flags.push(flag);
	}

	let argv = process.argv;
	let lastFlag = null;
	for (let i=2; i<argv.length; i++) {
		let argument = argv[i];
		if (argument.startsWith("--")) {
			let flagName = argument.slice(2).toLowerCase();
			for (let currentFlag of this.flags) {
				if (currentFlag.name == flagName) {
					currentFlag.count++;
					lastFlag = currentFlag;
				}
			}
		} else if (argument.startsWith("-")) {
			for (let j=1; j<argument.length; j++) {
				let letter = argument[j];
				for (let currentFlag of this.flags) {
					if (currentFlag.code == letter) {
						currentFlag.count++;
						lastFlag = currentFlag;
					}
				}
			}
		} else {
			if (lastFlag && lastFlag.hasParams()) {
				lastFlag.addParam(argument);
			} else {
				this.args.push(argument);
			}
		}
	}
}

KuzFlagManager.prototype.setupFlagsObject = function () {
	this.simpleFlags = {};
	for (let flag of this.flags) {
		this.simpleFlags[flag.name] = flag.isSet();
	}
}

KuzFlagManager.prototype.setupCounters = function () {
	this.counter = {
		independent: 0,
		major: 0,
		modifier: 0,
		touchmenot: 0,
		total: 0
	};

	for (let flag of this.flags) {
		if (flag.isSet()) {
			this.counter.total++;
			if (flag.independent) {
				this.counter.independent++;
			} else if (flag.major) {
				this.counter.major++;
			} else if (flag.modifier) {
				this.counter.modifier++;
			} else if (flag.touchmenot) {
				this.counter.touchmenot++;
			}
		}
	}
}

KuzFlagManager.prototype.getFlags = function () {
	return this.flags;
}

KuzFlagManager.prototype.getSimpleFlags = function () {
	return this.simpleFlags;
}

KuzFlagManager.prototype.getCounter = function () {
	return this.counter;
}

KuzFlagManager.prototype.getArgs = function () {
	return this.args;
}



module.exports = {
	KuzFlagManager: KuzFlagManager
};


