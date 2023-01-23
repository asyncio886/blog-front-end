import { PageDto, SafeUser } from "@/api/declare";
import { defineStore } from "pinia";


export default defineStore<"adminUserList",{
    userList: PageDto<SafeUser> | null,
    currentPage: number,
    isAdmin: boolean,
    defaultSize: number
},{},{
    deleteByUid(uid: number) : void,
    updateByUid(user:SafeUser) : void
}>(
    "adminUserList",{
        state() {
            return{
                userList: null,
                currentPage: 1,
                isAdmin: false,
                defaultSize: 10 
            }
        },
        actions: {
            deleteByUid(uid) {
                if(this.userList == null) {
                    return;
                }
                for(let i = 0; i < this.userList.dataList.length; i++) {
                    if(this.userList.dataList[i].uid == uid) {
                        this.userList.dataList.splice(i, 1);
                        return;
                    }
                }
            },
            updateByUid(user) {
                if(this.userList == null) {
                    return;
                }
                for(let i = 0; i < this.userList.dataList.length; i++) {
                    if(this.userList.dataList[i].uid == user.uid) {
                        this.userList.dataList.splice(i, 1, user);
                        return;
                    }
                }
            },
        }
    }
);