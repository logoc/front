import{n as e}from"./index.a2bf8911.js";const l={}.VITE_APP_ENV=="production"?window==null?void 0:window.globalConfig.Upload_url:window==null?void 0:window.globalConfig.Upload_url_dev;function t(o,r){return e.uploadFile({url:`${l}/upload/image`,onUploadProgress:r},o)}function i(o){return e.post({url:`${l}/table/weigh`,params:o},{errorMessageMode:"message",isRootUrl:!1})}export{i as t,t as u};
