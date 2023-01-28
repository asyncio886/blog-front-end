<template>
<div class="login-container">
        <div>
            <Row :justify="`center`">
                <Col>
                    <h2 :style="{ marginTop: `3rem` }">管理员登录</h2>
                </Col>
            </Row>
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
                <Button type="primary" @click="startAdminLogin">
                    登录
                </Button>
            </Row>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { adminLogin } from "@/api/adminApi";
import {Row, Col, Input, Button, message} from "ant-design-vue";
import { ref } from "vue";
import useBaseUserInfo from "@/store/baseUserInfo";
import { useRouter } from "vue-router"
import AdminRouteKeys from "@/constant/AdminRouteKeys";
const email = ref("");
const password = ref("");
const baseUserInfo = useBaseUserInfo();
const router = useRouter();
async function startAdminLogin() {
    let res = await adminLogin(email.value, password.value);
    if(res.ok) {
        message.success("管理员登录成功");
        router.replace({name: AdminRouteKeys.AdminTag.name}).then(() => {
            baseUserInfo.setUserAdmin();
        })
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