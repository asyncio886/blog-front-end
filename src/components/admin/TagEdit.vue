<template>
    <div>
        <div class="tag-edit-container" v-if="!props.isUpdate">
            <Input prefix="标签名:" v-model:value="uploadVo.tagName"/>
            <Input.TextArea placeholder="标签描述" v-model:value="uploadVo.description"/>
            <Input prefix="路由值" v-model:value="uploadVo.route"/>
            <Row :justify="`center`">
                <Button @click="insertTag">
                    提交
                </Button>
            </Row>
        </div>
        <div class="tag-edit-container" v-else>
            <span>tagId: {{ updateTagId == -1 ? "无更新目标" : updateTagId}}</span>
            <Input prefix="标签名:" v-model:value="updateVo.tagName" :disabled="updateTagId == -1"/>
            <Input.TextArea placeholder="标签描述" v-model:value="updateVo.description" :disabled="updateTagId == -1"/>
            <Input prefix="路由值" v-model:value="updateVo.route" :disabled="updateTagId == -1" />
            <Row :justify="`center`">
                <Button :disabled="updateTagId == -1" @click=" goToUpdateTag">
                    更新
                </Button>
            </Row>
        </div>
    </div>
</template>
<script setup lang="ts">
import { addTag, updateTag } from "@/api/adminApi";
import { Tag } from "@/api/declare";
import { Row, Button, Input, message } from "ant-design-vue";
import { Ref, computed, ref, toRefs, watch } from "vue";
type TagVo = { tagName: string, route: string, description: string }
const props = defineProps<{ isUpdate: boolean, beforeUpdatedData?: Tag }>();
const refProps = toRefs(props);
const emits = defineEmits<{
    (e: "uploaded", data: Tag): void,
    (e: "updated", data: Tag): void
}>();
const emptyUploadVo = {
    tagName: "",
    route: "",
    description: ""
};
const uploadVo = ref<TagVo>(emptyUploadVo);
async function insertTag() {
    let res = await addTag(uploadVo.value.tagName, uploadVo.value.description, uploadVo.value.route);
    if(res.ok && res.data != null) {
        let temp:Tag = {
            tid: res.data,
            tagName: uploadVo.value.tagName,
            tagRoute: uploadVo.value.route,
            description: uploadVo.value.description
        };
        emits("uploaded", temp);
        message.success(res.message);
        uploadVo.value = emptyUploadVo;
    }
    else {
        message.warning(res.message);
    }
}
const updateTagId = computed(()=>{
    if(!refProps.beforeUpdatedData?.value) {
        return -1;
    }
    else {
        return refProps.beforeUpdatedData.value?.tid;
    }
})
const updateVo:Ref<TagVo> = ref(emptyUploadVo);
async function goToUpdateTag() {
    if(updateTagId.value == -1) {
        return;
    }
    let res = await updateTag(updateTagId.value, updateVo.value.tagName, updateVo.value.description, updateVo.value.route);
    if(res.ok) {
        message.success(res.message);
        let temp:Tag = {
            tid: updateTagId.value,
            tagName: updateVo.value.tagName,
            tagRoute: updateVo.value.route,
            description: updateVo.value.description
        };
        emits("updated", temp);
    }
    else {
        message.warning(res.message);
    }
}
watch(() => refProps.beforeUpdatedData?.value, () => {
    if(!refProps.beforeUpdatedData?.value) {
        return;
    }
    updateVo.value.description = refProps.beforeUpdatedData.value.description;
    updateVo.value.route = refProps.beforeUpdatedData.value.tagRoute;
    updateVo.value.tagName = refProps.beforeUpdatedData.value.tagName;
},{
    immediate: true,
})
</script>
<style lang="less">
.tag-edit-container {
    width: 80%;
    margin: 0px auto;
    >* {
        margin: 0.5rem 0px;
    }
}
</style>