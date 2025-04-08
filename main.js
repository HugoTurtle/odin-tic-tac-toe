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
            return false;
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

function GameController (
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    let board = Gameboard;

    const players = [
        {name: playerOneName, token: 1},
        {name: playerTwoName, token: 2}
    ]
    
    let activePlayers = players[0];
    let moveCounter = 0;

    const switchPlayerTurn = () => {
        activePlayers = activePlayers === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayers;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    const checkForTie = () => {
        const totalCells = board.getBoard().length * board.getBoard()[0].length;
        if(moveCounter === totalCells) {
            console.log("It's a tie!")
            return true;
        }
        return false;
    }

    const playRound = (row, col) => {
        console.log(
            `Placing ${getActivePlayer().name}'s turn onto board`
        )
        if(board.placeToken(row, col, getActivePlayer().token) === false) {
            switchPlayerTurn();
        }

        const gameBoard = board.getBoard();
        const currentPlayer = getActivePlayer().token;

        function isWinningLine(a, b, c) {
            return a === currentPlayer && b === currentPlayer && c === currentPlayer;
        }

        // Check Rows
        for (let i = 0; i < 3; i++) {
            if (isWinningLine(gameBoard[i][0].getValue(), gameBoard[i][1].getValue(), gameBoard[i][2].getValue())) {
                console.log(`${getActivePlayer().name} Wins!`);
                printNewRound();
                return;
            }
        }

        // Check Columns
        for (let j = 0; j < 3; j++) {
            if (isWinningLine(gameBoard[0][j].getValue(), gameBoard[1][j].getValue(), gameBoard[2][j].getValue())) {
                console.log(`${getActivePlayer().name} Wins!`);
                printNewRound();
                return;
            }
        }

        // Check Diagonals
        if (isWinningLine(gameBoard[0][0].getValue(), gameBoard[1][1].getValue(), gameBoard[2][2].getValue()) ||
            isWinningLine(gameBoard[0][2].getValue(), gameBoard[1][1].getValue(), gameBoard[2][0].getValue())) {
            console.log(`${getActivePlayer().name} Wins!`);
            printNewRound();
            return;
        }
        
        moveCounter++;

        if(checkForTie()) {
            return;
        } 

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return{playRound, getActivePlayer, getBoard: board.getBoard}
};

function ScreenController(game) {
    const gameInstance = game;
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const symbols = { 1: 'X', 2: 'O', 0: '' }

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayers = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayers.name}'s turn...`

        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');

                cellButton.dataset.row = rowIndex;
                cellButton.dataset.col = colIndex;

                cellButton.textContent = symbols[cell.getValue()];

                cellButton.addEventListener('click', handleCellClick)

                boardDiv.appendChild(cellButton);
            })
        })
    }

    function handleCellClick(e) {
        const row = e.target.dataset.row;
        const col = e.target.dataset.col;

        game.playRound(row, col);

        updateScreen();
    }

    updateScreen();
}

const GameMenu = (function () {
    const startMenu = document.getElementById('start-menu');
    const startButton = document.getElementById('start-button');

    const gameScreen = document.getElementById('game-screen');

    startButton.addEventListener('click', (e) => {
        e.preventDefault();
        startMenu.style.display = 'none';
        gameScreen.style.display = 'block';

        const form = document.querySelector('form'); 
        const playerOne = form.elements['player-one-name'].value;
        const playerTwo = form.elements['player-two-name'].value;


        ScreenController(GameController(playerOne, playerTwo));
    })
})();