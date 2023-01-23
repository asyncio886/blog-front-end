import { marked } from "marked";
function translateNumberToTime(time: number): string {
    return new Date(time).toLocaleString().replace(/:\d{1,2}$/, ' ');
}
function translateMdToHtml(mdContent: string): string {
    return marked(mdContent);
}
export {
    translateNumberToTime,
    translateMdToHtml
}