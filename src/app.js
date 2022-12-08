function Ship(length) {
    return {
        length: length,
        hits: 0,
        coordinates: [],
        sunk: false,
        hit() {
            this.hits += 1;
        },
        isSunk() {
            if (this.hits == this.length) {
                this.sunk = true;
                return true;
            }
        }
    }
}

function GameBoard() {
    const coordinates = [];
    const ships = [];
    const missedAttacks = [];
    const hitAttacks = [];
    const targets = [];
    function isValidCoords(coords, shipLength, isHorizontal) {
        if (JSON.stringify(coordinates).includes(JSON.stringify(coords))) {
            console.log("Match");
            return false;                 
        }
        for (let i = 1; i < shipLength; i++) {
            if (isHorizontal) {
                if ((coords[0] + shipLength > 10) || (JSON.stringify(coordinates).includes(JSON.stringify([coords[0] + i, coords[1]])))) {
                    return false;
                }
            } else {
                if ((coords[1] + shipLength > 10) || (JSON.stringify(coordinates).includes(JSON.stringify([coords[0], coords[1] + i])))) {
                    return false;
                }
            }
        }
        return true;
    }
    function setCoordinates(ship, x, y, isHorizontal) {
        ship.coordinates.push([x, y]);
        coordinates.push([x, y]);
        for (let i = 1; i < ship.length; i++) {
            if (isHorizontal) {
                x = x + 1;
            } else {
                y = y + 1;
            }
            ship.coordinates.push([x, y]);
            coordinates.push([x, y]);
        }
        ships.push(ship);
    }
    return {
        targets: targets,
        hitAttacks: hitAttacks,
        missedAttacks: missedAttacks,
        getRandomCoordinates(ship) {
            const shipLength = ship.length;
            const isHorizontal = Math.random() > 0.5 ? true : false;
            let x;
            let y;
            while (true) {
                x = Math.floor(Math.random() * 10);
                y = Math.floor(Math.random() * 10);
                if (!isValidCoords([x, y], shipLength, isHorizontal)) {
                    continue;
                } else {
                    break;
                }
            }
            setCoordinates(ship, x, y, isHorizontal);
        },
        getCoordinates(ship, coords, isHorizontal) {
            if (isValidCoords(coords, ship.length, isHorizontal)) {
                let x = coords[0];
                let y = coords[1];
                setCoordinates(ship, x, y, isHorizontal);
            } else {
                return false;
            }
        },
        receiveAttack(coords) {
            let hitShip = false;
            for (let i = 0; i < ships.length; i++) {
                if (JSON.stringify(ships[i].coordinates).includes(JSON.stringify(coords))) {
                    ships[i].hit();
                    hitShip = true;
                    hitAttacks.push(coords);
                    targets.push([coords[0], coords[1] - 1], [coords[0], coords[1] + 1], [coords[0] + 1, coords[1]], [coords[0] - 1, coords[1]]);
                    return ships[i];
                }
            }       
            if (!hitShip) {
                missedAttacks.push(coords);
                return false;
            }
        },
        displayShips() {
            return ships;
        },
        displayCoordinates() {
            return coordinates;
        },
        deleteShips() {
            ships.splice(0, ships.length);
        },
        allShipsSunk() {
            for (let i = 0; i < ships.length; i++) {
                if (ships[i].sunk == false) {
                    return false;
                }
            }
            return true;
        },
        randomCoordinate() {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
            return [x, y];
        },
        displayMissedAttacks() {
            return missedAttacks;
        },
    }
}

function Player(name) {
    return {
        name: name,
        board: GameBoard(),
    }
}

const playerSquares = document.querySelectorAll(".gameboard.player > .square");
const computerSquares = document.querySelectorAll(".gameboard.computer > .square");
const computerBoard = document.querySelector(".gameboard.computer");
const messageBoard = document.querySelector("#message-board");
const rotateButton = document.querySelector("#rotate-button");

let isHorizontal = false;
let clicks = 5;

// Populate players
const player = Player("Player 1");
const computer = Player("Computer");
let randomSelected = false;
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
        getCoords(square);
    })
});

function getCoords(square) {
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
        document.querySelector(`[data-coords='[${coord[0]},${coord[1]}]']`).style.backgroundColor = "gray";
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
                square.style.backgroundColor = "#D3D3D3";
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
        document.querySelector(`.gameboard.player > .square[data-coords="[${x},${y}]"]`).style.backgroundColor = "red";
        sendMessage(`${computer.name} HIT!  [${x}, ${y}]`);
        if (computersAttack.isSunk()) {
            player.board.targets.splice(0, player.board.targets.length);
            sendMessage("Computer sank your ship!");
        }
    } else if (computersAttack == false && player.board.allShipsSunk() != true) {
        player.board.displayMissedAttacks().forEach((coord) => {
            let x = coord[0];
            let y = coord[1];
            document.querySelector(`.gameboard.player > .square[data-coords="[${x},${y}]"]`).style.backgroundColor = "#D3D3D3";
        })
        sendMessage(`${computer.name} MISSED  [${x}, ${y}]`);
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
