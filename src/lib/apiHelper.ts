import {ApiClient, getBaseUrl} from "@/utils/apiClient";



// const schedulingClient = new ApiClient({ baseURL: getBaseUrl('scheduling')});
console.log("UMS base URL →", getBaseUrl("ums"));
export const umsClient = new ApiClient({ baseURL: getBaseUrl("ums") });

