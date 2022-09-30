import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function Help() {
    let [searchParams] = useSearchParams();

    let userId = searchParams.get('userId');
    if (userId === undefined || userId === null || Number.isNaN(userId)) {
        userId = '-1'
    }

    let pId = searchParams.get('pId');
    if (pId === undefined || pId === null || Number.isNaN(pId)) {
        pId = '-1'
    }

    // console.log("Das ist von der Help.js, um zu sehen ob es die ID von searchParams: " + userId);

    let navigate = useNavigate();

    async function navigategame() {
        if (userId === -1 && pId === -1){
            navigate("../")
        } else {
            navigate("../?userID=" + userId + "&pId=" + pId)
        }
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
                <div className='howtocreate'>Wie erstellt man ein Spiel
                <p>
                    Logge dich in der Lobby ein und erstelle ein Spiel. Wähle dort die Größe des Spielfelds und
                    die Zeit für einen Zug in Millisekunden aus.
                </p>
                <p>
                    Du kannst dir jederzeit die Größe des Spielfelds anschauen wenn du das tust, kannst du
                    die Positionen der Amazonen beider Spieler auswählen.
                </p>
                <p>
                    Bevor du das Spiel startest wähle einen Spieler in der Liste daneben aus und es kann losgehen.
                    Wenn du lieber gegen den Computergegner spielen willst, wähle den dafür vorgesehenen Button aus.
                </p></div>
                <input className="button" type="button" value="Zurück zu Lobby" onClick={navigategame} />
            </div>
        </div>
    )
}
