<template>
    <Row :justify="`center`">
        <h1><b>{{ data.title }}</b></h1>
    </Row>
    <div>
        <p style="font-size: 0.8rem; opacity: 0.6; text-indent: 2em">
            {{ data.description }}
        </p>
    </div>
    <Row :justify="`center`" v-if="data.facePicture != null && data.facePicture != ''">
        <img :src="data.facePicture" class="face-picture">
    </Row>
    <div>
        <MdEditor previewOnly v-model="data.content" />
    </div>
    <div>
        点赞 : {{ likeCount }} 浏览量 : {{ data.watchCount }}
    </div>
    <Row :justify="`center`">
        <span style="cursor: pointer;" @click="doLike">
            <LikeFilled v-show="liked" :style="{ fontSize: '2rem' }" />
            <LikeOutlined v-show="!liked" :style="{ fontSize: '2rem' }" />
        </span>
    </Row>
</template>
<script lang="ts" setup>
import { Article } from '@/api/declare';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { Row } from "ant-design-vue";
import { LikeOutlined, LikeFilled } from "@ant-design/icons-vue";
import { articleLikeStatus, likeArticle } from '@/api/articleApi';
import { onBeforeMount, ref } from 'vue';
const props = defineProps<{ data: Article }>();
const data = props.data;
const liked = ref<boolean>(false);
const likeCount = ref(data.likeCount);
async function getLikeStatus() {
    let res = await articleLikeStatus(props.data.aid);
    if (res.ok) {
        liked.value = true;
    }
}
async function doLike() {
    let res = await likeArticle(data.aid, !liked.value);
    if (res.ok) {
        liked.value = !liked.value;
        if (liked.value) {
            likeCount.value++;
        }
        else {
            likeCount.value--;
        }
    }
}
onBeforeMount(async () => {
    await getLikeStatus();
})
</script>
<style lang="less">
p {
    .figure {
        margin: 5px auto;
        width: 100% !important;

        img {
            max-height: 30rem;
            max-width: 100%;
        }
    }
}
.face-picture{
    max-width: 100%;
}
</style>