// table.js



function GetCellString (cellString) {
	return cellString ? cellString + "" : "-";
}

function KZTable () {
	this.Reset();
}

KZTable.prototype.Reset = function () {
	this.columnObjects = [];
	this.paddingLength = 1;
	this.rowData = [];
	this.showIndex = true;
	this.firstColumn = {
		name: "Id",
		length: 5
	};
	return this;
}

KZTable.prototype.ShowIndex = function () {
	this.showIndex = true;
	return this;
}

KZTable.prototype.HideIndex = function () {
	this.showIndex = false;
	return this;
}

KZTable.prototype.Clear = function () {
	this.rowData = [];
	return this;
}

KZTable.prototype.SetPadding = function (paddingLength) {
	this.paddingLength = paddingLength;
	return this;
}

KZTable.prototype.Padding = function () {
	let padding = "";
	return padding.padStart(this.paddingLength);
}

KZTable.prototype.Separator = function () {
	return this.Padding() + "|" + this.Padding();
}

KZTable.prototype.AddColumn = function (columnName, columnLength) {
	if (columnLength === undefined || columnLength < columnName.length) {
		columnLength = columnName.length;
	}

	this.columnObjects.push({
		name: columnName,
		length: columnLength
	});
	return this;
}

KZTable.prototype.Add = function (obj) {
	let row = obj["Row"]();
	this.AddRow(row);
	return this;
}

KZTable.prototype.AddArray = function (arr) {
	for (let elem of arr) {
		let row = elem["Row"]();
		this.AddRow(row);
	}
	return this;
}

KZTable.prototype.AddRow = function (row) {
	for (let index in row) {
		let cell = row[index] + "";
		if (cell.length > this.columnObjects[index].length) {
			this.columnObjects[index].length = cell.length;
		}
	}
	this.rowData.push(row);
	return this;
}

KZTable.prototype.GetColumnLength = function (columnIndex) {
	return this.columnObjects[columnIndex].length;
}

KZTable.prototype.GetRowLength = function () {
	let rowLength = this.firstColumn.length + (2 * this.Separator().length) - this.paddingLength;
	for (let columnObject of this.columnObjects) {
		rowLength += columnObject.length + this.Separator().length;
	}

	rowLength -= this.paddingLength;
	return (rowLength);
}

KZTable.prototype.GetNDashes = function (n) {
	let dashes = "";
	return dashes.padStart(n, "-");
}

KZTable.prototype.GetColumnDashes = function (columnLength) {
	return this.GetNDashes(this.paddingLength + columnLength + this.paddingLength);
}

KZTable.prototype.GetRowSeparator = function () {
	let separator = "+";

	let rowSeparator;
	if (this.showIndex) {
		rowSeparator = separator + this.GetColumnDashes(this.firstColumn.length) + separator;
	} else {
		rowSeparator = separator;
	}

	for (let columnObject of this.columnObjects) {
		let columnLength = columnObject.length;
		rowSeparator += this.GetColumnDashes(columnLength) + separator;
	}
	return rowSeparator;
}

KZTable.prototype.GetRowString = function (rowId, row) {
	let rowString;
	if (this.showIndex) {
		rowString = "|" + this.Padding() + rowId.padStart(this.firstColumn.length) + this.Separator();
	} else {
		rowString = "|" + this.Padding();
	}

	for (let j in row) {
		let columnLength = this.GetColumnLength(j);
		let cell = GetCellString(row[j]);
		rowString += cell.padStart(columnLength) + this.Separator();
	}
	return rowString;
}

KZTable.prototype.GetHeaderRowString = function () {
	let row = [];
	let rowId = this.firstColumn.name;
	for (let i=0; i<this.columnObjects.length; i++) {
		row.push(this.columnObjects[i].name);
	}
	return this.GetRowString(rowId, row);
}

KZTable.prototype.GetDataRowString = function (rowIndex) {
	let row = this.rowData[rowIndex];
	let rowId = (rowIndex+1) + "";
	return this.GetRowString(rowId, row);
}

KZTable.prototype.PrintRow = function (rowIndex) {
	let rowString = this.GetDataRowString(rowIndex);
	console.log(rowString);
}

KZTable.prototype.Print = function () {
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
	KZTable: KZTable
};


