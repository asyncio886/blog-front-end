<template>
    <div>
        <UserInfoCard :data="props.data.authorInfo" :upload-time="props.data.reply.createTime"
            :reply-to-user-info="props.data.replyToInfo" />
        <div>
            <Row :justify="`end`" v-if="baseUserInfo.uid == ownUid">
                <DeleteOutlined class="cursor-pointer" @click="removeReply"/>
            </Row>
            <p style="text-indent: 2em; word-wrap: break-word;" @click="reply">
                {{ data.reply.content }}
            </p>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ReplyWithReplyToAndAuthor } from '@/api/declare';
import UserInfoCard from '../UserInfoCard.vue';
import { Row, message } from "ant-design-vue";
import { DeleteOutlined } from "@ant-design/icons-vue";
import { Ref, inject } from 'vue';
import ArticleStoreKey from '@/constant/ArticleStoreKey';
import { deleteReply } from '@/api/adminApi';
import { notice } from '@/utils/messageUtils';
import useBaseUserInfo from '@/store/baseUserInfo';
const props = defineProps<{ data: ReplyWithReplyToAndAuthor }>();
const emits = defineEmits(["chooseToReply", "deleted"]);
const ownUid:Ref<number> | undefined = inject(ArticleStoreKey.provideArticleOwn); 
const baseUserInfo = useBaseUserInfo();
function goToReply(uid: number, username: string) {
    emits("chooseToReply", uid, username);
}
function reply() {
    if (props.data.authorInfo != null) {
        goToReply(props.data.authorInfo.uid, props.data.authorInfo.username)
    }
}
async function removeReply() {
    let res = await deleteReply(props.data.reply.rid);
    if(res.ok) {
        message.success(res.message);
        emits("deleted", props.data.reply.rid);
    }
    else {
        notice(res.message);
    }
}
</script>
<style>

</style>