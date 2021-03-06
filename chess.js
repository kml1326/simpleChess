// create the board
//  - 8 * 8 grid 
//  - alternate black and white cells
//      - starts with white
//  - Cell
//    - color
//    - id
//    - piece?
//  - Each square has an id
// - Arrangement of the board
//  
// create a chess object
//  - unique chess piece keys
// Pieces
//  - currentPos (rows, cols)
//  - possiblePos
//  - name
//  - color
//  - uniqueMoveLogic??
//  - move - func
// Conditions
//  - kill
//  - Check
//    - checkmate
//  - castling

var columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
var rows = [1, 2, 3, 4, 5, 6, 7, 8];

var INIT_WHITE = {
  'A1': 'rook',
  'B1': 'knight',
  'C1': 'bishop',
  D1: 'king',
  'E1': 'queen',
  'F1': 'bishop',
  'G1': 'knight',
  'H1': 'rook',
  'A2': 'pawn',
  'B2': 'pawn',
  'C2': 'pawn',
  'D2': 'pawn',
  'E2': 'pawn',
  'F2': 'pawn',
  'G2': 'pawn',
  'H2': 'pawn',
}

var INIT_BLACK = {
  'A8': 'rook',
  'B8': 'knight',
  'C8': 'bishop',
  D8: 'queen',
  'E8': 'king',
  'F8': 'bishop',
  'G8': 'knight',
  'H8': 'rook',
  'A7': 'pawn',
  'B7': 'pawn',
  'C7': 'pawn',
  'D7': 'pawn',
  'E7': 'pawn',
  'F7': 'pawn',
  'G7': 'pawn',
  'H7': 'pawn',
}

var possibleMovesObj = {
  pawn: findPossiblePawnPos,
  bishop: findPossibleBishopPos,
  rook: findPossibleRookPos,
  knight: findPossibleKnightPos,
  // king: findPossibleKingPos,
  queen: findPossibleQueenPos,
}

var currentMover = 'white';

var selectedPiece;

var cells = {}; // Store of truth 

function assignPiece(row, col) {
  var id = col + row;

  if (INIT_WHITE[id]) {
    return new Piece(INIT_WHITE[id], 'white', row, col, INIT_WHITE[id])
  } else if (INIT_BLACK[id]) {
    return new Piece(INIT_BLACK[id], 'black', row, col, INIT_BLACK[id])
  } else {
    return null;
  }
}

rows.forEach((row, i) => {
  columns.forEach((col, j) => {
    var cell = {
        color: (i + j) % 2 == 0 ? 'white' : 'black',
        row: row,
        col: col,
        piece: assignPiece(row, col)
      }
      // cell.piece.updatePossibleMoves();

    cells[col + row] = cell;
  })
});

// 2 col, 1 row
// 2 row, 1 col
function findPossibleKnightPos(obj) { // 'A4'

  var potentialPos = [];

  var indexOfObjCol = columns.indexOf(obj.col);

  var potentialColumns = [];

  columns.forEach((col, index) => {
    if (Math.abs(index - indexOfObjCol) <= 2 && Math.abs(index - indexOfObjCol) !== 0) {
      potentialColumns.push(col);
    }
  });

  potentialColumns.forEach((col, index) => {
    if (Math.abs(columns.indexOf(col) - indexOfObjCol) == 2) {
      (rows.indexOf(obj.row - 1) !== -1) ? potentialPos.push(col + (obj.row - 1)): null;
      (rows.indexOf(+obj.row + 1) !== -1) ? potentialPos.push(col + (+obj.row + 1)): null;
    } else {
      (rows.indexOf(obj.row - 2) !== -1) ? potentialPos.push(col + (obj.row - 2)): null;
      (rows.indexOf(+obj.row + 2) !== -1) ? potentialPos.push(col + (+obj.row + 2)): null;
    }
  });
  potentialPos = potentialPos.reduce((acc,v) => {
    if(!checkCellPieceColor(cells[v])) acc.push(v);
    else if (checkCellPieceColor(cells[v]) !== obj.color) acc.push(v);
    return acc;
  },[]);

  return potentialPos;
}

