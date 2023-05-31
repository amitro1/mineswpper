let board = [];
let rows = 8;
let coloms = 8;

let minecount = 5;
let mineLoction = [];
let slotsClick = 0;
let flagEnabled = false;
let gameOver = false;

window.onload = startgame;

function startgame() {
    document.getElementById("mineCount").innerText = minecount;
    document.getElementById("flag").addEventListener("click", setFlag);
    setMine();
    for (let i = 0; i < rows; i++) {
        let rowArray = [];
        for (let j = 0; j < coloms; j++) {
            let slot = document.createElement("div");
            slot.id = i + "-" + j;
            slot.addEventListener("click", clickSlots);
            document.getElementById("board").append(slot);
            rowArray.push(slot);
        }
        board.push(rowArray);
    }
    console.log(board);
}

function setFlag() {
    flagEnabled = !flagEnabled;
    let flagButton = document.getElementById('flag');
    flagButton.style.backgroundColor = flagEnabled ? "darkgray" : "lightgray";
}

function checkWin() {
    let flaggedMines = 0;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < coloms; j++) {
            let slot = board[i][j];
            if (mineLoction.indexOf(slot.id) !== -1 && slot.innerText === '🚩') {
                flaggedMines++;
            }
        }
    }

    if (flaggedMines === minecount) {
        alert('Congratulations! You have won the game!');
        gameOver = true;
    }
}


function clickSlots() {
    if (gameOver) return

    let slot = this;
    if (flagEnabled) {
        if (slot.innerText === '') {
            slot.innerText = "🚩";
        } else if (slot.innerText == "🚩") {
            slot.innerText = '';
        }
        checkWin()
        return;
    }
    if (slot.innerText === '🚩') return;

    if (mineLoction.indexOf(slot.id) !== -1) {
        alert("you lose")
        gameOver = true;
        revelMines();
        return;
    }
    let coordinates = slot.id.split("-");
    let row = parseInt(coordinates[0]);
    let colom = parseInt(coordinates[1]);
    checkMine(row, colom);
}

function setMine() {
    // mineLoction.push('2-3');
    // mineLoction.push('1-3');
    // mineLoction.push('2-1');
    // mineLoction.push('5-3');
    // mineLoction.push('2-2');
    let mineLeft = minecount;
    while (mineLeft > 0) {
        let row = Math.floor(Math.random() * rows)
        let colom = Math.floor(Math.random() * coloms)
        let id = row.toString() + "-" + colom.toString()
        if (!mineLoction.includes(id)) {
            mineLoction.push(id)
            mineLeft -= 1
        }
    }
}

function revelMines() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < coloms; j++) {
            let slot = board[i][j];
            if (mineLoction.indexOf(slot.id) !== -1) {
                slot.innerText = "💣";
                slot.style.backgroundColor = "red";
            }
        }
    }
}

function checkMine(row, colom) {
    if (row < 0 || row >= rows || colom < 0 || colom >= coloms) {
        return;
    }
    if (board[row][colom].classList.contains("slotClicked")) return;

    board[row][colom].classList.add("slotClicked");
    slotsClick += 1;
    let minesFind = 0;

    minesFind += checkSlot(row - 1, colom - 1);
    minesFind += checkSlot(row - 1, colom);
    minesFind += checkSlot(row - 1, colom + 1);
    minesFind += checkSlot(row, colom - 1);
    minesFind += checkSlot(row, colom + 1);
    minesFind += checkSlot(row + 1, colom - 1);
    minesFind += checkSlot(row + 1, colom);
    minesFind += checkSlot(row + 1, colom + 1);

    if (minesFind > 0) {
        board[row][colom].innerText = minesFind;
        board[row][colom].classList.add("num" + minesFind.toString());

    } else {
        checkMine(row - 1, colom - 1);
        checkMine(row - 1, colom);
        checkMine(row - 1, colom + 1);
        checkMine(row, colom - 1);
        checkMine(row, colom + 1);
        checkMine(row + 1, colom - 1);
        checkMine(row + 1, colom);
        checkMine(row + 1, colom + 1);
    }
    if (slotsClick == rows * coloms - minecount) {
        document.getElementById("mineCount").innerHTML = 'Cleared'
        gameOver = true
    }
}

function checkSlot(row, colom) {
    if (row < 0 || row >= rows || colom < 0 || colom >= coloms) {
        return 0;
    }
    if (mineLoction.includes(row.toString() + "-" + colom.toString())) {
        return 1;
    }
    return 0;
}

