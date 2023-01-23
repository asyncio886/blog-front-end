<template>
    <EditArticlePanel @upload-article="updateArticleRemote" 
    :base-article-vo="editArticleStore.data == null ? undefined : editArticleStore.data"
    :local-store-prefix="editArticleStore.aid == null ? undefined : '_target_' + editArticleStore.aid"
    />
</template>
<script setup lang="ts">
import useEditArticleStore from '@/store/editArticleStore';
import EditArticlePanel from '@/components/admin/EditArticlePanel.vue';
import { ArticleVo } from '@/api/declare';
import { updateArticle } from '@/api/adminApi';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import RouteKeys from '@/constant/RouteKeys';
const router = useRouter();
const editArticleStore = useEditArticleStore();
async function updateArticleRemote(vo:ArticleVo, func: () => void) {
    let res = await updateArticle(vo, editArticleStore.aid as number);
    if(res.ok) {
        message.success(res.message);
        func();
        setTimeout(() => {
            router.replace({
                name: RouteKeys.Detail.name,
                params: {
                    aid: editArticleStore.aid
                }
            })
        }, 300);
    }
    else {
        message.warning(res.message);
    }
}
</script>