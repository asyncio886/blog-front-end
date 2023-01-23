import { searchArticles } from "@/api/articleApi";
import { BlogArticle } from "@/api/declare";
import { notice } from "@/utils/messageUtils";
import { defineStore } from "pinia";


export default defineStore<"searchItem",{
    pn: number,
    text: string,
    articles: BlogArticle[],
    sum: number
},{},{
    resetSearchData: () => void,
    search: () => Promise<void>
}>("searchItem",
    {
        state() {
            return {
                pn: 1,
                text: "",
                articles: [],
                sum: 0
            };
        },
        actions: {
            resetSearchData() {
                this.pn = 1;
                this.articles = [];
                this.sum = 0;
            },
            async search() {
                let res = await searchArticles(this.text, this.pn);
                if(res.ok && res.data != null) {
                    this.articles = res.data.dataList;
                    this.sum = res.data.sum;
                }
                else {
                    notice(res.message);
                }
            },
        }
    }
);