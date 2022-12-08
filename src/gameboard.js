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
        allShipsSunk() {
            for (let i = 0; i < ships.length; i++) {
                if (ships[i].sunk == false) {
                    return false;
                }
            }
            return true;
        },
        randomCoordinate() {
            let x = Math.floor(Math.random() * 10);
            let y = Math.floor(Math.random() * 10);
            return [x, y];
        },
        displayMissedAttacks() {
            return missedAttacks;
        },
    }
}

export {GameBoard};