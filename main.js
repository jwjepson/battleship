/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/***/ (() => {

eval("function Ship(length) {\n    return {\n        length: length,\n        hits: 0,\n        coordinates: [],\n        sunk: false,\n        hit() {\n            this.hits += 1;\n        },\n        isSunk() {\n            if (this.hits == this.length) {\n                this.sunk = true;\n                return true;\n            }\n        }\n    }\n}\n\nfunction GameBoard() {\n    const coordinates = [];\n    const ships = [];\n    const missedAttacks = [];\n    function isValidCoords(coords, shipLength, isHorizontal) {\n        if (JSON.stringify(coordinates).includes(JSON.stringify(coords))) {\n            console.log(\"Match\");\n            return false;                 \n        }\n        for (let i = 1; i < shipLength; i++) {\n            if (isHorizontal) {\n                if ((coords[0] + shipLength > 10) || (JSON.stringify(coordinates).includes(JSON.stringify([coords[0] + i, coords[1]])))) {\n                    return false;\n                }\n            } else {\n                if ((coords[1] + shipLength > 10) || (JSON.stringify(coordinates).includes(JSON.stringify([coords[0], coords[1] + i])))) {\n                    return false;\n                }\n            }\n        }\n        return true;\n    }\n    function setCoordinates(ship, x, y, isHorizontal) {\n        ship.coordinates.push([x, y]);\n        coordinates.push([x, y]);\n        for (let i = 1; i < ship.length; i++) {\n            if (isHorizontal) {\n                x = x + 1;\n            } else {\n                y = y + 1;\n            }\n            ship.coordinates.push([x, y]);\n            coordinates.push([x, y]);\n        }\n        ships.push(ship);\n    }\n    return {\n        getRandomCoordinates(ship) {\n            const shipLength = ship.length;\n            const isHorizontal = Math.random() > 0.5 ? true : false;\n            let x;\n            let y;\n            while (true) {\n                x = Math.floor(Math.random() * 10);\n                y = Math.floor(Math.random() * 10);\n                if (!isValidCoords([x, y], shipLength, isHorizontal)) {\n                    continue;\n                } else {\n                    break;\n                }\n            }\n            setCoordinates(ship, x, y, isHorizontal);\n        },\n        getCoordinates(ship, coords, isHorizontal) {\n            if (isValidCoords(coords, ship.length, isHorizontal)) {\n                let x = coords[0];\n                let y = coords[1];\n                setCoordinates(ship, x, y, isHorizontal);\n            } else {\n                return false;\n            }\n        },\n        receiveAttack(coords) {\n            let hitShip = false;\n            for (let i = 0; i < ships.length; i++) {\n                if (JSON.stringify(ships[i].coordinates).includes(JSON.stringify(coords))) {\n                    ships[i].hit();\n                    hitShip = true;\n                    return ships[i];\n                }\n            }       \n            if (!hitShip) {\n                missedAttacks.push(coords);\n                return false;\n            }\n        },\n        displayShips() {\n            return ships;\n        },\n        displayCoordinates() {\n            return coordinates;\n        },\n        deleteShips() {\n            ships.splice(0, ships.length);\n        }\n    }\n}\n\nfunction Player(name) {\n    return {\n        name: name,\n        board: GameBoard(),\n    }\n}\n\nconst playerSquares = document.querySelectorAll(\".gameboard.player > .square\");\nconst computerSquares = document.querySelectorAll(\".gameboard.computer > .square\");\nconst computerBoard = document.querySelector(\".gameboard.computer\");\nconst messageBoard = document.querySelector(\"#message-board\");\nlet isHorizontal = false;\nlet clicks = 5;\n\n// Populate players\nconst player = Player(\"Player 1\");\nconst computer = Player(\"Computer\");\nlet randomSelected = false;\n\nplayerSquares.forEach((square) => {\n    square.addEventListener(\"click\", () => {\n        getCoords(square);\n    })\n});\n\nfunction getCoords(square) {\n    let x = parseInt(square.getAttribute(\"data-coords\")[1]);\n    let y = parseInt(square.getAttribute(\"data-coords\")[3]);\n    let coords = [x, y];\n\n    if (JSON.stringify(player.board.displayCoordinates()).includes(JSON.stringify(coords))) {\n        return;\n    }\n\n    if (player.board.displayShips().length == 5) {\n        return;\n    }\n    if (player.board.displayShips().length == 2) {\n        player.board.getCoordinates(Ship(3), coords, isHorizontal);\n        renderBoard(player.board.displayCoordinates());\n        renderPlacement(3);\n    } else {\n        if (player.board.displayShips().length == 4) {\n            if ((player.board.getCoordinates(Ship(clicks), coords, isHorizontal)) != false) {\n                renderPlacement(0);\n                renderBoard(player.board.displayCoordinates());\n                startGame();\n            }\n        } else {\n            if ((player.board.getCoordinates(Ship(clicks), coords, isHorizontal)) != false) {\n                renderPlacement(clicks - 1);\n                renderBoard(player.board.displayCoordinates());\n                clicks--;\n            }\n        }\n    }\n}\n\nconst rotateButton = document.querySelector(\"#rotate-button\");\nrotateButton.addEventListener(\"click\", () => {\n    if (isHorizontal == false) {\n        isHorizontal = true;\n    } else {\n        isHorizontal = false;\n    }\n})\n\n\nfunction renderBoard(coords) {\n    coords.forEach((coord) => {\n        document.querySelector(`[data-coords='[${coord[0]},${coord[1]}]']`).style.backgroundColor = \"gray\";\n    })\n}\n\nfunction renderPlacement(shipLength) {\n    playerSquares.forEach((square) => {\n        square.addEventListener(\"mouseover\", () => {\n            playerSquares.forEach((square) => {\n                square.classList.remove(\"shipHover\");\n            });\n\n            let x = parseInt(square.getAttribute(\"data-coords\")[1]);\n            let y = parseInt(square.getAttribute(\"data-coords\")[3]);\n\n            if (isHorizontal) {\n                if (x + shipLength <= 10) {\n                    for (let i = 0; i < shipLength; i++) {\n                        document.querySelector(`[data-coords='[${x + i},${y}]']`).classList.add(\"shipHover\");\n                    }\n                }\n            } else {\n                if (y + shipLength <= 10) {\n                    for (let i = 0; i < shipLength; i++) {\n                        document.querySelector(`[data-coords='[${x},${y + i}]']`).classList.add(\"shipHover\");\n                    }\n                }\n            }\n        })\n    })\n}\n\ncomputerSquares.forEach((square) => {\n    square.addEventListener(\"mouseover\", () => {  \n        computerSquares.forEach((square) => {\n            square.classList.remove(\"attackHover\");\n        })  \n        square.classList.add(\"attackHover\"); \n    })\n    square.addEventListener(\"click\", () => {\n        let x = parseInt(square.getAttribute(\"data-coords\")[1]);\n        let y = parseInt(square.getAttribute(\"data-coords\")[3]);\n        const attackedShip = player.board.receiveAttack([x, y]);\n        if (attackedShip != false) {\n            square.style.backgroundColor = \"red\";\n            sendMessage(`HIT  [${x}, ${y}]`);\n            if (attackedShip.isSunk()) {\n                sendMessage(\"You have sank their ship!\");\n            }\n        } else {\n            sendMessage(`MISS  [${x}, ${y}]`);\n        }\n    })\n})\n\nfunction startGame() {\n    console.log(\"Start Game\");\n    computerBoard.style.display = \"grid\";\n    rotateButton.style.display = \"none\";\n}\n\nfunction sendMessage(message) {\n    messageBoard.textContent = message;\n}\nrenderPlacement(5);\n\n\n//# sourceURL=webpack://battleship/./src/app.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/app.js"]();
/******/ 	
/******/ })()
;