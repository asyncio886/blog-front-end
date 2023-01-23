<template>
    <div class="admin-container">
        <div class="admin-menu-list" v-if="refBaseUserInfo.isAdmin.value">
            <div>
                <Button type="primary" @click="toggleShowMenu">菜单</Button>
            </div>
            <div v-if="showMenu">
                <Menu theme="dark" mode="inline" :selected-keys="[]"  :style="{ borderRadius: '5px', minWidth: '200px' }">
                    <div v-for="item in adminRouteData" :key="item.name">
                        <Menu.Item  v-if="item.showMenu && !item.hasChild" :key="item.name">
                        <RouterLink :to="{ name: item.name }">{{ item.showName }}</RouterLink>
                        </Menu.Item>
                        <Menu.SubMenu v-if="item.hasChild" :key="item.name">
                            <template #title>{{ item.showName }}</template>
                            <div v-for="i in item.children" :key="(i as any).name" >
                                <Menu.Item v-if="i.showMenu">
                                    <RouterLink :to="{ name: (i as any).name }">{{ (i as any).showName }}</RouterLink>
                                </Menu.Item>
                            </div>
                        </Menu.SubMenu>
                    </div>
                </Menu>
            </div>
        </div>
        <div class="admin-view">
            <RouterView />
        </div>
    </div> 
</template>
<script lang="ts" setup>
import { Menu, Button } from "ant-design-vue";
import adminRouteData from "@/constant/AdminRouteKeys"
import {  ref } from "vue";
import useBaseUserInfo from "@/store/baseUserInfo"
import { storeToRefs } from "pinia";
const showMenu = ref(true);
const refBaseUserInfo = storeToRefs(useBaseUserInfo());
function toggleShowMenu() {
    showMenu.value = !showMenu.value;
}
</script>
<style lang="less" scoped>
.admin-menu-list {
    >* {
        padding: 5px;
    }

    @media screen and (min-width: 500px) {
        max-width: 200px;
    }
}

.admin-container {
    display: flex;

    @media screen and (max-width: 500px) {
        flex-direction: column;
    }

    .admin-view {
        flex-grow: 1;

        @media screen and (min-width: 500px) {
            margin-left: 1.8rem;
            width: 0;
        }
    }
}
</style>