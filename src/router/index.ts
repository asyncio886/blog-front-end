import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Index from "@/views/Index.vue";
import RouteKeys from '@/constant/RouteKeys';
import { isInteger } from '@/utils/NumberUtils';
import useWebConfig from '@/store/webConfig';
import AdminRouteKeys from '@/constant/AdminRouteKeys';
import useBaseUserInfo from "@/store/baseUserInfo"
import useEditArticleStore from "@/store/editArticleStore"
import { articleDetail } from '@/api/articleApi';
import { message } from 'ant-design-vue';
const routes: Array<RouteRecordRaw> = [
  {
    path: RouteKeys.Index.path,
    name: RouteKeys.Index.name,
    component: Index
  },{
    path: RouteKeys.Login.path,
    name: RouteKeys.Login.name,
    component: () => import("@/views/Login.vue")
  },{
    path: RouteKeys.Register.path,
    name: RouteKeys.Register.name,
    component: () => import("@/views/Register.vue")
  },{
    path: RouteKeys.Detail.path,
    name: RouteKeys.Detail.name,
    beforeEnter(to, from, next) {
        if(isInteger(to.params.aid as string)) {
            next();
        }
        else{
          next("/error");
        }
    },
    component: () => import("@/views/ArticleDetail.vue")
  },
  {
    path: RouteKeys.NotFound.path,
    name: RouteKeys.NotFound.name,
    component: () => import("@/views/NotFound.vue")
  },
  {
    path: RouteKeys.Search.path,
    name: RouteKeys.Search.name,
    component: () => import("@/views/Search.vue"),
    beforeEnter(to, from , next) {
      let query = to.query
      if(query.kw == undefined || query.pn == undefined || query.kw == '' || !isInteger(query.pn as any)) {
        next("/404");
      }
      next();
    }
  },
  {
    path: RouteKeys.Admin.path,
    name: RouteKeys.Admin.name,
    component: () => import("@/views/admin/Admin.vue"),
    beforeEnter(to, from, next){
      let userInfo = useBaseUserInfo();
      if(to.name == AdminRouteKeys.AdminLogin.name) {
        next();
      }
      else {
        
        if(userInfo.isAdmin) {
          next(); 
        }
        else {
          next('/404');
        }
      }
    },
    children: [
      {
        path: AdminRouteKeys.AdminLogin.suffixPath,
        name: AdminRouteKeys.AdminLogin.name,
        component: () => import("@/views/admin/AdminLogin.vue"),
        beforeEnter(to, from, next) {
          let userInfo = useBaseUserInfo();
          if(userInfo.isAdmin) {
            next({name: AdminRouteKeys.AdminTag.name});
          }
          else {
            next();
          }
        }
      },
      {
        path: AdminRouteKeys.AdminArticle.suffixPath,
        name: AdminRouteKeys.AdminArticle.name,
        component: () => import("@/views/admin/article/AdminArticle.vue"),
        children: [
          {
            path: AdminRouteKeys.AdminArticle.children[0].suffixPath,
            name: AdminRouteKeys.AdminArticle.children[0].name,
            component: () => import("@/views/admin/article/ArticleShowAndEdit.vue")
          },
          {
            path: AdminRouteKeys.AdminArticle.children[1].suffixPath,
            name: AdminRouteKeys.AdminArticle.children[1].name,
            component: () => import("@/views/admin/article/ArticleUpload.vue")
          },
          {
            path: AdminRouteKeys.AdminArticle.children[2].suffixPath,
            name: AdminRouteKeys.AdminArticle.children[2].name,
            component: () => import("@/views/admin/article/ArticleUpdate.vue"),
            async beforeEnter(to, from, next) {
                let aid = to.params.aid as undefined | string;
                if(!isInteger(aid)) {
                  next("/404");
                  return;
                }
                else {
                  const editArticleStore = useEditArticleStore();
                  let targetAid = Number.parseInt(aid as string);
                  if(editArticleStore.aid != null) {
                    if(editArticleStore.aid == targetAid) {
                      next();
                      return;
                    }
                  }
                  const baseUserInfo = useBaseUserInfo();
                  let res = await articleDetail(targetAid);
                  if(res.ok && res.data != null) {
                    if(res.data.article.ownUid != baseUserInfo.uid) {
                      message.warning("尚无权限修改");
                      next("/404");
                      return;
                    }
                    else {
                      editArticleStore.setArticle(res.data);
                      console.log("正常进入");
                      next();
                      return;
                    }
                  }
                  else {
                    message.success(res.message);
                    next("/404");
                    return;
                  }
                }
            }
          }
        ]
      },
      {
        path: AdminRouteKeys.AdminTag.suffixPath,
        name: AdminRouteKeys.AdminTag.name,
        component: () => import("@/views/admin/AdminTag.vue")
      },
      {
        path: AdminRouteKeys.AdminUser.suffixPath,
        name: AdminRouteKeys.AdminUser.name,
        component: () => import("@/views/admin/user/AdminUser.vue"),
        children:[
          {
            path: AdminRouteKeys.AdminUser.children[0].suffixPath,
            name: AdminRouteKeys.AdminUser.children[0].name,
            component: () => import("@/views/admin/user/NormalUserList.vue")
          },
          {
            path: AdminRouteKeys.AdminUser.children[1].suffixPath,
            name: AdminRouteKeys.AdminUser.children[1].name,
            component: () => import("@/views/admin/user/SelfUser.vue")
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior () {
    return { top: 0 }
  }
})
let st = true;
router.beforeEach(async (_,__,next)=>{
  if(st) {
    const webConfig = useWebConfig();
    const baseUserInfo = useBaseUserInfo();
    await webConfig.loadTagMenu();
    await baseUserInfo.getUserStatus();
    st = false;
    next();
  }
  else {
    next();
  }
})
export default router
