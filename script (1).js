const grid = document.getElementById('sudoku-grid');
const message = document.getElementById('message');

// Create 9x9 grid
for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.classList.add('cell');

        // Allow only digits 1-9
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^1-9]/g, '');
        });

        // Add thick borders for 3x3 boxes
        if ((col + 1) % 3 === 0 && col !== 8) {
            input.classList.add('thick-right');
        }

        if ((row + 1) % 3 === 0 && row !== 8) {
            input.classList.add('thick-bottom');
        }

        grid.appendChild(input);
    }
}

const cells = [...document.querySelectorAll('.cell')];

function getBoard() {
    const board = [];

    for (let row = 0; row < 9; row++) {
        board[row] = [];

        for (let col = 0; col < 9; col++) {
            const value = cells[row * 9 + col].value;
            board[row][col] = value === '' ? 0 : Number(value);
        }
    }

    return board;
}

function setBoard(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            cells[row * 9 + col].value = board[row][col] || '';
        }
    }
}

// Check whether a number can be placed
function isSafe(board, row, col, num) {
    // Row check
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) {
            return false;
        }
    }

    // Column check
    for (let x = 0; x < 9; x++) {
        if (board[x][col] === num) {
            return false;
        }
    }

    // 3x3 box check
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }

    return true;
}

// Validate existing board first
function validateBoard() {
    const board = getBoard();

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const current = board[row][col];

            if (current !== 0) {
                board[row][col] = 0;

                if (!isSafe(board, row, col, current)) {
                    message.textContent = `Invalid Sudoku: duplicate ${current} found`;
                    message.className = 'message error';
                    return false;
                }

                board[row][col] = current;
            }
        }
    }

    message.textContent = 'Valid Sudoku';
    message.className = 'message success';
    return true;
}

// Backtracking solver
function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isSafe(board, row, col, num)) {
                        board[row][col] = num;

                        if (solveSudoku(board)) {
                            return true;
                        }

                        board[row][col] = 0;
                    }
                }

                return false;
            }
        }
    }

    return true;
}

function solve() {
    // Requirement: validate first, then solve
    if (!validateBoard()) {
        return;
    }

    const board = getBoard();

    if (solveSudoku(board)) {
        setBoard(board);
        message.textContent = 'Sudoku solved successfully!';
        message.className = 'message success';
    } else {
        message.textContent = 'No solution exists';
        message.className = 'message error';
    }
}

function clearBoard() {
    cells.forEach(cell => {
        cell.value = '';
    });

    message.textContent = '';
    message.className = 'message';
}

function loadSample() {
    const sample = [
        [5,3,0,0,7,0,0,0,0],
        [6,0,0,1,9,5,0,0,0],
        [0,9,8,0,0,0,0,6,0],
        [8,0,0,0,6,0,0,0,3],
        [4,0,0,8,0,3,0,0,1],
        [7,0,0,0,2,0,0,0,6],
        [0,6,0,0,0,0,2,8,0],
        [0,0,0,4,1,9,0,0,5],
        [0,0,0,0,8,0,0,7,9]
    ];

    setBoard(sample);
    message.textContent = 'Sample puzzle loaded';
    message.className = 'message success';
}

// Button events
document.getElementById('validateBtn').addEventListener('click', validateBoard);
document.getElementById('solveBtn').addEventListener('click', solve);
document.getElementById('clearBtn').addEventListener('click', clearBoard);
document.getElementById('sampleBtn').addEventListener('click', loadSample);
