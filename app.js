import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

class Game2048 {
  constructor() {
    this.size = 4;
    this.board = this.createBoard();
    this.addNewTile();
    this.addNewTile();
  }

  createBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  addNewTile() {
    const emptyTiles = [];
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) emptyTiles.push([row, col]);
      }
    }

    if (emptyTiles.length === 0) return;

    const [row, col] =
      emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  printBoard() {
    console.clear();
    console.log(this.board.map((row) => row.join("\t")).join("\n"));
  }

  move(direction) {
    switch (direction) {
      case "w":
        this.moveUp();
        break;
      case "s":
        this.moveDown();
        break;
      case "a":
        this.moveLeft();
        break;
      case "d":
        this.moveRight();
        break;
      default:
        return false;
    }
    this.addNewTile();
    this.printBoard();
    return true;
  }

  moveUp() {
    for (let col = 0; col < this.size; col++) {
      let tiles = [];
      for (let row = 0; row < this.size; row++) {
        if (this.board[row][col] !== 0) tiles.push(this.board[row][col]);
      }
      tiles = this.mergeTiles(tiles);
      for (let row = 0; row < this.size; row++) {
        this.board[row][col] = tiles[row] || 0;
      }
    }
  }

  moveDown() {
    for (let col = 0; col < this.size; col++) {
      let tiles = [];
      for (let row = this.size - 1; row >= 0; row--) {
        if (this.board[row][col] !== 0) tiles.push(this.board[row][col]);
      }
      tiles = this.mergeTiles(tiles);
      for (let row = this.size - 1; row >= 0; row--) {
        this.board[row][col] = tiles[this.size - 1 - row] || 0;
      }
    }
  }

  moveLeft() {
    for (let row = 0; row < this.size; row++) {
      let tiles = this.board[row].filter((val) => val !== 0);
      tiles = this.mergeTiles(tiles);
      for (let col = 0; col < this.size; col++) {
        this.board[row][col] = tiles[col] || 0;
      }
    }
  }

  moveRight() {
    for (let row = 0; row < this.size; row++) {
      let tiles = this.board[row].filter((val) => val !== 0).reverse();
      tiles = this.mergeTiles(tiles).reverse();
      for (let col = 0; col < this.size; col++) {
        this.board[row][col] = tiles[col] || 0;
      }
    }
  }

  mergeTiles(tiles) {
    for (let i = 0; i < tiles.length - 1; i++) {
      if (tiles[i] === tiles[i + 1]) {
        tiles[i] *= 2;
        tiles.splice(i + 1, 1);
      }
    }
    return tiles;
  }
}

const game = new Game2048();
game.printBoard();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", (input) => {
  if (["w", "a", "s", "d"].includes(input)) {
    game.move(input);
  }
});
