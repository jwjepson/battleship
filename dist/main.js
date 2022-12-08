/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ \"./src/player.js\");\n/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ship */ \"./src/ship.js\");\n\n\n\n\nconst playerSquares = document.querySelectorAll(\".gameboard.player > .square\");\nconst computerSquares = document.querySelectorAll(\".gameboard.computer > .square\");\nconst computerBoard = document.querySelector(\".gameboard.computer\");\nconst messageBoard = document.querySelector(\"#message-board\");\nconst rotateButton = document.querySelector(\"#rotate-button\");\n\nlet isHorizontal = false;\nlet clicks = 5;\n\n// Populate players\nconst player = (0,_player__WEBPACK_IMPORTED_MODULE_0__.Player)(\"Player 1\");\nconst computer = (0,_player__WEBPACK_IMPORTED_MODULE_0__.Player)(\"Computer\");\nlet currentPlayer = player;\n\n\nrotateButton.addEventListener(\"click\", () => {\n    if (isHorizontal == false) {\n        isHorizontal = true;\n    } else {\n        isHorizontal = false;\n    }\n})\n\n\nplayerSquares.forEach((square) => {\n    square.addEventListener(\"click\", () => {\n        placeShip(square);\n    })\n});\n\nfunction placeShip(square) {\n    let x = parseInt(square.getAttribute(\"data-coords\")[1]);\n    let y = parseInt(square.getAttribute(\"data-coords\")[3]);\n    let coords = [x, y];\n\n    // If the coordinate is already occupied by a ship\n    if (JSON.stringify(player.board.displayCoordinates()).includes(JSON.stringify(coords))) {\n        return;\n    }\n\n    // If all the ships have been placed\n    if (player.board.displayShips().length == 5) {\n        return;\n    }\n\n\n    if (player.board.displayShips().length == 2) {\n        player.board.getCoordinates((0,_ship__WEBPACK_IMPORTED_MODULE_1__.Ship)(3), coords, isHorizontal);\n        renderBoard(player.board.displayCoordinates());\n        renderPlacement(3);\n    } else {\n        if (player.board.displayShips().length == 4) {\n            if ((player.board.getCoordinates((0,_ship__WEBPACK_IMPORTED_MODULE_1__.Ship)(clicks), coords, isHorizontal)) != false) {\n                renderPlacement(0);\n                renderBoard(player.board.displayCoordinates());\n                startGame();\n            }\n        } else {\n            if ((player.board.getCoordinates((0,_ship__WEBPACK_IMPORTED_MODULE_1__.Ship)(clicks), coords, isHorizontal)) != false) {\n                renderPlacement(clicks - 1);\n                renderBoard(player.board.displayCoordinates());\n                clicks--;\n            }\n        }\n    }\n}\n\nfunction renderBoard(coords) {\n    coords.forEach((coord) => {\n        document.querySelector(`[data-coords='[${coord[0]},${coord[1]}]']`).style.backgroundColor = \"gray\";\n    })\n}\n\nfunction renderPlacement(shipLength) {\n    playerSquares.forEach((square) => {\n        square.addEventListener(\"mouseover\", () => {\n            playerSquares.forEach((square) => {\n                square.classList.remove(\"shipHover\");\n            });\n\n            let x = parseInt(square.getAttribute(\"data-coords\")[1]);\n            let y = parseInt(square.getAttribute(\"data-coords\")[3]);\n\n            if (isHorizontal) {\n                if (x + shipLength <= 10) {\n                    for (let i = 0; i < shipLength; i++) {\n                        document.querySelector(`[data-coords='[${x + i},${y}]']`).classList.add(\"shipHover\");\n                    }\n                }\n            } else {\n                if (y + shipLength <= 10) {\n                    for (let i = 0; i < shipLength; i++) {\n                        document.querySelector(`[data-coords='[${x},${y + i}]']`).classList.add(\"shipHover\");\n                    }\n                }\n            }\n        })\n    })\n}\n\n// Player attacking the computer's board\ncomputerSquares.forEach((square) => {\n    square.addEventListener(\"mouseover\", () => {\n        if (currentPlayer == player) {\n            computerSquares.forEach((square) => {\n                square.classList.remove(\"attackHover\");\n            })  \n            square.classList.add(\"attackHover\"); \n        }\n    })\n    square.addEventListener(\"click\", () => {\n        if (currentPlayer == player) {\n            let x = parseInt(square.getAttribute(\"data-coords\")[1]);\n            let y = parseInt(square.getAttribute(\"data-coords\")[3]);\n\n            if (JSON.stringify(computer.board.hitAttacks).includes(JSON.stringify([x, y])) || JSON.stringify(computer.board.missedAttacks).includes(JSON.stringify([x, y]))) {\n                return;\n            }\n\n            let attackedShip = computer.board.receiveAttack([x, y]);\n\n            if (attackedShip != false && computer.board.allShipsSunk() != true) {\n                square.style.backgroundColor = \"red\";\n                sendMessage(`${player.name} HIT!  [${x}, ${y}]`);\n                if (attackedShip.isSunk()) {\n                    sendMessage(\"You have sank their ship!\");\n                }\n            } else if (attackedShip == false && computer.board.allShipsSunk() != true) {\n                square.style.backgroundColor = \"#D3D3D3\";\n                sendMessage(`${player.name} MISSED  [${x}, ${y}]`);\n            }\n            if (computer.board.allShipsSunk() == true) {\n                sendMessage(`${player.name} wins the game!`);\n                return;\n            }\n            currentPlayer = computer;\n            setTimeout(computerTurn, 2000);\n        }\n    })\n})\n\n\nfunction computerTurn() {\n\n    let computersMove = \"\";\n    let computersAttack = \"\";\n    // Get random coordinate for computer's move\n    if (player.board.targets.length > 0) {\n        while (true) {\n            computersMove = player.board.targets.pop();\n            if (computersMove[0] < 0 || computersMove[0] > 9 || computersMove[1] < 0 || computersMove[1] > 9) {\n                continue;\n            }\n            if (JSON.stringify(player.board.hitAttacks).includes(JSON.stringify(computersMove)) || JSON.stringify(player.board.missedAttacks).includes(JSON.stringify(computersMove))) {\n                continue;\n            }\n            break;\n        }\n        computersAttack = player.board.receiveAttack(computersMove);\n        console.log(computersMove);\n    } else {\n        while (true) {\n            computersMove = computer.board.randomCoordinate();\n            if (JSON.stringify(player.board.hitAttacks).includes(JSON.stringify(computersMove)) || JSON.stringify(player.board.missedAttacks).includes(JSON.stringify(computersMove))) {\n                continue;\n            }\n            break;\n        }\n        computersAttack = player.board.receiveAttack(computersMove);\n    }\n\n    if (computersAttack != false && player.board.allShipsSunk() != true) {\n        let x = computersMove[0];\n        let y = computersMove[1];\n        document.querySelector(`.gameboard.player > .square[data-coords=\"[${x},${y}]\"]`).style.backgroundColor = \"red\";\n        sendMessage(`${computer.name} HIT!  [${x}, ${y}]`);\n        if (computersAttack.isSunk()) {\n            player.board.targets.splice(0, player.board.targets.length);\n            sendMessage(\"Computer sank your ship!\");\n        }\n    } else if (computersAttack == false && player.board.allShipsSunk() != true) {\n        player.board.displayMissedAttacks().forEach((coord) => {\n            let x = coord[0];\n            let y = coord[1];\n            document.querySelector(`.gameboard.player > .square[data-coords=\"[${x},${y}]\"]`).style.backgroundColor = \"#D3D3D3\";\n            sendMessage(`${computer.name} MISSED  [${x}, ${y}]`);\n        })\n    }\n    if (player.board.allShipsSunk() == true) {\n        sendMessage(`${computer.name} wins the game!`);\n        return;\n    }\n    currentPlayer = player;\n}\n\nfunction startGame() {\n    console.log(\"Start Game\");\n    computerBoard.style.display = \"grid\";\n    rotateButton.style.display = \"none\";\n    sendMessage(\"Launch an attack!\");\n    // Randomly generate computer's ships\n    for (let i = 5; i > 1; i--) {\n        if (i == 3) {\n            computer.board.getRandomCoordinates((0,_ship__WEBPACK_IMPORTED_MODULE_1__.Ship)(i));\n            computer.board.getRandomCoordinates((0,_ship__WEBPACK_IMPORTED_MODULE_1__.Ship)(i));\n        } else {\n        computer.board.getRandomCoordinates((0,_ship__WEBPACK_IMPORTED_MODULE_1__.Ship)(i));\n        }\n    }\n    console.log(computer.board.displayShips());\n}\n\nfunction sendMessage(message) {\n    messageBoard.textContent = message;\n}\n\nrenderPlacement(5);\nsendMessage(\"Place your ships\");\n\n\n//# sourceURL=webpack://battleship/./src/app.js?");

