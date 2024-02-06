import { combineReducers } from "redux";
import token from "./token";
import sellerInfo from "./sellerInfo";

const rootReducer = combineReducers({
    token: token,
    seller_info: sellerInfo
});

export default rootReducer;