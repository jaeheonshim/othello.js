const WHITE = Symbol("white");
const BLACK = Symbol("black");
const EMPTY = Symbol("empty");

function Othello() {
    function OPPOSITE(color) {
        if (color == WHITE) return BLACK;
        else if (color == BLACK) return WHITE;
        else return EMPTY;
    }

    function COORD_TO_RC(coord) {
        coord = coord.trim().toUpperCase();
        const row = parseInt(coord.charAt(1)) - 1;
        const col = coord.charCodeAt(0) - 'A'.charCodeAt(0);
        return {
            row: row,
            col: col
        };
    }
    
    const board = new Array(8).fill(EMPTY).map(e => new Array(8).fill(EMPTY));
    let turn = BLACK;

    function printBoard() {
        console.log("  0 1 2 3 4 5 6 7");
        for (let i = 0; i < board.length; i++) {
            const line = [i];
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] == WHITE) {
                    line.push("O");
                } else if (board[i][j] == BLACK) {
                    line.push("X");
                } else {
                    line.push("-");
                }
            }

            console.log(line.join(" "));
        }
    }

    function initialPosition() {
        board[3][3] = WHITE;
        board[3][4] = BLACK;
        board[4][3] = BLACK;
        board[4][4] = WHITE;
    };

    function flipBetween(row, col, drow, dcol) {
        const originalColor = board[row][col];

        if(originalColor == EMPTY) return;

        let i, j;
        for(i = row + drow, j = col + dcol; i >= 0 && j >= 0 && i < 8 && j < 8 && board[i][j] != EMPTY; i += drow, j += dcol) {
            if(board[i][j] == originalColor) break;
        }

        if(i < 0 || j < 0 || i >= 8 || j >= 8 || board[i][j] == EMPTY) return;

        row += drow;
        col += dcol;
        while(row >= 0 && col >= 0 && row < 8 && col < 8 && board[row][col] != originalColor && board[row][col] != EMPTY) {
            board[row][col] = originalColor;
            row += drow;
            col += dcol;
        }
    }

    function checkCanPlace(row, col, drow, dcol, color) {
        let cX, cY;
        cX = row + drow;
        cY = col + dcol;

        while(cY >= 0 && cY < 8 && cX >= 0 && cX < 8) {
            if(board[cX][cY] == EMPTY) break;
            if(board[cX][cY] == color) {
                if(Math.abs(col - cY) > 1 || Math.abs(row - cX) > 1) {
                    return true;
                } else {
                    break;
                }
            }

            cX += drow;
            cY += dcol;
        }

        return false;
    }

    function canPlace(row, col, color) {
        if(!color) {
            color = col;
            const rc = COORD_TO_RC(row);
            row = rc.row;
            col = rc.col;
        }

        if (board[row][col] != EMPTY) return false;
        
        return checkCanPlace(row, col, -1, 0, color) || 
            checkCanPlace(row, col, 1, 0, color) || 
            checkCanPlace(row, col, 0, 1, color) ||
            checkCanPlace(row, col, 0, -1, color) ||
            checkCanPlace(row, col, 1, 1, color) ||
            checkCanPlace(row, col, -1, 1, color) ||
            checkCanPlace(row, col, -1, -1, color) ||
            checkCanPlace(row, col, 1, -1, color);
    }

    function place(row, col) {
        if(col == undefined) {
            const rc = COORD_TO_RC(row);
            row = rc.row;
            col = rc.col;
        }

        if(!canPlace(row, col, turn)) return;

        board[row][col] = turn;
        flipBetween(row, col, 1, 0);
        flipBetween(row, col, -1, 0);
        flipBetween(row, col, 0, 1);
        flipBetween(row, col, 0, -1);
        flipBetween(row, col, 1, 1);
        flipBetween(row, col, -1, 1);
        flipBetween(row, col, -1, -1);
        flipBetween(row, col, 1, -1);

        if(getValidMoves(OPPOSITE(turn)).length > 0) {
            turn = OPPOSITE(turn);
        }
    }

    function getValidMoves(color) {
        const validMoves = [];

        for(let row = 0; row < 8; row++) {
            for(let col = 0; col < 8; col++) {
                if(canPlace(row, col, color)) {
                    validMoves.push({
                        row: row,
                        col: col
                    });
                }
            }
        }

        return validMoves;
    }

    initialPosition();

    return {
        board: board,
        place: place
    }
};