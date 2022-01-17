import { useState } from 'react';
import customHeaders from './customHeaders';

const baseUrl = 'http://localhost:3002/api';

export default function useApi(resource) {
	const [ responses, setResponses ] = useState({
		remove: '',
		get: '',
		post: '',
		put: ''
	});
	const request = async ({ method, body, headers, queryString, params }) => {
		let url = `${baseUrl}/${resource}`;
		if (params) {
			const keys = Object.keys(params);
			url += `/${keys.map((key) => params[key]).join('/')}`;
		}
		if (queryString) {
			const keys = Object.keys(queryString);
			let qs = '?';
			keys.forEach((key) => {
				qs += `${key}=${queryString[key]}&`;
			});
			qs = qs.slice(0, -1);
			url += qs;
		}
		const response = await fetch(url, {
			method,
			headers: { ...headers, ...customHeaders[method] },
			body: body ? JSON.stringify(body) : undefined
		});
		if (response.status !== 200) {
			setResponses({ ...responses, [method]: null });
			throw new Error('API Error');
		}
		const json = await response.json();
		setResponses({ ...responses, [method]: json });
		return json;
	};

	const remove = async (params) => await request({ method: 'delete', ...params });
	const get = async (params) => await request({ method: 'get', ...params });
	const post = async (params) => await request({ method: 'post', ...params });
	const put = async (params) => await request({ method: 'put', ...params });

	return {
		remove,
		get,
		post,
		put,
		responses
	};
}
