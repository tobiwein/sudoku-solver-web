let cells = [];

document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('sudoku-grid');

    // Create a 9x9 Sudoku-Grid
    for (let row = 0; row < 9; row++) {
        const tr = document.createElement('tr');
        const rowCells = [];

        for (let col = 0; col < 9; col++) {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.setAttribute('id', `r${row}c${col}`);
            input.setAttribute('type', 'text');
            input.setAttribute('maxlength', '1');
            input.setAttribute('size', '1');

            input.addEventListener('input', function(e) {
                const newValue = e.target.value;
                if (newValue === '') return; // Allow empty input
                const num = parseInt(newValue, 10);
                if (isNaN(num) || num < 1 || num > 9) {
                    e.target.value = ''; // Clear the input if it's not a valid number
                }
            });

            td.appendChild(input);

            // Add classes for thicker lines to emphasize the 3x3 blocks
            if (col === 2 || col === 5) {
                td.classList.add('thick-right');
            }
            if (row === 2 || row === 5) {
                td.classList.add('thick-bottom');
            }

            tr.appendChild(td);
            rowCells.push(input);
        }

        grid.appendChild(tr);
        cells.push(rowCells);
    }
});

function clearGrid() {
    cells.forEach(row => {
        row.forEach(cell => {
            cell.value = '';
            cell.parentElement.style.backgroundColor = null;
            cell.removeAttribute('readonly');
        });
    });

    const checkButton = document.getElementById('check-button');
    checkButton.removeAttribute('disabled');
    const solveButton = document.getElementById('solve-button');
    solveButton.setAttribute('disabled', true);
}

function checkGrid() {
    let everyCellIsValid = true;
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cellValue = cells[row][col].value;
            if (!cellValue.isNaN) {
                const cellIsValid = checkCellValidity(cells, row, col);
                const parentElement = cells[row][col].parentElement;
                if (!cellIsValid) {
                    parentElement.style.backgroundColor = 'red';
                    everyCellIsValid = false;
                } else {
                    parentElement.style.backgroundColor = null;
                }
            }
        }
    }

    if (everyCellIsValid) {
        cells.forEach(row => {
            row.forEach(cell => {
                const cellValue = cell.value;
                if (cellValue != '') {
                    cell.parentElement.style.backgroundColor = 'grey';
                }
            });
        });

        const solveButton = document.getElementById('solve-button');
        solveButton.removeAttribute('disabled');
    }
}

function solveGrid() {
    const checkButton = document.getElementById('check-button');
    checkButton.setAttribute('disabled', true);
    const solveButton = document.getElementById('solve-button');
    solveButton.setAttribute('disabled', true);
    cells.forEach(row => {
        row.forEach(cell => {
            cell.setAttribute('readonly', true);
        });
    });

    solve(cells);
}

function solve(grid) {
    for (let currentRow = 0; currentRow < 9; currentRow++) {
        for (let currentCol = 0; currentCol < 9; currentCol++) {
            const cellData = grid[currentRow][currentCol].value;
            if (cellData == '') {
                // Get the next number to try for the current cell, starting from 1
                let nextNumberToTry = getNextNumberToTry(grid, currentRow, currentCol, 1);
                let numberIsValid = false;
                while (!numberIsValid) {
                    // If no valid number is found, backtrack
                    if (nextNumberToTry == -1) {
                        return false;
                    } else {
                        // Set the current cell to the next number to try
                        grid[currentRow][currentCol].value = nextNumberToTry;
                        // Recursively attempt to solve the rest of the puzzle
                        if (!solve(grid)) {
                            // If the recursive solve fails, reset the cell value to 0
                            grid[currentRow][currentCol].value = '';
                            // Get the next number to try, incrementing the last tried number
                            nextNumberToTry = getNextNumberToTry(grid, currentRow, currentCol, nextNumberToTry + 1);
                        } else {
                            // If the recursive solve succeeds, mark the number as valid
                            numberIsValid = true;
                        }
                    }
                }
            }
        }
    }
    // Return true if the entire puzzle is solved successfully
    return true;
}

function getNextNumberToTry(grid, row, col, numberToTry) {
    for (let nextNumber = numberToTry; nextNumber <= 9; nextNumber++) {
        grid[row][col].value = nextNumber;
        const cellIsValid = checkCellValidity(grid, row, col);
        grid[row][col].value = '';
        if (cellIsValid) {
            return nextNumber;
        }
    }
    return -1;
}

function checkCellValidity(grid, row, col) {
    const rowValidity = checkRowValidity(grid, row, col);
    const columnValidity = checkColumnValidity(grid, col, row);
    const segmentValidity = checkSegmentValidity(grid, row, col);
    return rowValidity && columnValidity && segmentValidity;
}

function checkRowValidity(grid, row, index) {
    const rowData = getGridRowData(grid, row);
    return checkDataValidity(rowData, index);
}

function checkColumnValidity(grid, col, index) {
    const colData = getGridColumnData(grid, col);
    return checkDataValidity(colData, index);
}

function checkSegmentValidity(grid, row, col) {
    const seg = getSegmentFromRowAndColumn(row, col);
    const segData = getGridSegmentData(grid, seg);
    const index = ((row % 3) * 3) + (col % 3);
    return checkDataValidity(segData, index);
}

function checkDataValidity(data, index) {
    if (data[index] == 0) {
        return true;
    }
    for (let i = 0; i < data.length; i++) {
        if (i != index && data[i] == data[index]) {
            return false;
        }
    }
    return true;
}

function getGridRowData(grid, row) {
    let rowData = [];
    for (let col = 0; col < 9; col++) {
        rowData[col] = grid[row][col].value;
    }
    return rowData;
}

function getGridColumnData(grid, col) {
    let colData = [];
    for (let row = 0; row < 9; row++) {
        colData[row] = grid[row][col].value;
    }
    return colData;
}

function getGridSegmentData(grid, seg) {
    let segData = [];
    let segDataIndex = 0;
    const startRow = Math.floor(seg / 3) * 3;
    const startCol = Math.floor(seg % 3) * 3;
    for (let row = startRow; row < startRow + 3; row++) {
        for (let col = startCol; col < startCol + 3; col++) {
            segData[segDataIndex++] = grid[row][col].value;
        }
    }
    return segData;
}

function getSegmentFromRowAndColumn(row, col) {
    const quadrantRow = Math.floor(row / 3);
    const quadrantCol = Math.floor(col / 3);
    return quadrantRow * 3 + quadrantCol;
}
