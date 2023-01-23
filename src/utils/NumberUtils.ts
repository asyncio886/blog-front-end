function isInteger(item: string | null | undefined):boolean {
    if(item == null || item == undefined) {
        return false;
    }
    let i = Number(item);
    if(Number.isNaN(i)) {
        return false;
    }
    return Number.isInteger(i);
}

export {
    isInteger
}