/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */ 
class Game {
  constructor(width, height, players){
    this.width = width;
    this.height = height;
    this.gameOver = false;
    this.players = players;
    this.playerIndex = 0;
    this.currPlayer = players[0]; // first player in array
    this.makeBoard(); 
    this.makeHtmlBoard();
    }
  


  /** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x]) */
makeBoard() {
  this.board = [];  // array of rows, each row is array of cells  (board[y][x])
  for (let y = 0; y < this.height; y++) {
    this.board.push(Array.from({ length: this.width }));
  }
}


/** makeHtmlBoard: make HTML table and row of column tops. */
makeHtmlBoard() {
  const board = document.getElementById('board');
  board.innerHTML = ""

  // make column tops (clickable area for adding a piece to that column)
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.addEventListener('click', this.handleClick.bind(this));

  for (let x = 0; x < this.width; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }

  board.append(top);

  // make main part of board
  for (let y = 0; y < this.height; y++) {
    const row = document.createElement('tr');

    for (let x = 0; x < this.width; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }

    board.append(row);
  }
};


/** findSpotForCol: given column x, return top empty y (null if filled) */
findSpotForCol(x) {
  for (let y = this.height - 1; y >= 0; y--) {
    if (!this.board[y][x]) {
      return y;
    }
  }
  return null;
}


/** placeInTable: update DOM to place piece into HTML table of board */
placeInTable(y, x, color) {
  const piece = document.createElement('div');
  piece.classList.add("piece"); 
  piece.style.backgroundColor = color;
  piece.style.top = -50 * (y + 2);
  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}


/** endGame: announce game end */
endGame(msg) {
  setTimeout(function(){
    alert(msg);
  }, 500)
}


/** handleClick: handle click of column top to play piece */
handleClick(evt) {
  if (this.gameOver) {return;}

  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if full, ignore click)
  const y = this.findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  this.board[y][x] = this.currPlayer.num;
  this.placeInTable(y, x, this.currPlayer.color);
  
  // check for win
  if (this.checkForWin()) {
    this.gameOver = true;
    return this.endGame(`${this.currPlayer.color} player won!!`);
  }
  
  // check for tie
  if (this.board.every(row => row.every(cell => cell))) {
    return this.endGame('Tie!');
  }
    
  // switch players
  if (this.playerIndex == (this.players.length - 1)) {
    this.currPlayer = this.players[0]
    this.playerIndex = 0
   } else {
    this.playerIndex++;
     this.currPlayer = this.players[this.playerIndex]
   };
}


/** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {
    const _win = cells => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer.num
      );
    }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }}}
  }
}

// creates a new player class
class Player{
  constructor(id, color){
    this.color = color;
    this.num = id;
  }
}

// updates displayed player list
function updatePlayerList(player){
  const list = document.getElementById("playerList")
  const item = document.createElement("li")
  item.innerText = player.color;
  list.append(item);
}


let currGame = null
let playerCount = 1
let players = []

// Event listener to create new player
document.getElementById("newPlayerBut")
  .addEventListener("click", function(){
    // validate if color is recognised by the system using a test div
    const test = document.getElementById("colorTest")
    const color = document.getElementById("newPlayer").value;
    test.style.backgroundColor = color
    if (test.style.backgroundColor == color){
      // if passed validation, create new player
      const newPlayer = new Player(`p${playerCount}`,color)
      players.push(newPlayer);
      updatePlayerList(newPlayer);
      playerCount++;
      document.getElementById("newPlayer").value = "";
    } else{
      // not passed, send alert
      alert("Unrecognised color. Please choose a valid color.")
    }
    // const p2 = new Player("p2")
    // currGame = new Game (6,7,p1,p2);
});

// Event listener to create new game
document.getElementById("start")
  .addEventListener("click", ()=>{
    currGame = new Game (6,7,players);
});







