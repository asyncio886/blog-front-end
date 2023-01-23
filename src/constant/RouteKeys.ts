export default {
    Index: {
        name: "Index",
        showName: "分类",
        path: "/",
        showMenu: true
    },
    Login: {
        name: "Login",
        path: "/login",
        showName: "登录",
        showMenu: true
    },
    Register: {
        name: "Register",
        path: "/register",
        showName: "注册",
        showMenu: true
    },
    NotFound: {
        name: "NotFound",
        path: "/:pathMatch(.*)",
        showName: "未找到",
        showMenu: false
    },
    Detail: {
        name: "Detail",
        path: "/detail/:aid",
        showMenu:false
    },
    Search: {
        name: "Search",
        path: "/search",
        showMenu: false
    },
    Admin: {
        name: "Admin",
        path: "/admin",
        showMenu: true,
        showName: "编辑平台"
    }
}