<template>
    <div>
        <Row :justify="`end`">
            <span style="cursor: pointer; padding: 5px;">
                <CloseCircleOutlined @click="closeUpload"/>
            </span>
            <Input.TextArea v-model:value="content" :placeholder="`回复 ${refProps.replyToName.value}`"/>
            <Button :style="{margin: '10px'}" @click="uploadReplyTORemote">
                提交
            </Button>
        </Row>
    </div>
</template>
<script lang="ts" setup>
import { ref, toRefs } from 'vue';
import { Input,Button, message, Row } from "ant-design-vue";
import { CloseCircleOutlined } from "@ant-design/icons-vue";
import { uploadReply } from '@/api/commentApi';
const props = defineProps<{fromCid: number, replyTo: number | null, replyToName: string | null}>()
const refProps = toRefs(props);
const content = ref("");
const emits = defineEmits(["uploaded", "close"]);
async function uploadReplyTORemote() {
    let res = await uploadReply(refProps.fromCid.value, content.value, refProps.replyTo.value);
    if(res.ok) {
        message.success(res.message);
        emits("uploaded", res.data, content.value);
        emits("close");
    }
    else {
        message.warning(res.message);
    }
}
function closeUpload() {
    emits("close");
}
</script>