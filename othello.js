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
    
    this.board = new Array(8).fill(EMPTY).map(e => new Array(8).fill(EMPTY));
    this.turn = BLACK;

    this.printBoard = function () {
        console.log("  0 1 2 3 4 5 6 7");
        for (let i = 0; i < this.board.length; i++) {
            const line = [i];
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] == WHITE) {
                    line.push("O");
                } else if (this.board[i][j] == BLACK) {
                    line.push("X");
                } else {
                    line.push("-");
                }
            }

            console.log(line.join(" "));
        }
    }

    this.initialPosition = function () {
        this.board[3][3] = WHITE;
        this.board[3][4] = BLACK;
        this.board[4][3] = BLACK;
        this.board[4][4] = WHITE;
    };

    this.flipBetween = function(row, col, drow, dcol) {
        const originalColor = this.board[row][col];

        if(originalColor == EMPTY) return;

        let i, j;
        for(i = row + drow, j = col + dcol; i >= 0 && j >= 0 && i < 8 && j < 8 && this.board[i][j] != EMPTY; i += drow, j += dcol) {
            if(this.board[i][j] == originalColor) break;
        }

        if(i < 0 || j < 0 || i >= 8 || j >= 8 || this.board[i][j] == EMPTY) return;

        row += drow;
        col += dcol;
        while(row >= 0 && col >= 0 && row < 8 && col < 8 && this.board[row][col] != originalColor && this.board[row][col] != EMPTY) {
            this.board[row][col] = originalColor;
            row += drow;
            col += dcol;
        }
    }

    this._checkCanPlace = function(row, col, drow, dcol, color) {
        let cX, cY;
        cX = row + drow;
        cY = col + dcol;

        while(cY >= 0 && cY < 8 && cX >= 0 && cX < 8) {
            if(this.board[cX][cY] == EMPTY) break;
            if(this.board[cX][cY] == color) {
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

    this.canPlace = function(row, col, color) {
        if(!color) {
            color = col;
            const rc = COORD_TO_RC(row);
            row = rc.row;
            col = rc.col;
        }

        if (this.board[row][col] != EMPTY) return false;
        
        return this._checkCanPlace(row, col, -1, 0, color) || 
            this._checkCanPlace(row, col, 1, 0, color) || 
            this._checkCanPlace(row, col, 0, 1, color) ||
            this._checkCanPlace(row, col, 0, -1, color) ||
            this._checkCanPlace(row, col, 1, 1, color) ||
            this._checkCanPlace(row, col, -1, 1, color) ||
            this._checkCanPlace(row, col, -1, -1, color) ||
            this._checkCanPlace(row, col, 1, -1, color);
    }

    this.place = function (row, col) {
        if(!col) {
            const rc = COORD_TO_RC(row);
            row = rc.row;
            col = rc.col;
        }

        if(!this.canPlace(row, col, this.turn)) return;

        this.board[row][col] = this.turn;
        this.flipBetween(row, col, 1, 0);
        this.flipBetween(row, col, -1, 0);
        this.flipBetween(row, col, 0, 1);
        this.flipBetween(row, col, 0, -1);
        this.flipBetween(row, col, 1, 1);
        this.flipBetween(row, col, -1, 1);
        this.flipBetween(row, col, -1, -1);
        this.flipBetween(row, col, 1, -1);

        if(this.getValidMoves(OPPOSITE(this.turn)).length > 0) {
            this.turn = OPPOSITE(this.turn);
        }
    }

    this.getValidMoves = function(color) {
        const validMoves = [];

        for(let row = 0; row < 8; row++) {
            for(let col = 0; col < 8; col++) {
                if(this.canPlace(row, col, color)) {
                    validMoves.push({
                        row: row,
                        col: col
                    });
                }
            }
        }

        return validMoves;
    }

    this.initialPosition();
};