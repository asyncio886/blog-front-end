<template>
  <Table :columns="columns" :pagination="false" :data-source="refProps.dataSource.value">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key == 'operator'">
        <span>
          <RouterLink :to="{
            name: AdminRouteKeys.AdminArticle.children[2].name, params: {
              aid: record.aid
            }
          }">
            编辑
          </RouterLink>
        </span>
        <span>
          <a @click="deleteTargetArticle(record.aid)">删除</a>
        </span>
      </template>
      <template v-if="column.key == 'title'">
        <RouterLink :to="{name: RouteKeys.Detail.name, params: {aid: record.aid}}">
          {{ record.title }}
        </RouterLink>
      </template>
    </template>
  </Table>
</template>
<script lang="ts" setup>
import { ArticleTableItem } from '@/api/declare';
import { Table, Modal, message } from 'ant-design-vue';
import { toRefs } from 'vue';
import AdminRouteKeys from '@/constant/AdminRouteKeys';
import { deleteArticle } from '@/api/adminApi';
import { useRouter } from 'vue-router';
import RouteKeys from '@/constant/RouteKeys';
const props = defineProps<{ dataSource: ArticleTableItem[] }>();
const refProps = toRefs(props);
const router = useRouter();
const columns: { title: string, dataIndex: string, width: string, key: string }[] = [
  {
    title: "aid",
    dataIndex: "aid",
    width: '5%',
    key: 'aid'
  },

  {
    title: '标题',
    dataIndex: 'title',
    width: '20%',
    key: 'title'
  },
  {
    title: '作者',
    dataIndex: 'username',
    width: '10%',
    key: 'username'
  },
  {
    title: '点赞数',
    dataIndex: 'likeCount',
    width: '5%',
    key: 'likeCount'
  },
  {
    title: '浏览数',
    dataIndex: 'watchCount',
    width: "5%",
    key: 'watchCount'
  },
  {
    title: '操作',
    dataIndex: "operator",
    width: '5%',
    key: 'operator'
  }
];
let emits = defineEmits(["deleteArticle"]);
function deleteTargetArticle(aid: number) {
  Modal.confirm({
    title: "确定删除吗",
    direction: "ltr",
    content: "删除后将无法撤销",
    okText: '确定',
    cancelText: '取消',
    onOk(){
      return new Promise((resolve,reject)=>{
        deleteArticle(aid).then(res => {
          if(res.ok) {
            message.success("删除成功");
            emits("deleteArticle", aid);
            resolve(null);
          }
          else {
            message.warning(res.message);
            reject(null);
          }
        }).catch(() => {
          reject(null);
        })    
      })
    }
  })
}
</script>

