<template>
    <div class="user-box">
        <div>
            <Avatar v-if="detail.avatar == null || detail.avatar == ''">
                <template #icon>
                    <UserOutlined />
                </template>
            </Avatar>
            <Avatar v-else :src="detail.avatar" />
        </div>
        <div>
            <b>{{ normal.username }}</b>
            &nbsp;
            <span>
                <Tag color="orange" v-if="normal.userType == 0">
                    普通用户
                </Tag>
                <Tag color="green" v-if="normal.userType == 1">
                    管理员
                </Tag>
            </span>
        </div>
        <div>
            <span>
                注册时间 :
            </span>
            <Tag>
                {{ translateNumberToTime(normal.createTime) }}
            </Tag>
        </div>
        <div>
            <p style="font-size: 0.8rem; opacity: 0.6; text-indent: 2em; word-wrap: break-word; white-space: normal; word-break: break-all;">
                {{ detail.description }}
            </p>
        </div>
        <Row :justify="`start`">
            <span style="font-size: large;" class="links">
                <Popover>
                    <template #content>
                        <span style="font-size: 0.6rem;">
                            {{ detail.qqLink }}
                        </span>
                    </template>
                    <QqCircleFilled :style="{ fontSize: '1.5rem' }" />
                </Popover>
                <Popover>
                    <template #content>
                        <span style="font-size: 0.6rem;">
                            {{ detail.githubLink }}
                        </span>
                    </template>
                    <GithubFilled :style="{ fontSize: '1.5rem' }" />
                </Popover>
                <Popover>
                    <template #content>
                        <span style="font-size: 0.6rem;">
                            {{ detail.weiboLink }}
                        </span>
                    </template>
                    <WeiboCircleFilled :style="{ fontSize: '1.5rem' }" />
                </Popover>
                <Popover>
                    <template #content>
                        <span style="font-size: 0.6rem;">
                            {{ detail.twitterLink }}
                        </span>
                    </template>
                    <TwitterCircleFilled :style="{ fontSize: '1.5rem' }" />
                </Popover>
            </span>
        </Row>
        <hr>
    </div>
</template>
<script lang="ts" setup>
import { AdminUser, NormalUser } from '@/api/declare';
import { Avatar, Tag, Row, Popover } from "ant-design-vue";
import { UserOutlined, GithubFilled, TwitterCircleFilled, QqCircleFilled, WeiboCircleFilled } from "@ant-design/icons-vue"
import { translateNumberToTime } from '@/utils/TranslateUtils';
const props = defineProps<{ detail: AdminUser, normal: NormalUser }>();
const detail = props.detail;
const normal = props.normal;
</script>
<style lang="less" scoped>
.user-box{
    >*{
        margin: 5px 0px;
    }
}
</style>