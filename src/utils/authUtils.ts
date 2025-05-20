import { jwtDecode } from "jwt-decode";
import {
	accessibleUIResource,
	AUD,
	AUTHORIZED_ROLES,
	BUSINESS_UNIT,
	CENTER_KEY,
	CENTER_KEYS,
	COMPANY_ID,
	COMPANY_NAME,
	EMAIL,
	FIRST_NAME,
	IS_AB,
	jwtTokenEnabledKey,
	jwtTokenKey,
	LAST_NAME,
	msiteData,
	PHONE_NUMBER,
	ROLES,
	SERVICES,
	USER_ID,
	USER_TYPE,
} from "../constants";
import { TypeUserData } from "../types";
import { umsClient } from "@/lib/apiHelper";
import {Session} from "react-router-dom";

let userData: TypeUserData = {};

export const decodeJwtToken = (token = ""): unknown => {
	const decoded = jwtDecode(token);
	return decoded;
};

export const setAccessibleUIResources = (uiResources: string): void => {
	localStorage.setItem(accessibleUIResource, uiResources);
	userData = { ...userData, [accessibleUIResource]: uiResources };
};

const setLocalStorage = <T>(key: string, value: T): void => {
	localStorage.setItem(key, String(value));
};

const removeLocalStorage = (key: string): void => {
	localStorage.removeItem(key);
};

export const setJwtToken = (jwtToken: string): void => {
	setLocalStorage(jwtTokenKey, jwtToken);
	setLocalStorage(jwtTokenEnabledKey, true);

	const domain = window.location.hostname;
	const subdomain = domain.substr(domain.indexOf(".") + 1);

	setSecureCookie(jwtTokenKey, jwtToken, subdomain);
	setSecureCookie(`jwt_token_sales_app`, jwtToken, domain);
	setSecureCookie("source", "sales_app", subdomain);
};

export const setUserDetails = (UserResponse: TypeUserData): void => {
	userData = UserResponse;
	setLocalStorage(AUTHORIZED_ROLES, UserResponse[AUTHORIZED_ROLES]);
	setLocalStorage(BUSINESS_UNIT, UserResponse[BUSINESS_UNIT]);
	setLocalStorage(COMPANY_ID, UserResponse[COMPANY_ID]);
	setLocalStorage(COMPANY_NAME, UserResponse[COMPANY_NAME]);
	setLocalStorage(EMAIL, UserResponse[EMAIL]);
	setLocalStorage(FIRST_NAME, UserResponse[FIRST_NAME]);
	setLocalStorage(LAST_NAME, UserResponse[LAST_NAME]);
	setLocalStorage(PHONE_NUMBER, UserResponse[PHONE_NUMBER]);
	setLocalStorage(ROLES, UserResponse[ROLES]);
	setLocalStorage(SERVICES, UserResponse[SERVICES]);
	setLocalStorage(CENTER_KEY, UserResponse[CENTER_KEY]);
	setLocalStorage(CENTER_KEYS, UserResponse[CENTER_KEYS]);
	setLocalStorage(USER_ID, UserResponse[USER_ID]);
	setLocalStorage(IS_AB, UserResponse[IS_AB] || false);
	setLocalStorage(AUD, UserResponse[AUD] || "");
	setLocalStorage(USER_TYPE, UserResponse[USER_TYPE] || "");
};

export const setMsiteData = (data: any): void => {
	setLocalStorage(msiteData, JSON.stringify(data));
};

export const removeUserDetails = (): void => {
	removeLocalStorage(AUTHORIZED_ROLES);
	removeLocalStorage(BUSINESS_UNIT);
	removeLocalStorage(COMPANY_ID);
	removeLocalStorage(COMPANY_NAME);
	removeLocalStorage(EMAIL);
	removeLocalStorage(FIRST_NAME);
	removeLocalStorage(LAST_NAME);
	removeLocalStorage(PHONE_NUMBER);
	removeLocalStorage(ROLES);
	removeLocalStorage(SERVICES);
	removeLocalStorage(CENTER_KEY);
	removeLocalStorage(CENTER_KEYS);
	removeLocalStorage(USER_ID);
	removeLocalStorage(AUD);
	removeLocalStorage(USER_TYPE);
	removeLocalStorage(accessibleUIResource);
};

// ✅ SAFER LOCALSTORAGE ACCESS UTILS
export const getLocalStorageData = (itemKey: string): string | null => {
	const value = localStorage.getItem(itemKey);
	return value !== null ? value : null;
};

