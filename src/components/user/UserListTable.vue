<template>
    <Table :columns="columns" :data-source="refProps.dataSource.value" :pagination="false">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key == 'operator'">
                <a @click="tryDeleteUser(record.uid, record.userType)" v-if="record.userType != 1">
                    删除
                </a>
                <a @click="readyToUpdate(record)">
                    编辑
                </a>
            </template>
            <template v-if="column.key == 'userType'">
                <Tag v-if="record.userType == 1" color="green">
                    管理员
                </Tag>
                <Tag v-else color="orange">
                    普通用户
                </Tag>
            </template>
            <template v-if="column.key == 'createTime'">
                {{ translateNumberToTime(record.createTime) }}
            </template>
        </template>
    </Table>
    <Row :justify="`center`" v-if="updateUserVo != null">
        <div style="width: 80%; margin: 5px auto; max-width: 400px;">
            <Input v-model:value="updateUserVo.username" prefix="用户名" :style="{ margin: '5px 0px' }" />
            <Input v-model:value="updateUserVo.email" prefix="邮箱" :style="{ margin: '5px 0px' }" />
            <Input v-model:value="updateUserVo.password" prefix="新密码" :style="{ margin: '5px 0px' }" />
            <Row :justify="`center`">
                <Button type="primary" :danger="true" :disabled="notChange" @click="goToUpdate">
                    更新
                </Button>
            </Row>
        </div>

    </Row>
</template>
<script lang="ts" setup>
import { SafeUser } from '@/api/declare';
import { Ref, computed, ref, toRefs } from 'vue';
import { Modal, Table, Tag, message, Row, Input, Button } from "ant-design-vue";
import { deleteUser, updateUserInfo } from '@/api/adminApi';
import { translateNumberToTime } from '@/utils/TranslateUtils';
const props = defineProps<{ dataSource: SafeUser[] }>();
const refProps = toRefs(props);
const columns = [{
    title: "uid",
    width: "5%",
    dataIndex: "uid"
}, {
    title: "用户名",
    width: "25%",
    dataIndex: "username"
}, {
    title: "邮箱",
    width: "30%",
    dataIndex: "email"
}, {
    title: "注册时间",
    width: "20%",
    key: "createTime",
    dataIndex: "createTime"
}, {
    title: "用户类型",
    width: "10%",
    dataIndex: "userType",
    key: "userType"
}, {
    title: "操作",
    width: "10%",
    dataIndex: "operator",
    key: "operator"
}]
const emits = defineEmits<{
    (e: "afterDeleteUser", uid: number): void,
    (e: "afterUpdateUser", data: SafeUser): void
}>();
type UpdateUserVo = {
    uid: number
    email: string,
    password: string,
    username: string
    createTime: number,
    userType: number
};
const updateUserVo: Ref<UpdateUserVo | null> = ref(null);
// 记录没有修改的用户信息
let tempModel: Ref<UpdateUserVo | null> = ref(null);
async function tryDeleteUser(uid: number, userType: number) {
    if (userType == 1) {
        message.warning("管理员用户不得删除");
        return;
    }
    Modal.confirm({
        title: "确定删除吗 ?",
        content: "删除后将无法恢复",
        direction: "ltr",
        okText: "确定",
        cancelText: "取消",
        onOk() {
            return new Promise((resolve, reject) => {
                deleteUser(uid).then(res => {
                    if (res.ok) {
                        message.success("删除成功")
                        emits("afterDeleteUser", uid);
                        resolve(true);
                    }
                    else {
                        reject(false);
                    }
                }).catch(() => {
                    reject(false);
                })
            })
        }
    })
}
const notChange = computed(() => {
    if (tempModel.value == null || updateUserVo.value == null) {
        return true;
    }
    else {
        return tempModel.value.email == updateUserVo.value.email &&
            tempModel.value.password == updateUserVo.value.password &&
            tempModel.value.uid == updateUserVo.value.uid &&
            tempModel.value.username == updateUserVo.value.username;
    }
})
function readyToUpdate(user: SafeUser) {
    let temp: UpdateUserVo = {
        uid: user.uid,
        email: user.email,
        password: "",
        username: user.username,
        createTime: user.createTime,
        userType: user.userType
    };
    let model: UpdateUserVo = {
        uid: user.uid,
        email: user.email,
        password: "",
        username: user.username,
        createTime: user.createTime,
        userType: user.userType
    };  
    tempModel.value = model;
    updateUserVo.value = temp;
}
async function goToUpdate() {
    Modal.confirm({
        title: "确定更新吗 ?",
        content: "更新后将无法恢复",
        direction: "ltr",
        okText: "确定",
        cancelText: "取消",
        onOk() {
            return new Promise((resolve, reject) => {
                if (updateUserVo.value == null) {
                    message.warning("出错了");
                    return;
                }
                updateUserInfo(updateUserVo.value.uid, updateUserVo.value.username, updateUserVo.value.email, updateUserVo.value.password)
                    .then(res => {
                        if (res.ok) {
                            message.success(res.message);
                            emits("afterUpdateUser", {
                                uid: updateUserVo.value?.uid,
                                username: updateUserVo.value?.username,
                                email: updateUserVo.value?.email,
                                userType: updateUserVo.value?.userType,
                                createTime: updateUserVo.value?.createTime
                            } as SafeUser);
                            resolve(true);
                        }
                        else {
                            message.warning(res.message);
                            reject(false);
                        }
                    }).catch(() => {
                        reject(false);
                    })
            })
        }
    })
}
</script>