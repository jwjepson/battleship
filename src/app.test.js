import {Ship} from "./app";

test("correctly creates ship object with correct length", () => {
    expect(Ship(5)).toEqual({length: 5, hits: 0, sunk: false});
    expect(Ship(4)).toEqual({length: 4, hits: 0, sunk: false});
})