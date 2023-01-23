<template>
    <div>
        <UserInfoCard :data="userInfo" :upload-time="commentInfo.createTime" />
        <Row :justify="`end`" v-if="uid == baseUserInfo.uid">
            <Popover>
                <template #content>
                    删评
                </template>
                <DeleteOutlined class="cursor-pointer" @click="removeComment"/>
            </Popover>
        </Row>
        <div style="text-indent: 2rem" @click="tryReply">
            <p>{{ commentInfo.content }}</p>
        </div>
        <ReplyList ref="replyListVue" :cid="commentInfo.cid" :replies-sum="props.data.replySum" />
        <hr style="width: 90%;margin: 0px auto;opacity: 0.4;">
    </div>
</template>

<script lang="ts" setup>
import { CommentWithAuthorInfo } from '@/api/declare';
import ReplyList from "@/components/reply/ReplyList.vue";
import UserInfoCard from '../UserInfoCard.vue';
import { Ref, inject, ref } from 'vue';
import { Row, Popover, message } from "ant-design-vue";
import { DeleteOutlined } from "@ant-design/icons-vue";
import useBaseUserInfo from "@/store/baseUserInfo"
import ArticleStoreKey from '@/constant/ArticleStoreKey';
import { deleteComment } from '@/api/adminApi';
import { notice } from '@/utils/messageUtils';
const props = defineProps<{ data: CommentWithAuthorInfo }>();
const userInfo = props.data.userInfo;
const baseUserInfo = useBaseUserInfo();
let uid = inject<Ref<number | null>>(ArticleStoreKey.provideArticleOwn);
const commentInfo = props.data.comment;
const replyListVue = ref<null | { removeReplyUpload: () => void, readyToReply: (replyToUid: null | number, replyToname: string | null) => void }>(null);
const showReplyUpload = ref(false);
const emits = defineEmits<{
    (e: "deleted", cid: number) : void
}>();
function tryReply() {
    if (userInfo == null) {
        return;
    }
    if (showReplyUpload.value) {
        replyListVue.value?.removeReplyUpload();
    }
    else {
        replyListVue.value?.readyToReply(null, userInfo.username);
    }
    showReplyUpload.value = !showReplyUpload.value;
}
async function removeComment() {
    let res = await deleteComment(props.data.comment.cid);
    if(res.ok) {
        message.success(res.message);
        emits("deleted", props.data.comment.cid);
    }
    else {
        notice(res.message);
    }
}
</script>