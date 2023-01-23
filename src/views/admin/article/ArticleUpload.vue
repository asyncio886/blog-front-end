<template>
    <EditArticlePanel @upload-article="uploadArticleRemote" />
</template>

<script lang="ts" setup>
import { uploadArticle } from '@/api/adminApi';
import { ArticleVo } from '@/api/declare';
import EditArticlePanel from '@/components/admin/EditArticlePanel.vue';
import RouteKeys from '@/constant/RouteKeys';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
const router = useRouter();
async function uploadArticleRemote(articleVo: ArticleVo, func: () => void) {
    let res = await uploadArticle(articleVo);
    if (res.ok && res.data != null) {
        message.success(res.message);
        func();
        setTimeout(() => {
            router.replace({
                name: RouteKeys.Detail.name,
                params: {
                    aid: res.data
                }
            })
        }, 300)
    }
    else {
        message.warning(res.message);
    }
}
</script>

