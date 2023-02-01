//版本号
const version = "1.0.0";
/****************************************网络请求参数配置start***********************************/
const baseUrl = "http://scs.jcloudsoft.com/scs-app/";
const appId = "dxa";
const appSecret = "adsf23sadfas";
/*
 * 20001 登录过期,20002 未登录,20003 用户令牌信息不一致，请重新登陆,
 * 20004 刷新令牌与token不一致,20005 刷新令牌的有效期已过
 */
const loginErrorCode = ["20001", "20002", "20003", "20004", "20005"];
//请求成功
const successCode = "00000";
//每页显示条数
const pageSizeGlobal = 10;
//配置列表的总数量要大于等于5条才显示'-- END --'的提示
const noMoreSizeGlobal = 5;
const emptyTip = "暂无相关数据";
//列表最后一页提示
const textNoMore = "抱歉，没有更多数据啦~";
//rsa加密公钥L
const rsaPublicKey =
	"MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC77146BsfQZ9RpTpBs+H8M+1xCrXUTeCvsVjWaNfUai768+Se3BwWjz9KvPlxX5I7b8bW0sEouZNRlEKbfXwbReOr0E/0zOg6t2HBadGrCZHCUOptY50d0cYOcFmcjhQMyW6lZMdLbjyX+T+wZdZB92O2mncycutgVXIILHZxYBwIDAQAB+H8M+1xCrXUTeCvsVjWaNfUai768+Se3BwWjz9KvPlxX5I7b8bW0sEouZNRlEKbfXwbReOr0E/0zOg6t2HBadGrCZHCUOptY50d0cYOcFmcjhQMyW6lZMdLbjyX+T+wZdZB92O2mncycutgVXIILHZxYBwIDAQAB/YUm4BH30XFHeibEzoF/JJC4OTsArF98CxJDsD6vWE62E7/OX6q8ejfKqCjwMvn/wIDAQAB";
/****************************************网络请求参数配置end***********************************/
export {
	version,
	baseUrl,
	appId,
	appSecret,
	loginErrorCode,
	successCode,
	pageSizeGlobal,
	noMoreSizeGlobal,
	emptyTip,
	rsaPublicKey
}