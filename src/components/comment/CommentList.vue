<template>
    <div>
        <h2><b>评论区</b></h2>
    </div>
    <UploadComment :target-aid="props.aid" @uploaded="afterUploadComment" />
    <div v-if="commentListData != null && commentListData.dataList.length != 0" class="comment-list">
        <CommentItem v-for="item in commentListData.dataList" :key="item.comment.cid" :data="item"
            @deleted="afterDeleted" />
        <Row :justify="`end`" v-if="hasMore">
            <span style="padding: 5px;">
                <Button @click="nextPage">
                    加载更多
                </Button>
            </span>
        </Row>
    </div>
    <div v-else>
        <Empty>
            <template #description>
                <span style="opacity: 0.6;">
                    空空如也
                </span>
            </template>
        </Empty>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import CommentItem from './CommentItem.vue';
import { CommentWithAuthorInfo, PageDto } from '@/api/declare';
import { listComments } from '@/api/commentApi';
import { message, Row, Button, Empty } from 'ant-design-vue';
import UploadComment from './UploadComment.vue';
import useBaseUserInfo from "@/store/baseUserInfo";
const props = defineProps<{ aid: number }>();
const commentListData = ref<null | PageDto<CommentWithAuthorInfo>>(null);
const currentPn = ref(1);
const defaultSize = 10;
const baseUserInfo = useBaseUserInfo();
watch(currentPn, async () => {
    let res = await listComments(props.aid, currentPn.value, defaultSize);
    if (res.ok && res.data != null) {
        if (commentListData.value == null) {
            commentListData.value = res.data;
        }
        else {
            commentListData.value.dataList.push(...res.data.dataList);
            commentListData.value.sum = res.data.sum;
        }
    }
    else {
        message.warning("加载失败");
    }
}, {
    immediate: true
})

const hasMore = computed(() => {
    if (commentListData.value == null) {
        return false;
    }
    else {
        return currentPn.value < Math.ceil(commentListData.value.sum / defaultSize);
    }
})

function nextPage() {
    if (!hasMore.value) {
        return;
    }
    else {
        currentPn.value++;
    }
}
function afterUploadComment(content: string, cid: number) {
    let temp: CommentWithAuthorInfo = {
        replySum: 0,
        userInfo: {
            uid: baseUserInfo.uid,
            username: "我",
            createTime: 0,
            userType: -1
        },
        comment: {
            cid,
            content,
            createTime: Date.now(),
            fromAid: props.aid,
            authorUid: baseUserInfo.uid
        }
    };
    commentListData.value?.dataList.unshift(temp);
}
function afterDeleted(cid: number) {

    if (!commentListData.value) {
        return;
    }
    for (let i = 0; i < commentListData.value.dataList.length; i++) {
        let o = commentListData.value.dataList[i];
        if (o.comment.cid == cid) {
            commentListData.value.dataList.splice(i, 1);
            commentListData.value.sum--;
            return;
        }

    }
}
</script>
<style>
.comment-list {
    background-color: rgba(175, 234, 237, 0.085);
    padding: 5px;
    border-radius: 0.5rem;
}
</style>