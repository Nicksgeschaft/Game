import { letter } from "./letter.js"

// gleiches Vorgehen wie markMovable, bloß mit anderen className-Anhang
export const markShootable = async (currentSelectedRow, currentSelectedColumn, rowAmazon, columnAmazon, game) => {

  // GET-Aufruf, um Informationen über das laufende Spiel zu bekommen
  let b = game;
  // console.log(b);

  // Variablen
  const rowForShoot = currentSelectedRow
  const columnForShot = currentSelectedColumn

  let i = 1
  let board = b.board.squares
  board[rowAmazon][columnAmazon] = -1 // setzt das vorherige Feld der Amazone auf -1 (freies Feld)

  // Funktion
  const write = (l, n) => {
    let str = document.getElementById(l + n).className
    str += " arrowselected"
    document.getElementById(l + n).className = str
  }

  // Schleife, die nach unten alle erlaubten Felder markiert
  do {
    if (rowForShoot + i === b.board.rows ||
      (board[rowForShoot + i][columnForShot] === 0) ||
      (board[rowForShoot + i][columnForShot] === 1) ||
      (board[rowForShoot + i][columnForShot] === -2)) {
      break;
    }
    else {
      let l = letter(columnForShot);
      let n = rowForShoot + i;
      write(l, n);
    }
  } while (board[rowForShoot + i++][columnForShot] === -1)

  // Schleife, die nach oben alle erlaubten Felder markiert
  i = 1
  do {
    if (rowForShoot - i === -1 ||
      (board[rowForShoot - i][columnForShot] === 0) ||
      (board[rowForShoot - i][columnForShot] === 1) ||
      (board[rowForShoot - i][columnForShot] === -2)) {
      break
    }
    else {
      let l = letter(columnForShot);
      let n = rowForShoot - i;
      write(l, n);
    }
  } while (board[rowForShoot - i++][columnForShot] === -1)

  // Schleife, die nach links alle erlaubten Felder markiert
  i = 1
  do {
    if (columnForShot - i === -1 ||
      (board[rowForShoot][columnForShot - i] === 0) ||
      (board[rowForShoot][columnForShot - i] === 1) ||
      (board[rowForShoot][columnForShot - i] === -2)) {
      break
    }
    else {
      let l = letter(columnForShot - i);
      let n = rowForShoot;
      write(l, n);
    }
  } while (board[rowForShoot][columnForShot - i++] === -1)

  // Schleife, die nach rechts alle erlaubten Felder markiert
  i = 1
  do {
    if (columnForShot + i === b.board.columns ||
      (board[rowForShoot][columnForShot + i] === 0) ||
      (board[rowForShoot][columnForShot + i] === 1) ||
      (board[rowForShoot][columnForShot + i] === -2)) {
      break
    }
    else {
      let l = letter(columnForShot + i);
      let n = rowForShoot;
      write(l, n);
    }
  } while (board[rowForShoot][columnForShot + i++] === -1)

  // Schleife, die nach rechts-oben alle erlaubten Felder markiert
  i = 1
  do {
    if (rowForShoot - i === -1 ||
      columnForShot + i === b.board.columns ||
      (board[rowForShoot - i][columnForShot + i] === 0) ||
      (board[rowForShoot - i][columnForShot + i] === 1) ||
      (board[rowForShoot - i][columnForShot + i] === -2)) {
      break
    }
    else {
      let l = letter(columnForShot + i);
      let n = rowForShoot - i;
      write(l, n);
    }
  } while (board[rowForShoot - i][columnForShot + i++] === -1)

  // Schleife, die nach rechts-unten alle erlaubten Felder markiert
  i = 1
  do {
    if (rowForShoot + i === b.board.rows ||
      columnForShot + i === b.board.columns ||
      (board[rowForShoot + i][columnForShot + i] === 0) ||
      (board[rowForShoot + i][columnForShot + i] === 1) ||
      (board[rowForShoot + i][columnForShot + i] === -2)) {
      break
    }
    else {
      let l = letter(columnForShot + i);
      let n = rowForShoot + i;
      write(l, n);
    }
  } while (board[rowForShoot + i][columnForShot + i++] === -1)

  // Schleife, die nach links-oben alle erlaubten Felder markiert
  i = 1
  do {
    if (rowForShoot - i === -1 ||
      columnForShot - i === -1 ||
      (board[rowForShoot - i][columnForShot - i] === 0) ||
      (board[rowForShoot - i][columnForShot - i] === 1) ||
      (board[rowForShoot - i][columnForShot - i] === -2)) {
      break
    }
    else {
      let l = letter(columnForShot - i);
      let n = rowForShoot - i;
      write(l, n);
    }
  } while (board[rowForShoot - i][columnForShot - i++] === -1)

  // Schleife, die nach links-unten alle erlaubten Felder markiert
  i = 1
  do {
    if (rowForShoot + i === b.board.rows ||
      columnForShot - i === -1 ||
      (board[rowForShoot + i][columnForShot - i] === 0) ||
      (board[rowForShoot + i][columnForShot - i] === 1) ||
      (board[rowForShoot + i][columnForShot - i] === -2)) {
      break
    }
    else {
      let l = letter(columnForShot - i);
      let n = rowForShoot + i;
      write(l, n);
    }
  } while (board[rowForShoot + i][columnForShot - i++] === -1)
}