export const getParsedStorageData = <T>(itemKey: string): T | null => {
	const value = localStorage.getItem(itemKey);
	if (!value) return null;
	try {
		return JSON.parse(value) as T;
	} catch {
		console.warn(`⚠️ Could not parse localStorage item: ${itemKey}`);
		return null;
	}
};

export const getJwtToken = (): string =>
	getLocalStorageData(jwtTokenKey) || "";

export const getJwtTokenEnable = (): boolean =>
	getLocalStorageData(jwtTokenEnabledKey) === "true";

export const getAuthorizedRoles = (): string[] | undefined => userData[AUTHORIZED_ROLES];
export const getBusinessUnit = (): string[] | undefined => userData[BUSINESS_UNIT];
export const getCompanyId = (): string | undefined => userData[COMPANY_ID];
export const getCompanyName = (): string | undefined => userData[COMPANY_NAME];
export const getEmail = (): string | undefined => userData[EMAIL];
export const getFirstName = (): string | undefined => userData[FIRST_NAME];
export const getLastName = (): string | undefined => userData[LAST_NAME];
export const getPhoneNumber = (): string | undefined => userData[PHONE_NUMBER];
export const getRoles = (): string[] | undefined => userData[ROLES];
export const getServices = (): string[] | undefined => userData[SERVICES];
export const getUserCenter = (): string[] | undefined => userData[CENTER_KEY];
export const getUserCenters = (): string | undefined => userData[CENTER_KEYS];
export const getUserId = (): string | undefined =>
	userData[USER_ID] || getLocalStorageData(USER_ID) || "";

export const getAudSource = (): string | undefined =>
	userData[AUD] || getLocalStorageData(AUD) || "";

export const getUserType = (): string | undefined =>
	userData[USER_TYPE] || getLocalStorageData(USER_TYPE) || "";

export const getUserData = (): TypeUserData => userData;

export const getMsiteData = (): string => {
	const data = getParsedStorageData<string>(msiteData);
	return data ?? "";
};

export const removeMsiteData = (): void => {
	localStorage.removeItem(msiteData);
};

export const isLoggedIn = (): boolean => {
	const authToken = getJwtToken();
	return !!authToken;
};

export const removeJwtToken = (): void => {
	localStorage.removeItem(jwtTokenKey);
	localStorage.removeItem(jwtTokenEnabledKey);
};

export const logoutFunc = () => {
	localStorage.clear();
	const domain = window.location.hostname;
	setSecureCookie("jwt_token_sales", "", domain, -99999999);
	window.location.href = "/";
};

export const logOut = async (): Promise<void> => {
	logoutFunc();
};

export const getCenterIdForZerothIndex = (): string => {
	const centers = getUserCenter();
	if (typeof centers === "string") return centers;
	if (centers?.length) return centers[0];
	return "";
};

export const isInternalPlatformURL = () => {
	return true;
};

export const isInternalPlatform = (): boolean => {
	if (isLoggedIn()) {
		return getAudSource() === "InternalApp" && getUserType() === "internal";
	}
	return isInternalPlatformURL();
};

export const isNextPlatform = (): boolean => {
	if (isLoggedIn()) {
		return getAudSource() === "BizongoApp" && getUserType() === "external";
	}
	return window.location.host.includes("next");
};

export const internalRoles = () => {
	return localStorage.getItem("roles");
};

export const getCookie = (cookieName: string): string | null => {
	const cookies = document.cookie.split(";");

	for (let cookie of cookies) {
		cookie = cookie.trim();
		if (cookie.startsWith(`${cookieName}=`)) {
			return cookie.substring(cookieName.length + 1);
		}
	}
	return null;
};

const setSecureCookie = (
	key: string,
	value: string,
	domain: string,
	maxAge: number = 604800 // 7 days
) => {
	document.cookie = `${key}=${value}; Domain=${domain}; Path=/; Max-Age=${maxAge}; Secure; SameSite=None`;
};

export const getSessions = async () => {
	const response = await umsClient.get<{ data: Session[] }>(`api/users/fetch-sessions`);
	return response;
};

export const deleteSessions = async (
	sessionId: number,
	sessionToken: string
) => {
	const response = await umsClient.get(
		`api/users/session/terminate/${sessionId}?sessionToken=${encodeURIComponent(sessionToken)}`
	);
	console.log(response);
	return response;
};
