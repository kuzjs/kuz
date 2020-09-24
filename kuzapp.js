// kaagazz.js

const fsutils = require("./kuz-fs");
const jsonDirectory = require("./kuz-common").jsonDirectory;

const kaagazzJsonPath = fsutils.JoinPath(jsonDirectory, "kaagazz.json");
const flagsJsonPath = fsutils.JoinPath(jsonDirectory, "flags.json");
const blackadderJsonPath = fsutils.JoinPath(jsonDirectory, "blackadder.json");
const loremIpsumJsonPath = fsutils.JoinPath(jsonDirectory, "lorem-ipsum.json");



function KuzApp () {
	this.setupBenchmark();
	this.benchmark.recordMilestone("KuzApp.setupBenchmark() complete.");

	this.setupLog();
	this.benchmark.recordMilestone("KuzApp.setupLog() complete.");

	this.setupJsons();
	this.benchmark.recordMilestone("KuzApp.setupJsons() complete.");
	this.log.setName(this.getTitle());

	this.setupFlags();
	this.benchmark.recordMilestone("KuzApp.setupFlags() complete.");

	if (this.ok()) {
		const siteSetupAction = this.benchmark.getNewAction("Site setup");
		const KuzSite = require("./kuz-site").KuzSite;
		this.site = new KuzSite(this);
		this.benchmark.recordMilestone("new KuzSite() complete.");
		siteSetupAction.record();
		this.setupOperands();
	} else {
		this.site = null;
	}

	this.benchmark.recordMilestone("new KuzApp() complete.");
}



KuzApp.prototype.setupLog = function () {
	const KuzLogger = require("./kuz-logger");
	this.log = new KuzLogger("KuzApp");
	//this.log.TurnOnDisk();
}

KuzApp.prototype.setupBenchmark = function () {
	const KuzBenchmark = require("./kuz-benchmark").KuzBenchmark;
	this.benchmark = new KuzBenchmark("Kuz Benchmark");
	this.jsonParseActon = this.benchmark.getNewAction("JSON parsing");
	this.pageSetupActon = this.benchmark.getNewAction("Page setup");
	this.themeSetupActon = this.benchmark.getNewAction("Theme setup");
	this.layoutSetupActon = this.benchmark.getNewAction("Layout setup");
	this.pageRenderActon = this.benchmark.getNewAction("Page render");
}

KuzApp.prototype.setupJsons = function () {
	const KuzJson = require("./kuz-json").KuzJson;
	this.jsonParseActon.resetClock();
	this.meta = new KuzJson(kaagazzJsonPath);
	this.jsonParseActon.record();
	this.flagsJson = new KuzJson(flagsJsonPath);
	this.jsonParseActon.record();
	this.blackadder = new KuzJson(blackadderJsonPath);
	this.jsonParseActon.record();
	this.ipsum = new KuzJson(loremIpsumJsonPath);
	this.jsonParseActon.record();
}

KuzApp.prototype.setupFlags = function () {
	const KuzFlagManager = require("./kuz-flagmanager");
	this.flagman = new KuzFlagManager(this.flagsJson.json.flags);

	this.flags = this.flagman.getFlags();
	this.simpleFlags = this.flagman.getSimpleFlags();
	this.args = this.flagman.getArgs();
	this.numberOfFlags = this.flagman.getCounter();

	if (this.simpleFlags.debug) {
		this.log.turnDebugOn();
	}
}

