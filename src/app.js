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
                return true;
            }
        }
    }
}

function GameBoard() {
    const coordinates = [];
    const ships = [];
    const missedAttacks = [];
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
            }
        },
        receiveAttack(coords) {
            let hitShip = false;
            for (let i = 0; i < ships.length; i++) {
                if (JSON.stringify(ships[i].coordinates).includes(JSON.stringify(coords))) {
                    ships[i].hit();
                    hitShip = true;
                    break;
                }
            }       
            if (!hitShip) {
                missedAttacks.push(coords);
            }
        }
    }
}

let isHorizontal = false;

const rotateButton = document.querySelector("#rotate-button");
rotateButton.addEventListener("click", () => {
    if (isHorizontal == false) {
        isHorizontal = true;
    } else {
        isHorizontal = false;
    }
})

const gameSquares = document.querySelectorAll(".square");
gameSquares.forEach((square) => {
    square.addEventListener("mouseover", () => {
        gameSquares.forEach((square) => {
            square.classList.remove("shipHover");
        });

        let x = parseInt(square.getAttribute("data-coords")[1]);
        let y = parseInt(square.getAttribute("data-coords")[3]);

        if (isHorizontal) {
            if (x <= 5) {
                for (let i = 0; i < 5; i++) {
                    document.querySelector(`[data-coords='[${x + i},${y}]']`).classList.add("shipHover");
                }
            }
        } else {
            if (y <= 5) {
                for (let i = 0; i < 5; i++) {
                    document.querySelector(`[data-coords='[${x},${y + i}]']`).classList.add("shipHover");
                }
            }
        }
    })
})



export {GameBoard, Ship};