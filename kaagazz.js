// kaagazz.js

const fsutils = require("./kuz-fs");
const jsonDirectory = require("./base/common").jsonDirectory;

const kaagazzJsonPath = fsutils.JoinPath(jsonDirectory, "kaagazz.json");
const flagsJsonPath = fsutils.JoinPath(jsonDirectory, "flags.json");
const blackadderJsonPath = fsutils.JoinPath(jsonDirectory, "blackadder.json");
const loremIpsumJsonPath = fsutils.JoinPath(jsonDirectory, "lorem-ipsum.json");



function KaagazzApp () {
	const JsonFile = require("./kuz-json").JsonFile;
	this.meta = new JsonFile(kaagazzJsonPath);
	this.flagsJson = new JsonFile(flagsJsonPath);
	this.blackadder = new JsonFile(blackadderJsonPath);
	this.ipsum = new JsonFile(loremIpsumJsonPath);

	this.SetupFlags();

	const KuzLogger = require("./kuz-log").KuzLogger;
	this.log = new KuzLogger(this.GetTitle());
	//this.log.TurnOnDisk();

	if (this.AllIsWell()) {
		const Site = require("./kuz-site").Site;
		this.site = new Site(this);
		this.SetupOperands();
	} else {
		this.site = null;
	}
}

KaagazzApp.prototype.Props = function () {
	return this.meta.json;
}

KaagazzApp.prototype.AllIsWell = function () {
	if (!this.meta.AllIsWell()) {
		return false;
	}

	if (!this.flagsJson.AllIsWell()) {
		return false;
	}

	if (!this.blackadder.AllIsWell()) {
		return false;
	}

	if (!this.ipsum.AllIsWell()) {
		return false;
	}

	if (!this.CheckForModule("pug")) {
		this.log.Red("Module NOT found: pug");
		return false;
	}

	if (!this.CheckForModule("express")) {
		this.log.Red("Module NOT found: express");
		return false;
	}

	return true;
}

KaagazzApp.prototype.SetupFlags = function () {
	const KuzFlagManager = require("./kuz-flag").KuzFlagManager;
	this.flagman = new KuzFlagManager(this.flagsJson.json.flags);

	this.flags = this.flagman.GetFlags();
	this.simpleFlags = this.flagman.GetSimpleFlags();
	this.args = this.flagman.GetArgs();
	this.numberOfFlags = this.flagman.GetCounter();

	if (this.simpleFlags.debug) {
		this.log.TurnOnDebug();
	}
}

KaagazzApp.prototype.SetupOperands = function () {
	this.operands = [];
	let flags = this.simpleFlags;

	let everything = this.site.EveryThing();
	if (flags.everything) {
		this.operands = everything;
		return;
	}

	for (let arg of this.args) {
		for (let somethimg of everything) {
			if (somethimg.CodeName() == arg) {
				this.operands.push(somethimg);
				break;
			}
		}
	}

	if (flags.all) {
		this.operands = this.operands.concat(this.site.Renderables());
	} else {
		if (flags.pages) {
			this.operands = this.operands.concat(this.site.Pages());
		}
		if (flags.entities) {
			this.operands = this.operands.concat(this.site.Entities());
		} else {
			if (flags.authors) {
				this.operands = this.operands.concat(this.site.Authors());
			}

			if (flags.categories) {
				this.operands = this.operands.concat(this.site.Categories());
			}

			if (flags.tags) {
				this.operands = this.operands.concat(this.site.Tags());
			}

			if (flags.collections) {
				this.operands = this.operands.concat(this.site.Collections());
			}
		}
	}

	if (flags.konfig) {
		this.operands = this.operands.concat(this.site.konfigs);
	}

	if (flags.themes) {
		this.operands = this.operands.concat(this.site.Themes());
	}

	if (flags.layouts) {
		this.operands = this.operands.concat(this.site.LayoutsArray());
	}

	if (flags.modules) {
		this.operands = this.operands.concat(this.site.ModulesArray());
	}

	if (flags.css) {
		this.operands = this.operands.concat(this.site.CSSArray());
	}

	if (flags.js) {
		this.operands = this.operands.concat(this.site.JsArray());
	}

	if (flags.res) {
		this.operands = this.operands.concat(this.site.ResourceArray());
	}
}

KaagazzApp.prototype.IsApp = function () {
	return true;
}

KaagazzApp.prototype.Blackadder = function () {
	return this.blackadder.json["quotes"];
}

KaagazzApp.prototype.LoremIpsum = function () {
	return this.ipsum.json["lorem-ipsum"];
}

KaagazzApp.prototype.HelloWorld = function () {
	this.log.Green("Hello, " + this + "!");
}

KaagazzApp.prototype.GetSiteJsonPath = function () {
	return this.meta.json.filenames.siteJson;
}

KaagazzApp.prototype.GetTitle = function () {
	return this.meta.json.meta.title;
}

KaagazzApp.prototype.GetDescription = function () {
	return this.meta.json.meta.description;
}

KaagazzApp.prototype.GetVersion = function () {
	return this.meta.json.meta.version;
}

KaagazzApp.prototype.toString = function () {
	return this.Title();
}

KaagazzApp.prototype.ShowSomeHelp = function () {
	let table = this.flags[0].GetTable();

	for (let flag of this.flags) {
		if (!flag.modifier) {
			table.Add(flag);
		}
	}

	table.Print();
}

