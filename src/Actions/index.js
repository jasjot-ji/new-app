import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOGIN_TOKEN, SELLER_INFO} from '../Constants';
import {baseUrl} from '../baseUrl';
import CryptoJS from 'crypto-js';

// Login
export const loginCustomer = token => {
  return async function (dispatch) {
    dispatch({
      type: LOGIN_TOKEN,
      payload: token,
    });
  };
};

// Seller Info
export const getSellerInfo = token => {
  return async function (dispatch) {
    var myHeaders = new Headers();
    myHeaders.append('token', token);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${baseUrl}/seller_info`, requestOptions)
      .then(response => response.json())
      .then(res => {
        if (res.status === 'Success' || res.status === 'success') {
          const ciphertext = res.data;
          const bytes = CryptoJS.AES.decrypt(ciphertext, 'secret_key_not_so_secret');
          const plaintext = bytes.toString(CryptoJS.enc.Utf8);
          var dt = JSON.parse(plaintext);
          dispatch({
            type: SELLER_INFO,
            payload: dt,
          });
        } else {
          const logout = async () => {
            try {
              await AsyncStorage.removeItem('DukkandaarSeller');
              dispatch({
                type: SELLER_INFO,
                payload: null,
              });
              dispatch({
                type: LOGIN_TOKEN,
                payload: null,
              });
            } catch (e) {
              console.log(e);
            }
          };
          logout();
        }
      })
      .catch(error => console.log('error', error));
  };
};

// Logout
export const logoutSeller = () => {
  return async function (dispatch) {
    const logout = async () => {
      try {
        await AsyncStorage.removeItem('DukkandaarSeller');
        dispatch({
          type: LOGIN_TOKEN,
          payload: null,
        });
        dispatch({
          type: SELLER_INFO,
          payload: null,
        });
      } catch (e) {
        console.log(e);
      }
    };
    logout();
  };
};
