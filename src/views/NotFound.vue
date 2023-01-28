<template>
    <Result status="404" title="404" sub-title="你要找的界面不存在">
        <template #extra>
            <RouterLink :to="'/'" :replace="true">
                <Button type="primary">
                    回到首页
                </Button>
            </RouterLink>
        </template>
    </Result>
</template>
<script lang="ts" setup>
import { Result, Button } from "ant-design-vue";
</script>