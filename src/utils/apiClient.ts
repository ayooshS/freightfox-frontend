import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

/**
 * @description The baseURL should always end without a trailing slash, ensuring consistency across all API requests.
 */
interface ApiClientOptions {
	baseURL: string;
	timeout?: number;
}

interface RequestConfig extends AxiosRequestConfig {
	queryParams?: Record<string, string | number | boolean>;
	pathParams?: Record<string, string | number>;
	headers?: Record<string, string>;
}

class ApiClient {
	private client: AxiosInstance;

	constructor(options: ApiClientOptions) {
		this.client = axios.create({
			baseURL: options.baseURL,
			timeout: options.timeout || 30000,
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
				"Jwt-Token-Enabled": localStorage.getItem("jwt-token-enabled") || "false",
				"Source": "InternalApp",
			}
		});

		// Add request interceptor for auth token
		this.client.interceptors.request.use((config) => {
			const token = localStorage.getItem("jwt_token");
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
				config.headers['x-source'] = 'InternalApp';
				config.headers['x-Tenant-Id'] = '1';
			}

			return config;
		});
	}

	private formatUrl(
		endpoint: string,
		pathParams?: Record<string, string | number>,
	): string {
		let formattedUrl = endpoint;
		if (pathParams) {
			Object.entries(pathParams).forEach(([key, value]) => {
				formattedUrl = formattedUrl.replace(`:${key}`, String(value));
			});
		}
		return formattedUrl;
	}

	async get<T>(endpoint: string, config?: RequestConfig) {
		const url = this.formatUrl(endpoint, config?.pathParams);
		return this.client.get<T>(url, {
			...config,
			params: config?.queryParams,
			headers: config?.headers
		});
	}

	async post<T>(endpoint: string, data?: any, config?: RequestConfig) {
		const url = this.formatUrl(endpoint, config?.pathParams);
		return this.client.post<T>(url, data, {
			...config,
			params: config?.queryParams,
			headers: config?.headers
		});
	}

	async put<T>(endpoint: string, data?: any, config?: RequestConfig) {
		const url = this.formatUrl(endpoint, config?.pathParams);
		return this.client.put<T>(url, data, {
			...config,
			params: config?.queryParams,
			headers: config?.headers
		});
	}

	async patch<T>(endpoint: string, data?: any, config?: RequestConfig) {
		const url = this.formatUrl(endpoint, config?.pathParams);
		return this.client.patch<T>(url, data, {
			...config,
			params: config?.queryParams,
			headers: config?.headers
		});
	}

	async delete<T>(endpoint: string, config?: RequestConfig) {
		const url = this.formatUrl(endpoint, config?.pathParams);
		return this.client.delete<T>(url, {
			...config,
			params: config?.queryParams,
			headers: config?.headers
		});
	}

	async options<T>(endpoint: string, config?: RequestConfig) {
		const url = this.formatUrl(endpoint, config?.pathParams);
		return this.client.options<T>(url, {
			...config,
			params: config?.queryParams,
			headers: config?.headers
		});
	}
}
const getBaseUrl = (serviceName: string): string => {
	switch (serviceName) {
		case "scheduling":
			return process.env.REACT_APP_SCHEDULING_URL_PREFIX!;
		case "po":
			return process.env.REACT_APP_PO_SERVICE_BASE_URL!;
		case "ums":
			return process.env.REACT_APP_UMS_URL_PREFIX!;
		case "catalogue":
			return process.env.REACT_APP_CATALOGUING_SERVICE_URL!;
		default:
			throw new Error(`Missing baseURL for service: ${serviceName}`);
	}
};

const cleanQueryParams = (params: Record<string, any>) => {
	return Object.fromEntries(
		Object.entries(params).filter(([_, v]) => v !== undefined && v !== null)
	);
}


export { ApiClient, getBaseUrl, cleanQueryParams };