// table.js



function Table () {
	this.Reset();
}

Table.prototype.Reset = function () {
	this.columnObjects = [];
	this.rowData = [];
	this.firstColumn = {
		name: "Id",
		length: 5
	};
	return this;
}

Table.prototype.Clear = function () {
	this.rowData = [];
	return this;
}

Table.prototype.AddColumn = function (columnName, columnLength) {
	if (columnLength === undefined || columnLength < columnName.length) {
		columnLength = columnName.length;
	}

	this.columnObjects.push({
		name: columnName,
		length: columnLength
	});
	return this;
}

Table.prototype.Add = function (obj) {
	let row = obj["Row"]();
	this.AddRow(row);
	return this;
}

Table.prototype.AddArray = function (arr) {
	for (let index in arr) {
		let row = arr[index]["Row"]();
		this.AddRow(row);
	}
	return this;
}

Table.prototype.AddRow = function (row) {
	for (let index in row) {
		if (row[index].length > this.columnObjects[index].length) {
			this.columnObjects[index].length = row[index].length;
		}
	}
	this.rowData.push(row);
	return this;
}

Table.prototype.GetColumnLength = function (columnIndex) {
	return this.columnObjects[columnIndex].length;
}

Table.prototype.GetRowLength = function (columnIndex) {
	let rowLength = 2 + this.firstColumn.length + 3;
	for (let columnIndex in this.columnObjects) {
		let columnObject = this.columnObjects[columnIndex];
		rowLength += columnObject.length + 3;
	}

	return (rowLength-1);
}

Table.prototype.GetRowSeparator = function () {
	let rowLength = this.GetRowLength();
	let rowSeparator = "";
	rowSeparator = rowSeparator.padStart(rowLength, "-");
	return rowSeparator;
}

Table.prototype.GetRowString = function (rowId, row) {
	let rowString = "| " + rowId.padStart(this.firstColumn.length) + " | ";
	for (let j in row) {
		let columnLength = this.GetColumnLength(j);
		rowString += row[j].padStart(columnLength) + " | ";
	}
	return rowString;
}

Table.prototype.GetHeaderRowString = function () {
	let row = [];
	let rowId = this.firstColumn.name;
	for (let i=0; i<this.columnObjects.length; i++) {
		row.push(this.columnObjects[i].name);
	}
	return this.GetRowString(rowId, row);
}

Table.prototype.GetDataRowString = function (rowIndex) {
	let row = this.rowData[rowIndex];
	let rowId = (rowIndex+1) + "";
	return this.GetRowString(rowId, row);
}

Table.prototype.PrintRow = function (rowIndex) {
	let rowString = this.GetDataRowString(rowIndex);
	console.log(rowString);
}

Table.prototype.Print = function () {
	let rowSeparator = this.GetRowSeparator();
	let headerRowString = this.GetHeaderRowString();

	console.log(rowSeparator);
	console.log(headerRowString);
	console.log(rowSeparator);
	for (let i=0; i<this.rowData.length; i++) {
		this.PrintRow(i);
	}
	console.log(rowSeparator);
	return this;
}



module.exports = {
	Table: Table
};


