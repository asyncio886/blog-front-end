<template>
    <div class="register-container">
        <div>
            <div v-show="currentStep == 0">
                <Row :justify="`center`">
                    <Col :xs="20" :md="10">
                    <Input v-model:value="email" :prefix="`邮箱:`" />
                    </Col>
                </Row>
            </div>
            <div v-show="currentStep == 1" class="register-user-info">
                <Row :justify="`center`">
                    <Col :xs="20" :md="10">
                    <Input :prefix="`用户名: `" v-model:value="username" />
                    </Col>
                </Row>
                <Row :justify="`center`">
                    <Col :xs="20" :md="10">
                    <Input.Password :prefix="`密码: `" v-model:value="password" />
                    </Col>
                </Row>
                <Row :justify="`center`">
                    <Col :xs="20" :md="10">
                    <Input.Password :prefix="`再次输入密码: `" v-model:value="confirmPassword" />
                    </Col>
                </Row>
                <Row :justify="`center`">
                    <Col :xs="10" :md="5">
                    <Input :prefix="`验证码: `" :maxlength="5" :size="`small`" v-model:value="code" />
                    </Col>
                </Row>
                <Row :justify="`center`">
                    <Button type="primary" @click="doRegister">
                        注册
                    </Button>
                </Row>
            </div>
            <Row :justify="`center`" :style="{ 'padding': '10px' }">
                <Button type="primary" @click="lastStep" :disabled="currentStep <= 0">
                    上一步
                </Button>
                <Button type="primary" @click="nextStep" :disabled="currentStep >= stepsList.length - 1">
                    下一步
                </Button>
            </Row>
        </div>
    </div>

    <div style="padding: 10px;">
        <Steps :current="currentStep" :size="`small`">
            <Steps.Step v-for="item in stepsList" :key="item.title">
                <template #title>{{ item.title }}</template>
                <template #description>{{ item.desciption }}</template>
            </Steps.Step>
        </Steps>
    </div>

</template>
<script lang="ts" setup>
import { getCode, register } from '@/api/userApi';
import { Steps, Input, Row, Col, Button, message } from 'ant-design-vue';
import { ref } from 'vue';
import useBaseUserInfo from "@/store/baseUserInfo";
const baseUserInfo = useBaseUserInfo(); 
const stepsList: { desciption: string, title: string }[] = [
    {
        title: "输入您的邮箱",
        desciption: "我需要验证您是不是机器人"
    },
    {
        title: "填写用户名，密码和刚才的验证码",
        desciption: "用于标识你的身份"
    }
]
const currentStep = ref(0);
const email = ref("");
const password = ref("");
const username = ref("");
const confirmPassword = ref("");
const code = ref("");
let hasSendCode = false;
function lastStep() {
    if (currentStep.value > 0) {
        currentStep.value--;
    }
}
async function nextStep() {
    if (email.value == "") {
        return;
    }
    if (currentStep.value < stepsList.length - 1) {
        if (!hasSendCode) {
            let res = await getCode(email.value);
            if (res.ok && res.data != null) {
                message.success("验证码获取成功," + res.data + "分钟内有效");
                hasSendCode = true;
                currentStep.value++;
                setTimeout(() => {
                    hasSendCode = false;
                }, res.data * 1000 * 60)
            }
            else {
                message.warning(res.message);
            }
        }
        else {
            message.info("验证码已经发送过");
            currentStep.value++;
        }
    }
}

async function doRegister() {
    if (confirmPassword.value != password.value) {
        message.warning("两次密码输入不一致");
        return;
    }
    let res = await register(email.value, password.value, username.value, code.value);
    if (res.ok) {
        message.success("注册成功");
        baseUserInfo.removeAllLoginData();
        location.href = "/";
        return;
    }
    else {
        message.error(res.message);
    }
} 
</script>
<style lang="less">
.register-user-info {
    >* {
        padding: 10px;
    }
}

.register-container {
    height: 35vw;
    display: flex;
    align-items: center;
    >* {
        width: 100%;
    }
}
</style>