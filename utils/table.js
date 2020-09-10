// table.js



function Table () {
	this.columnObjects = [];
	this.rowData = [];
}

Table.prototype.AddColumn = function (columnName, columnLength) {
	if (columnLength === undefined) {
		columnLength = columnName.length;
	}

	this.columnNames.push({
		name: columnName,
		length: columnLength
	});
}

Table.prototype.Add = function (obj) {
	let row = obj["Row"]();
	this.AddRow(row);
}

Table.prototype.AddRow = function (row) {
	this.rowData.push(row);
}

Table.prototype.Print = function (row) {
	for (let index in this.rowData) {
		let row = this.rowData[index];
		let rowString = index + "";
		for (let j in row) {
			rowString += " | " + row[j];
		}
		console.log(rowString);
	}
}



module.exports = {
	Table: Table
};


