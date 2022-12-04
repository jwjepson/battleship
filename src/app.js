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
    function isValidCoords(coords, shipLength) {
        if (JSON.stringify(coordinates).includes(JSON.stringify(coords))) {
            console.log("Match");
            return false;                 
        }
        for (let i = 1; i < shipLength; i++) {
            if (JSON.stringify(coordinates).includes(JSON.stringify([coords[0] + i, coords[1]]))) {
                return false;
            }
        }
        return true;
    }
    return {
        getRandomCoordinates(ship) {
            const shipLength = ship.length;
            let x;
            let y;
            while (true) {
                x = Math.floor(Math.random() * 10);
                y = Math.floor(Math.random() * 10);
                if ((x + ship.length > 10) || (!isValidCoords([x, y], shipLength)))  {
                    continue;
                } else {
                    break;
                }
            }

            ship.coordinates.push([x, y]);
            coordinates.push([x, y]);
            for (let i = 1; i < shipLength; i++) {
                x = x + 1;
                ship.coordinates.push([x, y]);
                coordinates.push([x, y]);
            }
        }
    }
}
