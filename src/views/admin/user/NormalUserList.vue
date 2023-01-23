<template>
    <div v-if="refAdminUserList.userList.value != null">
        <div>
            <span>仅看管理员: </span>
            <Switch v-model:checked="refAdminUserList.isAdmin.value" />
        </div>
        <UserListTable :data-source="refAdminUserList.userList.value.dataList" @after-delete-user="afterDeleteUser"
            @after-update-user="afterUpdateUser" />
        <Row :justify="`center`">
            <Pagination :current="refAdminUserList.currentPage.value" :total="refAdminUserList.userList.value.sum"
                :page-size="refAdminUserList.defaultSize.value" />
        </Row>
    </div>
</template>
<script setup lang="ts">
import { listUsers } from '@/api/adminApi';
import { SafeUser } from '@/api/declare';
import UserListTable from '@/components/user/UserListTable.vue';
import useAdminUserList from '@/store/adminUserList';
import { message, Row, Pagination, Switch } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';
const adminUserList = useAdminUserList();
const refAdminUserList = storeToRefs(adminUserList);
const storeHasLoaded = computed(() => {
    return refAdminUserList.userList.value != null;
});
let componentLoaded = false;
async function loadData() {
    let res = await listUsers(refAdminUserList.currentPage.value, refAdminUserList.defaultSize.value, refAdminUserList.isAdmin.value);
    if (res.ok && res.data != null) {
        refAdminUserList.userList.value = res.data
    }
    else {
        message.warning(res.message);
    }
}
watch(refAdminUserList.currentPage, async () => {
    if (storeHasLoaded.value && !componentLoaded) {
        componentLoaded = true;
        return;
    }
    else {
        await loadData();
    }
    componentLoaded = true;
}, {
    immediate: true
})
watch(refAdminUserList.isAdmin, async ()=> {
    if(refAdminUserList.currentPage.value != 1) {
        refAdminUserList.currentPage.value = 1;
    }
    else {
        loadData();
    }
})
function afterDeleteUser(uid: number) {
    adminUserList.deleteByUid(uid);
}

function afterUpdateUser(user: SafeUser) {
    adminUserList.updateByUid(user);
}
</script>