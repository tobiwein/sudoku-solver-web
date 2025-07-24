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
