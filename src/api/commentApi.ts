import MimeType from "@/constant/MimeType";
import request from "./baseApi";
import { BaseOperator, CommentWithAuthorInfo, PageDto, ReplyWithReplyToAndAuthor } from "./declare";
import handlerRootResult from "./handlerRootResult";
import { message } from "ant-design-vue";

async function listComments(aid:number, pn:number, size:number) {
    let res = await request.get<BaseOperator<PageDto<CommentWithAuthorInfo>>>(`/comment/list/${aid}?pn=${pn}&size=${size}`);
    return handlerRootResult(res.data);
}


async function uploadComment(aid: number, content: string) {
    content = content.trim();
    if(content == "") {
        message.warn("评论不得为空");
        throw new Error();
    }
    let res = await request.post<BaseOperator<null | number>>(`/comment/upload?aid=${aid}`, `content=${content}`, {
        headers: {
            "content-type": MimeType.URLENCODED_FORM
        }
    });
    return handlerRootResult(res.data);
}

async function listReplies(cid: number, pn: number, size: number) {
    let res = await request.get<BaseOperator<PageDto<ReplyWithReplyToAndAuthor>>>(`/reply/list?cid=${cid}&pn=${pn}&size=${size}`)
    return handlerRootResult(res.data);
}

async function uploadReply(cid: number, content: string, reply_to: number | null) {
    content = content.trim();
    if(content == "") {
        message.warn("评论不得为空");
        throw new Error();
    }
    let data;
    if( !reply_to ) {
        data = `content=${content}&cid=${cid}`;
    }
    else {
        data = `content=${content}&reply_to=${reply_to}&cid=${cid}`;
    }
    let res = await request.post<BaseOperator<null | number>>("/reply/upload", data);
    return handlerRootResult(res.data);
}

export {
    listComments, uploadComment, listReplies, uploadReply
}
