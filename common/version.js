import {
	checkVersion
} from './ApiServiceHelper.js'
export function checkUpdate(isShowDialog, callback) {
	try {
		const VersionBean = {
			versionName: "",
			versionCode: "",
			updateType: 1,
		}

		plus.runtime.getProperty(plus.runtime.appid, function(sysinfo) {

			VersionBean.versionCode = sysinfo.versionCode;
			VersionBean.versionName = sysinfo.version;

			checkVersion(VersionBean, isShowDialog,true).then(versionBean => {
				callback(versionBean);
			}).catch(res => {
				console.log(res);
			});
		});
	} catch (e) {
		console.log("获取版本名称:" + e)
		return "";
	}
}

function callback(VersionBean) {

}
