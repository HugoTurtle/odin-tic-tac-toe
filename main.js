const Gameboard = (function() {
    const rows = 3;
    const columns = 3;
    const board = [];

    //3 x 3 game board
    for(let i = 0; i < rows; i++) {
        board[i] = [];
        for(let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const placeToken = (row, col, player) => {
        // Check if the specified cell is empty (value 0)
        if (board[row][col].getValue() !== 0) {
            console.log("Invalid move: Cell is already occupied.");
            return;
        }

        board[row][col].addToken(player);
    };

    const printBoard = () => {
        const boardWithValues = board.map(row => row.map(cell => cell.getValue()));
        console.log(boardWithValues);
    };

    return {getBoard, placeToken, printBoard};
})();

function Cell() {
    let value = 0;

    const addToken = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {addToken, getValue};
}