import api from "../utils/api";
import * as types from "../constants/home.constants";
import { toast } from "react-toastify";
import { commonUiActions } from "./commonUiAction";

const getHomeData = () => async (dispatch) => {
    try {
        dispatch({ type: types.GET_HOME_DATA_REQUEST })
        const res = await api.get(`/home`);
        if (res.status !== 200) {
            throw new Error('데이터을 불러오는데 실패하였습니다.')
        } else {
            dispatch({ type: types.GET_HOME_DATA_SUCCESS, payload: res.data.data });
        }
    } catch (error) {
        dispatch({ type: types.GET_HOME_DATA_FAIL, payload: error.message });
        // dispatch(commonUiActions.showToastMessage(error.message, "error"));
    }
};

export const homeActions = {
    getHomeData,
};
