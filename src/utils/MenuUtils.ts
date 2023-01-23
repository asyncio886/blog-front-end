import { Tag } from "@/api/declare";
import RouteKeys from "@/constant/RouteKeys"

export type MenuItemType = {
    routeTo:string,
    routeName: string,
    hasChild: boolean,
    showName: string,
    children: MenuItemType[] | undefined
}

function createBaseMenuList():MenuItemType[]{
    let keys:string[] = Object.keys(RouteKeys);
    let res:MenuItemType[] = [];
    for(let i = 0; i < keys.length; i++) {
        let item:{name:string, path:string, showMenu: boolean, showName: string} = (RouteKeys as any)[keys[i]];
        if(item.showMenu) {
            let o:MenuItemType = {
                routeTo: item.path,
                routeName: item.name,
                hasChild: false,
                children: undefined,
                showName: item.showName
            };
            res.push(o);
        }
    }
    return res;
}

function createMenuListFromTags(tags:Tag[], rootMenuPath:string):MenuItemType[] {
    let res:MenuItemType[] = [];
    for(let i = 0;i < tags.length;i++) {
        let o:MenuItemType = {
            routeTo: rootMenuPath + "?tag=" + tags[i].tagRoute,
            routeName: tags[i].tagRoute,
            hasChild: false,
            children: undefined,
            showName: tags[i].tagName
        }
        res.push(o);
    }
    return res;
}

function addChildMenu(root: MenuItemType[], children: MenuItemType[], targetRootKey: string) {
    for(let i = 0;i < root.length;i++) {
        if(root[i].routeName == targetRootKey) {
            root[i].hasChild = true;
            root[i].children = children;
        }
    }
}

export {
    createBaseMenuList, createMenuListFromTags, addChildMenu
}