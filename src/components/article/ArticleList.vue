<template>
    <div style="width: 100%" class="article-list-container">
        <List item-layout="vertical" size="small" :data-source="props.data">
            <template #renderItem="{ item }">
                <ArticleListItem :data="item" :key="item.simpleArticle.aid"/>
            </template>
        </List>
    </div>
</template>
<script lang="ts" setup>
import { SimpleArticleWithAuthorInfo } from '@/api/declare';
import ArticleListItem from './ArticleListItem.vue';
import { List } from "ant-design-vue"
const props = defineProps<{ data: SimpleArticleWithAuthorInfo[] }>();
</script>
<style lang="less">
.article-list-container{
    background-color: rgba(240, 248, 255, 0.577);
    border-radius: 1rem;
}
</style>