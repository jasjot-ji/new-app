import { SELLER_INFO } from "../Constants/index";
const sellerInfo = (info = null, action) => {
    if (action.type === SELLER_INFO) {
        return action.payload;
    }
    return info;
}

export default sellerInfo;