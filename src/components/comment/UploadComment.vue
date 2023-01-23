<template>
    <Row :justify="`end`">
        <Input.TextArea v-model:value="content"/>
        <Button type="primary" :style="{margin: '0.5rem'}" @click="upload">提交评论</Button>
    </Row>
</template>
<script lang="ts" setup>
import { uploadComment } from "@/api/commentApi";
import { Input, Row, Button, message } from "ant-design-vue";
import { ref } from "vue";
const props = defineProps<{targetAid: number}>();
const content = ref("");
const emits = defineEmits(["uploaded"]);
async function upload() {
    let res = await uploadComment(props.targetAid, content.value);
    if(res.ok) {
        message.success(res.message);
        emits("uploaded", content.value, res.data as number);
        content.value = "";
    }
    else {
        message.warning(res.message);
    }
}
</script>