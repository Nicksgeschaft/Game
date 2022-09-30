const urlPlayer = "https://gruppe12.toni-barth.com/players/"
const urlGame = "https://gruppe12.toni-barth.com/games/"
const urlMove = "https://gruppe12.toni-barth.com/move/"


// CRUD-Operationen
const FETCH = (requestOptions, url) => {
    const fetched = fetch(url, requestOptions)
        .then((response) => {
            // console.log(response);
            if (response.status === 400) {
                return { message: 400 }
            }
            // console.log(response);
            return response.json()
        })
        .catch((error) => {
            console.log("FETCH error. Message is: " + error.message);
            return { message: error.message }
        })
    // console.log("FETCH returned...")
    // console.log(fetched)
    return fetched;
}

export const GET = (url) => {

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            accept: '*/*'
        },
    };

    const fetched = FETCH(requestOptions, url)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.log("GET error. Message is: " + error.message);
            return { message: error.message }
        })
    // console.log("GET returned...")
    // console.log(fetched)
    return fetched;
}

// PUT
export const PUT = (value, url) => {

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
        body: JSON.stringify(value)
    };

    const fetched = FETCH(requestOptions, url)
        .then((response) => {
            return response
        }).catch((error) => {
            console.log("PUT error. Message is: " + error.message);
            return { message: error.message }
        });
    // console.log("PUT returned...")
    // console.log(fetched)
    return fetched;
}

export const DELETE = (url) => {

    const requestOptions = {
        method: 'DELETE',
        headers: { accept: '*/*' }
    };

    const fetched = FETCH(requestOptions, url)
        .then((response) => {
            return response
        })
        .catch((error) => {
            console.log("DELETE error. Message is: " + error.message);
            return { message: error.message }
        });
    // console.log("DELETE returned...")
    // console.log(fetched)
    return fetched;
}

export const POST = (value, url) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            accept: '*/*'
        },
        body: JSON.stringify(value)
    };
    const fetched = FETCH(requestOptions, url)
        .then((response) => {
            return response;
        }).catch((error) => {
            console.log("POST error. Message is: " + error.message);
            return { message: error.message }
        });
    // console.log("POST returned...")
    // console.log(fetched)
    return fetched;
}

// befiehlt Backend einen Spieler anzulegen
export const createPlayer = (name) => {

    try {
        const user = {
            "name": name,
            "controllable": true,
        }
        const res = POST(user, urlPlayer)
            .then((response) => {
                return response;
            }).catch((error) => {
                console.log("POST error. Message is: " + error.message);
                return { message: error.message }
            });
        return res;
    }
    catch (error) {
        console.error(error)
    }
}

// befiehlt Backend eine KI anzulegen
export const generateAI = () => {
    try {
        const user = {
            "name": "KI",
            "controllable": false,
        }

        const res = POST(user, urlPlayer)
            .then((response) => {
                return response;
            }).catch((error) => {
                console.log("POST error. Message is: " + error.message);
                return { message: error.message }
            });
        return res;
    }
    catch (error) {
        console.error(error)
    }
}

// hole vom Server eine Liste von Spielern
export const getPlayers = () => {
    try {
        const res = GET(urlPlayer)
            .then((response) => {
                return response
            }).catch((error) => {
                console.log("GET error. Message is: " + error.message)
                return { message: error.message }
            })
        return res
    } catch (error) {
        console.error(error)
    }
}

// beauftrage den Server einen Spieler aus der Liste zu löschen
export const deletePlayer = (id) => {
    try {
        const res = DELETE(urlPlayer + id)
            .then((response) => {
                return response
            }).catch((error) => {
                console.log("DELETE error. Message is: " + error.message)
                return { message: error.message }
            })
        return res
    } catch (error) {
        console.error(error)
    }
}

// Anfrage an Server ein neues Spiel zu erstellen
// FIXME: muss noch angepasst werden an die neuen Vorraussetzungen
export const newGame = (maxTurnTime, gameSizeRows, gameSizeColumns, board, playerOne, playerTwo) => {
    try {
        // console.log("playerOne");
        // console.log(playerOne);
        // console.log("playerTwo");
        // console.log(playerTwo);
        const game = {
            "maxTurnTime": maxTurnTime,
            "players": [
                playerOne,
                playerTwo
            ],
            "board": {
                "gameSizeRows": gameSizeRows, // Zeilen des Spielbrettes
                "gameSizeColumns": gameSizeColumns, // Spalten des Spielbrettes
                "squares": board
            }
        }

        // console.log(game);

        const res = POST(game, urlGame)
            .then((response) => {
                return response
            }).catch((error) => {
                console.log("POST error. Message is: " + error.message)
                return { message: error.message }
            })
        return res
    } catch (error) {
        console.log(error)
    }
}

// gib Liste von allen Spielen
export const getGames = () => {
    try {
        const res = GET(urlGame)
            .then((response) => {
                return response
            })
            .catch((error) => {
                console.log("GET error. Message is: " + error.message)
                return { message: error.message }
            })
        return res
    } catch (error) {
        console.log(error)
    }
}

// gib zu einem spezifischen Spiel die Statistiken
export const getGameByID = (id) => {
    try {
        const res = GET(urlGame + id)
            .then((response) => {
                return response
            }).catch((error) => {
                console.log("GET error. Message is: " + error.message)
                return { message: error.message }
            })
        return res
    } catch (error) {
        console.log(error)
    }
}

// lösche ein Spiel
export const deleteGame = (id) => {
    try {
        const res = DELETE(urlGame + id)
            .then((response) => {
                return response
            }).catch((error) => {
                console.log("DELETE error. Message is: " + error.message)
                return { message: error.message }
            })
        return res
    } catch (error) {
        console.error(error)
    }
}

// gib den Server den Spielzug zum setzen
export const move = (playerID, gameID, startrow, startcolumn, endrow, endcolumn, shotrow, shotcolumn) => {
    try {
        const move = {
            "move": {
                "start": {
                    "row": startrow, // Startzeile der Bewegung
                    "column": startcolumn // Startspalte der Bewegung
                },
                "end": {
                    "row": endrow, // Zielzeile der Bewegung
                    "column": endcolumn // Zielspalte der Bewegung
                }
            },
            "shot": {
                "row": shotrow, // Zeile des Pfeilschusses
                "column": shotcolumn // Spalte des Pfeilschusses
            }
        }

        const res = POST(move, urlMove + playerID + "/" + gameID)
            .then((response) => {
                // console.log(response);
                return response
            }).catch((error) => {
                console.log("POST error. Message is: " + error.message)
                return { message: error.message }
            })
        return res
    } catch (error) {
        console.log(error)
    }
}

// reset Server
export const reset = () => {
    try {
        const res = DELETE("https://gruppe12.toni-barth.com/reset/")
            .then((response) => {
                return response
            }).catch((error) => {
                console.log("DELETE error. Message is: " + error.message)
                return { message: error.message }
            })
        return res
    } catch (error) {
        console.error(error)
    }
}