function findPossiblePawnPos(obj) {

  var potentialPos = [];
  var indexOfObjCol = columns.indexOf(obj.col);

  var oneJump;
  var twoJump;

  if (obj.color == "black") {
    oneJump = 1;
    twoJump = 2;
  } else {
    oneJump = -1;
    twoJump = -2;
  }

  if (obj.color === 'black') {

    if (obj.timesMoved === 0) {
      potentialPos.push(obj.col + (Number(obj.row) - 1));
      potentialPos.push(obj.col + (Number(obj.row) - 2));
    } else {
      potentialPos.push(obj.col + (Number(obj.row) - 1));
    }
    if (columns[indexOfObjCol + 1] + (Number(obj.row) - 1)) {
      let pieceColor = checkCellPieceColor(cells[columns[indexOfObjCol + 1] + (Number(obj.row) - 1)]);
      if (pieceColor) {
        if (pieceColor == obj.color) return;
        else potentialPos.push(columns[indexOfObjCol + 1] + (Number(obj.row) - 1));
      }
    }
    if (columns[indexOfObjCol - 1] + (Number(obj.row) - 1)) {
      let pieceColor = checkCellPieceColor(cells[columns[indexOfObjCol - 1] + (Number(obj.row) - 1)])
      if (pieceColor) {
        if (pieceColor == obj.color) return;
        else potentialPos.push(columns[indexOfObjCol - 1] + (Number(obj.row) - 1));
      }
    }

  } else {

    if (obj.timesMoved === 0) {
      potentialPos.push(obj.col + (Number(obj.row) + 1));
      potentialPos.push(obj.col + (Number(obj.row) + 2));
    } else {
      potentialPos.push(obj.col + (Number(obj.row) + 1));
    }
    if (columns[indexOfObjCol + 1] + (Number(obj.row) + 1)) {
      let pieceColor = checkCellPieceColor(cells[columns[indexOfObjCol + 1] + (Number(obj.row) + 1)])
      if (pieceColor) {
        if (pieceColor == obj.color) return;
        else potentialPos.push(columns[indexOfObjCol + 1] + (Number(obj.row) + 1));
      }
    }
    if (columns[indexOfObjCol - 1] + (Number(obj.row) + 1)) {
      let pieceColor = checkCellPieceColor(cells[columns[indexOfObjCol - 1] + (Number(obj.row) + 1)])
      if (pieceColor) {
        if (pieceColor == obj.color) return;
        else potentialPos.push(columns[indexOfObjCol - 1] + (Number(obj.row) + 1));
      }
    }

  }

  return potentialPos;

}

function findPossibleQueenPos(obj) {
  var potentialPos = [];
  var indexOfObjCol = columns.indexOf(obj.col);

  // Rook like movement
  columns.filter(item => item != obj.col).forEach((ele) => {
    potentialPos.push(ele + obj.row);
  });

  rows.filter(item => item != obj.row).forEach((ele) => {
    potentialPos.push(obj.col + ele);
  });

  // Bishop like movement
  var potentialColumns = [];

  columns.forEach((col, index) => {
    if ((index - indexOfObjCol) !== 0) {
      potentialColumns.push(col);
    }
  });

  potentialColumns.forEach((col, index) => {
    rows.forEach(row => {
      // console.log(Math.abs(col.indexOf(obj.col) - col.indexOf(col)) , Math.abs(obj.row-row))
      (Math.abs(columns.indexOf(obj.col) - columns.indexOf(col)) == Math.abs(obj.row - row)) ? potentialPos.push(col + row): null;
    })
  });
  return potentialPos;
}

function findPossibleRookPos(obj) {
  var potentialPos = [];
  var indexOfObjCol = columns.indexOf(obj.col);
  // columns.filter(item => item != obj.col).forEach((ele) => {
  //   potentialPos.push(ele + obj.row);
  // });

  // rows.filter(item => item != obj.row).forEach((ele) => {
  //   potentialPos.push(obj.col + ele);
  // });

  // var directions = [
  //   [-1, 0, -1],
  //   [],
  //   [],
  //   []
  // ]

  // // Column back
  // for (let colOff = -1, rowOff = 0; colOff >= 0; colOff--) {
  //   let pieceColor = checkCellPieceColor(cells[columns[colOff] + obj.row]);
  //   if (cells[columns[indexOfObjCol + colOff] + (obj.row + rowOff)].piece) {
  //     if (pieceColor != obj.color) {
  //       potentialPos.push(columns[colOff] + (obj.row + rowOff))
  //     }
  //     break;
  //   }
  //   potentialPos.push(columns[colOff] + obj.row)
  // }

  // Column back
  for (let i = indexOfObjCol - 1; i >= 8; i--) {
    let pieceColor = checkCellPieceColor(cells[columns[i] + obj.row]);
    if (cells[columns[i] + obj.row].piece) {
      if (pieceColor != obj.color) {
        potentialPos.push(columns[i] + obj.row)
      }
      break;
    }
    potentialPos.push(columns[i] + obj.row)
  }

  // Column forward
  for (let i = indexOfObjCol + 1; i < 8; i++) {
    let pieceColor = checkCellPieceColor(cells[columns[i] + obj.row]);
    if (cells[columns[i] + obj.row].piece) {
      if (pieceColor != obj.color) {
        potentialPos.push(columns[i] + obj.row)
      }
      break;
    }
    potentialPos.push(columns[i] + obj.row)
  }

  // Row up;
  for (let i = obj.row - 1; i >= 1; i--) {
    let pieceColor = checkCellPieceColor(cells[obj.col + i]);
    if (cells[obj.col + i].piece) {
      if (pieceColor != obj.color) {
        potentialPos.push(obj.col + i)
      }
      break;
    }
    potentialPos.push(obj.col + i)
  }

  // Row down;
  // debugger;
  var rowNumber = Number(obj.row)
  for (let i = rowNumber + 1; i <= 8; i++) {
    let pieceColor = checkCellPieceColor(cells[obj.col + i]);
    if (cells[obj.col + i].piece) {
      if (pieceColor != obj.color) {
        potentialPos.push(obj.col + i)
      }
      break;
    }
    potentialPos.push(obj.col + i)
  }

  return potentialPos;
}

