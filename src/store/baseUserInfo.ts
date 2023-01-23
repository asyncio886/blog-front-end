import { isLogin } from "@/api/userApi";
import { defineStore } from "pinia";
import { getSession, removeSession, setSession } from "@/utils/SessionUtils";
import { UserDetailDto } from "@/api/declare";

export default defineStore<"user", {
    isLogin: boolean,
    uid: number,
    adminSessionKey: "admin_login_time",
    storeIsAdmin: boolean,
    adminUserDetail: UserDetailDto | null,
    baseAvatar: string
}, {
    isAdmin: () => boolean
}, {
    getUserStatus: () => Promise<void>,
    setUserAdmin: () => void,
    removeAllLoginData: () => void
}>(
    "user",
    {
        state() {
            return {
                isLogin: false,
                uid: -1,
                adminSessionKey: "admin_login_time",
                storeIsAdmin: false,
                adminUserDetail: null,
                baseAvatar: ""
            };
        }, getters: {
            isAdmin(): boolean {
                if(this.storeIsAdmin) {
                    return true;
                }
                let value = getSession(this.adminSessionKey);
                if (value == null) {
                    return false;
                }
                else {
                    let time = Number.parseInt(value);
                    if (Number.isNaN(time)) {
                        return false;
                    }
                    let disc = Math.floor(Date.now() / 1000) - time;
                    if (Math.floor(disc / (60 * 60)) < 10) {
                        this.storeIsAdmin = true;
                        return true;
                    } // 十个小时内可以直接进入
                }
                return false;
            }
        },
        actions: {
            async getUserStatus() {
                let res = await isLogin();
                if (res.ok) {
                    this.isLogin = true;
                    this.uid = res.data as number;
                }
            },
            setUserAdmin() {
                setSession(this.adminSessionKey, Date.now().toString(), 60 * 60 * 2);
                this.storeIsAdmin = true;
            },
            removeAllLoginData() {
                removeSession(this.adminSessionKey);
            },
        }
    }
);