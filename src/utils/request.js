import originAxios from 'axios'
import QueryString from 'qs';
import qs from 'qs'
export function post(url, data) {

	function transformRequest(data) {
		for (const key in data) {
			if (data.hasOwnProperty(key)) {
				if (typeof data[key] == "object") {
					data[key] = JSON.stringify(data[key])
				}
			}
		}
		// 对 data 进行任意转换处理
		return qs.stringify(data)
	}

	let option = {
		url,
		data,
		transformRequest
		// params
	}

	return new Promise((resolve, reject) => {
		const instance = originAxios.create({
			baseURL: '/treasurebsg',
			method: 'post'
		});
		// 配置请求和响应拦截
		instance.interceptors.request.use(config => {
			if (localStorage.getItem("userinfo")) {
				config.headers.mtoken = JSON.parse(localStorage.getItem("userinfo")).mtoken;
			}
			return config
		}, err => {
			return err
		})
		instance.interceptors.response.use(response => {
			if (response.data.code == 501) {
				localStorage.clear();
			}
			return response.data
		}, err => {
			if (err && err.response) {
				switch (err.response.status) {
					case 400:
						err.message = '请求错误'
						break
					case 401:
						err.message = '未授权的访问'
						break
				}
			}
			return err
		})
		// 2.传入对象进行网络请求
		instance(option).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

export function uploadPost(url, data) {
	let option = {
		url,
		data,
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	}
	return new Promise((resolve, reject) => {
		// 1.创建axios的实例
		const instance = originAxios.create({
			baseURL: '/treasurebsg',

			method: 'post',
		});
		// 配置请求和响应拦截
		instance.interceptors.request.use(config => {
			if (JSON.parse(localStorage.getItem("userinfo")).mtoken) {
				config.headers.mtoken = JSON.parse(localStorage.getItem("userinfo")).mtoken;
			}
			return config
		}, err => {
			return err
		})
		instance.interceptors.response.use(response => {
			return response.data
		}, err => {
			if (err && err.response) {
				switch (err.response.status) {
					case 400:
						err.message = '请求错误'
						break
					case 401:
						err.message = '未授权的访问'
						break
				}
			}
			return err
		})

		// 2.传入对象进行网络请求
		instance(option).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

