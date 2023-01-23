<template>
    <div v-if="userDetail != null">
        <Row :justify="`center`">
            <Upload :custom-request="justDoPreview" :max-count="1" v-model:file-list="fileList">
                <Avatar v-if="refBaseUserInfo.baseAvatar.value == '' || refBaseUserInfo.baseAvatar.value == null"
                    :style="{ height: '4rem', width: '4rem', cursor: 'pointer' }">
                    <template #icon>
                        <UserOutlined :style="{ fontSize: '3.5rem' }" />
                    </template>
                </Avatar>
                <Avatar v-else :src="refBaseUserInfo.baseAvatar.value"
                    :style="{ height: '4rem', width: '4rem', cursor: 'pointer' }" />
            </Upload>
        </Row>
        <Row :justify="`center`">
            <div>
                <b>
                    <h2>
                        {{ userDetail.username }}
                    </h2>
                </b>
            </div>
        </Row>
        <Row :justify="`center`">
            <div class="edit-admin-container">
                <Input v-model:value="(userDetail.githubLink as string)" prefix="github链接: " />
                <Input v-model:value="(userDetail.qqLink as string)" prefix="qq联系方式: " />
                <Input v-model:value="(userDetail.twitterLink as string)" prefix="推特: " />
                <Input v-model:value="(userDetail.weiboLink as string)" prefix="微博: " />
                <Input.TextArea v-model:value="(userDetail.description as string)" placeholder="简介" />
                <Row :justify="`center`">
                    <Button @click="doUpload" type="primary" :danger="true">
                        提交
                    </Button>
                </Row>
            </div>
        </Row>
    </div>
</template>
<script setup lang="ts">
import useBaseUserInfo from '@/store/baseUserInfo';
import { storeToRefs } from 'pinia';
import { Input, Row, Avatar, message, Upload, Button, UploadFile, Modal } from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue'
import { onBeforeMount } from 'vue';
import { detail } from '@/api/userApi';
import { adminUserInfoUpdate, uploadAvatar } from '@/api/adminApi';
import { UploadRequestOption } from 'ant-design-vue/lib/vc-upload/interface';
const baseUserInfo = useBaseUserInfo();
const refBaseUserInfo = storeToRefs(baseUserInfo);
const userDetail = refBaseUserInfo.adminUserDetail;
let preViewFileOption: UploadRequestOption<any> | null = null;
let fileList: UploadFile[] = [];
async function createBase64Str(): Promise<string> {
    if (preViewFileOption == null) {
        return '';
    }
    let file: File = preViewFileOption.file as File;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve) => {
        reader.onload = function () {
            resolve(this.result as string);
        }
    })
}
async function justDoPreview(option: UploadRequestOption<any>) {
    preViewFileOption = option;
    refBaseUserInfo.baseAvatar.value = await createBase64Str()
}

async function realUploadUserAvatar() {
    if (userDetail.value == null || preViewFileOption == null) {
        return;
    }
    let res = await uploadAvatar(preViewFileOption.file as File);
    if (res.ok && res.data != null) {
        message.success(res.message);
        userDetail.value.avatar = res.data;
    }
    else {
        message.warning(res.message);
    }
}
async function upload() {
    if(userDetail.value == null) {
        return;
    }
    await realUploadUserAvatar();
    let res = await adminUserInfoUpdate({
        avatar: userDetail.value.avatar,
        description: userDetail.value.description,
        githubLink: userDetail.value.githubLink,
        qqLink: userDetail.value.qqLink,
        twitterLink: userDetail.value.twitterLink,
        weiboLink: userDetail.value.weiboLink
    });
    if(res.ok) {
        message.success(res.message);
    }
    else {
        message.warning(res.message);
    }
}
async function doUpload() {
    Modal.confirm({
        title: "确定提交？",
        content: "提交后将无法修改",
        okText: "确定",
        cancelText: "取消",
        onOk() {
            return new Promise((resolve, reject)=>{
                upload().then(() => {
                    resolve(true);
                }).catch(() => {
                    reject();
                })
            })
        }
    })
}

onBeforeMount(async () => {
    if (refBaseUserInfo.adminUserDetail.value != null) {
        return;
    }
    let res = await detail(refBaseUserInfo.uid.value);
    if (res.ok && res.data != null) {
        refBaseUserInfo.adminUserDetail.value = res.data;
        refBaseUserInfo.baseAvatar.value = res.data.avatar as string;
    }
    else {
        message.warning(res.message);
    }
})
</script>
<style lang="less">
.edit-admin-container {
    width: 60%;
    margin: 0px auto;

    @media screen and (max-width: 500px) {
        width: 80%;
    }

    >* {
        margin: 5px 0px;
    }
}
</style>