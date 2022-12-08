import {Ship} from "../ship";
import {GameBoard} from "../gameboard";

test("correctly gives random coordinates to ship", () => {
    const ship = Ship(3);
    const board = GameBoard();
    expect(ship.coordinates).toEqual([]);
    board.getRandomCoordinates(ship);
    expect(ship.coordinates).not.toEqual([]);
})

test("correctly gives correct number of coordinates based on size of ship", () => {
    const ship4 = Ship(4);
    const ship5 = Ship(5);
    const board = GameBoard();
    board.getRandomCoordinates(ship4);
    board.getRandomCoordinates(ship5);
    expect(ship4.coordinates.length).toBe(4);
    expect(ship5.coordinates.length).toBe(5);
})

test("correctly places ship horizontally at specified coordinate", () => {
    const ship = Ship(5);
    const board = GameBoard();
    board.getCoordinates(ship, [5, 2], true);
    expect(ship.coordinates).toEqual([[5, 2], [6, 2], [7, 2], [8, 2], [9, 2]]);
})

test("correctly places ship vertically at specified coordinate", () => {
    const ship = Ship(5);
    const board = GameBoard();
    board.getCoordinates(ship, [0, 2], false);
    expect(ship.coordinates).toEqual([[0, 2], [0, 3], [0, 4], [0, 5], [0, 6]]);
})

test("correctly hits a ship when attack is received with correct coordinates", () => {
    const ship1 = Ship(5);
    const board = GameBoard();

    board.getCoordinates(ship1, [0, 2], true);
    board.receiveAttack([1, 2]);
    expect(ship1.hits).toBe(1);
})