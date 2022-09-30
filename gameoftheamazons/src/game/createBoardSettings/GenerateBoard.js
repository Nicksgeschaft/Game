import { useRef, useState } from "react";
import { newGame, generateAI } from "../../communication/Communication";
import { createBoard } from "../createBoard/CreateNewBoard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BackgroundColor } from "../RenderBoard"
import { letter } from "../letter"
import { PlaceAmazons } from "../RenderBoard";


export function GenerateBoard(u) {

    var navigate = useNavigate();

    const xSize = useRef();
    const timeout = useRef();

    // console.log(u.u);
    // const users = useRef({ pId: u.u.pId, opId: u.u.opId })
    // console.log(users.current);
    var gameID;

    const [settings, setSettings] = useState({ boardWidth: 10, timeoutTime: 60000 });
    const [boardPrev, setBoardPrev] = useState();
    const [change, setChange] = useState(0)

    function submit() {
        if (xSize.current.value === "" ||
            timeout.current.value === "" ||
            xSize.current.value < 5 ||
            timeout.current.value < 30000
        ) {
            return
        } else {
            setSettings({
                boardWidth: xSize.current.value,
                timeoutTime: timeout.current.value
            });
        }
        console.log(u);
    };



    async function startGame() {

        if (checkFigureValidity() === true && boardPrev !== undefined) {
            var b = u.checked
            console.log(u.checked);
            if (b === true) {
                var ai = await generateAI();
                var aiId = ai.id;
                console.log(aiId);

                const g = await newGame(
                    Number(settings.timeoutTime),
                    Number(settings.boardWidth),
                    Number(settings.boardWidth),
                    boardPrev,
                    Number(u.u.pId),
                    Number(aiId)
                )
                // console.log(await g);
                gameID = await g.id;
                // console.log(g.id);
                if (g.id !== undefined) {
                    navigate("/Game/?userId=" + u.u.userId + "&gameId=" + gameID)
                }
            } else {

                const g = await newGame(
                    Number(settings.timeoutTime),
                    Number(settings.boardWidth),
                    Number(settings.boardWidth),
                    boardPrev,
                    Number(u.u.pId),
                    Number(u.u.opId)
                )
                // console.log(await g);
                gameID = await g.id;
                // console.log(g.id);
                if (g.id !== undefined) {
                    navigate("/Game/?userId=" + u.u.userId + "&gameId=" + gameID)
                }
            }
        }
    }

    async function showField() {
        var bb = await createBoard(settings.boardWidth);
        setBoardPrev(bb);
        const appendTo = document.getElementById("sw")
        const parent = document.getElementById("parent");
        parent.style.width = appendTo.offsetWidth * 0.5 + 'px'
        parent.style.height = appendTo.offsetWidth * 0.5 + 'px'
        const board = bb;


        if (parent.childElementCount !== 0) {
            while (parent.childElementCount > 0) {
                parent.removeChild(parent.lastChild);
            }
        }
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const child = document.createElement("div");
                child.id = letter(j) + i;
                child.className = BackgroundColor(i, j);
                parent.appendChild(child);
            }

        }

        var box = document.getElementsByClassName("box");
        for (let i = 0; i < box.length; i++) {
            box[i].style.width = (1 / settings.boardWidth) * 100 + '%'
        }
        for (let i = 0; i < box.length; i++) {
            box[i].style.height = (parent.offsetHeight / settings.boardWidth) + 'px';
        }
        document.getElementById("grayChoose").classList.remove("grayed");
    }


    const checkFigureValidity = () => {
        var p1hasAFigure = false;
        var p2hasAFigure = false;

        for (let i = 0; i < boardPrev.length; i++) {
            for (let j = 0; j < boardPrev[i].length; j++) {
                if (boardPrev[i][j] === 0 && p1hasAFigure === false) {
                    p1hasAFigure = true;
                    // console.log(p1hasAFigure);
                    continue;
                }
                if (boardPrev[i][j] === 1 && p2hasAFigure === false) {
                    p2hasAFigure = true;
                    // console.log(p1hasAFigure);
                    continue;
                }
                if (p1hasAFigure === true && p2hasAFigure === true) {
                    // console.log(p1hasAFigure + " | " + p2hasAFigure);
                    return true;
                }
            }

        }
        // console.log(p1hasAFigure + " | " + p2hasAFigure);
        return (p1hasAFigure && p2hasAFigure);
    }

    const loadAmazone = (val, c, r) => {
        var str = " " + PlaceAmazons(Number(val));
        var box = document.getElementById(letter(c) + r);
        box.className += str;
    }

    function changeAmazone() {
        change === 0 ? setChange(1) : setChange(0);
        document.getElementById("grayCreate").classList.remove("grayed");
    }

    const clicks = (evt) => {
        const targetClick = evt.target.className

        if (targetClick.includes("box")) {
            const row = Number(evt.target.id.charAt(1));
            const column = Number((evt.target.id.charCodeAt(0) - 97));

            if (boardPrev !== undefined) {
                if (boardPrev[row][column] === -1) {
                    boardPrev[row][column] = change;
                    loadAmazone(change, column, row);
                } else {
                    boardPrev[row][column] = -1;
                    var el = document.getElementById(letter(column) + row);
                    if (el.className.includes("pieceblack")) el.classList.remove("pieceblack");
                    else el.classList.remove("piecewhite");
                }
                console.log(boardPrev);
            }
        }
    }

    // const createAI = async () => {
    //     // console.log(document.getElementById("playAgainstAI"));
    //     if (document.getElementById("playAgainstAI").checked === true) {
    //         var aiId = await generateAI();
    //         users.opId = aiId;
    //     } else return;
    // }

    return (
        <div className="settingswindow" id="sw">

            <div className="input">
                <p>Gib die Größe des Spielfeldes an: </p>
                <input id="inputBoardSize" type="number" ref={xSize} value={settings.boardWidth} min="5" max="25" onChange={submit} />
                <p>Dauer des Zuges (ms): </p>
                <input id="inputTimeoutLength" type="number" ref={timeout} value={settings.timeoutTime} min="30000" onChange={submit} />
                <p>Gegen AI spielen:
                    <input type="checkbox" id="playAgainstAI" value="Play against AI" /*onClick={createAI}*/></input></p>
            </div>
            <div className="submitbutton">

                <input type="button" className="showUserPlayfield" value={"showField"} onClick={showField} />
            </div>
            <div id="grayChoose" className="chooseAmazon grayed">
                <input type="button" className="setAmazone grayed" value="changePlayerAmazone" onClick={changeAmazone} />
                <p>gewählte Amazone: Spieler {change + 1}</p>
            </div>
            <div id="grayCreate" className="create grayed">
                <input type="button" id="createGame" className="createGame" value={"createGame"} onClick={startGame} />
                <div className="currentBoard" id="parent" onClick={clicks}></div>
            </div>
        </div>
    )

}