/***/ }),

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GameBoard\": () => (/* binding */ GameBoard)\n/* harmony export */ });\nfunction GameBoard() {\n    const coordinates = [];\n    const ships = [];\n    const missedAttacks = [];\n    const hitAttacks = [];\n    const targets = [];\n    function isValidCoords(coords, shipLength, isHorizontal) {\n        if (JSON.stringify(coordinates).includes(JSON.stringify(coords))) {\n            console.log(\"Match\");\n            return false;                 \n        }\n        for (let i = 1; i < shipLength; i++) {\n            if (isHorizontal) {\n                if ((coords[0] + shipLength > 10) || (JSON.stringify(coordinates).includes(JSON.stringify([coords[0] + i, coords[1]])))) {\n                    return false;\n                }\n            } else {\n                if ((coords[1] + shipLength > 10) || (JSON.stringify(coordinates).includes(JSON.stringify([coords[0], coords[1] + i])))) {\n                    return false;\n                }\n            }\n        }\n        return true;\n    }\n    function setCoordinates(ship, x, y, isHorizontal) {\n        ship.coordinates.push([x, y]);\n        coordinates.push([x, y]);\n        for (let i = 1; i < ship.length; i++) {\n            if (isHorizontal) {\n                x = x + 1;\n            } else {\n                y = y + 1;\n            }\n            ship.coordinates.push([x, y]);\n            coordinates.push([x, y]);\n        }\n        ships.push(ship);\n    }\n    return {\n        targets: targets,\n        hitAttacks: hitAttacks,\n        missedAttacks: missedAttacks,\n        getRandomCoordinates(ship) {\n            const shipLength = ship.length;\n            const isHorizontal = Math.random() > 0.5 ? true : false;\n            let x;\n            let y;\n            while (true) {\n                x = Math.floor(Math.random() * 10);\n                y = Math.floor(Math.random() * 10);\n                if (!isValidCoords([x, y], shipLength, isHorizontal)) {\n                    continue;\n                } else {\n                    break;\n                }\n            }\n            setCoordinates(ship, x, y, isHorizontal);\n        },\n        getCoordinates(ship, coords, isHorizontal) {\n            if (isValidCoords(coords, ship.length, isHorizontal)) {\n                let x = coords[0];\n                let y = coords[1];\n                setCoordinates(ship, x, y, isHorizontal);\n            } else {\n                return false;\n            }\n        },\n        receiveAttack(coords) {\n            let hitShip = false;\n            for (let i = 0; i < ships.length; i++) {\n                if (JSON.stringify(ships[i].coordinates).includes(JSON.stringify(coords))) {\n                    ships[i].hit();\n                    hitShip = true;\n                    hitAttacks.push(coords);\n                    targets.push([coords[0], coords[1] - 1], [coords[0], coords[1] + 1], [coords[0] + 1, coords[1]], [coords[0] - 1, coords[1]]);\n                    return ships[i];\n                }\n            }       \n            if (!hitShip) {\n                missedAttacks.push(coords);\n                return false;\n            }\n        },\n        displayShips() {\n            return ships;\n        },\n        displayCoordinates() {\n            return coordinates;\n        },\n        deleteShips() {\n            ships.splice(0, ships.length);\n        },\n        allShipsSunk() {\n            for (let i = 0; i < ships.length; i++) {\n                if (ships[i].sunk == false) {\n                    return false;\n                }\n            }\n            return true;\n        },\n        randomCoordinate() {\n            let x = Math.floor(Math.random() * 10);\n            let y = Math.floor(Math.random() * 10);\n            return [x, y];\n        },\n        displayMissedAttacks() {\n            return missedAttacks;\n        },\n    }\n}\n\n\n\n//# sourceURL=webpack://battleship/./src/gameboard.js?");

/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Player\": () => (/* binding */ Player)\n/* harmony export */ });\n/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ \"./src/gameboard.js\");\n\n\n\nfunction Player(name) {\n    return {\n        name: name,\n        board: (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__.GameBoard)(),\n    }\n}\n\n\n\n//# sourceURL=webpack://battleship/./src/player.js?");

/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Ship\": () => (/* binding */ Ship)\n/* harmony export */ });\nfunction Ship(length) {\n    return {\n        length: length,\n        hits: 0,\n        coordinates: [],\n        sunk: false,\n        hit() {\n            this.hits += 1;\n        },\n        isSunk() {\n            if (this.hits == this.length) {\n                this.sunk = true;\n                return true;\n            }\n        }\n    }\n}\n\n\n\n//# sourceURL=webpack://battleship/./src/ship.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/app.js");
/******/ 	
/******/ })()
;