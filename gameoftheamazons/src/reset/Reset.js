import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { reset } from "../communication/Communication";

export default async function ResetAll() {
    await reset();
    // console.log("Es wurde alles zurückgesetzt.");
    return(
        <></>
    )
}