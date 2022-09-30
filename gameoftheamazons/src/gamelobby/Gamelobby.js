import React, { useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import LoginForm from '../game/loginForm/LoginForm';
import { GenerateBoard } from '../game/createBoardSettings/GenerateBoard';
import { createPlayer, deletePlayer, getGames, getPlayers } from '../communication/Communication';

export default function Gamelobby() {
    const [searchParams] = useSearchParams();
    // const [userId, setUserId] = useState({current: undefined});
    // const [pId, setPId] = useState({current: undefined});
    // const [opId, setOpId] = useState({current: undefined});
    const [global, setGlobal] = useState({ userId: -1, pId: -1, opId: -1 });
    const userName = useRef();
    const [isChecked, setIsChecked] = useState(false);


    let userId = searchParams.get('userId')
    if (userId === undefined || userId === null || isNaN(userId)) {
        // console.log("userId in update: " + searchParams.get('userId'));
        userId = '-1'
        // setUserId({current: uId})
    }

    let pId = searchParams.get('pId')
    if (pId === undefined || pId === null || isNaN(pId)) {
        // console.log("pId in update: " + searchParams.get('pId'));
        pId = '-1'
        // setPId({current: p})
    }

    let opId = searchParams.get('opId')
    if (opId === undefined || opId === null || isNaN(opId)) {
        // console.log("opId in update: " + searchParams.get('opId'));
        opId = '-1'
        // setOpId({current: op})
    }
    


    var navigate = useNavigate();

    function OpenRules() {

        navigate("../HelpLobby")
    }

    function CreateGame() {
        document.getElementById("CGame").classList.remove("visually-hidden");
        document.getElementById("sidebarright").classList.remove("visually-hidden");
        document.getElementById("OpenGames").classList.add("visually-hidden");
    }

    const Login = () => {
        // console.log("Logged in");

        
        createPlayer(userName.current.value).then((p) => {
            // console.log(p);
            
            var playerId = p.id;
            setGlobal({ userId: playerId, pId: playerId, opId: global.opId })
            var uId = playerId.toString();
            if ('URLSearchParams' in window) {
                searchParams.set('userId', uId);
                searchParams.set('pId', uId);
                var newURL = window.location.pathname + '?' + searchParams.toString();
                window.history.pushState({}, null, newURL);
                userId = searchParams.get('userId');
                pId = searchParams.get('pId');
                // console.log("searchParams nach Login: " +
                //     userId + ", " +
                //     pId + ", " +
                //     opId
                // );
            }
        })
        clear();
        
    }

    const Logout = () => {
        document.getElementById("CGame").classList.add("visually-hidden");
        document.getElementById("sidebarright").classList.add("visually-hidden");
        // console.log("Logout");
        userId = searchParams.get('userId');
        // console.log("userId vor Logout: " + userId);
        deletePlayer(Number(userId))
        searchParams.delete("userId")
        searchParams.delete("pId")
        searchParams.delete("opId")
        var newURL = window.location.origin + window.location.pathname
        window.history.pushState({}, null, newURL);
        clear();
    }

    function clear() {
        // clearInterval(logInterval);
        clearInterval(gameListInterval);
        clearInterval(playerListInterval);
        clearInterval(pullPlayerInterval);
        clearInterval(checked);
    }

    const renderGameList = async () => {
        const allCurrentGames = await getGames(); // Liste aller Spiele
        // console.log(await allCurrentGames);

        const parent = document.getElementById("listOfGames");
        if (parent.childElementCount !== 0) { // Lösche alte Einträge
            while (parent.childElementCount > 0) {
                parent.removeChild(parent.lastChild);
            }
        }
        for (const ind in allCurrentGames.games) { // schreibe neue Einträge
            if (Object.hasOwnProperty.call(allCurrentGames.games, ind)) {
                
                if (allCurrentGames.games[ind].winningPlayer === undefined) { // schreibe nur dann, wenn das Spiel noch keine Gewinner hat
                    const child = document.createElement('li');
                    const baby = document.createElement('a');
                    // console.log("gameId durch Spielerstellung: " + allCurrentGames.games[ind].id);
                    baby.href = "/Game/?userId=" + userId + "&gameId=" + allCurrentGames.games[ind].id;
                    baby.innerText = "Spiel " + allCurrentGames.games[ind].id;
                    child.appendChild(baby);
                    parent.appendChild(child);
                }
            }
        }
    }
    

    const renderPlayerList = async () => {
        const allCurrentPlayer = await getPlayers(); // Liste alle registrierter Spiele auf dem Server (API)
        const list = await getAllPlayersInGames() // Liste aller Spieler, die in aktuellen Spielen sind
        

        const parent = document.getElementById("sidebarright");
        if (parent.childElementCount !== 0) { // lösche alle alten Einträge
            while (parent.childElementCount > 0) {
                parent.removeChild(parent.lastChild);
            }
        }
        for (const ind in allCurrentPlayer.players) { // schreibe alle neuen Einträge
            if (Object.hasOwnProperty.call(allCurrentPlayer.players, ind)) {
                if (!list.includes(allCurrentPlayer.players[ind].id)) {
                    const child = document.createElement('li');
                    const baby = document.createElement('a');
                    
                    baby.innerHTML = allCurrentPlayer.players[ind].name;
                    baby.id = allCurrentPlayer.players[ind].id;
                    baby.className = "clickable"
                    child.appendChild(baby);
                    child.style.cursor = "pointer";
                    parent.appendChild(child);
                }
            }
        }
    }

    const getAllPlayersInGames = async () => {
        const games = await getGames();
        var list = new Array([]);
        for (const ind in games.games) {
            if (Object.hasOwnProperty.call(games.games, ind)) {
                const playerOne = games.games[ind].players[0];
                const playerTwo = games.games[ind].players[1];
                list.push(playerOne);
                list.push(playerTwo);
            }
        }
        return list;
    }
    


    const choseOpponent = (evt) => {
        // console.log(global);
        var opponentId = evt.target.id;
        var opponentIdStr = opponentId.toString()

        if (evt.target.className.includes("clickable")) {
            if ('URLSearchParams' in window) {
                setGlobal({ userId: global.userId, pId: global.pId, opId: Number(opponentId) })
                searchParams.set('userId', global.userId.toString());
                searchParams.set('pId', global.pId.toString());
                searchParams.set('opId', opponentIdStr);
                var newURL = window.location.pathname + '?' + searchParams.toString();
                window.history.pushState({}, null, newURL);
                opId = searchParams.get('opId')
                // console.log("Werte, die nach Wahl des Gegners für die Spielerstellung gültig sind: " + pId + ", " + opId);
            }
        }
    }

    function closeWindow() {
        document.getElementById("CGame").classList.add("visually-hidden");
        //document.getElementById("sidebarright").classList.add("visually-hidden");
        document.getElementById("OpenGames").classList.remove("visually-hidden");
    }

    const pullPlayerInGame = async () => {
        var currentGames = await getGames();
        var gId, playerTwoId;
        // console.log(currentGames);
        currentGames.games.forEach(async (game) => {
            // console.log(game);
            if (game.winningPlayer === undefined) {
                playerTwoId = game.players[1].id;
                // console.log("playerTwoId: " + playerTwoId);
                // console.log("userId: " + userId);
                // console.log(playerTwoId === Number(userId));
                if (playerTwoId === Number(userId)) {
                    gId = game.id;
                    clear();
                    navigate("../Game?userId=" + playerTwoId + "&gameId=" + gId);
                }
            }
        });
    }
    // const logInterval = setInterval(log, 5000, [userId, pId, opId]);
    const gameListInterval = setInterval(renderGameList, 5000);
    const playerListInterval = setInterval(renderPlayerList, 5000);
    const pullPlayerInterval = setInterval(pullPlayerInGame, 5000);

    const check = () => {
        console.log(document.getElementById("playAgainstAI").checked);
        setIsChecked( document.getElementById("playAgainstAI").checked);
    }

    const checked = setInterval(check, 250);
    
    

    return (
        <div>
            <div className="sidenav">
                <h1>Game of the Amazons</h1>
                {(global.userId !== -1) ? (
                    <div className='welcome'>
                        <h2>Welcome</h2>
                        {/*<button onClick={Logout}>Logout</button>*/}
                        <button onClick={CreateGame}>Create new Game</button>
                        <button onClick={OpenRules}>Rules</button>
                    </div>
                ) : (
                    <form >
                        <div className='form-inner'>
                            <h2>Login</h2>
                            <div className='form-group'>
                                <label htmlFor='name'>Name:</label>
                                <input type='text' placeholder="Enter Name" ref={userName}></input>
                            </div>
                            <input type='button' className='submit' value="login" onClick={Login}></input>
                        </div>
                    </form>
                )}


            </div>
            <div className="main">

                <div id="OpenGames" className="OpenGames">
                    <h1>Existing Games</h1>
                    <p>Click on game to Spectate</p>
                    {(global.userId !== -1) ? (
                        <button className="CreateGame" onClick={CreateGame}>Create new Game</button>
                    ) : (
                        <div>
                            <p>Login first to create a Game</p>
                        </div>
                    )}
                    <div id='listOfGames' className='gamelist'>
                    </div>
                    {/* <li><a href='#'>Game von Atze</a></li>

                    <li><a href='#'>Game von Atze2</a></li> */}
                </div>



            </div>
            <div id="CGame" className="visually-hidden CGame">
                <input type="button" id="back" className="back" value={"X"} onClick={closeWindow} />
                <h1 className="CreateGame">Create Game</h1>

                < GenerateBoard u={global} checked={isChecked} />


                
            </div>

            <div id="sidebarright" className="sidebarright visually-hidden" onClick={choseOpponent}>
                Choose your Opponent

            </div>
        </div>

    )
}