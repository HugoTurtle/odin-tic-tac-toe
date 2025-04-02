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

const GameController = (function(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    let board = Gameboard;

    const players = [
        {name: playerOneName, token: 1},
        {name: playerTwoName, token: 2}
    ]
    
    let activePlayers = players[0];

    const switchPlayerTurn = () => {
        activePlayers = activePlayers === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayers;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    const playRound = (row, col) => {
        console.log(
            `Placing ${getActivePlayer().name}'s turn onto board`
        )
        board.placeToken(row, col, getActivePlayer().token);

        //Win condition
        let playerOnePoints = 0 
        let playerTwoPoints = 0;

        function updatePoints(value) {
            if (value === 1) {
                playerOnePoints++;
                playerTwoPoints = 0;
                if (playerOnePoints === 3) {
                    console.log("Player One Wins!");
                    printNewRound();
                    return true;
                }
            } else if (value === 2) {
                playerTwoPoints++;
                playerOnePoints = 0;
                if (playerTwoPoints === 3) {
                    console.log("Player Two Wins!");
                    printNewRound();
                    return true;
                }
            } else {
                playerOnePoints = 0;
                playerTwoPoints = 0;
            }
            return false;
        }
        const gameBoard = board.getBoard();

        //Row Traversal
        for(let i = 0; i < gameBoard.length; i++) {
            for(let j = 0; j < gameBoard[i].length; j++) {
                if(updatePoints(gameBoard[i][j].getValue())) {
                    return; //Exit early if a player wins;
                }
            }
        }
        //Column Traversal
        for(let j = 0; j < gameBoard[0].length; j++) {
            for(let i = 0; i < gameBoard.length; i++) {
                if(updatePoints(gameBoard[i][j].getValue())) {
                    return; //Exit early if a player wins;
                }
            }
        }

        //Top-Left to Bottom-Right
        for(let i = 0; i < gameBoard.length; i++) {
            if(updatePoints(gameBoard[i][i].getValue())) {
                return; //Exit early if a player wins;
            }
        }

        //Top-Right to Bottom-Left
        let n = gameBoard.length;
        for(let i = 0; i < n; i++) {
            if(updatePoints(gameBoard[i][n - 1 - i].getValue())) {
                return; //Exit early if a player wins;
            }
        }
        

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return{playRound, getActivePlayer}
});