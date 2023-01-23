import { ArticleVo, ArticleWithAuthorInfo } from "@/api/declare";
import { defineStore } from "pinia";


export default defineStore<"editArticle",{
    data: ArticleVo | null,
    aid: null | number
},{},{
    setArticle: (detail:ArticleWithAuthorInfo) => void
}>(
    "editArticle",{
        state() {
            return{
                data: null,
                aid: null
            }
        },
        actions: {
            setArticle(detail) {
                let temp:ArticleVo = {
                    title: detail.article.title,
                    content: detail.article.content,
                    tagId: detail.article.tagId,
                    description: detail.article.description,
                    facePicture: detail.article.facePicture
                }; 
                this.data = temp;
                this.aid = detail.article.aid;
            },
        }
    }
);