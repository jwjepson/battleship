test("correctly create ship with length of 3", () => {
    expect(Ship(3).length).toBe(3);
})

test("correctly increase hits on ship when hit", () => {
    const ship = Ship(3);
    ship.hit();
    expect(ship.hits).toBe(1);
})

test("correctly determines if ship is sunk", () => {
    const ship = Ship(3);
    ship.hits = 3;
    expect(ship.isSunk()).toBeTruthy();
    ship.hits = 2;
    expect(ship.isSunk()).toBeFalsy();
})