(function () {
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
                $(col).click(() => onClick(i, j));

                row.appendChild(col);
            }

            element.append(row);
        }

        state.subscribe(onBoardUpdate);
        onBoardUpdate(state.board);

        return {
            setPiece: setPiece
        }
    }

    function onClick(row, col) {
        state.place(row, col);
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

        const pieceWhiteSide = piece.find(".othello-white-side");
        pieceWhiteSide.hide();

        if (color == BLACK) {
            piece.addClass("othello-black");
        } else if (color == WHITE) {
            piece.addClass("othello-white");
        }
        
        setTimeout(() => pieceWhiteSide.show(), 25); // super janky fix
    }

    function getPiece(row, col) {
        if (row >= 8 || row < 0 || col >= 8 || col < 0) {
            console.error("getPiece: row/col out of bounds");
            return;
        }

        const rowElement = element.children().eq(row);
        const cell = rowElement.children().eq(col);
        const piece = cell.find(".othello-piece");

        if(piece.hasClass("othello-black")) return BLACK;
        if(piece.hasClass("othello-white")) return WHITE;
        return EMPTY;
    }

    function onBoardUpdate(board) {
        for(let row = 0; row < board.length; row++) {
            for(let col = 0; col < board[row].length; col++) {
                if(board[row][col] != EMPTY && board[row][col] != getPiece(row, col)) {
                    setPiece(row, col, board[row][col]);
                }
            }
        }
    }

    window["Othello"] = constructor;
})();