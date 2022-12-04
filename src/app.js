function Ship(length) {
    return {
        length: length,
        hits: 0,
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

export {Ship};
