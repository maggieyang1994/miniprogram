let axios = require("axios")
export default async (param) => {
  //字典升序排序，得到有序的参数对列表N
  // param = Object.keys(param).reduce((o, item) => {
  //   o[item] = param[item];
  //   return o
  // }, {});
  // // 数对按URL键值对的格式拼接成字符串
  // let str = '';
  // for(var key in param){
  //   str += `${key}=${encodeURIComponent(param[key])}&`
  // }
  let authUrl = "https://aip.baidubce.com/oauth/2.0/token"
  const client_id =  "8s0sxvRAPQYhravbOXZ6G4sG";
  const client_secret = "yx2Rpaf4fbMtuk7rpAVAPcHnDXv1p9Id"
  let res = await axios.post(authUrl, {
    grant_type: 'client_credentials',
    client_id,
    client_secret
  })
}