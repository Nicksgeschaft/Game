import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import React from 'react'

import { deleteGame, deletePlayer, getGameByID } from '../communication/Communication'

import { firstSelectionProcess, redoFirstSelectionProcess } from './selectionProcess/FirstSelectionProcess'
import { moveAmazone, redoMove } from './selectionProcess/SecondSelectionProcess'
import { shotArrow } from './selectionProcess/ThirdSelectionProcess'

import { letter } from './letter'
import { BackgroundColor, PlaceAmazons } from './RenderBoard'

export default function Game() {

  const [searchParams] = useSearchParams();

  var gameId = searchParams.get('gameId');
  if (gameId === undefined || gameId === null || Number.isNaN(gameId)) {
    gameId = '-1'
  }

  var userId = searchParams.get('userId');
  if (userId === undefined || userId === null || Number.isNaN(userId)) {
    userId = '-1'
  }

  // console.log("Das ist von der Game.js, um zu sehen ob es die ID von searchParams: " + gameId);

  var navigate = useNavigate();

  // Spieler 1: blau, turnPlayer = 0 pieceblack
  // Spieler 2: rot, turnPlayer = 1 piecewhite

  // Variablen
  const gameboard = useRef({ board: undefined });
  const currentPlayer = useRef();
  const thereIsAWinner = useRef(false);
  const winningPlayer = useRef();
  const selectedCoordinates = useRef({ currentRow: undefined, currentColumn: undefined });
  const amazoneSelected = useRef(0);
  const firstRunFinished = useRef(false);
  const elementLoaded = useRef(false);
  const selectionProcess = useRef({
    startrow: undefined,
    startcolumn: undefined,
    endrow: undefined,
    endcolumn: undefined,
    shotrow: undefined,
    shotcolumn: undefined
  })
  const figureAssigned = useRef({ pOne: undefined, pTwo: undefined });



  const fetchGameData = () => {
    const game = getGameByID(gameId).then((g) => {
      // console.log(g);
      gameboard.current.board = g.board;
      g.turnPlayer === 0 ? currentPlayer.current = g.players[0].id : currentPlayer.current = g.players[1].id;
      winningPlayer.current = g.winningPlayer;
      figureAssigned.current.pOne = g.players[0].id;
      figureAssigned.current.pTwo = g.players[1].id;
      return g;
    }).catch((error) => {
      console.log("setGame error. Message is: " + error.message);
      return { message: error.message };
    });


    return game;
  }

  async function firstRun() {
    const g = await fetchGameData();
    if (firstRunFinished.current === false) {
      // console.log(await g);
      figureAssigned.current.pOne = g.players[0].id;
      figureAssigned.current.pTwo = g.players[1].id;
      firstRunFinished.current = true;
    }
  }

  const element = async (boolean) => {
    await firstRun();
    if (elementLoaded.current === true && boolean !== true) return; // abbruchbedingung, da nur einmal ausgeführt werden soll, außer es wird spezifisch aufgerufen
    const parent = document.getElementById("parent");
    parent.style.width = 50 + '%'
    parent.style.height = 80 + '%'
    const board = gameboard.current.board.squares;
    // Felder samt inhalt wird erstellt
    board.forEach((row, indexr) => {
      row.forEach((column, indexc) => {
        const child = document.createElement("div");
        child.id = letter(indexc) + indexr;
        child.className = BackgroundColor(indexr, indexc);
        parent.appendChild(child);
        loadAmazone(column, indexc, indexr);
      })
    })
    // Größe der Felder wird definiert
    var box = document.getElementsByClassName("box");
    for (let i = 0; i < box.length; i++) {
      box[i].style.width = (1 / gameboard.current.board.rows) * 100 + '%'
    }
    for (let i = 0; i < box.length; i++) {
      box[i].style.height = (parent.offsetHeight / gameboard.current.board.rows) + 'px';
    }

    // aktueller Spieler wird angezeigt
    document.getElementById("currentPlayer").textContent = currentPlayer.current
    var g = await getGameByID(gameId)
    if (currentPlayer.current === figureAssigned.current.pOne) {
      var cplayerone = g.players[0].name
      document.getElementById("currentPlayer").textContent = "Spieler 1: " + cplayerone
    } else {
      var cplayertwo = g.players[1].name;
      document.getElementById("currentPlayer").textContent = "Spieler 2: " + cplayertwo
    }
    elementLoaded.current = true;
  }

  const loadAmazone = (val, c, r) => {
    var str = " " + PlaceAmazons(val);
    var box = document.getElementById(letter(c) + r);
    box.className += str;
  }

  const loadPlayfield = async () => {
    var g = await getGameByID(gameId);
    // console.log();
    var turnId = g.turnPlayer
    // console.log(currentPlayer.current !== g.players[turnId].id);
    if (currentPlayer.current !== g.players[turnId].id) {
      var parent = document.getElementById("parent");
      if (parent.childElementCount !== 0) {
        while (parent.childElementCount > 0) {
          parent.removeChild(parent.lastChild);
        }
      }
      element(true)
    }
  }

  const myInterval = setInterval(loadPlayfield, 1000)

  // Funktion für onClick Ereignis
  const select = async (row, column) => {
    await getGameByID(gameId)
    /**
    * Bedingung: es gibt keinen Gewinner
    * -> führe den Algorithmus aus
    */
    
    if (thereIsAWinner.current === false && currentPlayer.current === Number(userId)) {
      /**
       * 1te Überprüfung: wurde noch keine Amazone gewählt -> merke Amazone und markiere mögliche Züge
       * 2te Überprüfung: es ist eine Amazone gewählt und erneut gleiche ausgewählt -> lösche alle Einträge aus 1.
       * 3te Überprüfung: es ist eine Amazone gewählt -> bewege die Amazone
       * 4te Überprüfung: es wurde die Amazone bewegt und wählt nochmal die Amazone -> setze die Amazone zurück und lösche alle Einträge aus 1.
       * else: verschieße den Pfeil und beende den Zug
       */
      
      const g = await fetchGameData();

      // falls noch keine Amazone gewählt wurde
      if (amazoneSelected.current === 0) {
        
        if (firstSelectionProcess(row, column, g, currentPlayer.current, figureAssigned.current) === true) {
          // speichere letztes gewähltes Feld
          selectedCoordinates.current.currentRow = row;
          selectedCoordinates.current.currentColumn = column
          // setze auf 1, weil Amazone ausgewählt wurde
          amazoneSelected.current = 1
          // speichere Koordinaten der Amazone für den Startpunkt des Zuges
          selectionProcess.current.startrow = row;
          selectionProcess.current.startcolumn = column
        }
      }
      // falls gleiches Feld nochmal ausgewählt wird, entferne wieder die Anzeige der möglichen Züge
      else if (amazoneSelected.current === 1 && (selectedCoordinates.current.currentColumn === column && selectedCoordinates.current.currentRow === row)) {
        
        await redoFirstSelectionProcess();
        // setze letztes Feld auf Koordinaten auserhalb des wählbaren Bereichs
        selectedCoordinates.current.currentRow = -1;
        selectedCoordinates.current.currentColumn = -1;
        // setze den Wert auf 0, da keine Amazone mehr ausgewählt ist
        amazoneSelected.current = 0;
      }
      // Zweig für den Zug
      else if (amazoneSelected.current === 1) {
        
        await moveAmazone(row, column, gameboard.current, selectionProcess.current);
        // speichere letzten gewählte Koordinaten
        selectedCoordinates.current.currentRow = row;
        selectedCoordinates.current.currentColumn = column;
        // setze den Wert auf 2, weil wir die Amazone bewegt haben
        amazoneSelected.current = 2;
        // merke die Position, an die sich die Amazone bewwegt hat
        selectionProcess.current.endrow = row;
        selectionProcess.current.endcolumn = column;
      }
      // falls gleiches Feld nochmal ausgewählt wird, entferne wieder die Anzeige der möglichen Ziele
      else if (amazoneSelected.current === 2 && (selectedCoordinates.currentColumn === column && selectedCoordinates.currentRow === row)) {
        
        redoMove();
        // setze den Wert auf 1, da die Amazone wieder auf ihre Startposition gesetzt wird
        amazoneSelected.current = 0;
      }
      // verschieße den Pfeil
      else if (amazoneSelected.current === 2) {
        
        await shotArrow(row, column, Number(gameId), currentPlayer.current, selectionProcess.current, amazoneSelected.current);
        // speicher letzte Auswahl
        selectedCoordinates.current.currentRow = row;
        selectedCoordinates.current.currentColumn = column;
        // setzt Wert auf 0 da der Zug beendet wird
        amazoneSelected.current = 0;
        // merkt sich die Position, an die der Pfeil verschossen wurde
        selectionProcess.current.shotrow = row;
        selectionProcess.current.shotcolumn = column;
        // aktuelles Spielbrett aktuallisieren
        var newGameData = await fetchGameData();
        
        gameboard.current.board = newGameData.board;
        g.turnPlayer === 0 ? currentPlayer.current = g.players[0].id : currentPlayer.current = g.players[1].id;
        winningPlayer.current = newGameData.winningPlayer;


      }
      else {
        console.log("wtf you doing here? you ain't supposed to be here!!");
      }
    }
    // wenn es einen Gewinner gibt
    const w = await fetchGameData();
    
    if (w.winningPlayer !== undefined) {
      // console.log("WINNING PLAYER: " + (w.winningPlayer === 0 ? "Spieler1" : "Spieler2"));
      document.getElementById("currentPlayer").textContent = "GEWINNER: " + (Number(await w.winningPlayer) === 0 ? "Spieler 1" : "Spieler 2");
      winningPlayer.current = w.winningPlayer;
      thereIsAWinner.current = true
      
      return;
    }

    // Spieler, der am Zug ist anzeigen
    document.getElementById("currentPlayer").textContent = currentPlayer.current
    if (currentPlayer.current === figureAssigned.current.pOne) {
      var cplayerone = w.players[0].name;
      document.getElementById("currentPlayer").textContent = "Spieler 1: " + cplayerone
    } else {
      var cplayertwo = w.players[1].name;
      document.getElementById("currentPlayer").textContent = "Spieler 2: " + cplayertwo
    }

  }




  function Navigatehelp() {
    navigate("/Help/?userId=" + userId + "&gameId=" + gameId)
  }

  // Funktion um zu Hilfe zu navigieren
  async function Navigateback() {
    clearInterval(myInterval);
    var g = await getGameByID(gameId)
    var controllable = g.players[1].controllable
    if(controllable === false) await deletePlayer(figureAssigned.current.pTwo)
    await deleteGame(gameId);
    await deletePlayer(userId);
    navigate("/");
  }

  useEffect(() => {
    element();
  });

  window.addEventListener("click", evt => {
    const targetClick = evt.target.className;
    if (targetClick.includes("box")) {
      // console.log(evt.target.id);
      const row = Number(evt.target.id.charAt(1));
      const column = Number((evt.target.id.charCodeAt(0) - 97));
      // console.log(row + ", " + column);
      select(row, column);
    }
  })

  return (
    <div className='outer-container'>
      <div className="Ui">
        <div className='grid-container'>

          <div className='grid-item'><h1 className='CurrentPlayer'>Aktueller Spieler</h1></div>
          <div className='grid-item'><p id="currentPlayer" className='currentPlayerone'></p></div>
          <div className='grid-item'><input type="button" className="resetGame" value="Aktuelles Spiel Beenden" onClick={Navigateback}></input></div>
          <div className='grid-item'><input type="button" className="resetGame help" value="Hilfe" onClick={Navigatehelp} /></div>
        </div>
      </div>
      <div className="board" id="parent">
      </div>
    </div>
  )
}



