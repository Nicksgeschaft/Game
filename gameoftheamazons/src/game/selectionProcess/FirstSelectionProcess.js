import { markMoveable } from '../markMoveable';
import { letter } from '../letter';

export const firstSelectionProcess = (rowGiven, columnGiven, g, currentPlayer, figureAssigned) => {

    let row = Number(rowGiven);
    let column = Number(columnGiven);
    let figure = figureAssigned

    let isInputCorrect = () => {

        if ((currentPlayer === figure.pOne && g.board.squares[row][column] === 0) ||
            (currentPlayer === figure.pTwo && g.board.squares[row][column] === 1)) {
            return true;
        } else {
            return false;
        }
    };
    

    if (isInputCorrect()) {
        document.getElementById(letter(column) + row).className += "select";
        // markieren aller erlaubten Spielzüge
        markMoveable(row, column, g);
        return true
    }
    return false
}

export const redoFirstSelectionProcess = async () => {

    let listWhite = document.getElementsByClassName("piecewhiteselect")
    let listBlack = document.getElementsByClassName("pieceblackselect")

    if (listWhite.length > 0) {
        let id = listWhite[0].id
        let str = listWhite[0].className
        str = str.replace("piecewhiteselect", "piecewhite")
        document.getElementById(id).className = str
    } else if (listBlack.length > 0) {
        let id = listBlack[0].id
        let str = listBlack[0].className
        str = str.replace("pieceblackselect", "pieceblack")
        document.getElementById(id).className = str
    }

    let list = document.getElementsByClassName("selected")

    // entferne die Markierung der möglichen Felder
    while (list.length > 0) {
        let ind = 0
        let id = list[ind].id
        let str = list[ind].className
        str = str.replace(" selected", "")
        document.getElementById(id).className = str
        ind++
    }

}