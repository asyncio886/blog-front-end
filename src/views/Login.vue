<template>
    <div class="login-container">
        <div>
            <Row :justify="`center`" :style="{ padding: `5px` }">
                <Col :xs="20" :md="10">
                <Input :prefix="`邮箱: `" v-model:value="email" />
                </Col>
            </Row>
            <Row :justify="`center`" :style="{ padding: `5px` }">
                <Col :xs="20" :md="10">
                <Input.Password :prefix="`密码: `" v-model:value="password" />
                </Col>
            </Row>
            <Row :justify="`center`">
                <Button type="primary" @click="startLogin">
                    登录
                </Button>
            </Row>
        </div>
    </div>

</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { Input , Row, Col, Button, message } from 'ant-design-vue';
import { login } from '@/api/userApi';
import useBaseUserInfo from '@/store/baseUserInfo';
const email = ref("");
const password = ref("");
const baseUserInfo = useBaseUserInfo();
async function startLogin() {
    let res = await login(email.value, password.value);
    if (res.ok) {
        message.success("登录成功");
        baseUserInfo.removeAllLoginData();
        location.href = "/";
    }
    else {
        message.warning(res.message);
    }
}
</script>
<style lang="less">
.login-container {
    height: 35vw;
    display: flex;
    align-items: center;
    >* {
        width: 100%;
    }
}
</style>