function Piece(name, color, row, col, type) {
  this.name = name;
  this.color = color;
  this.type = type;
  this.row = row;
  this.col = col;
  this.timesMoved = 0;
  this.possiblePositions = [];
  this.updatePossibleMoves = function() {
      this.possiblePositions = possibleMovesObj[this.type](this);
      this.possiblePositions.forEach((item) => {
        console.log(document.getElementById(item))
        document.getElementById(item).classList.add('highlight')
      })

    }
    // position - A1
    // check for validity of move
    // move.
  this.move = function(pos) {
    // TODO:check the validity of move.
    this.possiblePositions = possibleMovesObj[this.type](this);
    if (!this.possiblePositions.includes(pos)) {
      console.log("invalid move", this, pos);

      return;
    }
    var currentPos = this.col + this.row;
    var nextPos = pos;

    this.col = nextPos.split('')[0];
    this.row = nextPos.split('')[1];

    console.log('I am supposed to move to ', nextPos, 'and my current pos is', currentPos);

    // empty the .piece property on the cell object
    cells[currentPos].piece = null;
    // set an new .piece prop on the nextPos cell obj
    // kill logic
    cells[nextPos].piece = this;

    // flip the currentMover
    currentMover = this.color == 'white' ? 'black' : 'white';
    selectedPiece = null;

    ++this.timesMoved;

    renderGame();
  }
}

function renderGame() {
  var htmlString = '';
  for (var cell in cells) {
    var pieceInfo = cells[cell].piece ? cells[cell].piece.color + '-' + cells[cell].piece.name : '';
    htmlString += `<div id="${cell}" class="${cells[cell].color} cell" data-piece="${pieceInfo}"></div>`;
  }

  var root = document.getElementById('chess-board');
  root.innerHTML = htmlString;

  //addEventListeners
  var allCells = document.querySelectorAll('.cell');

  allCells.forEach((cell, index) => {
    cell.addEventListener('click', () => {

      if (cells[cell.id].piece && (cells[cell.id].piece.color == currentMover)) {
        selectedPiece = cells[cell.id].piece;
        console.log(selectedPiece)
        selectedPiece.updatePossibleMoves();
        return;
      }

      if (selectedPiece) {
        selectedPiece.move(cell.id);
      }

    });
  })
}

renderGame();


function checkCellPieceColor(cell) {
  if (!cell.piece) return null;
  return cell.piece.color;
}



function findPossibleBishopPos(obj) {
  var potentialPos = [];

  var indexOfObjCol = columns.indexOf(obj.col);
  var indexOfObjRow = rows.indexOf(+obj.row);

  var directions = [
    [+1, +1],
    [+1, -1],
    [-1, +1],
    [-1, -1],
  ]
  directions.forEach(val => {
    for (let c = indexOfObjCol + val[0], r = indexOfObjRow + val[1]; c >= 0 && r >= 0 && c < 8 && r < 8; c += val[0], r += val[1]) {
      let CellPcolor = checkCellPieceColor(cells[columns[c] + rows[r]]);
      if (!CellPcolor) {
        potentialPos.push(columns[c] + rows[r]);
      } else {
        if (CellPcolor !== obj.color) {
          potentialPos.push(columns[c] + rows[r])
        };
        break;
      }
    }
  });
  return potentialPos;
}