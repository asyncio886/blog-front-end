import { getAllTags, listHots } from "@/api/articleApi";
import {  SimpleArticleWithAuthorInfo, Tag, UserDetailDto } from "@/api/declare";
import { detail } from "@/api/userApi";
import { notice } from "@/utils/messageUtils";
import { defineStore } from "pinia";

export default defineStore<"webConfig",{
    topMenuList: Tag[],
    webOwnUid: number,
    webOwnInfo: UserDetailDto | null,
    hotArticles: SimpleArticleWithAuthorInfo[] | null,
    hotLimit: 5
},{},{
    loadTagMenu: () => Promise<void>,
    getTagId: (name: string | undefined | null) => number | null,
    getWebOwnInfo: () => Promise<void>,
    getCardHotArticles: () => Promise<void>,
    removeTag: (tagId: number) => void,
    addTagToList: (tag: Tag) => void,
    updateListItem(tag:Tag):void
}>("webConfig",{
    state() {
        return{
            topMenuList: [],
            webOwnUid: 2,
            webOwnInfo: null,
            hotArticles: null,
            hotLimit: 5
        }
    },
    actions: {
        async loadTagMenu() {
            let st = true;
            let data = await getAllTags()
            st = data.ok;
            this.topMenuList = data.data?.dataList as Tag[];
            if( !st ) {
                notice("获取配置出错");
            }
        },
        getTagId(name) {
            if(name == undefined || name == null) {
                return null;
            }
            for(let i = 0;i < this.topMenuList.length;i++) {
                if(this.topMenuList[i].tagRoute == name) {
                    return this.topMenuList[i].tid;
                }    
            }
            return null;
        },
        async getWebOwnInfo() {
            if(this.webOwnInfo != null) {
                return;
            }
            let res = await detail(this.webOwnUid);
            if(res.ok) {
                this.webOwnInfo = res.data;
            }
        },
        async getCardHotArticles() {
            if(this.hotArticles != null) {
                return;
            }
            let res = await listHots(this.hotLimit);
            if(res.ok && res.data != null) {
                this.hotArticles = res.data.dataList;
            }
        },
        removeTag(tagId) {
            for(let i = 0;i < this.topMenuList.length;i++) {
                if(this.topMenuList[i].tid == tagId) {
                    this.topMenuList.splice(i, 1);
                    return;
                }
            }
        },
        addTagToList(tag:Tag) {
            this.topMenuList.push(tag);
        },
        updateListItem(tag:Tag) {
            for(let i = 0;i < this.topMenuList.length;i++) {
                if(this.topMenuList[i].tid == tag.tid) {
                    this.topMenuList[i] = tag;
                    return;
                }
            }
        }
    }
});