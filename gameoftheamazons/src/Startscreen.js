import React, { useRef } from 'react'
import Avatar from './Avatar.jpg'
import Avatar2 from './Avatar2.jpg'
import { useNavigate } from 'react-router-dom'
import { createPlayer, deletePlayer, getPlayers, generateAI, getGames, newGame } from './communication'





export default function Startscreen() {
    let navigate = useNavigate();

    const playernameone = useRef()
    const playernametwo = useRef()

    // Aufgabenspezifische Bedingungen
    let checkRequirements = async () => {
        let g = await getGames()
            .then((res) => {
                return res
            }).catch((error) => {
                console.log('ISGAMEONGOING error. Message is: ' + error.message)
                return { message: error.message }
            })

        // wenn bereits ein Spiel offen ist, wechsel zum Spiel
        if (g.games.length > 0) {
            navigate('./Game')
            return
        }

        let ps = await getPlayers()
            .then((res) => {
                return res
            }).catch((error) => {
                console.log('if(GETplayer.players > 1) error. Message is: ' + error.message)
                return { message: error.message }
            })

        console.log(ps.players.length)

        // wenn mehr als ein Spieler, erzeuge Spiel und wechsel zum Spiel
        if (ps.players.length > 1) {
            await newGame()
                .then((res) => {
                    return res
                }).catch((error) => {
                    console.log('STARTGAME error. Message is: ' + error.message)
                    return { message: error.message }
                })
            navigate('./Game')
            return
            // wenn nur ein Spieler da ist, wechsel zum Spieler 2 erstellen Screen
        } else if (ps.players.length === 1) {
            document.getElementById("playeruno").style.display = "none"
            document.getElementById("playerdos").style.display = "block"
            getInfotwo()
            return
        }
    }

    // Spieler1-Erstellung
    async function getInfoone() {

        const playername = playernameone.current.value

        let p = await createPlayer(playername)
            .then((res) => {
                return res
            }).catch((error) => {
                console.log('GET error. Message is: ' + error.message)
                return { message: error.message }
            })
        console.log('Your Playername is: ' + p.name + " and your ID is: " + p.id)
        document.getElementById("playeruno").style.display = "none"
        document.getElementById("playerdos").style.display = "block"

    }

    // Spieler2-Erstellung und anschlie??end Spielerzeugung
    async function getInfotwo() {
        const playername = playernametwo.current.value

        let p = await createPlayer(playername)
            .then((res) => {
                return res
            }).catch((error) => {
                console.log('GET error. Message is: ' + error.message)
                return { message: error.message }
            })
        console.log('Your Playername is: ' + p.name + " and your ID is: " + p.id)

        let g = await newGame()
            .then((res) => {
                return res
            }).catch((error) => {
                console.log('STARTGAME error. Message is: ' + error.message)
                return { message: error.message }
            })
        console.log("Your game has the id: " + g.id)
        navigate("/Game")

    }

    // erzeut einen KI Spieler, funktioniert aber noch nicht korrekt
    const createAI = async () => {
/*
        let playername
        if (playernameone.current.value !== "") {
            playername = playernameone.current.value
            document.getElementById("playeruno").style.display = "none"
            document.getElementById("playerdos").style.display = "block"
        } else if (playernametwo.current.value !== "") {
            playername = playernametwo.current.value
        }

        let p = await generateAI(playername)
            .then((res) => {
                return res
            }).catch((error) => {
                console.log('GET error. Message is: ' + error.message)
                return { message: error.message }
            })
        console.log(p)



        if (playernametwo.current.value !== "") {
            let g = await newGame()
                .then((res) => {
                    return res
                }).catch((error) => {
                    console.log('STARTGAME error. Message is: ' + error.message)
                    return { message: error.message }
                })
            console.log("Your game has the id: " + g.id)
            navigate('./game')
        }
      */  
    }

// l??scht den letzten Spieler in der Spielerliste
    const deletePlayerWithID = async () => {

        let ps = await getPlayers()
            .then((res) => {
                return res
            }).catch((error) => {
                console.log('GET error. Message is: ' + error.message)
                return { message: error.message }
            })

        if (ps.players.length > 0) {
            console.log(ps)
            let lastPlayerID = ps.players[ps.players.length - 1].id
            console.log(lastPlayerID)

            await deletePlayer(lastPlayerID)
                .then((res) => {
                    return res
                }).catch((error) => {
                    console.log('GET error. Message is: ' + error.message)
                    return { message: error.message }
                })

        }

    }

    return (
        <>
            <div className="loginbox playerone" id="playeruno" onLoad={checkRequirements}>
                <img src={Avatar2} className="avatar" alt='Avatar2' />
                <h1>Player 1 Login</h1>
                <form>
                    <p>Playername</p>
                    <input type="text" ref={playernameone} placeholder="Enter Name"></input>

                    <input type="button" className="submitone" name="" value="Create as Player" onClick={getInfoone}></input>
                    <input type="button" className="ai" value="Create as KI" onClick={createAI}></input>
                    <input type="button" className="deletePlayer" value="deletePlayer" onClick={deletePlayerWithID}></input>

                </form>
            </div>
            <div className="loginbox playertwo" id="playerdos">
                <img src={Avatar} className="avatar" alt='Avatar'></img>
                <h1>Player 2 Login</h1>
                <form>
                    <p>Playername</p>
                    <input type="text" ref={playernametwo} placeholder="Enter Name"></input>

                    <input type="button" className="submittwo" name="" value="Create as Player" onClick={getInfotwo}></input>
                    <input type="button" className="ai" value="Create as KI" onClick={createAI}></input>
                    <input type="button" className="deletePlayer" value="deletePlayer" onClick={deletePlayerWithID}></input>


                </form>
            </div>


        </>
    );
}
