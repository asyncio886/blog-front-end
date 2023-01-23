import { isInteger } from "./NumberUtils";

function getPageNumber(pn: string | number | undefined | null):number {
    if(pn == undefined || pn == null) {
        return 1;
    }
    else if (typeof pn === "string") {
        if(isInteger(pn)) {
            let i = Number.parseInt(pn);
            return i < 0 ? 1 : i;    
        }
        else {
            return 1;
        }
    }
    else return pn < 0 ? 1 : pn;
}

export {
    getPageNumber
}