KuzApp.prototype.setupOperands = function () {
	this.operands = [];
	let flags = this.simpleFlags;

	let everything = this.site.getEveryThing();
	if (flags.everything) {
		this.operands = everything;
		return;
	}

	for (let arg of this.args) {
		for (let somethimg of everything) {
			if (somethimg.getCodeName() === arg) {
				this.operands.push(somethimg);
				break;
			}
		}
	}

	if (flags.all) {
		this.operands = this.operands.concat(this.site.getRenderables());
	} else {
		if (flags.pages) {
			this.operands = this.operands.concat(this.site.getPages());
		}
		if (flags.entities) {
			this.operands = this.operands.concat(this.site.getEntities());
		} else {
			if (flags.authors) {
				this.operands = this.operands.concat(this.site.getAuthors());
			}

			if (flags.categories) {
				this.operands = this.operands.concat(this.site.getCategories());
			}

			if (flags.tags) {
				this.operands = this.operands.concat(this.site.getTags());
			}
		}
	}

	if (flags.konfig) {
		this.operands = this.operands.concat(this.site.konfigs);
	}

	if (flags.themes) {
		this.operands = this.operands.concat(this.site.getThemes());
	}

	if (flags.layouts) {
		this.operands = this.operands.concat(this.site.getLayouts());
	}

	if (flags.modules) {
		this.operands = this.operands.concat(this.site.getModules());
	}

	if (flags.css) {
		this.operands = this.operands.concat(this.site.getCssArray());
	}

	if (flags.js) {
		this.operands = this.operands.concat(this.site.getJsArray());
	}

	if (flags.res) {
		this.operands = this.operands.concat(this.site.getResources());
	}
}

KuzApp.prototype.ok = function () {
	if (!this.meta.ok()) {
		return false;
	}

	if (!this.flagsJson.ok()) {
		return false;
	}

	if (!this.blackadder.ok()) {
		return false;
	}

	if (!this.ipsum.ok()) {
		return false;
	}

	if (!this.checkForModule("pug")) {
		this.log.red("Module NOT found: pug");
		return false;
	}

	if (!this.checkForModule("express")) {
		this.log.red("Module NOT found: express");
		return false;
	}

	return true;
}



KuzApp.prototype.isApp = function () {
	return true;
}

KuzApp.prototype.getBlackadder = function () {
	return this.blackadder.json["quotes"];
}

KuzApp.prototype.getIpsum = function () {
	return this.ipsum.json["lorem-ipsum"];
}

KuzApp.prototype.getSiteJsonPath = function () {
	return this.meta.json.filenames.siteJson;
}

KuzApp.prototype.getProps = function () {
	return this.meta.json;
}

KuzApp.prototype.getTitle = function () {
	return this.meta.json.meta.title;
}

KuzApp.prototype.getDescription = function () {
	return this.meta.json.meta.description;
}

KuzApp.prototype.getVersion = function () {
	return this.meta.json.meta.version;
}

KuzApp.prototype.toString = function () {
	return this.getTitle();
}



KuzApp.prototype.showSomeHelp = function () {
	let table = this.flags[0].getTable();

	for (let flag of this.flags) {
		if (!flag.modifier) {
			table.add(flag);
		}
	}

	table.print();
}

KuzApp.prototype.showFullHelp = function () {
	let table = this.flags[0].getTable();

	for (let flag of this.flags) {
		table.add(flag);
	}

	table.print();
}

KuzApp.prototype.showIndependentFlags = function () {
	let table = this.flags[0].getTable();

	for (let flag of this.flags) {
		if (!flag.modifier && !flag.major) {
			table.add(flag);
		}
	}

	table.print();
}

KuzApp.prototype.showModifierFlags = function () {
	let table = this.flags[0].getTable();

	for (let flag of this.flags) {
		if (flag.modifier) {
			table.add(flag);
		}
	}

	table.print();
}

KuzApp.prototype.showMajorFlags = function () {
	let table = this.flags[0].getTable();

	for (let flag of this.flags) {
		if (flag.major) {
			table.add(flag);
		}
	}

	table.print();
}

KuzApp.prototype.showVersion = function () {
	const KuzTable = require("./kuz-table");
	let table = new KuzTable();
	table.addColumn("Key");
	table.addColumn("Value");

	let meta = this.meta.json.meta;
	table.addRow(["Title", this.getTitle()]);
	table.addRow(["Version", this.getVersion()]);
	table.addRow(["Description", this.getDescription()]);
	table.print();
}



