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

export {Ship};