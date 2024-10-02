const domain="http://127.0.0.1:8108";//您的域名//独立部署需要填写Go服务api接口域名(部署在Go目录下可以留空)
const localhost="http://127.0.0.1:8108";//访问本地的域名和端口，如果您改变Go服务端口，请自行修改
window.globalConfig = {
	Main_url:`${domain}/`,//域名
	Root_url:`${domain}/business`,//Api服务器域名
	Upload_url:`${domain}/common`,//Api服务器域名
	Avatar_API:`${domain}/common/uploadfile/get_image?url=`,//头像地址
	Upload_url_dev:`${localhost}/common`,//Api服务器域名-开发环境
    Root_url_dev:`${localhost}/business`,//Api服务器域名-开发环境
    Root_wxurl_dev:`${localhost}`,//接口测试-微信小程序-开发环境
    Upinfile_url:`${domain}/business`,//业务专用上传附件
    Upinfile_url_dev:`${domain}/business`,//业务专用上传附件-开发环境
	AppTitle:"自媒体管理后台",
    AppVersion:"1.1.0",
    Company:"公司名称",
    Address:"中国·北京",
    Team:"技术团队",
    loginTitle:"登录自媒体管理后台",
    loginSubTitle:"管理账号、业务、数据统计等",
    Copyright:"团队提供技术支持",
    MaxSizeImage:5,//最大上传图片大小,单位M
	MaxSizeVideo:150,//最大上传视频大小,单位M
};