import axios from 'axios';
import qs from 'qs';
const currentHost = `${Config.api.base}` + 'callIdspApi';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export const postRequest = (params) => {
  $.ajaxSettings.beforeSend = function (xhr) {
    // see https://github.com/madrobby/zepto/issues/274
    xhr.withCredentials = true;  // TODO(elsigh): Do this in zepto w/ xhrFields.
  };
  const mes = $.post(currentHost, params, function (res) {
    return res;
  });
}

export const getRequest = async(params) => {
  console.log(params);
  return axios.get(currentHost, {
    params: params,
    withCredentials: true
  }).catch(err => { 
    console.log(err)
  })
}


