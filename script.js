document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('sudoku-grid');

    // Create a 9x9 Sudoku-Grid
    for (let row = 0; row < 9; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < 9; col++) {
            const td = document.createElement('td');
            // Füge Klassen für dickere Linien hinzu, um die 3x3 Blöcke zu betonen
            if (col === 2 || col === 5) {
                td.classList.add('thick-right');
            }
            if (row === 2 || row === 5) {
                td.classList.add('thick-bottom');
            }
            tr.appendChild(td);
        }
        grid.appendChild(tr);
    }

    const cells = grid.querySelectorAll('td');
    cells[0].textContent = '5';
});
