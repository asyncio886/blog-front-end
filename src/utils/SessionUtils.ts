function setSession(key: string, value: string, seconds: number = -1) {
    sessionStorage.setItem(key, value);
    if (seconds != -1) {
        setTimeout(() => {
            sessionStorage.removeItem(key);
        }, seconds * 1000)
    }

}

function removeSession(key: string) {
    sessionStorage.removeItem(key);
}

function getSession(key: string): null |string {
    return sessionStorage.getItem(key);
}

export {
    setSession, removeSession, getSession
}