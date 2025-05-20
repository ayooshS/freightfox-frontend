import { accessibleUIResource, AUD, AUTHORIZED_ROLES, BUSINESS_UNIT, CENTER_KEY, CENTER_KEYS, COMPANY_ID, COMPANY_NAME, EMAIL, FIRST_NAME, IS_AB, LAST_NAME, PHONE_NUMBER, ROLES, SERVICES, USER_ID, USER_TYPE } from "./constants";

export interface Product {
	skuCode: string;
	productName: string;
	grade?: string;
	size?: string;
	brand?: string;
	price?: number;
	quantity?: number;
	unit?: "MT" | "KG";
	[key: string]: any;
}

export interface ProductGroup {
	name: string;
	category?: string;
	variants: Product[];
}

export interface Customer extends Company {
	registered_address_id: number;
}

export interface Company {
	id: number;
	name: string;
	gstin: string;
	contractDetails?: {
		startDate: string;
		endDate: string;
		contractType: string;
		contractValue: Array<{
			period: string;
			commitment: number;
		}>;
		contractStatus: string;
		usageMTD: number;
	};
	active: string;
	admin: any;
	admin_user_id: number;
	alias_name: string;
	company_type: string;
	created_at: string;
	industry_id: number;
	primary_contact: {
		id: number;
		email: string;
		first_name: string;
		last_name: string;
		name: string;
	};
	status: string;
	total_users: string;
}

export interface PriceLineItem {
	id?: string;
	name: string;
	value?: number;
	type: "absolute" | "percentage" | "string";
	readonly?: boolean;
	meteringDetails?: any;
	default?: number | string;
	mandatory?: boolean;
}

export interface DefaultPriceLineItem {
	name: string;
	type: "absolute" | "percentage" | "discount";
}

export interface Attribute {
	attributeName: string;
	attributeValue: string;
}

export interface Service {
	_id: string;
	serviceName: string;
	description: string;
	serviceCode: string;
	chargeType: "ABSOLUTE" | "RELATIVE" | "METERED";
	isDiscount: boolean;
	lineItemStatus: "ACTIVE" | "INACTIVE";
	isTaxOnMarginCalulation: boolean;
}

export interface Costs extends Service {
	costAmount: number;
	currency: string;
}

export interface SalesPrice extends Service {
	saleAmount: number;
	currency: string;
}

export interface OrderRequest {
	tradeType: "MOU" | "SPOT";
	originationType: string;
	clientId: number;
	address: {
		delivery?: any;
		billing: any;
	};
	paymentTerms: {
		client: PaymentTerm[];
	};
	bizongoBillingEntityId: number;
	gstin: string;
	transporter: {
		name: string;
		fulfilled_by?: string;
	};
	notes?: string;
	pricingType: string;
	items: any[];
	paymentMode: string;
}

export type TradeType = "contracted" | "spot";
export type PriceType = "manual" | "mcx" | "cost" | "dnpl" | "floating_mcx";

export interface Address {
	country: string;
	pincode: number;
	street_address: string;
	is_active: boolean;
	landline_number: string;
	city: string;
	is_billing: boolean;
	vat: string;
	gstin: string;
	buyer_warehouse_code: string;
	alternate_number: string;
	full_name: string;
	auto_fetched: boolean;
	company_name: string;
	alias: string;
	id: number;
	state: string;
	landmark: string;
	mobile_number: string;
	gstin_attachment: string;
}

export interface CompanyProfile {
	company_type: string;
	cst: null;
	production_capacity_unit: null;
	constitution_of_business: string;
	created_at: number;
	type: string;
	pan_document: null;
	pan: string;
	active: "active";
	centre_id_list: number[];
	name: string;
	po_buyer: boolean;
}

export interface PaymentTerm {
	creditOn: 'ADVANCE' | 'INVOICE' | 'DISPATCH' | 'DELIVERY' | 'LOADING';
	percentage?: string; // for ADVANCE
	days?: number; // for CREDIT
}

export interface TypeUserData {
	[AUTHORIZED_ROLES]?: string[];
	[BUSINESS_UNIT]?: string[];
	[COMPANY_ID]?: string;
	[COMPANY_NAME]?: string;
	[EMAIL]?: string;
	[FIRST_NAME]?: string;
	[LAST_NAME]?: string;
	[PHONE_NUMBER]?: string;
	[ROLES]?: string[];
	[SERVICES]?: string[];
	[CENTER_KEY]?: string[];
	[CENTER_KEYS]?: string;
	[USER_ID]?: string;
	[accessibleUIResource]?: string;
	[IS_AB]?: boolean;
	[AUD]?: string;
	[USER_TYPE]?: string;
}