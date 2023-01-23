export type Result<T> = {
    code: number,
    msg: string,
    data: T | null
}

export type PageDto<T> = {
    dataList: T[],
    sum: number
}

export type Operator<T> = {
    ok: boolean,
    message: string,
    data: T | null
}

export type UserDetailDto = {
    uid: number,
    avatar: string | null,
    description: string | null,
    githubLink: string | null,
    qqLink: string | null,
    twitterLink: string | null,
    weiboLink: string | null,
    username: string
}

export type BaseOperator<T> = Result<Operator<T>>;

export type Tag = {
    tid: number,
    tagName: string,
    description: string,
    tagRoute: string
}

export type BlogArticle = {
    aid: number,
    description: string,
    title: string
}

export type SimpleArticle = {
    aid: number,
    title: string,
    createTime: number,
    modifiedTime: number,
    likeCount: number,
    watchCount: number,
    tagId: number,
    description: string,
    ownUid: number,
    facePicture: string
}

export type NormalUser = {
    uid: number,
    username: string,
    createTime: number,
    userType: number
}

export type SafeUser = {
    uid: number,
    username: string,
    createTime: number,
    userType: 0 | 1
    email: string
}

export type Article = {
    aid: number,
    title: string,
    createTime: number,
    modifiedTime: number,
    likeCount: number,
    watchCount: number,
    tagId: number,
    description: string,
    ownUid: number,
    facePicture: string | null
    content: string
}

export type AdminUser = {
    uid: number,
    avatar: string | null,
    description: string | null,
    githubLink: string | null,
    qqLink: string | null,
    twitterLink: string | null,
    weiboLink: string | null
}

export type Comment = {
    cid: number,
    authorUid: number,
    createTime: number,
    fromAid: number
    content: string
}

export type Reply = {
    rid: number,
    fromCid: number,
    content: string,
    replyToUid: number | null,
    createTime: number,
    authorUid: number
}

export type ArticleWithAuthorInfo = {
    article: Article,
    baseUserInfo: NormalUser,
    detailUserInfo: AdminUser
    tag: Tag | null
}
export type CommentWithAuthorInfo = {
    comment: Comment,
    userInfo: NormalUser | null,
    replySum: number
}

export type ReplyWithReplyToAndAuthor = {
    reply: Reply,
    authorInfo: NormalUser | null,
    replyToInfo: NormalUser | null
}

export type SimpleArticleWithAuthorInfo = {
    simpleArticle: SimpleArticle,
    userInfo: NormalUser
}

export type ArticleVo = {
    facePicture: string | null
    content: string
    title: string
    tagId: number
    description: string
}

export type AdminUserVo = {
    avatar: string | null,
    description: string | null,
    githubLink: string | null,
    qqLink: string | null,
    twitterLink: string | null,
    weiboLink: string | null,
}

export type ArticleTableItem = {
    title: string,
    username: string,
    likeCount: number,
    watchCount: number,
    aid: number,
}