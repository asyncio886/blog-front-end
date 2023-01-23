import { message } from "ant-design-vue";

function notice(msg: string) {
    message.error(msg);
}

export  {
    notice
}