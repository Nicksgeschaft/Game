import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function Help() {
    let [searchParams] = useSearchParams();
    let navigate = useNavigate();

    var gameId = searchParams.get('gameId');
    var userId = searchParams.get('userId');

    async function navigategame() {
        navigate("../Game/?userId=" + userId + "&gameId=" + gameId)
    }

    return (

        <div className="tutorial">

            <div className="text">

                <h2> Game of the Amazons </h2>
                <p>
                    Game of the Amazons ist ein Zweispieler-Brettspiel auf einem Rasterbrett, in der es darum geht,
                    alle gegnerischen Spielfiguren mithilfe von Blockaden (Giftpfeile) unbewegbar zu machen.
                </p>
                <p>
                    Die Spieler sind abwechselnd am Zug. Die Spielfiguren k&ouml;nnen sich einmal pro Zug in alle Richtungen
                    horizontal,vertikal und diagonal bewegen.
                    Giftpfeile k&ouml;nnen nach demselben Prinzip platziert werden, aber nicht verschoben werden.
                </p>
                <p>
                    Jeder Spielzug besteht aus 2 Phasen:
                </p>
                <ol>
                    <li> Spielfigur w&auml;hlen und bewegen.</li>
                    <li> Giftpfeil platzieren</li>
                </ol>
                <p>
                    Dieses Projekt ist an der HS Anhalt und unter der Aufsicht von Toni Barth entstanden.
                    Es wurde von Nick Cwertetschka, Philipp J&auml;ckel und Danny N&auml;ckel entwickelt.
                </p>
                <input className="button" type="button" value="weiterspielen" onClick={navigategame} />
            </div>
        </div>
    )
}
