import MimeType from "@/constant/MimeType";
import request from "./baseApi";
import { AdminUserVo, ArticleVo, BaseOperator, SafeUser, PageDto } from "./declare";
import handlerRootResult from "./handlerRootResult";
import { notice } from "@/utils/messageUtils";
async function addTag(tagName: string, desciption: string, route: string) {
    tagName = tagName.trim();
    desciption = desciption.trim();
    if(route.indexOf(" ") != -1) {
        notice("路由键值不得有空格");
    }
    route = route.trim();
    let res = await request.post<BaseOperator<null | number>>("/admin/addTag", `tagName=${tagName}&description=${desciption}&route=${route}`,
        {
            headers: {
                "content-type": MimeType.URLENCODED_FORM
            }
        });
    return handlerRootResult(res.data);
}

async function deleteArticle(aid: number) {
    let res = await request.get<BaseOperator<null>>(`/admin/article/delete?aid=${aid}`);
    return handlerRootResult(res.data);
}

async function uploadArticle(vo: ArticleVo) {
    let res = await request.post<BaseOperator<null | number>>("/admin/article/upload", JSON.stringify(vo), {
        headers: {
            "content-type": MimeType.APPLICATION_JSON
        }
    });
    return handlerRootResult(res.data);
}

async function updateArticle(vo: ArticleVo, aid: number) {
    vo.description = vo.description.trim();
    vo.title = vo.title.trim();
    let res = await request.post<BaseOperator<null>>(`/admin/article/update/${aid}`, JSON.stringify(vo),
        {
            headers: {
                "content-type": MimeType.APPLICATION_JSON
            }
        })
    return handlerRootResult(res.data);
}


async function uploadAvatar(file: File) {
    let form = new FormData();
    form.append("file", file);
    let res = await request.post<BaseOperator<string | null>>("/admin/avatar/upload", form, {
        headers: {
            "content-type": MimeType.MULITPART_FORM
        }
    });
    return handlerRootResult(res.data);
}

async function uploadArticlePicture(file: File) {
    let form = new FormData();
    form.append("file", file);
    let res = await request.post<BaseOperator<string | null>>("/admin/article/uploadPicture", form, {
        headers: {
            "content-type": MimeType.MULITPART_FORM
        }
    });
    return handlerRootResult(res.data);
}

async function deleteComment(cid: number) {
    let res = await request.get<BaseOperator<null>>(`/admin/deleteComment/${cid}`);
    return handlerRootResult(res.data);
}

async function deleteReply(rid: number) {
    let res = await request.get<BaseOperator<null>>(`/admin/deleteReply/${rid}`);
    return handlerRootResult(res.data);
}

async function deleteTag(tid: number) {
    let res = await request.get<BaseOperator<null>>(`/admin/delTag/${tid}`);
    return handlerRootResult(res.data);
}

async function adminLogin(email: string, password: string) {
    email = email.trim();
    password = password.trim();
    let res = await request.post<BaseOperator<null>>(`/admin/login`, `email=${email}&password=${password}`, {
        headers: {
            "content-type": MimeType.URLENCODED_FORM
        }
    })
    return handlerRootResult(res.data);
}


async function updateTag(tagId: number, tagName: string, desciption: string, route: string) {
    let res = await request.post<BaseOperator<null>>(`/admin/updateTag/${tagId}`, `tagName=${tagName}&description=${desciption}&route=${route}`,
        {
            headers: {
                "content-type": MimeType.URLENCODED_FORM
            }
        })
    return handlerRootResult(res.data);
}

async function updateUserInfo(uid: number, username: string, email: string, password: string) {
    let res = await request.post<BaseOperator<null>>(`/admin/updateUserInfo/${uid}`, `username=${username}&email=${email}&passwprd=${password}`, {
        headers: {
            "content-type": MimeType.URLENCODED_FORM
        }
    })
    return handlerRootResult(res.data);
}

async function adminUserInfoUpdate(vo: AdminUserVo) {
    let keys: string[] = Object.keys(vo);
    let temp: string[] = [];
    for (let i = 0; i < keys.length; i++) {
        // @ts-ignore
        temp.push(`${keys[i]}=${vo[keys[i]]}`);
    }
    let data = temp.join("&");
    let res = await request.post<BaseOperator<null>>(`/admin/user/update`, data, {
        headers: {
            "content-type": MimeType.URLENCODED_FORM
        }
    });
    return handlerRootResult(res.data);
}

async function deleteUser(uid: number) {
    let res = await request.get<BaseOperator<null>>(`/admin/userDelete/${uid}`);
    return handlerRootResult(res.data);
}


async function listUsers(pn: number, size: number, admin: boolean = false) {
    let res = await request.get<BaseOperator<PageDto<SafeUser>>>(`/admin/users?pn=${pn}&size=${size}&admin=${admin}`);
    return handlerRootResult(res.data);
}

export {
    addTag, deleteArticle, updateArticle, uploadArticle, uploadAvatar, uploadArticlePicture, deleteComment, deleteReply,
    deleteTag, adminLogin, updateTag, updateUserInfo, adminUserInfoUpdate, deleteUser, listUsers
}