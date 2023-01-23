<template>
    <div class="comment-user-info">
        <span v-if="refProps.data && refProps.data.value">
            <span>
                <b>{{ refProps.data.value.username }}</b>
            </span>
            &nbsp;
            <span>
                <Tag v-if="refProps.data.value.userType == 0" color="orange"
                    :style="{ fontSize: '0.5rem', height: '1.3rem' }">
                    普通用户
                </Tag>
                <Tag v-if="refProps.data.value.userType == 1" color="green"
                    :style="{ fontSize: '0.5rem', height: '1.3rem' }">
                    管理员
                </Tag>
            </span>
        </span>
        <span v-else>
            <Tag color="error">
                用户不存在
            </Tag>
        </span>
        <span v-if="refProps.replyToUserInfo && refProps.replyToUserInfo.value">
            <span>回复 </span>
            <span><b>{{ refProps.replyToUserInfo.value.username }}</b></span>
            &nbsp;
            <span>
                <Tag v-if="refProps.replyToUserInfo.value.userType == 0" color="orange" :style="{ fontSize: '0.5rem' }">
                    普通用户
                </Tag>
                <Tag v-if="refProps.replyToUserInfo.value.userType == 1" color="green" :style="{ fontSize: '0.5rem' }">
                    管理员
                </Tag>
            </span>
        </span>
        <span style="font-size: 0.5rem; opacity: 0.6;" v-if="refProps.replyToUserInfo == undefined">
            {{ translateNumberToTime(refProps.uploadTime.value) }}
        </span>
        <Row :justify="`start`" v-else>
            <span style="font-size: 0.5rem; opacity: 0.6">
                {{ translateNumberToTime(refProps.uploadTime.value) }}
            </span>
        </Row>
    </div>
</template>
<script lang="ts" setup>
import { NormalUser } from '@/api/declare';
import { translateNumberToTime } from "@/utils/TranslateUtils"
import { Tag, Row } from "ant-design-vue";
import { toRefs } from 'vue';
const props = defineProps<{ data: NormalUser | null, uploadTime: number, replyToUserInfo?: NormalUser | null }>()
const refProps = toRefs(props);
</script>
<style lang="less">
.comment-user-info {
    >* {
        margin: 0px 0.5px;
    }
}
</style>