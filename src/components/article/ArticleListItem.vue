<template>
    <div @click="goToDetail(articleInfo.aid)" class="article-item-container">
        <hr>
        <List.Item>
            <template #extra v-if="articleInfo.facePicture != null && articleInfo.facePicture != ''">
                <img :src="articleInfo.facePicture" width="100" alt="">
            </template>
            <template #actions>
                <span>
                    <LikeFilled />
                    {{ articleInfo.likeCount }}
                </span>
                <span>
                    <EyeFilled />
                    {{ articleInfo.watchCount }}
                </span>
                <span>
                    {{ translateNumberToTime(articleInfo.createTime) }}
                </span>

            </template>
            <List.Item.Meta>
                <template #title>
                    <span style="overflow: hidden;"><b>{{ articleInfo.title }}</b></span>&nbsp;
                    <span>
                        <Popover>
                            <template #content>
                                <div style="font-size: 0.8rem; opacity: 0.6;">
                                    <p>用户名: {{ userInfo.username }}</p>
                                    <p>用户类型: {{ getUserType(userInfo.userType) }}</p>
                                    <p>注册时间: {{ translateNumberToTime(userInfo.createTime) }}</p>
                                </div>
                            </template>
                            <Tag color="cyan">
                                {{ userInfo.username }}
                            </Tag>
                        </Popover>
                    </span>
                </template>
            </List.Item.Meta>
            {{ articleInfo.description }}
        </List.Item>
    </div>
</template>
<script lang="ts" setup>
import { SimpleArticleWithAuthorInfo } from '@/api/declare';
import RouteKeys from '@/constant/RouteKeys';
import { useRouter } from "vue-router";
import { ListItem, ListItemMeta, Tag, Popover,List } from "ant-design-vue";
import { LikeFilled, EyeFilled } from "@ant-design/icons-vue";
import { translateNumberToTime } from "@/utils/TranslateUtils"
const props = defineProps<{ data: SimpleArticleWithAuthorInfo }>();
const data = props.data;
const articleInfo = props.data.simpleArticle;
const userInfo = data.userInfo;
const router = useRouter();
function goToDetail(aid: number) {
    router.push({
        name: RouteKeys.Detail.name,
        params: {
            aid
        }
    });
}
function getUserType(t: number): string {
    return t == 1 ? "管理员用户" : "普通用户";
}
</script>
<style lang="less">
.article-item-container {
    cursor: pointer;
}
</style>