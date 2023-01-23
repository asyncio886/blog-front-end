<template>
    <div>
        <Table :columns="columns" :data-source="refWebConfig.topMenuList.value" :pagination="false">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key == 'operator'">
                    <span>
                        <a @click="removeTag(record.tid)">
                            删除
                        </a>
                        <a @click="startUpdateTag(record)">
                            编辑
                        </a>
                    </span>
                </template>
            </template>
        </Table>
    </div>
    <div>
        <Row :justify="`center`" :style="{width: '80%', margin: '0px auto'}">
            <Tabs v-model:active-key="activeKey" animated>
                <Tabs.TabPane :key="1" tab="添加">
                    <TagEdit :is-update="false" @uploaded="afterUploadTag" />
                </Tabs.TabPane>
                <Tabs.TabPane :key="2" tab="更新">
                    <TagEdit :is-update="true" :before-updated-data="refTempUpdateTag" @updated="afterUpdateTag"/>
                </Tabs.TabPane>
            </Tabs>
        </Row>
    </div>
</template>
<script lang="ts" setup>
import { Table, Row, message, Modal,  Tabs } from "ant-design-vue";
import useWebConfig from "@/store/webConfig";
import { storeToRefs } from "pinia";
import { deleteTag } from "@/api/adminApi";
import { ref } from "vue";
import TagEdit from "@/components/admin/TagEdit.vue";
import { Tag } from "@/api/declare";
const webConfig = useWebConfig();
const refWebConfig = storeToRefs(webConfig);
const columns = [{
    title: "tagId",
    width: "5%",
    dataIndex: "tid"
}, {
    title: "标签名",
    width: "25%",
    dataIndex: "tagName"
}, {
    title: "描述",
    width: "30%",
    dataIndex: "description"
}, {
    title: "路由关键字",
    width: "20%",
    dataIndex: "tagRoute"
}, {
    title: "操作",
    width: "20%",
    dataIndex: "operator",
    key: "operator"
}]
const activeKey = ref(1);
async function removeTag(tagId: number) {
    Modal.confirm({
        title: "确定删除吗",
        content: "删除后将无法恢复",
        okText: "确定",
        cancelText: "取消",
        async onOk() {
            let res = await deleteTag(tagId);
            if (res.ok) {
                message.success(res.message);
                webConfig.removeTag(tagId);
            }
            else {
                message.warning(res.message);
            }
        }
    })
}
function startUpdateTag(tag: Tag) {
    activeKey.value = 2;
    refTempUpdateTag.value = tag;
}
function afterUploadTag(tag: Tag) {
    webConfig.addTagToList(tag);
}
function afterUpdateTag(tag: Tag) {
    webConfig.updateListItem(tag);
}
const refTempUpdateTag = ref<Tag | undefined>(undefined);
</script>