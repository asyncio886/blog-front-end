import MimeType from "@/constant/MimeType";
import request from "./baseApi";
import { ArticleWithAuthorInfo, BaseOperator, BlogArticle, PageDto, SimpleArticleWithAuthorInfo, Tag } from "./declare";
import handlerRootResult from "./handlerRootResult";
import { message } from "ant-design-vue";
async function getAllTags() {
    let res = await request.get<BaseOperator<PageDto<Tag>>>("/article/tags");
    return handlerRootResult(res.data);
}

async function searchArticles(kw: string ,pn: number) {
    kw = kw.trim();
    if( kw.includes("{") || kw.includes("}") ) {
        message.warn("搜索内容不能含有{ }");
        throw new Error();
    }
    let res = await request.get<BaseOperator<PageDto<BlogArticle>>>(`/article/search?kw=${kw}&pn=${pn}`);
    return handlerRootResult(res.data);
}

async function listHots(size: number) {
    let res = await request.get<BaseOperator<PageDto<SimpleArticleWithAuthorInfo>>>(`/article/listHot?size=${size}`)
    return handlerRootResult(res.data);
}

async function getArticlesByTagId(tid: number, pn:number, size:number) {
    let res = await request.get<BaseOperator<PageDto<SimpleArticleWithAuthorInfo>>>(`/article/listByTagId?tagId=${tid}&pn=${pn}&size=${size}`);
    return handlerRootResult(res.data);
}


async function getArticlesNormal(pn:number, size:number) {
    let res = await request.get<BaseOperator<PageDto<SimpleArticleWithAuthorInfo>>>(`/article/list?pn=${pn}&size=${size}`);
    return handlerRootResult(res.data);
}

async function articleDetail(aid: number) {
    let res = await request.get<BaseOperator<ArticleWithAuthorInfo>>(`/article/detail/${aid}`);
    return handlerRootResult(res.data);
}


async function articleLikeStatus(aid: number) {
    let res = await request.get<BaseOperator<null>>(`/like/status/${aid}`);
    return handlerRootResult(res.data, true);
}

async function likeArticle(aid : number, status: boolean) {
    let res = await request.post<BaseOperator<string>>(`/like`,`aid=${aid}&status=${status}`,
    {
        headers: {
            "content-type": MimeType.URLENCODED_FORM
        }
    });
    return handlerRootResult(res.data);
}

export {
    getAllTags, searchArticles, listHots,getArticlesByTagId, getArticlesNormal, articleDetail, articleLikeStatus,
    likeArticle
}