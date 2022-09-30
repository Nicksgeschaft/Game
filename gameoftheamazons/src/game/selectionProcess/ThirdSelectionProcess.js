import { letter } from '../letter'
import { move, getGameByID } from '../../communication/Communication'

export const shotArrow = async (row, column, gameID, currentPlayer, selectionProcess) => {

    // falls ein Feld gewählt wurde, welches gültig ist
    if (document.getElementById(letter(column) + row).classList.contains("arrowselected")) {
        // merkt sich die Position, an die der Pfeil verschossen wurde
        selectionProcess.shotrow = row;
        selectionProcess.shotcolumn = column;

        let list = document.getElementsByClassName("arrowselected")

        // entferne die Markierung der möglichen Felder
        while (list.length > 0) {
            let ind = 0
            let id = list[ind].id
            let str = list[ind].className
            str = str.replace(" arrowselected", "")
            document.getElementById(id).className = str
            ind++
        }

        var u = currentPlayer
        var g = gameID
        var sr = selectionProcess.startrow
        var sc = selectionProcess.startcolumn
        var er = selectionProcess.endrow
        var ec = selectionProcess.endcolumn
        var tr = selectionProcess.shotrow
        var tc = selectionProcess.shotcolumn
        // console.log(typeof u, typeof g, typeof sr, typeof sc, typeof er, typeof ec, typeof tr, typeof tc);
        // Zug an Server senden
        // console.log(selectionProcess);
        let m = await move(u, g, sr, sc, er, ec, tr, tc)

        // falls 400 bad request zurückkommt, brich den Zug ab und setze den Zug zurück
        if (m.message === 400) {
            let b1 = await getGameByID(gameID)
                .then((res) => {
                    return res
                }).catch((error) => {
                    console.log('GetGameByID error. Message is: ' + error.message)
                    return { message: error.message }
                })

            // console.log(b1.turnPlayer)
            let listWhite = document.getElementsByClassName("piecewhiteselect")
            let listBlack = document.getElementsByClassName("pieceblackselect")

            if (listWhite !== null && listWhite.length > 0) {
                let id = listWhite[0].id
                let str = listWhite[0].className
                str = str.replace("piecewhiteselect", "piecewhite")
                document.getElementById(id).className = str
            } else if (listBlack !== null && listBlack.length > 0) {
                let id = listBlack[0].id
                let str = listBlack[0].className
                str = str.replace("pieceblackselect", "pieceblack")
                document.getElementById(id).className = str
            }
            return;
        }

        // Figuren setzen
        let str = document.getElementById(letter(selectionProcess.startcolumn) + selectionProcess.startrow).className
        if (document.getElementById(letter(selectionProcess.startcolumn) + selectionProcess.startrow).classList.contains("pieceblackselect")) {
            str = str.replace(" pieceblackselect", "")
            document.getElementById(letter(selectionProcess.startcolumn) + selectionProcess.startrow).className = str
            document.getElementById(letter(selectionProcess.endcolumn) + selectionProcess.endrow).className += " pieceblack"
        }
        else {
            str = str.replace(" piecewhiteselect", "")
            document.getElementById(letter(selectionProcess.startcolumn) + selectionProcess.startrow).className = str
            document.getElementById(letter(selectionProcess.endcolumn) + selectionProcess.endrow).className += " piecewhite"
        }

        // Pfeil setzen
        document.getElementById(letter(selectionProcess.shotcolumn) + selectionProcess.shotrow).className += " arrow"
    }
    // wenn ein falsches Feld gewählt wird, bring das Spielfeld zum Anfang des Zugs zurück
    else {
        let list = document.getElementsByClassName("arrowselected")
        while (list.length > 0) {
            let ind = 0
            let id = list[ind].id
            let str = list[ind].className
            str = str.replace(" arrowselected", "")
            document.getElementById(id).className = str
        }
        let listWhite = document.getElementsByClassName("piecewhiteselect")
        let listBlack = document.getElementsByClassName("pieceblackselect")

        if (listWhite !== null && listWhite.length > 0) {
            let id = listWhite[0].id
            let str = listWhite[0].className
            str = str.replace("piecewhiteselect", "piecewhite")
            document.getElementById(id).className = str
        } else if (listBlack !== null && listBlack.length > 0) {
            let id = listBlack[0].id
            let str = listBlack[0].className
            str = str.replace("pieceblackselect", "pieceblack")
            document.getElementById(id).className = str
        }
    }
}