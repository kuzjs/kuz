// kaagazz.js

const log = require("./utils/log");
const JsonFile = require("./utils/jsonfile").JsonFile;
const KZTable = require("./utils/table").KZTable;
const KZFlag = require("./utils/flag").KZFlag;

const fsutils = require("./utils/fsutils");
const jsonDirectory = require("./base/common").jsonDirectory;

const kaagazzJsonPath = fsutils.JoinPath(jsonDirectory, "kaagazz.json");
const flagsJsonPath = fsutils.JoinPath(jsonDirectory, "flags.json");
const blackadderJsonPath = fsutils.JoinPath(jsonDirectory, "blackadder.json");
const loremIpsumJsonPath = fsutils.JoinPath(jsonDirectory, "lorem-ipsum.json");



function KaagazzApp () {
	this.meta = new JsonFile(kaagazzJsonPath);
	this.flagsJson = new JsonFile(flagsJsonPath);
	this.blackadder = new JsonFile(blackadderJsonPath);
	this.ipsum = new JsonFile(loremIpsumJsonPath);

	this.SetupFlags();

	if (this.AllIsWell()) {
		const Site = require("./site").Site;
		this.site = new Site(this);
		this.SetupOperands();
	} else {
		this.site = null;
	}
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
		log.Red("Module NOT found: pug");
		return false;
	}

	if (!this.CheckForModule("express")) {
		log.Red("Module NOT found: express");
		return false;
	}

	return true;
}

KaagazzApp.prototype.SetupFlags = function () {
	let flagObjects = this.flagsJson.json.flags;
	this.flags = [];
	this.args = [];

	for (let flagObject of flagObjects) {
		let flag = new KZFlag(flagObject);
		this.flags.push(flag);
	}

	let argv = process.argv;
	for (let i=2; i<argv.length; i++) {
		let argument = argv[i];
		if (argument.startsWith("--")) {
			let flagName = argument.slice(2).toLowerCase();
			for (let currentFlag of this.flags) {
				if (currentFlag.name == flagName) {
					currentFlag.count++;
				}
			}
		} else if (argument.startsWith("-")) {
			for (let j=1; j<argument.length; j++) {
				let letter = argument[j];
				for (let currentFlag of this.flags) {
					if (currentFlag.code == letter) {
						currentFlag.count++;
					}
				}
			}
		} else {
			this.args.push(argument);
		}
	}

	this.numberOfFlags = {
		independent: 0,
		major: 0,
		modifier: 0,
		total: 0
	};

	for (let flag of this.flags) {
		if (flag.IsSet()) {
			this.numberOfFlags.total++;
			if (flag.independent) {
				this.numberOfFlags.independent++;
			} else if (flag.major) {
				this.numberOfFlags.major++;
			} else if (flag.modifier) {
				this.numberOfFlags.modifier++;
			}
		}
	}

	this.simpleFlags = {};
	for (let flag of this.flags) {
		this.simpleFlags[flag.name] = flag.IsSet();
	}

	if (this.simpleFlags.debug) {
		log.DebugOn();
	}
}

KaagazzApp.prototype.SetupOperands = function () {
	this.operands = [];
	let flags = this.simpleFlags;

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

	if (flags.layouts) {
		this.operands = this.operands.concat(this.site.LayoutsArray());
	}

	if (flags.css) {
		this.operands = this.operands.concat(this.site.CssFilesArray());
	}

	if (flags.js) {
		this.operands = this.operands.concat(this.site.JsFilesArray());
	}

	if (flags.res) {
		this.operands = this.operands.concat(this.site.ResFilesArray());
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
	log.Green("Hello, " + this + "!");
}

KaagazzApp.prototype.GetSiteJsonPath = function () {
	return this.meta.json.filenames.siteJson;
}

KaagazzApp.prototype.Title = function () {
	return this.meta.json.meta.title;
}

KaagazzApp.prototype.Description = function () {
	return this.meta.json.meta.description;
}

KaagazzApp.prototype.Version = function () {
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
	let table = new KZTable();
	table.AddColumn("Key");
	table.AddColumn("Value");

	let meta = this.meta.json.meta;
	table.AddRow(["Title", this.Title()]);
	table.AddRow(["Version", this.Version()]);
	table.AddRow(["Description", this.Description()]);
	table.Print();
}

KaagazzApp.prototype.Experiment = function () {
	log.Green("Kaagazz experiment.");
	for (let x of this.operands) {
		log.Green(x.CodeName());
	}
}

KaagazzApp.prototype.ListThings = function (flags) {
	if (flags.all) {
		this.site.PrintAll();
	} else if (flags.entities) {
		this.site.PrintEntities();
	} else if (flags.authors) {
		this.site.PrintAuthors();
	} else if (flags.categories) {
		this.site.PrintCategories();
	} else if (flags.collections) {
		this.site.PrintCollections();
	} else if (flags.pages) {
		this.site.PrintPages();
	} else if (flags.tags) {
		this.site.PrintTags();
	} else if (flags.themes) {
		this.site.PrintThemes();
	} else if (flags.layouts) {
		this.site.PrintLayouts();
	} else if (flags.css) {
		this.site.PrintCssFiles();
	} else if (flags.js) {
		this.site.PrintJsFiles();
	} else if (flags.res) {
		this.site.PrintResFiles();
	} else if (flags.config) {
		this.site.PrintConfigFiles();
	} else {
		//
	}
}

KaagazzApp.prototype.Buildable = function () {
	for (let thing of this.operands) {
		thing.Buildable();
	}
}

KaagazzApp.prototype.Build = function () {
	for (let thing of this.operands) {
		thing.Update();
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
	if (this.numberOfFlags.independent > 0) {
		if (this.numberOfFlags.total > 1) {
			log.Red("Independent flags cannot be combined.");
			return false;
		}
	}

	if (this.numberOfFlags.major > 1) {
		log.Red("Multiple major flags specified.");
		return false;
	}

	if (this.numberOfFlags.modifier > 0 && this.numberOfFlags.major == 0) {
		log.Red("Modifiers specified without a major flag.");
		return false;
	}

	return true;
}

KaagazzApp.prototype.Run = function () {
	if (this.site == null) {
		log.BadNews("Site not initialized.");
		return;
	}

	if (!this.FlagsAreOK()) {
		log.BadNews("Flags are not OK.");
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
	} else if (flags.major) {
		this.ShowMajorFlags();
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
		this.Updateable();
	} else if (flags.update) {
		this.Update();
	} else if (flags.watch) {
		this.Watch();
	} else if (flags.experiment) {
		this.Experiment();
	} else {
		//
	}
}

const kaagazz = new KaagazzApp();


module.exports = {
	kaagazz: kaagazz,
	log: log
};


