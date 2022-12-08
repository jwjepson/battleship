import {Player} from "./player";
import {Ship} from "./ship";
import "./styles.css";


const playerSquares = document.querySelectorAll(".grid.player > .square");
const computerSquares = document.querySelectorAll(".grid.computer > .square");
const computerBoard = document.querySelector(".gameboard.computer");
const messageBoard = document.querySelector("#message-board");
const rotateButton = document.querySelector("#rotate-button");

let isHorizontal = false;
let clicks = 5;

// Populate players
const player = Player("Player 1");
const computer = Player("Computer");
let currentPlayer = player;


rotateButton.addEventListener("click", () => {
    if (isHorizontal == false) {
        isHorizontal = true;
    } else {
        isHorizontal = false;
    }
})


playerSquares.forEach((square) => {
    square.addEventListener("click", () => {
        placeShip(square);
    })
});

function placeShip(square) {
    let x = parseInt(square.getAttribute("data-coords")[1]);
    let y = parseInt(square.getAttribute("data-coords")[3]);
    let coords = [x, y];

    // If the coordinate is already occupied by a ship
    if (JSON.stringify(player.board.displayCoordinates()).includes(JSON.stringify(coords))) {
        return;
    }

    // If all the ships have been placed
    if (player.board.displayShips().length == 5) {
        return;
    }


    if (player.board.displayShips().length == 2) {
        player.board.getCoordinates(Ship(3), coords, isHorizontal);
        renderBoard(player.board.displayCoordinates());
        renderPlacement(3);
    } else {
        if (player.board.displayShips().length == 4) {
            if ((player.board.getCoordinates(Ship(clicks), coords, isHorizontal)) != false) {
                renderPlacement(0);
                renderBoard(player.board.displayCoordinates());
                startGame();
            }
        } else {
            if ((player.board.getCoordinates(Ship(clicks), coords, isHorizontal)) != false) {
                renderPlacement(clicks - 1);
                renderBoard(player.board.displayCoordinates());
                clicks--;
            }
        }
    }
}

function renderBoard(coords) {
    coords.forEach((coord) => {
        document.querySelector(`[data-coords='[${coord[0]},${coord[1]}]']`).style.backgroundColor = "#cce6ff";
    })
}

function renderPlacement(shipLength) {
    playerSquares.forEach((square) => {
        square.addEventListener("mouseover", () => {
            playerSquares.forEach((square) => {
                square.classList.remove("shipHover");
            });

            let x = parseInt(square.getAttribute("data-coords")[1]);
            let y = parseInt(square.getAttribute("data-coords")[3]);

            if (isHorizontal) {
                if (x + shipLength <= 10) {
                    for (let i = 0; i < shipLength; i++) {
                        document.querySelector(`[data-coords='[${x + i},${y}]']`).classList.add("shipHover");
                    }
                }
            } else {
                if (y + shipLength <= 10) {
                    for (let i = 0; i < shipLength; i++) {
                        document.querySelector(`[data-coords='[${x},${y + i}]']`).classList.add("shipHover");
                    }
                }
            }
        })
    })
}

// Player attacking the computer's board
computerSquares.forEach((square) => {
    square.addEventListener("mouseover", () => {
        if (currentPlayer == player) {
            computerSquares.forEach((square) => {
                square.classList.remove("attackHover");
            })  
            square.classList.add("attackHover"); 
        }
    })
    square.addEventListener("click", () => {
        if (currentPlayer == player) {
            let x = parseInt(square.getAttribute("data-coords")[1]);
            let y = parseInt(square.getAttribute("data-coords")[3]);

            if (JSON.stringify(computer.board.hitAttacks).includes(JSON.stringify([x, y])) || JSON.stringify(computer.board.missedAttacks).includes(JSON.stringify([x, y]))) {
                return;
            }

            let attackedShip = computer.board.receiveAttack([x, y]);

            if (attackedShip != false && computer.board.allShipsSunk() != true) {
                square.style.backgroundColor = "red";
                sendMessage(`${player.name} HIT!  [${x}, ${y}]`);
                if (attackedShip.isSunk()) {
                    sendMessage("You have sank their ship!");
                }
            } else if (attackedShip == false && computer.board.allShipsSunk() != true) {
                square.style.backgroundColor = "#E8E8E8";
                sendMessage(`${player.name} MISSED  [${x}, ${y}]`);
            }
            if (computer.board.allShipsSunk() == true) {
                sendMessage(`${player.name} wins the game!`);
                return;
            }
            currentPlayer = computer;
            setTimeout(computerTurn, 2000);
        }
    })
})


function computerTurn() {

    let computersMove = "";
    let computersAttack = "";
    // Get random coordinate for computer's move
    if (player.board.targets.length > 0) {
        while (true) {
            computersMove = player.board.targets.pop();
            if (computersMove[0] < 0 || computersMove[0] > 9 || computersMove[1] < 0 || computersMove[1] > 9) {
                continue;
            }
            if (JSON.stringify(player.board.hitAttacks).includes(JSON.stringify(computersMove)) || JSON.stringify(player.board.missedAttacks).includes(JSON.stringify(computersMove))) {
                continue;
            }
            break;
        }
        computersAttack = player.board.receiveAttack(computersMove);
        console.log(computersMove);
    } else {
        while (true) {
            computersMove = computer.board.randomCoordinate();
            if (JSON.stringify(player.board.hitAttacks).includes(JSON.stringify(computersMove)) || JSON.stringify(player.board.missedAttacks).includes(JSON.stringify(computersMove))) {
                continue;
            }
            break;
        }
        computersAttack = player.board.receiveAttack(computersMove);
    }

    if (computersAttack != false && player.board.allShipsSunk() != true) {
        let x = computersMove[0];
        let y = computersMove[1];
        document.querySelector(`.grid.player > .square[data-coords="[${x},${y}]"]`).style.backgroundColor = "red";
        sendMessage(`${computer.name} HIT!  [${x}, ${y}]`);
        if (computersAttack.isSunk()) {
            player.board.targets.splice(0, player.board.targets.length);
            sendMessage("Computer sank your ship!");
        }
    } else if (computersAttack == false && player.board.allShipsSunk() != true) {
        player.board.displayMissedAttacks().forEach((coord) => {
            let x = coord[0];
            let y = coord[1];
            document.querySelector(`.grid.player > .square[data-coords="[${x},${y}]"]`).style.backgroundColor = "#E8E8E8";
            sendMessage(`${computer.name} MISSED  [${x}, ${y}]`);
        })
    }
    if (player.board.allShipsSunk() == true) {
        sendMessage(`${computer.name} wins the game!`);
        return;
    }
    currentPlayer = player;
}

function startGame() {
    console.log("Start Game");
    computerBoard.style.display = "grid";
    rotateButton.style.display = "none";
    sendMessage("Launch an attack!");
    // Randomly generate computer's ships
    for (let i = 5; i > 1; i--) {
        if (i == 3) {
            computer.board.getRandomCoordinates(Ship(i));
            computer.board.getRandomCoordinates(Ship(i));
        } else {
        computer.board.getRandomCoordinates(Ship(i));
        }
    }
    console.log(computer.board.displayShips());
}

function sendMessage(message) {
    messageBoard.textContent = message;
}

renderPlacement(5);
sendMessage("Place your ships");
