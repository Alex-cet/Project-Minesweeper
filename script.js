let bomb = [], clickedCells = 0, gameOver = 0, flagsPlaced = 8;
function startGame() {
    document.getElementById("startMessage").style.display = 'none';
    document.getElementById("flagCounter").innerHTML = 'Bombs to be missed: ';
    document.getElementById("nrBombs").innerHTML = flagsPlaced;
    document.getElementById("grid").appendChild(createTable());
    handleRightClick();
}

function createTable() {
    grid = document.createElement('table');
    for (let i = 0; i < 8; ++i) {
        let row = document.createElement("tr");
        for (let j = 0; j < 8; ++j) {
            let cell = document.createElement("td");
            cell.id = i + " " + j;
            cell.onclick = function() {
                if (document.getElementById(i + " " + j).id === bomb[i].id) {
                    gameOver = 1;
                    checkEndGame();
                } else {
                    countNearbyBombs(i, j);
                    ++clickedCells;
                    if (document.getElementById(i + " " + j).innerHTML === '' && document.getElementById(i + " " + j).style.backgroundColor === "whitesmoke") {
                        handleCaseOf0(i, j);
                    }
                }
                console.log(clickedCells);
                checkEndGame();
            }
            row.appendChild(cell);
        }
        grid.appendChild(row);
        placeBombsRandomly(i);
    }
    return grid;
}

function placeBombsRandomly(i) {
    let randomColumn = Math.floor(Math.random() * 8);
    bomb[i] = document.createElement("div");
    bomb[i].id = i + " " + randomColumn;
    document.body.appendChild(bomb[i]);
    console.log("bomb[" + i + "].id: " + bomb[i].id);
}


function handleRightClick() {
    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            document.getElementById(i + " " + j).addEventListener('contextmenu', function(rightClick) {
                rightClick.preventDefault();
                if (document.getElementById(i + " " + j).innerHTML != '') {
                    document.getElementById(i + " " + j).innerHTML = '';
                    ++flagsPlaced;
                } else {
                    let flagImg = document.createElement("img");
                    flagImg.src = "flag.png";
                    document.getElementById(i + " " + j).appendChild(flagImg);
                    --flagsPlaced;
                }
                document.getElementById("nrBombs").innerHTML = flagsPlaced;
                return false;
            }, false);
        }
    }
}


function handleCaseOf0(i, j) {
    let rowPosition = i - 1, columnPosition = j;
    for (;;) {
        if ((rowPosition < 8 && rowPosition > -1) && (columnPosition < 8 && columnPosition > -1) && document.getElementById(rowPosition + " " + columnPosition).style.backgroundColor != "whitesmoke") {
            countNearbyBombs(rowPosition, columnPosition);
            ++clickedCells;
            if (document.getElementById(rowPosition + " " + columnPosition).innerHTML === '' && document.getElementById(rowPosition + " " + columnPosition).style.backgroundColor === "whitesmoke") {
                handleCaseOf0(rowPosition, columnPosition);
            }
        }
        if (rowPosition == i - 1 && columnPosition < j + 1 && columnPosition > j - 1) {
            ++columnPosition;
        } else if (rowPosition < i + 1 && columnPosition == j + 1) {
            ++rowPosition;
        } else if (rowPosition == i + 1 && columnPosition > j - 1) {
            --columnPosition;
        } else if (rowPosition > i - 1 && columnPosition == j - 1) {
            --rowPosition;
        } else {
            break;
        }
    }
}

function countNearbyBombs(i, j) {
    let countBombs = 0, rowPos = i - 1, columnPos = j;
    for (;;) {
        if (rowPos == i - 1 && columnPos < j + 1 && columnPos > j - 1) {
            if (columnPos < j + 2 && rowPos > -1) {
                if (document.getElementById(rowPos + " " + columnPos).id === bomb[rowPos].id) {
                    ++countBombs;
                }
            }
            ++columnPos;
        } else if (rowPos < i + 1 && columnPos == j + 1) {
            if (rowPos > -1 && columnPos < 8) {
                if (document.getElementById(rowPos + " " + columnPos).id === bomb[rowPos].id) {
                    ++countBombs;
                }
            }
            ++rowPos;
        } else if (rowPos == i + 1 && columnPos > j - 1) {
            if (rowPos < 8 && columnPos < 8) {
                if (document.getElementById(rowPos + " " + columnPos).id === bomb[rowPos].id) {
                    ++countBombs;
                }
            }
            --columnPos;
        } else if (rowPos > i - 1 && columnPos == j - 1) {
            if (rowPos < 8 && columnPos > -1) {
                if (document.getElementById(rowPos + " " + columnPos).id === bomb[rowPos].id) {
                    ++countBombs;
                }
            }
            --rowPos;
        } else {
            if (rowPos > -1 && columnPos > -1) {
                if (document.getElementById(rowPos + " " + columnPos).id === bomb[rowPos].id) {
                    ++countBombs;
                }
            }
            break;
        }
    }  
    document.getElementById(i + " " + j).innerHTML = countBombs;
    document.getElementById(i + " " + j).style.backgroundColor = "whitesmoke";
    if (countBombs == 0) {
        document.getElementById(i + " " + j).innerHTML = '';
    }
}

function checkEndGame() {
    if (clickedCells === 64 - bomb.length || gameOver == 1) {
        if (clickedCells === 64 - bomb.length) {
            document.getElementById("endGameMessage").innerHTML = "Congratulations! You won!";
        } else if (gameOver == 1) {
            gameOver = 0;
            document.getElementById("endGameMessage").innerHTML = "Game over! You found a bomb";
        }
        for (let i = 0; i < 8; ++i) {
            let img = document.createElement("img");
            img.src = "bombImg.png";
            if (document.getElementById(bomb[i].id).innerHTML != '') {
                document.getElementById(bomb[i].id).innerHTML = '';
            }
            document.getElementById(bomb[i].id).style.backgroundColor = "red";
            document.getElementById(bomb[i].id).appendChild(img);
        }
        disableAllCells();
        createResetButton();
    }
}

function disableAllCells() {
    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            document.getElementById(i + " " + j).onclick = 'null';
            document.getElementById(i + " " + j).style.cursor = 'not-allowed';
        }
    }
}

function createResetButton() {
    let playAgainButton = document.createElement("button");
    playAgainButton.className = "playAgainButton";
    playAgainButton.innerHTML = "Play Again";
    playAgainButton.onclick = function() {
        document.location.reload();
    }
    document.body.appendChild(playAgainButton);
}