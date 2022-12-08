import {GameBoard} from "./gameboard";


function Player(name) {
    return {
        name: name,
        board: GameBoard(),
    }
}

export {Player};