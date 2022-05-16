const WHITE = Symbol("white");
const BLACK = Symbol("black");
const EMPTY = Symbol("empty");

function Othello() {
    function OPPOSITE(color) {
        if (color == WHITE) return BLACK;
        else if (color == BLACK) return WHITE;
        else return EMPTY;
    }
    
    this.board = new Array(8).fill(EMPTY).map(e => new Array(8).fill(EMPTY));
    this.turn = BLACK;
    const handlers = [];

    this.subscribe = function(listener) {
        handlers.push(listener);
    }

    this.fire = function(data) {
        for(let handler of handlers) {
            handler(data);
        }
    }

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

    this._checkCanPlace = function(x, y, dx, dy, color) {
        let cX, cY;
        cX = x + dx;
        cY = y + dy;

        while(cY >= 0 && cY < 8 && cX >= 0 && cX < 8) {
            if(this.board[cX][cY] == EMPTY) break;
            if(this.board[cX][cY] == color) {
                if(Math.abs(y - cY) > 1 || Math.abs(x - cX) > 1) {
                    return true;
                } else {
                    break;
                }
            }

            cX += dx;
            cY += dy;
        }

        return false;
    }

    this.canPlace = function(x, y, color) {
        if (this.board[x][y] != EMPTY) return false;
        
        return this._checkCanPlace(x, y, -1, 0, color) || 
            this._checkCanPlace(x, y, 1, 0, color) || 
            this._checkCanPlace(x, y, 0, 1, color) ||
            this._checkCanPlace(x, y, 0, -1, color) ||
            this._checkCanPlace(x, y, 1, 1, color) ||
            this._checkCanPlace(x, y, -1, 1, color) ||
            this._checkCanPlace(x, y, -1, -1, color) ||
            this._checkCanPlace(x, y, 1, -1, color);
    }

    this.place = function (x, y) {
        if(!this.canPlace(x, y, this.turn)) return;

        this.board[x][y] = this.turn;
        this.flipBetween(x, y, 1, 0);
        this.flipBetween(x, y, -1, 0);
        this.flipBetween(x, y, 0, 1);
        this.flipBetween(x, y, 0, -1);
        this.flipBetween(x, y, 1, 1);
        this.flipBetween(x, y, -1, 1);
        this.flipBetween(x, y, -1, -1);
        this.flipBetween(x, y, 1, -1);

        this.fire(this.board);
        this.turn = OPPOSITE(this.turn);
    }

    this.initialPosition();
    this.fire(this.board);
};