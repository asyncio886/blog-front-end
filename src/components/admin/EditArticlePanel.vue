<template>
    <div class="edit-container">
        <div>
            <Row :justify="`center`">
                <Col :xs="24" :md="10">
                <Input v-model:value="articleVo.title" :size="`large`" :prefix="`标题: `" />
                </Col>
            </Row>
            <Row :justify="`start`">
                <div>
                    <h2>标签</h2>
                    <Select v-model:value="articleVo.tagId" style="min-width: 120px">
                        <Select.Option v-for="item in webConfig.topMenuList" :key="item.tid" :value="item.tid">
                            {{ item.tagName }}
                        </Select.Option>
                    </Select>
                </div>
            </Row>
            <br>
            <Row>
                <Input.TextArea v-model:value="articleVo.description" placeholder="简介" />
            </Row>
            <br>
            <span>封面图: </span>
            <Upload v-model:file-list="facePictureUploadFiles" :custom-request="customRequest" :max-count="1">
                <Button type="primary">上传封面图</Button>
            </Upload>
            <br>
            <Image v-if="articleVo.facePicture != null" :width="200" :height="200"
                :src="(articleVo.facePicture as string)" />
            <span v-else>暂无</span>
        </div>
        <MdEditor v-model="articleVo.content" @upload-img="onUploadImages" />
        <Row :justify="`center`" :style="{ padding: '10px' }">
            <Button type="primary" @click="uploadArticleToRemote">提交</Button>
        </Row>
    </div>
</template>

<script lang="ts" setup>
import { uploadArticlePicture } from '@/api/adminApi';
import { UploadFile, message } from 'ant-design-vue';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { Ref, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Input, Row, Col, Upload, Image, Button, Modal, Select } from "ant-design-vue";
import { ArticleVo } from '@/api/declare';
import { UploadRequestOption } from 'ant-design-vue/lib/vc-upload/interface';
import ArticleStoreKey from '@/constant/ArticleStoreKey';
import useWebConfig from '@/store/webConfig';
const webConfig = useWebConfig();
const props = defineProps<{ localStorePrefix?: string, baseArticleVo?: ArticleVo }>();
let emptyArticleVo: ArticleVo = {
    content: "",
    facePicture: null,
    description: "",
    tagId: webConfig.topMenuList.length == 0 ? -1 : webConfig.topMenuList[0].tid,
    title: ""
};
const articleVo: Ref<ArticleVo> = ref<ArticleVo>(emptyArticleVo);
let facePictureUploadFiles: UploadFile[] = [];

const emits = defineEmits<{
    (e: "uploadArticle", data: ArticleVo, func: () => void): void
}>();
async function onUploadImages(files: File[], callBack: (urls: string[]) => void) {
    let urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
        let res = await uploadArticlePicture(files[i]);
        if (res.ok && res.data != null) {
            urls.push(res.data);
            if (articleVo.value.facePicture == null) {
                articleVo.value.facePicture = res.data;
            }
        }
        else {
            message.warning(files[i].name + " " + res.message);
        }
    }
    callBack(urls);
}
async function customRequest(options: UploadRequestOption<any>) {
    let res = await uploadArticlePicture(options.file as File);
    if (res.ok) {
        articleVo.value.facePicture = res.data;
    }
    else {
        message.warning(res.message);
    }
}
function save() {
    if (props.localStorePrefix == undefined) {
        localStorage.setItem(ArticleStoreKey.aritcleVoKey, JSON.stringify(articleVo.value));
    }
    else {
        localStorage.setItem(ArticleStoreKey.aritcleVoKey + props.localStorePrefix, JSON.stringify(articleVo.value));
    }
}
function loadLocal() {
    let data;
    if (props.localStorePrefix == undefined) {
        data = localStorage.getItem(ArticleStoreKey.aritcleVoKey);
    }
    else {
        data = localStorage.getItem(ArticleStoreKey.aritcleVoKey + props.localStorePrefix);
    }
    if (data == null) {
        if (props.baseArticleVo == undefined) {
            articleVo.value = emptyArticleVo;
        }
        else {
            articleVo.value = props.baseArticleVo;
        }
    }
    else {
        try {
            let tempVo = JSON.parse(data);
            articleVo.value = tempVo;
        } catch (e) {
            articleVo.value = emptyArticleVo;
        }
    }
}

function clearLocal() {
    if (props.localStorePrefix == undefined) {
        localStorage.removeItem(ArticleStoreKey.aritcleVoKey);
    }
    else {
        localStorage.removeItem(ArticleStoreKey.aritcleVoKey + props.localStorePrefix);
    }
}
function saveLocal(e: KeyboardEvent) {
    if (e.ctrlKey && e.key == 's') {
        e.preventDefault();
        save();
        message.success("页面有自动保存功能");
    }
}
async function uploadArticleToRemote() {
    Modal.confirm({
        title: "确定提交吗",
        direction: "ltr",
        content: "提交后叫无法撤销，本地记录会被删除",
        okText() {
            return "确定";
        },
        cancelText() {
            return "取消";
        },
        onOk() {
            return new Promise((resolve, reject) => {
                emits("uploadArticle", articleVo.value, clearLocal);
                resolve(null);
            });
        }
    })
}
onMounted(() => {
    document.addEventListener("keydown", saveLocal);
});

onBeforeUnmount(() => {
    document.removeEventListener("keydown", saveLocal);
})
onBeforeMount(() => {
    loadLocal();
})
watch(articleVo, () => {
    save();
}, {
    deep: true
})
</script>
<style lang="less">
.md-editor-content {
    @media screen and (max-width: 500px) {
        flex-direction: column !important;
    }
}

.edit-container {
    max-width: 100%;
}

.md-editor-toolbar {
    @media screen and (min-width: 500px) {
        overflow-x: scroll !important;
        overflow-y: hidden;
        height: 2.1rem !important;
    }

}
</style>