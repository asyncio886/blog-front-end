<template>
    <div>
        <div v-if="replies != null" class="reply-list-container">
            <ReplyItem v-for="item in replies.dataList" :data="item" @chooseToReply="readyToReply"
                @deleted="afterDeleted" />
            <Row :justify="`end`">
                <Button :size="`small`" :style="{ margin: `10px` }" v-show="hasMore" @click="nextPage">
                    加载更多
                </Button>
            </Row>
        </div>
        <ReplyUpload :from-cid="props.cid" :reply-to="replyTo" v-if="showReply" :reply-to-name="replyToName"
            @close="removeReplyUpload" @uploaded="afterUploadedReply" />
    </div>
</template>
<script lang="ts" setup>
import { listReplies } from '@/api/commentApi';
import { PageDto, ReplyWithReplyToAndAuthor } from '@/api/declare';
import { computed, ref, watch } from 'vue';
import ReplyItem from './ReplyItem.vue';
import ReplyUpload from './ReplyUpload.vue';
import useBaseUserInfo from '@/store/baseUserInfo';
import { Button, Row } from "ant-design-vue";
const baseUserInfo = useBaseUserInfo();
const props = defineProps<{ cid: number, repliesSum: number }>();
const defaultSize = 6;
const currentPn = ref(1);
const replies = ref<null | PageDto<ReplyWithReplyToAndAuthor>>(null)
watch(currentPn, async () => {
    if (props.repliesSum == 0) {
        return;
    }
    let res = await listReplies(props.cid, currentPn.value, defaultSize);
    if (res.ok && res.data != null) {
        if (replies.value == null) {
            replies.value = res.data;
        }
        else {
            replies.value.dataList.push(...replies.value.dataList);
            replies.value.sum = res.data.sum;
        }
    }
}, {
    immediate: true
})
const showReply = ref(false);
const replyTo = ref<null | number>(null);
const replyToName = ref<null | string>(null);
function readyToReply(replyToUid: null | number = null, replyToname: string | null) {
    showReplyUpload();
    replyTo.value = replyToUid;
    replyToName.value = replyToname;
}
function removeReplyUpload() {
    showReply.value = false;
    replyTo.value = null;
}
function showReplyUpload() {
    showReply.value = true;
    replyTo.value = null;
}
function nextPage() {
    if (replies.value == null) {
        return;
    }
    if (currentPn.value >= Math.ceil(replies.value.sum / defaultSize)) {
        return;
    }
    else {
        currentPn.value++;
    }
}
function afterUploadedReply(rid: number, content: string) {
    let reply: ReplyWithReplyToAndAuthor = {
        reply: {
            rid,
            fromCid: props.cid,
            content,
            replyToUid: replyTo.value,
            createTime: Date.now(),
            authorUid: baseUserInfo.uid
        },
        authorInfo: {
            username: "我",
            uid: baseUserInfo.uid,
            userType: 2,
            createTime: 0
        },
        replyToInfo: {
            username: replyToName.value as string,
            uid: replyTo.value as number,
            userType: 2,
            createTime: 0
        }
    };
    if (replies.value == null) {
        replies.value = {
            dataList: [],
            sum: 1
        };
        replies.value.dataList.unshift(reply);
    }
    else {
        replies.value.dataList.unshift(reply);
    }
}
defineExpose({
    removeReplyUpload, readyToReply
})
const hasMore = computed(() => {
    if (replies.value == null) {
        return false;
    }
    return currentPn.value < Math.ceil(replies.value.sum / defaultSize);
});
function afterDeleted(rid: number) {
    if (!replies.value) {
        return;
    }
    for (let i = 0; i < replies.value.dataList.length; i++) {
        if(replies.value.dataList[i].reply.rid == rid) {
            replies.value.dataList.splice(i, 1);
            return;
        }
    }
}
</script>
<style lang="less">
.reply-list-container {
    margin: 0px 2rem;
    font-size: 0.8rem;
    background-color: rgba(182, 250, 250, 0.153);
    padding: 5px;
    border-radius: 0.5rem;
}
</style>