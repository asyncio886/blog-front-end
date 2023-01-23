<template>
    <div style="display: flex;" class="all-container">
        <div v-if="articleData == null" style="flex-grow: 1;">
            <Skeleton />
        </div>
        <div v-else style="flex-grow: 1;" class="article-show-container">
            <UserNormalCard :detail="articleData.detailUserInfo" :normal="articleData.baseUserInfo" />
            <span>
                <span>
                    标签 :
                </span>
                <Popover v-if="articleData.tag != null">
                    <template #content>
                        {{ articleData.tag.description }}
                    </template>
                    <Tag @click="goToTag" :style="{ cursor: 'pointer' }">{{ articleData.tag.tagName }}</Tag>
                </Popover>
            </span>

            <ShowArticle :data="articleData.article" />
            <CommentList :aid="aid" />
        </div>
        <div class="admin-user-container">
            <PersonCard />
        </div>
    </div>
</template>

<script setup lang="ts">
import { articleDetail } from '@/api/articleApi';
import { ArticleWithAuthorInfo } from '@/api/declare';
import { notice } from '@/utils/messageUtils';
import { Ref, onBeforeMount, provide, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ShowArticle from '@/components/article/ShowArticle.vue';
import UserNormalCard from '@/components/article/UserNormalCard.vue';
import { Skeleton } from 'ant-design-vue';
import CommentList from "@/components/comment/CommentList.vue"
import PersonCard from '@/components/PersonCard.vue';
import { Tag, Popover } from "ant-design-vue"
import ArticleStoreKey from '@/constant/ArticleStoreKey';
const router = useRouter();
const route = useRoute()
let aid = Number.parseInt(route.params.aid as string)
const articleData: Ref<ArticleWithAuthorInfo | null> = ref(null);
const ownUid:Ref<number | null> = ref(null); 
provide<Ref<number | null>>(ArticleStoreKey.provideArticleOwn, ownUid);
onBeforeMount(async () => {
    let data = await articleDetail(aid);
    if (!data.ok || data.data == null) {
        notice(data.message);
        router.replace("/404");
    }
    else {
        articleData.value = data.data;
        ownUid.value = data.data.article.ownUid
    }
});

function goToTag() {
    if (articleData.value?.tag != null) {
        router.push(`/?tag=${articleData.value?.tag.tagRoute}`)
    }

}
</script>
<style lang="less">
.admin-user-container {
    max-width: 33%;
    min-width: 33%;

    @media screen and (max-width: 500px) {
        max-width: 100%;
    }
}

.all-container {
    max-width: 100%;

    @media screen and (max-width:500px) {
        flex-direction: column;
    }
}

.article-show-container {
    @media screen and (min-width: 500px) {
        max-width: 67%;
        min-width: 67%
    }

}
</style>