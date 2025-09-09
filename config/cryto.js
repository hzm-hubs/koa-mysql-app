// import JSEncrypt from "jsencrypt/bin/jsencrypt.min";

const publicKey =
	"MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKoR8mX0rGKLqzcWmOzbfj64K8ZIgOdH" +
	"nzkXSOVOZbFu/TJhZ7rFAN+eaGkl3C4buccQd/EjEsj9ir7ijT7h96MCAwEAAQ==";

const privateKey =
	"MIIBVgIBADANBgkqhkiG9w0BAQEFAASCAUAwggE8AgEAAkEApa8FfBjNxZXEocx2" +
	"iczCxFeXixlpc4GH+/nycXa2E98LyrdnVDhGRQpsZCqjLLa0K6ESmvn4TusHN/g2" +
	"P73zwwIDAQABAkEAn3Eauh20iBxkqb/1ow6lsAULFRVTYZCZqGcUZRR0jBFg9UdC" +
	"NdRMedDHrGKWbmDAgmG72vYV6iDoiD/dYztj4QIhANIEP0ud9JgZbYOsR0xS7cvO" +
	"6MztUhMUTNnxDPRO+czdAiEAyfXYos+dknqIfmnhBbJyfE/qmJhUWvmMB6sxkisd" +
	"6R8CIE+bgIqfQznsWZDR2uzZen4I3kHfq37D8SWjs69fyFyZAiEAh9dNxIzjDrBO" +
	"eMDcswlJCiZyw/rJ2ns5XbsfV5Kaxr8CIQCMvbnUOgJSb76HsFtxWbM9DPTacgvb" +
	"qSv5NvM2Cj0keQ==";

const backPrivateKey =
	"MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAqhHyZfSsYourNxaY" +
	"7Nt+PrgrxkiA50efORdI5U5lsW79MmFnusUA355oaSXcLhu5xxB38SMSyP2KvuKN" +
	"PuH3owIDAQABAkAfoiLyL+Z4lf4Myxk6xUDgLaWGximj20CUf+5BKKnlrK+Ed8gA" +
	"kM0HqoTt2UZwA5E2MzS4EI2gjfQhz5X28uqxAiEA3wNFxfrCZlSZHb0gn2zDpWow" +
	"cSxQAgiCstxGUoOqlW8CIQDDOerGKH5OmCJ4Z21v+F25WaHYPxCFMvwxpcw99Ecv" +
	"DQIgIdhDTIqD2jfYjPTY8Jj3EDGPbH2HHuffvflECt3Ek60CIQCFRlCkHpi7hthh" +
	"YhovyloRYsM+IS9h/0BzlEAuO0ktMQIgSPT3aFAgJYwKpqRYKlLDVcflZFCKY7u3" +
	"UP8iWi1Qw0Y=";

const backPublicKeye =
	"MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKWvBXwYzcWVxKHMdonMwsRXl4sZaXOB" +
	"h/v58nF2thPfC8q3Z1Q4RkUKbGQqoyy2tCuhEpr5+E7rBzf4Nj+988MCAwEAAQ==";

// 加密
export function encrypt(txt) {
	const encryptor = new JSEncrypt();
	encryptor.setPublicKey(publicKey); // 设置公钥
	return encryptor.encrypt(txt); // 对数据进行加密
}

// 解密
export function decrypt(txt) {
	const encryptor = new JSEncrypt();
	encryptor.setPrivateKey(privateKey); // 设置私钥
	return encryptor.decrypt(txt); // 对数据进行解密
}

// 后端解密 对应前端加密
export function backDecrypt(txt) {
	const encryptor = new JSEncrypt();
	encryptor.setPrivateKey(backPrivateKey); // 设置私钥
	return encryptor.decrypt(txt); // 对数据进行解密
}

// 后端加密 对应前端解密
export function backEncrypt(txt) {
	const encryptor = new JSEncrypt();
	encryptor.setPrivateKey(backPublicKeye); // 设置私钥
	return encryptor.encrypt(txt); // 对数据进行解密
}
