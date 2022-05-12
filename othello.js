const WHITE = Symbol("white");
const BLACK = Symbol("black");
const EMPTY = Symbol("empty");

(function () {

    function Othello() {
        function OPPOSITE(color) {
            if (color == WHITE) return BLACK;
            else if (color == BLACK) return WHITE;
            else return EMPTY;
        }
        
        this.board = new Array(8).fill(EMPTY).map(e => new Array(8).fill(EMPTY));
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

        this.canPlace = function (x, y, color) {
            if (this.board[x][y] != EMPTY) return false;
            let cX, cY;

            // check up
            cY = y - 1;
            while (cY >= 0) {
                if (this.board[x][cY] == EMPTY) break;
                if (this.board[x][cY] == color) {
                    if (y - cY > 1) {
                        return true;
                    } else {
                        break;
                    }
                }

                cY--;
            }

            // check down
            cY = y + 1;
            while (cY < 8) {
                if (this.board[x][cY] == EMPTY) break;
                if (this.board[x][cY] == color) {
                    if (cY - y > 1) {
                        return true;
                    } else {
                        break;
                    }
                }

                cY++;
            }

            // check left
            cX = x - 1;
            while (cX >= 0) {
                if (this.board[cX][y] == EMPTY) break;
                if (this.board[cX][y] == color) {
                    if (x - cX > 1) {
                        return true;
                    } else {
                        break;
                    }
                }

                cX--;
            }

            // check right
            cX = x + 1;
            while (cX < 8) {
                if (this.board[cX][y] == EMPTY) break;
                if (this.board[cX][y] == color) {
                    if (cX - x > 1) {
                        return true;
                    } else {
                        break;
                    }
                }

                cX++;
            }

            return false;
        }

        this.place = function (x, y, color) {
            if(!this.canPlace(x, y, color)) return;

            this.board[x][y] = color;
            this.fire(this.board);
        }

        this.initialPosition();
        this.fire(this.board);
    };

    const state = new Othello();
    window["state"] = state;

    let element;

    function constructor(eid) {
        element = $(`#${eid}`);
        element.css("display", "flex");
        element.css("flex-direction", "column");
        element.height(element.width());

        for (let i = 0; i < 8; i++) {
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.flexGrow = 1;

            for (let j = 0; j < 8; j++) {
                const col = document.createElement("div");
                col.classList.add("othello-cell");
                col.style.flexGrow = 1;

                if (i % 2 == j % 2) {
                    col.classList.add("othello-light");
                } else {
                    col.classList.add("othello-dark");
                }

                const piece = document.createElement("div");
                piece.classList.add("othello-piece");

                const blackSide = document.createElement("div");
                blackSide.classList.add("othello-black-side");
                piece.appendChild(blackSide);

                const whiteSide = document.createElement("div");
                whiteSide.classList.add("othello-white-side");
                piece.appendChild(whiteSide);

                col.appendChild(piece);

                row.appendChild(col);
            }

            element.append(row);

            addPiece(4, 4, WHITE);
        }

        state.subscribe(onBoardUpdate);
        onBoardUpdate(state.board);

        return {
            addPiece: addPiece,
            setPiece: setPiece
        }
    }

    function addPiece(row, col, color) {
        if (row >= 8 || row < 0 || col >= 8 || col < 0) {
            console.error("addPiece: row/col out of bounds");
            return;
        }

        const rowElement = element.children().eq(row);
        const cell = rowElement.children().eq(col);
        const piece = cell.find(".othello-piece");

        if (color == BLACK) {
            piece.addClass("othello-black");
        } else {
            piece.addClass("othello-white");
        }
    }

    function setPiece(row, col, color) {
        if (row >= 8 || row < 0 || col >= 8 || col < 0) {
            console.error("flipPiece: row/col out of bounds");
            return;
        }

        const rowElement = element.children().eq(row);
        const cell = rowElement.children().eq(col);
        const piece = cell.find(".othello-piece");

        piece.removeClass("othello-black");
        piece.removeClass("othello-white");

        if (color == BLACK) {
            piece.addClass("othello-black");
        } else if (color == WHITE) {
            piece.addClass("othello-white");
        }
    }

    function onBoardUpdate(board) {
        for(let row = 0; row < board.length; row++) {
            for(let col = 0; col < board[row].length; col++) {
                setPiece(row, col, board[row][col]);
            }
        }
    }

    window["Othello"] = constructor;
})();