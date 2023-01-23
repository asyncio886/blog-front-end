import MimeType from "@/constant/MimeType";
import request from "./baseApi";
import { BaseOperator, UserDetailDto } from "./declare";
import baseHandler from "./handlerRootResult";

async function getCode(email: string) {
    email = email.trim();
    return baseHandler((await request.get<BaseOperator<number>>(`/user/getCode?email=${email}`)).data);
}

async function isLogin() {
    let res = await request.get<BaseOperator<null | number>>("/user/isLogin");
    return baseHandler(res.data);
}

async function login(email: string, password: string) {
    password = password.trim();
    email = email.trim();
    let res = await request.post<BaseOperator<null>>("/user/login", `email=${email}&password=${password}`,{
        headers:{
            "content-type": MimeType.URLENCODED_FORM
        }
    });
    return baseHandler(res.data);
}

async function register(email: string, password: string, username: string, code: string) {
    email = email.trim();
    password = password.trim();
    code = code.trim();
    return baseHandler((await request.post<BaseOperator<null>>("/user/register", `email=${email}&password=${password}&username=${username}&code=${code}`,{
        headers:{
            "content-type": MimeType.URLENCODED_FORM
        }
    })).data);
}

async function detail(uid: number) {
    return baseHandler((await request.get<BaseOperator<UserDetailDto>>(`/user/detail/${uid}`)).data);
}

export { getCode, isLogin, login, register, detail }