const WHITE = Symbol("white");
const BLACK = Symbol("black");
const EMPTY = Symbol("empty");

(function() {
    const board = Array(8).fill(null).map(x => Array(10).fill(EMPTY));

    let element;

    function constructor(eid) {
        element = $(`#${eid}`);
        element.css("display", "flex");
        element.css("flex-direction", "column");
        element.height(element.width());

        for(let i = 0; i < 8; i++) {
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.flexGrow = 1;

            for(let j = 0; j < 8; j++) {
                const col = document.createElement("div");
                col.classList.add("othello-cell");
                col.style.flexGrow = 1;

                if(i % 2 == j % 2) {
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

        return {
            state: board,
            addPiece: addPiece,
            flipPiece: flipPiece
        }
    }

    function addPiece(row, col, color) {
        if(row >= 8 || row < 0 || col >= 8 || col < 0) {
            console.error("addPiece: row/col out of bounds");
            return;
        }

        const rowElement = element.children().eq(row);
        const cell = rowElement.children().eq(col);
        const piece = cell.find(".othello-piece");

        if(color == BLACK) {
            board[row][col] = BLACK;
            piece.addClass("othello-black");
        } else {
            board[row][col] = WHITE;
            piece.addClass("othello-white");
        }
    }

    function flipPiece(row, col) {
        if(row >= 8 || row < 0 || col >= 8 || col < 0) {
            console.error("flipPiece: row/col out of bounds");
            return;
        }

        const rowElement = element.children().eq(row);
        const cell = rowElement.children().eq(col);
        const piece = cell.find(".othello-piece");

        piece.removeClass("othello-black");
        piece.removeClass("othello-white");

        if(board[row][col] == WHITE) {
            board[row][col] = BLACK;
            piece.addClass("othello-black");
        } else if(board[row][col] == BLACK) {
            board[row][col] = WHITE;
            piece.addClass("othello-white");
        } else {
            return;
        }
    }

    window["Othello"] = constructor;
})();