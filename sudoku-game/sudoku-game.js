let cells = [];
let invalidCells = [];

document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('sudoku-grid');

    // Create a 9x9 Sudoku-Grid
    for (let row = 0; row < 9; row++) {
        const tr = document.createElement('tr');
        const rowCells = [];

        for (let col = 0; col < 9; col++) {
            const td = document.createElement('td');
            const input = document.createElement('input');
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

function checkGrid() {
    const invalidParagraph = document.getElementById('gridInvalid');
    const validParagraph = document.getElementById('gridValid');
    hideParagraphs();
    invalidCells = [];
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cellIsValid = checkCellValidity(cells, row, col);
            if (!cellIsValid || cells[row][col].value == '') {
                invalidCells.push({row, col});
            }
        }
    }
    if (invalidCells.length > 0) {
        invalidParagraph.style.display = 'block';
    } else {
        validParagraph.style.display = 'block';
        
    }
}

function hideParagraphs() {
    const invalidParagraph = document.getElementById('gridInvalid');
    const validParagraph = document.getElementById('gridValid');
    invalidParagraph.style.display = 'none';
    validParagraph.style.display = 'none';
}

function newGame(min, max) {
    console.log("new game")
    hideParagraphs();
    cells.forEach(row => {
        row.forEach(cell => {
            cell.value = '';
            cell.removeAttribute('readonly');
            cell.parentElement.style.backgroundColor = null;
        })
    })
    let cellsToFill = getRandomInt(min, max);
    while (cellsToFill > 0) {
        const row = getRandomInt(0, 8);
        const col = getRandomInt(0, 8);
        const cellValue = cells[row][col].value;
        if (cellValue == '') {
            const newValue = getRandomInt(1, 9);
            cells[row][col].value = newValue;
            const cellIsValid = checkCellValidity(cells, row, col);
            if (cellIsValid) {
                cells[row][col].setAttribute('readonly', true);
                cells[row][col].parentElement.style.backgroundColor = '#BBBBBB';
                cellsToFill -= 1;
            } else {
                cells[row][col].value = '';
            }
        }
    }
    let grid = [];
    for (let row = 0; row < 9; row++) {
        let rowVals = []
        for (let col = 0; col < 9; col++) {
            rowVals.push(cells[row][col].value);
        }
        grid.push(rowVals);
    }
    const gameIsSolvable = solve(grid);
    console.log(gameIsSolvable)
    if (!gameIsSolvable) {
        newGame(min, max);
    }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

function solve(grid) {
    console.log(grid)
    for (let currentRow = 0; currentRow < 9; currentRow++) {
        for (let currentCol = 0; currentCol < 9; currentCol++) {
            const cellData = grid[currentRow][currentCol];
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
                        grid[currentRow][currentCol] = nextNumberToTry;
                        // Recursively attempt to solve the rest of the puzzle
                        if (!solve(grid)) {
                            // If the recursive solve fails, reset the cell value to 0
                            grid[currentRow][currentCol] = '';
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
    console.log(numberToTry)
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
