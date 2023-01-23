export default {
    AdminLogin: {
        name: "AdminLogin",
        showName: "管理员登录",
        suffixPath: "",
        showMenu: false,
        hasChild: false,
        children:[]
    },
    AdminTag: {
        name: "AdminTag",
        showName: "标签管理",
        suffixPath: "tag",
        showMenu: true,
        hasChild: false,
        children:[]
    },
    AdminUser: {
        name: "AdminUser",
        showName: "用户管理",
        suffixPath: "users",
        showMenu: true,
        hasChild: true,
        children:[
            {
                name: "NormalUser",
                suffixPath: "",
                showName: "用户管理",
                showMenu: true, 
            },{
                name: "SelfUser",
                suffixPath: "self",
                showMenu: true,
                showName: "个人信息"
            }
        ]
    },
    AdminArticle: {
        name: "AdminArticle",
        showName: "文章管理",
        suffixPath: "article",
        showMenu: true,
        hasChild: true,
        children:[
            {
                name: "AdminArticleShowAndEdit",
                suffixPath: "",
                showName: "文章列表",
                showMenu: true, 
            },{
                name: "ArticleUpload",
                suffixPath: "upload",
                showMenu: true,
                showName: "上传文章"
            },{
                name: "ArticleUpdate",
                suffixPath: "update/:aid",
                showMenu: false
            }
        ]
    }
}