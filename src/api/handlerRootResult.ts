import { Result } from "./declare";
import { notice } from "@/utils/messageUtils";
export default function <T>(baseRes: Result<T>, notNotice: boolean = false): T {
    if (baseRes.code === 0) {
        return baseRes.data as T;
    }
    else {
        if(!notNotice) {
           notice(baseRes.msg); 
        }
        throw new Error("error happend");
    }
}