KuzApp.prototype.kursesStuff = function () {
	const KursesInstance = require("./kuz-kurses").KursesInstance;
	const kurse = new KursesInstance(this.getTitle());
	kurse.run();
}

KuzApp.prototype.benchmarkStuff = function () {
	let rendered = 0;
	for (let index=0; index<20; index++) {
		for (let x of this.site.getRenderables()) {
			x.forcedUpdate();
			rendered++;
		}
	}

	this.benchmark.recordMilestone("KuzApp.benchmarkStuff() ends.");
	this.benchmark.print();
}

KuzApp.prototype.nietzsche = function () {
	this.log.green("Kaagazz Nietzschean Experiment.");

	//this.site.pages[0].metaData.printPropertyTable();
	this.benchmarkStuff();

	for (let x of this.operands) {
		this.log.green(x.getCodeAndName());
	}
}



KuzApp.prototype.listStuff = function (flags) {
	if (this.operands.length === 0) {
		this.log.red("Zero operands to list.");
	} else {
		let table = this.operands[0].getTable();
		for (let operand of this.operands) {
			table.add(operand);
		}
		table.print();
	}
}

KuzApp.prototype.buildableStuff = function () {
	for (let thing of this.operands) {
		thing.buildable();
	}
}

KuzApp.prototype.buildStuff = function () {
	for (let thing of this.operands) {
		thing.build();
	}
}

KuzApp.prototype.updatableStuff = function () {
	for (let thing of this.operands) {
		thing.updatable();
	}
}

KuzApp.prototype.updateStuff = function () {
	for (let thing of this.operands) {
		thing.update();
	}
}

KuzApp.prototype.forcedUpdateStuff = function () {
	for (let thing of this.operands) {
		thing.forcedUpdate();
	}
}

KuzApp.prototype.serveStuff = function () {
	this.log.green("Serving on X.X.X.X:X ...");
}

KuzApp.prototype.watchStuff = function () {
	for (let thing of this.operands) {
		thing.watch();
	}
}



KuzApp.prototype.checkForModule = function (moduleName) {
	try {
		const mod = require(moduleName);
		return true;
	} catch {
		return false;
	}
}

KuzApp.prototype.flagsAreOK = function () {
	if (this.numberOfFlags.touchmenot > 0) {
		if (this.numberOfFlags.total > 1) {
			this.log.red("Touch-me-not flags cannot be combined.");
			return false;
		}
	}

	if (this.numberOfFlags.major > 1) {
		this.log.red("Multiple major flags specified.");
		return false;
	}

	if (this.numberOfFlags.modifier > 0 && this.numberOfFlags.major === 0) {
		this.log.red("Modifiers specified without a major flag.");
		return false;
	}

	return true;
}



KuzApp.prototype.run = function () {
	if (this.site === null) {
		this.log.badNews("Site not initialized.");
		return;
	}

	if (!this.flagsAreOK()) {
		this.log.badNews("Flags are not OK.");
		return;
	}

	let flags = this.simpleFlags;

	if (flags.help) {
		this.showSomeHelp();
	} else if (flags.helpfull) {
		this.showFullHelp();
	} else if (flags.independent) {
		this.showIndependentFlags();
	} else if (flags.modifier) {
		this.showModifierFlags();
	} else if (flags.version) {
		this.showVersion();
	} else if (flags.buildable) {
		this.buildableStuff();
	} else if (flags.build) {
		this.buildStuff();
	} else if (flags.list) {
		this.listStuff(flags);
	} else if (flags.forced) {
		this.forcedUpdateStuff();
	} else if (flags.serve) {
		this.serveStuff();
	} else if (flags.updatable) {
		this.updatableStuff();
	} else if (flags.update) {
		this.updateStuff();
	} else if (flags.watch) {
		this.watchStuff();
	} else if (flags.nietzsche) {
		this.nietzsche();
	} else if (flags.kurses) {
		this.kursesStuff();
	} else {
		//
	}
}



module.exports = KuzApp;


