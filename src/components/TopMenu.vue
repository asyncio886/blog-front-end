<template>
    <div>
        <Menu mode="horizontal" theme="dark" :selected-keys="[]">
            <div style="flex-grow: 1; justify-content: flex-end; display: flex;">
                <div style="max-width: 250px; padding-top: 10px;">
                    <Menu.Item>
                    <Input.Search v-model:value="searchText" placeholder="搜索内容" @search="startSeach" />
                    </Menu.Item>
                </div>
            </div>
            <div v-for="item in baseMenu" :key="item.routeName">
                <Menu.Item v-if="!item.hasChild">
                <RouterLink :to="item.routeTo">
                    {{ item.showName }}
                </RouterLink>
                </Menu.Item>
                <Menu.SubMenu v-else>
                    <template #title>{{ item.showName }}</template>
                    <Menu.Item :key="`firt-item`">
                    <RouterLink :to="'/'">
                        综合
                    </RouterLink>
                    </Menu.Item>
                    <Menu.Item v-for="subItem in item.children" :key="subItem.routeName">
                    <RouterLink :to="subItem.routeTo">
                        {{ subItem.showName }}
                    </RouterLink>
                    </Menu.Item>
                </Menu.SubMenu>
            </div>

        </Menu>
    </div>
</template>
<script lang="ts" setup>
import useWebConfig from '@/store/webConfig';
import { Menu,  Input } from "ant-design-vue"
import { storeToRefs } from 'pinia';
import { createBaseMenuList, createMenuListFromTags, addChildMenu, MenuItemType } from "@/utils/MenuUtils"
import routeKeys from "@/constant/RouteKeys";
import { Ref, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import RouteKeys from '@/constant/RouteKeys';
const webConfig = storeToRefs(useWebConfig());
let baseMenu: Ref<null | MenuItemType[]> = ref(null);
watch(webConfig.topMenuList, () => {
    baseMenu.value = createBaseMenuList()
    addChildMenu(baseMenu.value, createMenuListFromTags(webConfig.topMenuList.value, routeKeys.Index.path), routeKeys.Index.name);
})
const searchText = ref("");
const router = useRouter();
function startSeach() {
    router.push({
        name: RouteKeys.Search.name, query: {
            kw: searchText.value,
            pn: 1
        }
    })
}
</script>