KaagazzApp.prototype.ShowFullHelp = function () {
	let table = this.flags[0].GetTable();

	for (let flag of this.flags) {
		table.Add(flag);
	}

	table.Print();
}

KaagazzApp.prototype.ShowIndependentFlags = function () {
	let table = this.flags[0].GetTable();

	for (let flag of this.flags) {
		if (!flag.modifier && !flag.major) {
			table.Add(flag);
		}
	}

	table.Print();
}

KaagazzApp.prototype.ShowModifierFlags = function () {
	let table = this.flags[0].GetTable();

	for (let flag of this.flags) {
		if (flag.modifier) {
			table.Add(flag);
		}
	}

	table.Print();
}

KaagazzApp.prototype.ShowMajorFlags = function () {
	let table = this.flags[0].GetTable();

	for (let flag of this.flags) {
		if (flag.major) {
			table.Add(flag);
		}
	}

	table.Print();
}

KaagazzApp.prototype.ShowVersion = function () {
	const KZTable = require("./kuz-table").KZTable;
	let table = new KZTable();
	table.AddColumn("Key");
	table.AddColumn("Value");

	let meta = this.meta.json.meta;
	table.AddRow(["Title", this.Title()]);
	table.AddRow(["Version", this.GetVersion()]);
	table.AddRow(["Description", this.GetDescription()]);
	table.Print();
}

KaagazzApp.prototype.BenchMark = function () {
	const KuzStopWatch = require("./kuz-stopwatch").KuzStopWatch;
	const sw = new KuzStopWatch("KaagazzApp.BenchMark()");

	let rendered = 0;
	for (let index=0; index<20; index++) {
		for (let x of this.site.Renderables()) {
			x.ForcedUpdate();
			rendered++;
		}
	}

	let duration = sw.GetTimePassed();
	this.log.Red(`Rendered: ${rendered} pages in ${duration}ms.`);
}

KaagazzApp.prototype.Nietzsche = function () {
	this.log.Green("Kaagazz Nietzschean Experiment.");

	//this.site.pages[0].metaData.PrintPropertyTable();
	this.BenchMark();

	for (let x of this.operands) {
		this.log.Green(x.CodeAndName());
	}
}

KaagazzApp.prototype.ListThings = function (flags) {
	if (this.operands.length == 0) {
		this.log.Red("Zero operands to list.");
	} else {
		let table = this.operands[0].GetTable();
		for (let operand of this.operands) {
			table.Add(operand);
		}
		table.Print();
	}
}

KaagazzApp.prototype.Buildable = function () {
	for (let thing of this.operands) {
		thing.Buildable();
	}
}

KaagazzApp.prototype.Build = function () {
	for (let thing of this.operands) {
		thing.Build();
	}
}

KaagazzApp.prototype.Updatable = function () {
	for (let thing of this.operands) {
		thing.Updatable();
	}
}

KaagazzApp.prototype.Update = function () {
	for (let thing of this.operands) {
		thing.Update();
	}
}

KaagazzApp.prototype.ForcedUpdate = function () {
	for (let thing of this.operands) {
		thing.ForcedUpdate();
	}
}

KaagazzApp.prototype.Watch = function () {
	for (let thing of this.operands) {
		thing.Watch();
	}
}

KaagazzApp.prototype.CheckForModule = function (moduleName) {
	try {
		const mod = require(moduleName);
		return true;
	} catch {
		return false;
	}
}

KaagazzApp.prototype.FlagsAreOK = function () {
	if (this.numberOfFlags.touchmenot > 0) {
		if (this.numberOfFlags.total > 1) {
			this.log.Red("Touch-me-not flags cannot be combined.");
			return false;
		}
	}

	if (this.numberOfFlags.major > 1) {
		this.log.Red("Multiple major flags specified.");
		return false;
	}

	if (this.numberOfFlags.modifier > 0 && this.numberOfFlags.major == 0) {
		this.log.Red("Modifiers specified without a major flag.");
		return false;
	}

	return true;
}

KaagazzApp.prototype.Run = function () {
	if (this.site == null) {
		this.log.BadNews("Site not initialized.");
		return;
	}

	if (!this.FlagsAreOK()) {
		this.log.BadNews("Flags are not OK.");
		return;
	}

	let flags = this.simpleFlags;

	if (flags.help) {
		this.ShowSomeHelp();
	} else if (flags.helpfull) {
		this.ShowFullHelp();
	} else if (flags.independent) {
		this.ShowIndependentFlags();
	} else if (flags.modifier) {
		this.ShowModifierFlags();
	} else if (flags.version) {
		this.ShowVersion();
	} else if (flags.buildable) {
		this.Buildable();
	} else if (flags.build) {
		this.Build();
	} else if (flags.list) {
		this.ListThings(flags);
	} else if (flags.forced) {
		this.ForcedUpdate();
	} else if (flags.serve) {
		//
	} else if (flags.updatable) {
		this.Updatable();
	} else if (flags.update) {
		this.Update();
	} else if (flags.watch) {
		this.Watch();
	} else if (flags.nietzsche) {
		this.Nietzsche();
	} else {
		//
	}
}

const kaagazz = new KaagazzApp();


module.exports = {
	kaagazz: kaagazz
};


