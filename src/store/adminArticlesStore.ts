import { getArticlesNormal } from "@/api/articleApi";
import { PageDto, SimpleArticleWithAuthorInfo } from "@/api/declare";
import { message } from "ant-design-vue";
import { defineStore } from "pinia";


export default defineStore<"adminArticle", {
    articles: PageDto<SimpleArticleWithAuthorInfo>
    defaultSize: 10,
    hasLoadOnce: boolean,
    currentPage: number
},{},{
    getArticles : (pn: number) =>Promise<void>
}>(
    "adminArticle",{
        state() {
            return{
                articles:{
                    sum: 0,
                    dataList: []
                },
                defaultSize: 10,
                hasLoadOnce: false, 
                currentPage: 1
            }
        },
        actions: {
            async getArticles(pn: number) {
                let res = await getArticlesNormal(pn, this.defaultSize);
                if(res.ok && res.data != null) {
                    this.articles = res.data;
                    this.hasLoadOnce = true;
                }
                else {
                    message.warning("获取失败");
                }
            },
        }
    }
)