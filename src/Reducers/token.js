import { LOGIN_TOKEN } from "../Constants/index";
const token = (token = null, action) => {
    if (action.type === LOGIN_TOKEN) {
        return action.payload;
    }
    return token;
}

export default token;