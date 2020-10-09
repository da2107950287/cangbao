import originAxios from 'axios'

export function post(url, params,headers={"Content-Type":" application/x-www-form-urlencoded"}) {
	let option = {
		url,
    params,
    headers
	}
	return new Promise((resolve, reject) => {
		const instance = originAxios.create({
			baseURL: '/treasurebsg',
			timeout: 5000,
			method: 'post'
		});
		// 配置请求和响应拦截
		instance.interceptors.request.use(config => {
			if (localStorage.getItem("token")) {
				config.headers.token = localStorage.getItem("token");
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

// export function uploadPost(url, data) {
// 	let option = {
// 		url,
// 		data,
// 		headers: {
// 			'Content-Type': 'multipart/form-data'
// 		}
// 	}
// 	return new Promise((resolve, reject) => {
// 		// 1.创建axios的实例
// 		const instance = originAxios.create({
// 			baseURL: '/mustard',
// 			timeout: 5000,
// 			method: 'post',
// 		});
// 		// 配置请求和响应拦截
// 		instance.interceptors.request.use(config => {
// 			if (localStorage.getItem("token")) {
// 				config.headers.token = localStorage.getItem("token");
// 			}
// 			store.dispatch('showLoading')
// 			return config
// 		}, err => {
// 			return err
// 		})

// 		instance.interceptors.response.use(response => {
// 			store.dispatch('hideLoading')
// 			return response.data
// 		}, err => {
// 			if (err && err.response) {
// 				switch (err.response.status) {
// 					case 400:
// 						err.message = '请求错误'
// 						break
// 					case 401:
// 						err.message = '未授权的访问'
// 						break
// 				}
// 			}
// 			return err
// 		})

// 		// 2.传入对象进行网络请求
// 		instance(option).then(res => {
// 			resolve(res)
// 		}).catch(err => {
// 			reject(err)
// 		})
// 	})
// }
