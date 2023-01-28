<template>
    <div style="padding: 10px;" v-if="refWebConfig.webOwnInfo.value != null">
        <Row :justify="`center`" :style="{padding: '0.7rem'}">
            <Avatar :size="`large`" :style="{height: '5rem', width: '5rem'}"
                v-if="refWebConfig.webOwnInfo.value.avatar == null || refWebConfig.webOwnInfo.value.avatar == ''">
                <template #icon>
                    <UserOutlined />
                </template>
            </Avatar>
            <Avatar v-else :size="`large`" :style="{height: '5rem', width: '5rem'}" :src="refWebConfig.webOwnInfo.value.avatar" />
        </Row>
        <Card :title="refWebConfig.webOwnInfo.value.username">
            <p style="font-size: 0.6rem; opacity: 0.8; word-wrap: break-word;">
                {{ refWebConfig.webOwnInfo.value.description }}
            </p>
            <p>
                <Row :justify="`center`">
                    <span style="font-size: large;" class="links">
                        <Popover>
                            <template #content>
                                <span style="font-size: 0.6rem;">
                                    {{ refWebConfig.webOwnInfo.value.qqLink }}
                                </span>
                            </template>
                            <QqCircleFilled :style="{ fontSize: '2rem' }" />
                        </Popover>
                        <Popover>
                            <template #content>
                                <span style="font-size: 0.6rem;">
                                    {{ refWebConfig.webOwnInfo.value.githubLink }}
                                </span>
                            </template>
                            <GithubFilled :style="{ fontSize: '2rem' }" />
                        </Popover>
                        <Popover>
                            <template #content>
                                <span style="font-size: 0.6rem;">
                                    {{ refWebConfig.webOwnInfo.value.weiboLink }}
                                </span>
                            </template>
                            <WeiboCircleFilled :style="{ fontSize: '2rem' }" />
                        </Popover>
                        <Popover>
                            <template #content>
                                <span style="font-size: 0.6rem;">
                                    {{ refWebConfig.webOwnInfo.value.twitterLink }}
                                </span>
                            </template>
                            <TwitterCircleFilled :style="{ fontSize: '2rem' }" />
                        </Popover>
                    </span>
                </Row>
            </p>
        </Card>
        <SideArticleShow />
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import useWebConfig from "@/store/webConfig"
import { storeToRefs } from 'pinia';
import { Avatar, Card, Row, Popover } from "ant-design-vue"
import { UserOutlined, QqCircleFilled, GithubFilled, WeiboCircleFilled, TwitterCircleFilled } from "@ant-design/icons-vue"
import SideArticleShow from './SideArticleShow.vue';
const refWebConfig = storeToRefs(useWebConfig());
const webConfig = useWebConfig();
onBeforeMount(async () => {
    await webConfig.getWebOwnInfo();
})
</script>
<style lang="less">
.links {
    >* {
        padding: 5px;
    }
}
</style>