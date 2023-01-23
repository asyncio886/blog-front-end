<template>
    <div style="width: 100%">
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