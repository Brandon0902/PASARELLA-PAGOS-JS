import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core';
import Oas from 'oas';
import APICore from 'api/dist/core';
declare class SDK {
    spec: Oas;
    core: APICore;
    constructor();
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    config(config: ConfigOptions): void;
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    auth(...values: string[] | number[]): this;
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    server(url: string, variables?: {}): void;
    /**
     * Return all rules
     *
     * @summary Get a list of whitelisted rules
     * @throws FetchError<401, types.GetRuleWhitelistResponse401> authentication error
     * @throws FetchError<403, types.GetRuleWhitelistResponse403> forbidden error
     * @throws FetchError<500, types.GetRuleWhitelistResponse500> internal server error
     */
    getRuleWhitelist(metadata?: types.GetRuleWhitelistMetadataParam): Promise<FetchResponse<200, types.GetRuleWhitelistResponse200>>;
    /**
     * Create whitelisted rule
     *
     * @throws FetchError<401, types.CreateRuleWhitelistResponse401> authentication error
     * @throws FetchError<403, types.CreateRuleWhitelistResponse403> forbidden error
     * @throws FetchError<500, types.CreateRuleWhitelistResponse500> internal server error
     */
    createRuleWhitelist(body: types.CreateRuleWhitelistBodyParam, metadata?: types.CreateRuleWhitelistMetadataParam): Promise<FetchResponse<200, types.CreateRuleWhitelistResponse200>>;
    /**
     * Delete whitelisted rule
     *
     * @throws FetchError<401, types.DeleteRuleWhitelistResponse401> authentication error
     * @throws FetchError<403, types.DeleteRuleWhitelistResponse403> forbidden error
     * @throws FetchError<404, types.DeleteRuleWhitelistResponse404> not found entity
     * @throws FetchError<500, types.DeleteRuleWhitelistResponse500> internal server error
     */
    deleteRuleWhitelist(metadata: types.DeleteRuleWhitelistMetadataParam): Promise<FetchResponse<200, types.DeleteRuleWhitelistResponse200>>;
    /**
     * Return all rules
     *
     * @summary Get list of blacklisted rules
     * @throws FetchError<401, types.GetRuleBlacklistResponse401> authentication error
     * @throws FetchError<500, types.GetRuleBlacklistResponse500> internal server error
     */
    getRuleBlacklist(metadata?: types.GetRuleBlacklistMetadataParam): Promise<FetchResponse<200, types.GetRuleBlacklistResponse200>>;
    /**
     * Create blacklisted rule
     *
     * @throws FetchError<401, types.CreateRuleBlacklistResponse401> authentication error
     * @throws FetchError<500, types.CreateRuleBlacklistResponse500> internal server error
     */
    createRuleBlacklist(body: types.CreateRuleBlacklistBodyParam, metadata?: types.CreateRuleBlacklistMetadataParam): Promise<FetchResponse<200, types.CreateRuleBlacklistResponse200>>;
    /**
     * Delete blacklisted rule
     *
     * @throws FetchError<401, types.DeleteRuleBlacklistResponse401> authentication error
     * @throws FetchError<404, types.DeleteRuleBlacklistResponse404> not found entity
     * @throws FetchError<500, types.DeleteRuleBlacklistResponse500> internal server error
     */
    deleteRuleBlacklist(metadata: types.DeleteRuleBlacklistMetadataParam): Promise<FetchResponse<200, types.DeleteRuleBlacklistResponse200>>;
    /**
     * Consume the list of api keys you have
     *
     * @summary Get list of Api Keys
     * @throws FetchError<401, types.GetApiKeysResponse401> authentication error
     * @throws FetchError<500, types.GetApiKeysResponse500> internal server error
     */
    getApiKeys(metadata?: types.GetApiKeysMetadataParam): Promise<FetchResponse<200, types.GetApiKeysResponse200>>;
    /**
     * Create a api key
     *
     * @summary Create Api Key
     * @throws FetchError<401, types.CreateApiKeyResponse401> authentication error
     * @throws FetchError<422, types.CreateApiKeyResponse422> parameter validation error
     * @throws FetchError<500, types.CreateApiKeyResponse500> internal server error
     */
    createApiKey(body: types.CreateApiKeyBodyParam, metadata?: types.CreateApiKeyMetadataParam): Promise<FetchResponse<200, types.CreateApiKeyResponse200>>;
    /**
     * Deletes a api key that corresponds to a api key ID
     *
     * @summary Delete Api Key
     * @throws FetchError<401, types.DeleteApiKeyResponse401> authentication error
     * @throws FetchError<404, types.DeleteApiKeyResponse404> not found entity
     * @throws FetchError<500, types.DeleteApiKeyResponse500> internal server error
     */
    deleteApiKey(metadata: types.DeleteApiKeyMetadataParam): Promise<FetchResponse<200, types.DeleteApiKeyResponse200>>;
    /**
     * Gets a api key that corresponds to a api key ID
     *
     * @summary Get Api Key
     * @throws FetchError<401, types.GetApiKeyResponse401> authentication error
     * @throws FetchError<404, types.GetApiKeyResponse404> not found entity
     * @throws FetchError<500, types.GetApiKeyResponse500> internal server error
     */
    getApiKey(metadata: types.GetApiKeyMetadataParam): Promise<FetchResponse<200, types.GetApiKeyResponse200>>;
    /**
     * Update an existing api key
     *
     * @summary Update Api Key
     * @throws FetchError<401, types.UpdateApiKeyResponse401> authentication error
     * @throws FetchError<404, types.UpdateApiKeyResponse404> not found entity
     * @throws FetchError<500, types.UpdateApiKeyResponse500> internal server error
     */
    updateApiKey(body: types.UpdateApiKeyBodyParam, metadata: types.UpdateApiKeyMetadataParam): Promise<FetchResponse<200, types.UpdateApiKeyResponse200>>;
    updateApiKey(metadata: types.UpdateApiKeyMetadataParam): Promise<FetchResponse<200, types.UpdateApiKeyResponse200>>;
    /**
     * Get a company's balance
     *
     * @summary Get a company's balance
     * @throws FetchError<401, types.GetBalanceResponse401> authentication error
     * @throws FetchError<500, types.GetBalanceResponse500> internal server error
     */
    getBalance(metadata?: types.GetBalanceMetadataParam): Promise<FetchResponse<200, types.GetBalanceResponse200>>;
    /**
     * Get A List of Charges
     *
     * @throws FetchError<422, types.GetChargesResponse422> whitelist validation error
     * @throws FetchError<500, types.GetChargesResponse500> internal server error
     */
    getCharges(metadata?: types.GetChargesMetadataParam): Promise<FetchResponse<200, types.GetChargesResponse200>>;
    /**
     * Update a charge
     *
     * @throws FetchError<404, types.UpdateChargeResponse404> not found entity
     * @throws FetchError<422, types.UpdateChargeResponse422> whitelist validation error
     * @throws FetchError<500, types.UpdateChargeResponse500> internal server error
     */
    updateCharge(body: types.UpdateChargeBodyParam, metadata: types.UpdateChargeMetadataParam): Promise<FetchResponse<200, types.UpdateChargeResponse200>>;
    /**
     * Create charge for an existing orden
     *
     * @summary Create charge
     * @throws FetchError<401, types.OrdersCreateChargeResponse401> authentication error
     * @throws FetchError<404, types.OrdersCreateChargeResponse404> not found entity
     * @throws FetchError<428, types.OrdersCreateChargeResponse428> Precondition Required
     * @throws FetchError<500, types.OrdersCreateChargeResponse500> internal server error
     */
    ordersCreateCharge(body: types.OrdersCreateChargeBodyParam, metadata: types.OrdersCreateChargeMetadataParam): Promise<FetchResponse<200, types.OrdersCreateChargeResponse200>>;
    /**
     * Consume the list of child companies.  This is used for holding companies with several
     * child entities.
     *
     * @summary Get List of Companies
     * @throws FetchError<401, types.GetCompaniesResponse401> authentication error
     * @throws FetchError<500, types.GetCompaniesResponse500> internal server error
     */
    getCompanies(metadata?: types.GetCompaniesMetadataParam): Promise<FetchResponse<200, types.GetCompaniesResponse200>>;
    /**
     * Get Company
     *
     * @throws FetchError<401, types.GetCompanyResponse401> authentication error
     * @throws FetchError<404, types.GetCompanyResponse404> not found entity
     * @throws FetchError<500, types.GetCompanyResponse500> internal server error
     */
    getCompany(metadata: types.GetCompanyMetadataParam): Promise<FetchResponse<200, types.GetCompanyResponse200>>;
    /**
     * The purpose of business is to create and maintain a client, you will learn what elements
     * you need to obtain a list of clients, which can be paged.
     *
     * @summary Get a list of customers
     * @throws FetchError<401, types.GetCustomersResponse401> authentication error
     * @throws FetchError<500, types.GetCustomersResponse500> internal server error
     */
    getCustomers(metadata?: types.GetCustomersMetadataParam): Promise<FetchResponse<200, types.GetCustomersResponse200>>;
    /**
     * The purpose of business is to create and keep a customer, you will learn what elements
     * you need to create a customer.
     * Remember the credit and debit card tokenization process:
     * [https://developers.conekta.com/page/web-checkout-tokenizer](https://developers.conekta.com/page/web-checkout-tokenizer)
     *
     *
     * @summary Create customer
     * @throws FetchError<401, types.CreateCustomerResponse401> authentication error
     * @throws FetchError<402, types.CreateCustomerResponse402> payment required error
     * @throws FetchError<422, types.CreateCustomerResponse422> parameter validation error
     * @throws FetchError<500, types.CreateCustomerResponse500> internal server error
     */
    createCustomer(body: types.CreateCustomerBodyParam, metadata?: types.CreateCustomerMetadataParam): Promise<FetchResponse<200, types.CreateCustomerResponse200>>;
    /**
     * Deleted a customer resource that corresponds to a customer ID.
     *
     * @summary Delete Customer
     * @throws FetchError<401, types.DeleteCustomerByIdResponse401> authentication error
     * @throws FetchError<404, types.DeleteCustomerByIdResponse404> not found entity
     * @throws FetchError<422, types.DeleteCustomerByIdResponse422> parameter validation error
     * @throws FetchError<500, types.DeleteCustomerByIdResponse500> internal server error
     */
    deleteCustomerById(metadata: types.DeleteCustomerByIdMetadataParam): Promise<FetchResponse<200, types.DeleteCustomerByIdResponse200>>;
    /**
     * Gets a customer resource that corresponds to a customer ID.
     *
     * @summary Get Customer
     * @throws FetchError<401, types.GetCustomerByIdResponse401> authentication error
     * @throws FetchError<404, types.GetCustomerByIdResponse404> not found entity
     * @throws FetchError<500, types.GetCustomerByIdResponse500> internal server error
     */
    getCustomerById(metadata: types.GetCustomerByIdMetadataParam): Promise<FetchResponse<200, types.GetCustomerByIdResponse200>>;
    /**
     * You can update customer-related data
     *
     * @summary Update customer
     * @throws FetchError<401, types.UpdateCustomerResponse401> authentication error
     * @throws FetchError<402, types.UpdateCustomerResponse402> payment required error
     * @throws FetchError<422, types.UpdateCustomerResponse422> parameter validation error
     * @throws FetchError<500, types.UpdateCustomerResponse500> internal server error
     */
    updateCustomer(body: types.UpdateCustomerBodyParam, metadata: types.UpdateCustomerMetadataParam): Promise<FetchResponse<200, types.UpdateCustomerResponse200>>;
    /**
     * Create Fiscal entity resource that corresponds to a customer ID.
     *
     * @summary Create Fiscal Entity
     * @throws FetchError<401, types.CreateCustomerFiscalEntitiesResponse401> authentication error
     * @throws FetchError<404, types.CreateCustomerFiscalEntitiesResponse404> not found entity
     * @throws FetchError<422, types.CreateCustomerFiscalEntitiesResponse422> parameter validation error
     * @throws FetchError<500, types.CreateCustomerFiscalEntitiesResponse500> internal server error
     */
    createCustomerFiscalEntities(body: types.CreateCustomerFiscalEntitiesBodyParam, metadata: types.CreateCustomerFiscalEntitiesMetadataParam): Promise<FetchResponse<200, types.CreateCustomerFiscalEntitiesResponse200>>;
    /**
     * Update Fiscal Entity resource that corresponds to a customer ID.
     *
     * @summary Update  Fiscal Entity
     * @throws FetchError<401, types.UpdateCustomerFiscalEntitiesResponse401> authentication error
     * @throws FetchError<404, types.UpdateCustomerFiscalEntitiesResponse404> not found entity
     * @throws FetchError<422, types.UpdateCustomerFiscalEntitiesResponse422> parameter validation error
     * @throws FetchError<500, types.UpdateCustomerFiscalEntitiesResponse500> internal server error
     */
    updateCustomerFiscalEntities(body: types.UpdateCustomerFiscalEntitiesBodyParam, metadata: types.UpdateCustomerFiscalEntitiesMetadataParam): Promise<FetchResponse<200, types.UpdateCustomerFiscalEntitiesResponse200>>;
    /**
     * Get discount lines for an existing orden
     *
     * @summary Get a List of Discount
     * @throws FetchError<401, types.OrdersGetDiscountLinesResponse401> authentication error
     * @throws FetchError<500, types.OrdersGetDiscountLinesResponse500> internal server error
     */
    ordersGetDiscountLines(metadata: types.OrdersGetDiscountLinesMetadataParam): Promise<FetchResponse<200, types.OrdersGetDiscountLinesResponse200>>;
    /**
     * Create discount lines for an existing orden
     *
     * @summary Create Discount
     * @throws FetchError<401, types.OrdersCreateDiscountLineResponse401> authentication error
     * @throws FetchError<404, types.OrdersCreateDiscountLineResponse404> not found entity
     * @throws FetchError<500, types.OrdersCreateDiscountLineResponse500> internal server error
     */
    ordersCreateDiscountLine(body: types.OrdersCreateDiscountLineBodyParam, metadata: types.OrdersCreateDiscountLineMetadataParam): Promise<FetchResponse<200, types.OrdersCreateDiscountLineResponse200>>;
    /**
     * Delete an existing discount lines for an existing orden
     *
     * @summary Delete Discount
     * @throws FetchError<401, types.OrdersDeleteDiscountLinesResponse401> authentication error
     * @throws FetchError<404, types.OrdersDeleteDiscountLinesResponse404> not found entity
     * @throws FetchError<422, types.OrdersDeleteDiscountLinesResponse422> parameter validation error
     * @throws FetchError<500, types.OrdersDeleteDiscountLinesResponse500> internal server error
     */
    ordersDeleteDiscountLines(metadata: types.OrdersDeleteDiscountLinesMetadataParam): Promise<FetchResponse<200, types.OrdersDeleteDiscountLinesResponse200>>;
    /**
     * Get an existing discount lines for an existing orden
     *
     * @summary Get Discount
     * @throws FetchError<401, types.OrdersGetDiscountLineResponse401> authentication error
     * @throws FetchError<404, types.OrdersGetDiscountLineResponse404> not found entity
     * @throws FetchError<422, types.OrdersGetDiscountLineResponse422> parameter validation error
     * @throws FetchError<500, types.OrdersGetDiscountLineResponse500> internal server error
     */
    ordersGetDiscountLine(metadata: types.OrdersGetDiscountLineMetadataParam): Promise<FetchResponse<200, types.OrdersGetDiscountLineResponse200>>;
    /**
     * Update an existing discount lines for an existing orden
     *
     * @summary Update Discount
     * @throws FetchError<401, types.OrdersUpdateDiscountLinesResponse401> authentication error
     * @throws FetchError<404, types.OrdersUpdateDiscountLinesResponse404> not found entity
     * @throws FetchError<422, types.OrdersUpdateDiscountLinesResponse422> parameter validation error
     * @throws FetchError<500, types.OrdersUpdateDiscountLinesResponse500> internal server error
     */
    ordersUpdateDiscountLines(body: types.OrdersUpdateDiscountLinesBodyParam, metadata: types.OrdersUpdateDiscountLinesMetadataParam): Promise<FetchResponse<200, types.OrdersUpdateDiscountLinesResponse200>>;
    /**
     * Get list of Events
     *
     * @throws FetchError<401, types.GetEventsResponse401> authentication error
     * @throws FetchError<500, types.GetEventsResponse500> internal server error
     */
    getEvents(metadata?: types.GetEventsMetadataParam): Promise<FetchResponse<200, types.GetEventsResponse200>>;
    /**
     * Returns a single event
     *
     * @summary Get Event
     * @throws FetchError<401, types.GetEventResponse401> authentication error
     * @throws FetchError<404, types.GetEventResponse404> not found entity
     * @throws FetchError<500, types.GetEventResponse500> internal server error
     */
    getEvent(metadata: types.GetEventMetadataParam): Promise<FetchResponse<200, types.GetEventResponse200>>;
    /**
     * Try to send an event
     *
     * @summary Resend Event
     * @throws FetchError<401, types.ResendEventResponse401> authentication error
     * @throws FetchError<404, types.ResendEventResponse404> not found entity
     * @throws FetchError<500, types.ResendEventResponse500> internal server error
     */
    resendEvent(metadata: types.ResendEventMetadataParam): Promise<FetchResponse<200, types.ResendEventResponse200>>;
    /**
     * Get log details in the form of a list
     *
     * @summary Get List Of Logs
     * @throws FetchError<401, types.GetLogsResponse401> authentication error
     * @throws FetchError<500, types.GetLogsResponse500> internal server error
     */
    getLogs(metadata?: types.GetLogsMetadataParam): Promise<FetchResponse<200, types.GetLogsResponse200>>;
    /**
     * Get the details of a specific log
     *
     * @summary Get Log
     * @throws FetchError<401, types.GetLogByIdResponse401> authentication error
     * @throws FetchError<404, types.GetLogByIdResponse404> not found entity
     * @throws FetchError<500, types.GetLogByIdResponse500> internal server error
     */
    getLogById(metadata: types.GetLogByIdMetadataParam): Promise<FetchResponse<200, types.GetLogByIdResponse200>>;
    /**
     * Get order details in the form of a list
     *
     * @summary Get a list of Orders
     * @throws FetchError<401, types.GetOrdersResponse401> authentication error
     * @throws FetchError<500, types.GetOrdersResponse500> internal server error
     */
    getOrders(metadata?: types.GetOrdersMetadataParam): Promise<FetchResponse<200, types.GetOrdersResponse200>>;
    /**
     * Create a new order.
     *
     * @summary Create order
     * @throws FetchError<401, types.CreateOrderResponse401> authentication error
     * @throws FetchError<402, types.CreateOrderResponse402> payment required error
     * @throws FetchError<422, types.CreateOrderResponse422> parameter validation error
     * @throws FetchError<500, types.CreateOrderResponse500> internal server error
     */
    createOrder(body: types.CreateOrderBodyParam, metadata?: types.CreateOrderMetadataParam): Promise<FetchResponse<200, types.CreateOrderResponse200>>;
    /**
     * Info for a specific order
     *
     * @summary Get Order
     * @throws FetchError<401, types.GetOrderByIdResponse401> authentication error
     * @throws FetchError<404, types.GetOrderByIdResponse404> not found entity
     * @throws FetchError<500, types.GetOrderByIdResponse500> internal server error
     */
    getOrderById(metadata: types.GetOrderByIdMetadataParam): Promise<FetchResponse<200, types.GetOrderByIdResponse200>>;
    /**
     * Update an existing Order.
     *
     * @summary Update Order
     * @throws FetchError<401, types.UpdateOrderResponse401> authentication error
     * @throws FetchError<404, types.UpdateOrderResponse404> not found entity
     * @throws FetchError<422, types.UpdateOrderResponse422> parameter validation error
     * @throws FetchError<500, types.UpdateOrderResponse500> internal server error
     */
    updateOrder(body: types.UpdateOrderBodyParam, metadata: types.UpdateOrderMetadataParam): Promise<FetchResponse<200, types.UpdateOrderResponse200>>;
    /**
     * Cancel an order that has been previously created.
     *
     * @summary Cancel Order
     * @throws FetchError<401, types.CancelOrderResponse401> authentication error
     * @throws FetchError<402, types.CancelOrderResponse402> payment required error
     * @throws FetchError<404, types.CancelOrderResponse404> not found entity
     * @throws FetchError<428, types.CancelOrderResponse428> Precondition Required
     * @throws FetchError<500, types.CancelOrderResponse500> internal server error
     */
    cancelOrder(metadata: types.CancelOrderMetadataParam): Promise<FetchResponse<200, types.CancelOrderResponse200>>;
    /**
     * Processes an order that has been previously authorized.
     *
     * @summary Capture Order
     * @throws FetchError<401, types.OrdersCreateCaptureResponse401> authentication error
     * @throws FetchError<404, types.OrdersCreateCaptureResponse404> not found entity
     * @throws FetchError<428, types.OrdersCreateCaptureResponse428> Precondition Required
     * @throws FetchError<500, types.OrdersCreateCaptureResponse500> internal server error
     */
    ordersCreateCapture(body: types.OrdersCreateCaptureBodyParam, metadata: types.OrdersCreateCaptureMetadataParam): Promise<FetchResponse<200, types.OrdersCreateCaptureResponse200>>;
    /**
     * Create a new product for an existing order.
     *
     * @summary Create Product
     * @throws FetchError<401, types.OrdersCreateProductResponse401> authentication error
     * @throws FetchError<404, types.OrdersCreateProductResponse404> not found entity
     * @throws FetchError<500, types.OrdersCreateProductResponse500> internal server error
     */
    ordersCreateProduct(body: types.OrdersCreateProductBodyParam, metadata: types.OrdersCreateProductMetadataParam): Promise<FetchResponse<200, types.OrdersCreateProductResponse200>>;
    /**
     * Delete product for an existing orden
     *
     * @summary Delete Product
     * @throws FetchError<401, types.OrdersDeleteProductResponse401> authentication error
     * @throws FetchError<404, types.OrdersDeleteProductResponse404> not found entity
     * @throws FetchError<422, types.OrdersDeleteProductResponse422> parameter validation error
     * @throws FetchError<500, types.OrdersDeleteProductResponse500> internal server error
     */
    ordersDeleteProduct(metadata: types.OrdersDeleteProductMetadataParam): Promise<FetchResponse<200, types.OrdersDeleteProductResponse200>>;
    /**
     * Update an existing product for an existing orden
     *
     * @summary Update Product
     * @throws FetchError<401, types.OrdersUpdateProductResponse401> authentication error
     * @throws FetchError<404, types.OrdersUpdateProductResponse404> not found entity
     * @throws FetchError<422, types.OrdersUpdateProductResponse422> parameter validation error
     * @throws FetchError<500, types.OrdersUpdateProductResponse500> internal server error
     */
    ordersUpdateProduct(body: types.OrdersUpdateProductBodyParam, metadata: types.OrdersUpdateProductMetadataParam): Promise<FetchResponse<200, types.OrdersUpdateProductResponse200>>;
    /**
     * A refunded order describes the items, amount, and reason an order is being refunded.
     *
     * @summary Refund Order
     * @throws FetchError<401, types.OrderRefundResponse401> authentication error
     * @throws FetchError<402, types.OrderRefundResponse402> payment required error
     * @throws FetchError<404, types.OrderRefundResponse404> not found entity
     * @throws FetchError<422, types.OrderRefundResponse422> parameter validation error
     * @throws FetchError<500, types.OrderRefundResponse500> internal server error
     */
    orderRefund(body: types.OrderRefundBodyParam, metadata: types.OrderRefundMetadataParam): Promise<FetchResponse<200, types.OrderRefundResponse200>>;
    /**
     * A refunded order describes the items, amount, and reason an order is being refunded.
     *
     * @summary Cancel Refund
     * @throws FetchError<401, types.OrderCancelRefundResponse401> authentication error
     * @throws FetchError<402, types.OrderCancelRefundResponse402> payment required error
     * @throws FetchError<404, types.OrderCancelRefundResponse404> not found entity
     * @throws FetchError<422, types.OrderCancelRefundResponse422> parameter validation error
     * @throws FetchError<500, types.OrderCancelRefundResponse500> internal server error
     */
    orderCancelRefund(metadata: types.OrderCancelRefundMetadataParam): Promise<FetchResponse<200, types.OrderCancelRefundResponse200>>;
    /**
     * Get Payout order details in the form of a list
     *
     * @summary Get a list of Payout Orders
     * @throws FetchError<401, types.GetPayoutOrdersResponse401> authentication error
     * @throws FetchError<500, types.GetPayoutOrdersResponse500> internal server error
     */
    getPayoutOrders(metadata?: types.GetPayoutOrdersMetadataParam): Promise<FetchResponse<200, types.GetPayoutOrdersResponse200>>;
    /**
     * Create a new payout order.
     *
     * @summary Create payout order
     * @throws FetchError<401, types.CreatePayoutOrderResponse401> authentication error
     * @throws FetchError<402, types.CreatePayoutOrderResponse402> payment required error
     * @throws FetchError<404, types.CreatePayoutOrderResponse404> not found entity
     * @throws FetchError<422, types.CreatePayoutOrderResponse422> parameter validation error
     * @throws FetchError<500, types.CreatePayoutOrderResponse500> internal server error
     */
    createPayoutOrder(body: types.CreatePayoutOrderBodyParam, metadata?: types.CreatePayoutOrderMetadataParam): Promise<FetchResponse<200, types.CreatePayoutOrderResponse200>>;
    /**
     * Gets a payout Order resource that corresponds to a payout order ID.
     *
     * @summary Get Payout Order
     * @throws FetchError<401, types.GetPayoutOrderByIdResponse401> authentication error
     * @throws FetchError<404, types.GetPayoutOrderByIdResponse404> not found entity
     * @throws FetchError<500, types.GetPayoutOrderByIdResponse500> internal server error
     */
    getPayoutOrderById(metadata: types.GetPayoutOrderByIdMetadataParam): Promise<FetchResponse<200, types.GetPayoutOrderByIdResponse200>>;
    /**
     * Returns a list of links generated by the merchant
     *
     * @summary Get a list of payment links
     * @throws FetchError<401, types.GetCheckoutsResponse401> authentication error
     * @throws FetchError<402, types.GetCheckoutsResponse402> payment required error
     * @throws FetchError<422, types.GetCheckoutsResponse422> parameter validation error
     * @throws FetchError<500, types.GetCheckoutsResponse500> internal server error
     */
    getCheckouts(metadata?: types.GetCheckoutsMetadataParam): Promise<FetchResponse<200, types.GetCheckoutsResponse200>>;
    /**
     * Create Unique Payment Link
     *
     * @throws FetchError<401, types.CreateCheckoutResponse401> authentication error
     * @throws FetchError<402, types.CreateCheckoutResponse402> payment required error
     * @throws FetchError<422, types.CreateCheckoutResponse422> parameter validation error
     * @throws FetchError<500, types.CreateCheckoutResponse500> internal server error
     */
    createCheckout(body: types.CreateCheckoutBodyParam, metadata?: types.CreateCheckoutMetadataParam): Promise<FetchResponse<200, types.CreateCheckoutResponse200>>;
    /**
     * Get a payment link by ID
     *
     * @throws FetchError<401, types.GetCheckoutResponse401> authentication error
     * @throws FetchError<402, types.GetCheckoutResponse402> payment required error
     * @throws FetchError<404, types.GetCheckoutResponse404> not found entity
     * @throws FetchError<422, types.GetCheckoutResponse422> parameter validation error
     * @throws FetchError<500, types.GetCheckoutResponse500> internal server error
     */
    getCheckout(metadata: types.GetCheckoutMetadataParam): Promise<FetchResponse<200, types.GetCheckoutResponse200>>;
    /**
     * Cancel Payment Link
     *
     * @throws FetchError<401, types.CancelCheckoutResponse401> authentication error
     * @throws FetchError<402, types.CancelCheckoutResponse402> payment required error
     * @throws FetchError<404, types.CancelCheckoutResponse404> not found entity
     * @throws FetchError<422, types.CancelCheckoutResponse422> parameter validation error
     * @throws FetchError<500, types.CancelCheckoutResponse500> internal server error
     */
    cancelCheckout(metadata: types.CancelCheckoutMetadataParam): Promise<FetchResponse<200, types.CancelCheckoutResponse200>>;
    /**
     * Send an email
     *
     * @throws FetchError<401, types.EmailCheckoutResponse401> authentication error
     * @throws FetchError<402, types.EmailCheckoutResponse402> payment required error
     * @throws FetchError<404, types.EmailCheckoutResponse404> not found entity
     * @throws FetchError<422, types.EmailCheckoutResponse422> parameter validation error
     * @throws FetchError<500, types.EmailCheckoutResponse500> internal server error
     */
    emailCheckout(body: types.EmailCheckoutBodyParam, metadata: types.EmailCheckoutMetadataParam): Promise<FetchResponse<200, types.EmailCheckoutResponse200>>;
    /**
     * Send an sms
     *
     * @throws FetchError<401, types.SmsCheckoutResponse401> authentication error
     * @throws FetchError<402, types.SmsCheckoutResponse402> payment required error
     * @throws FetchError<404, types.SmsCheckoutResponse404> not found entity
     * @throws FetchError<422, types.SmsCheckoutResponse422> parameter validation error
     * @throws FetchError<500, types.SmsCheckoutResponse500> internal server error
     */
    smsCheckout(body: types.SmsCheckoutBodyParam, metadata: types.SmsCheckoutMetadataParam): Promise<FetchResponse<200, types.SmsCheckoutResponse200>>;
    /**
     * Get a list of Payment Methods
     *
     * @summary Get Payment Methods
     * @throws FetchError<401, types.GetCustomerPaymentMethodsResponse401> authentication error
     * @throws FetchError<404, types.GetCustomerPaymentMethodsResponse404> not found entity
     * @throws FetchError<500, types.GetCustomerPaymentMethodsResponse500> internal server error
     */
    getCustomerPaymentMethods(metadata: types.GetCustomerPaymentMethodsMetadataParam): Promise<FetchResponse<200, types.GetCustomerPaymentMethodsResponse200>>;
    /**
     * Create a payment method for a customer.
     *
     * @summary Create Payment Method
     * @throws FetchError<401, types.CreateCustomerPaymentMethodsResponse401> authentication error
     * @throws FetchError<404, types.CreateCustomerPaymentMethodsResponse404> not found entity
     * @throws FetchError<422, types.CreateCustomerPaymentMethodsResponse422> parameter validation error
     * @throws FetchError<500, types.CreateCustomerPaymentMethodsResponse500> internal server error
     */
    createCustomerPaymentMethods(body: types.CreateCustomerPaymentMethodsBodyParam, metadata: types.CreateCustomerPaymentMethodsMetadataParam): Promise<FetchResponse<200, types.CreateCustomerPaymentMethodsResponse200>>;
    /**
     * Delete an existing payment method
     *
     * @summary Delete Payment Method
     * @throws FetchError<401, types.DeleteCustomerPaymentMethodsResponse401> authentication error
     * @throws FetchError<404, types.DeleteCustomerPaymentMethodsResponse404> not found entity
     * @throws FetchError<422, types.DeleteCustomerPaymentMethodsResponse422> parameter validation error
     * @throws FetchError<500, types.DeleteCustomerPaymentMethodsResponse500> internal server error
     */
    deleteCustomerPaymentMethods(metadata: types.DeleteCustomerPaymentMethodsMetadataParam): Promise<FetchResponse<200, types.DeleteCustomerPaymentMethodsResponse200>>;
    /**
     * Gets a payment Method that corresponds to a customer ID.
     *
     * @summary Update Payment Method
     * @throws FetchError<401, types.UpdateCustomerPaymentMethodsResponse401> authentication error
     * @throws FetchError<404, types.UpdateCustomerPaymentMethodsResponse404> not found entity
     * @throws FetchError<422, types.UpdateCustomerPaymentMethodsResponse422> parameter validation error
     * @throws FetchError<500, types.UpdateCustomerPaymentMethodsResponse500> internal server error
     */
    updateCustomerPaymentMethods(body: types.UpdateCustomerPaymentMethodsBodyParam, metadata: types.UpdateCustomerPaymentMethodsMetadataParam): Promise<FetchResponse<200, types.UpdateCustomerPaymentMethodsResponse200>>;
    /**
     * Get A List of Plans
     *
     * @throws FetchError<401, types.GetPlansResponse401> authentication error
     * @throws FetchError<422, types.GetPlansResponse422> parameter validation error
     * @throws FetchError<500, types.GetPlansResponse500> internal server error
     */
    getPlans(metadata?: types.GetPlansMetadataParam): Promise<FetchResponse<200, types.GetPlansResponse200>>;
    /**
     * Create a new plan for an existing order
     *
     * @summary Create Plan
     * @throws FetchError<401, types.CreatePlanResponse401> authentication error
     * @throws FetchError<422, types.CreatePlanResponse422> parameter validation error
     * @throws FetchError<500, types.CreatePlanResponse500> internal server error
     */
    createPlan(body: types.CreatePlanBodyParam, metadata?: types.CreatePlanMetadataParam): Promise<FetchResponse<200, types.CreatePlanResponse200>>;
    /**
     * Delete Plan
     *
     * @throws FetchError<401, types.DeletePlanResponse401> authentication error
     * @throws FetchError<404, types.DeletePlanResponse404> not found entity
     * @throws FetchError<422, types.DeletePlanResponse422> parameter validation error
     * @throws FetchError<500, types.DeletePlanResponse500> internal server error
     */
    deletePlan(metadata: types.DeletePlanMetadataParam): Promise<FetchResponse<200, types.DeletePlanResponse200>>;
    /**
     * Get Plan
     *
     * @throws FetchError<401, types.GetPlanResponse401> authentication error
     * @throws FetchError<404, types.GetPlanResponse404> not found entity
     * @throws FetchError<422, types.GetPlanResponse422> parameter validation error
     * @throws FetchError<500, types.GetPlanResponse500> internal server error
     */
    getPlan(metadata: types.GetPlanMetadataParam): Promise<FetchResponse<200, types.GetPlanResponse200>>;
    /**
     * Update Plan
     *
     * @throws FetchError<401, types.UpdatePlanResponse401> authentication error
     * @throws FetchError<404, types.UpdatePlanResponse404> not found entity
     * @throws FetchError<422, types.UpdatePlanResponse422> parameter validation error
     * @throws FetchError<500, types.UpdatePlanResponse500> internal server error
     */
    updatePlan(body: types.UpdatePlanBodyParam, metadata: types.UpdatePlanMetadataParam): Promise<FetchResponse<200, types.UpdatePlanResponse200>>;
    /**
     * Create new shipping for an existing orden
     *
     * @summary Create Shipping
     * @throws FetchError<401, types.OrdersCreateShippingResponse401> authentication error
     * @throws FetchError<404, types.OrdersCreateShippingResponse404> not found entity
     * @throws FetchError<500, types.OrdersCreateShippingResponse500> internal server error
     */
    ordersCreateShipping(body: types.OrdersCreateShippingBodyParam, metadata: types.OrdersCreateShippingMetadataParam): Promise<FetchResponse<200, types.OrdersCreateShippingResponse200>>;
    /**
     * Delete shipping
     *
     * @summary Delete Shipping
     * @throws FetchError<401, types.OrdersDeleteShippingResponse401> authentication error
     * @throws FetchError<404, types.OrdersDeleteShippingResponse404> not found entity
     * @throws FetchError<422, types.OrdersDeleteShippingResponse422> parameter validation error
     * @throws FetchError<428, types.OrdersDeleteShippingResponse428> Precondition Required
     * @throws FetchError<500, types.OrdersDeleteShippingResponse500> internal server error
     */
    ordersDeleteShipping(metadata: types.OrdersDeleteShippingMetadataParam): Promise<FetchResponse<200, types.OrdersDeleteShippingResponse200>>;
    /**
     * Update existing shipping for an existing orden
     *
     * @summary Update Shipping
     * @throws FetchError<401, types.OrdersUpdateShippingResponse401> authentication error
     * @throws FetchError<404, types.OrdersUpdateShippingResponse404> not found entity
     * @throws FetchError<422, types.OrdersUpdateShippingResponse422> parameter validation error
     * @throws FetchError<500, types.OrdersUpdateShippingResponse500> internal server error
     */
    ordersUpdateShipping(body: types.OrdersUpdateShippingBodyParam, metadata: types.OrdersUpdateShippingMetadataParam): Promise<FetchResponse<200, types.OrdersUpdateShippingResponse200>>;
    /**
     * Create a shipping contacts for a customer.
     *
     * @summary Create a shipping contacts
     * @throws FetchError<401, types.CreateCustomerShippingContactsResponse401> authentication error
     * @throws FetchError<404, types.CreateCustomerShippingContactsResponse404> not found entity
     * @throws FetchError<422, types.CreateCustomerShippingContactsResponse422> parameter validation error
     * @throws FetchError<500, types.CreateCustomerShippingContactsResponse500> internal server error
     */
    createCustomerShippingContacts(body: types.CreateCustomerShippingContactsBodyParam, metadata: types.CreateCustomerShippingContactsMetadataParam): Promise<FetchResponse<200, types.CreateCustomerShippingContactsResponse200>>;
    /**
     * Delete shipping contact that corresponds to a customer ID.
     *
     * @summary Delete shipping contacts
     * @throws FetchError<401, types.DeleteCustomerShippingContactsResponse401> authentication error
     * @throws FetchError<404, types.DeleteCustomerShippingContactsResponse404> not found entity
     * @throws FetchError<422, types.DeleteCustomerShippingContactsResponse422> parameter validation error
     * @throws FetchError<500, types.DeleteCustomerShippingContactsResponse500> internal server error
     */
    deleteCustomerShippingContacts(metadata: types.DeleteCustomerShippingContactsMetadataParam): Promise<FetchResponse<200, types.DeleteCustomerShippingContactsResponse200>>;
    /**
     * Update shipping contact that corresponds to a customer ID.
     *
     * @summary Update shipping contacts
     * @throws FetchError<401, types.UpdateCustomerShippingContactsResponse401> authentication error
     * @throws FetchError<404, types.UpdateCustomerShippingContactsResponse404> not found entity
     * @throws FetchError<422, types.UpdateCustomerShippingContactsResponse422> parameter validation error
     * @throws FetchError<500, types.UpdateCustomerShippingContactsResponse500> internal server error
     */
    updateCustomerShippingContacts(body: types.UpdateCustomerShippingContactsBodyParam, metadata: types.UpdateCustomerShippingContactsMetadataParam): Promise<FetchResponse<200, types.UpdateCustomerShippingContactsResponse200>>;
    /**
     * Get Subscription
     *
     * @throws FetchError<401, types.GetSubscriptionResponse401> authentication error
     * @throws FetchError<404, types.GetSubscriptionResponse404> not found entity
     * @throws FetchError<500, types.GetSubscriptionResponse500> internal server error
     */
    getSubscription(metadata: types.GetSubscriptionMetadataParam): Promise<FetchResponse<200, types.GetSubscriptionResponse200>>;
    /**
     * You can create the subscription to include the plans that your customers consume
     *
     * @summary Create Subscription
     * @throws FetchError<401, types.CreateSubscriptionResponse401> authentication error
     * @throws FetchError<404, types.CreateSubscriptionResponse404> not found entity
     * @throws FetchError<422, types.CreateSubscriptionResponse422> parameter validation error
     * @throws FetchError<500, types.CreateSubscriptionResponse500> internal server error
     */
    createSubscription(body: types.CreateSubscriptionBodyParam, metadata: types.CreateSubscriptionMetadataParam): Promise<FetchResponse<200, types.CreateSubscriptionResponse200>>;
    /**
     * You can modify the subscription to change the plans that your customers consume
     *
     * @summary Update Subscription
     * @throws FetchError<401, types.UpdateSubscriptionResponse401> authentication error
     * @throws FetchError<404, types.UpdateSubscriptionResponse404> not found entity
     * @throws FetchError<422, types.UpdateSubscriptionResponse422> parameter validation error
     * @throws FetchError<500, types.UpdateSubscriptionResponse500> internal server error
     */
    updateSubscription(body: types.UpdateSubscriptionBodyParam, metadata: types.UpdateSubscriptionMetadataParam): Promise<FetchResponse<200, types.UpdateSubscriptionResponse200>>;
    /**
     * You can cancel the subscription to stop the plans that your customers consume
     *
     * @summary Cancel Subscription
     * @throws FetchError<401, types.CancelSubscriptionResponse401> authentication error
     * @throws FetchError<404, types.CancelSubscriptionResponse404> not found entity
     * @throws FetchError<500, types.CancelSubscriptionResponse500> internal server error
     */
    cancelSubscription(metadata: types.CancelSubscriptionMetadataParam): Promise<FetchResponse<200, types.CancelSubscriptionResponse200>>;
    /**
     * You can get the events of the subscription(s) of a client, with the customer id
     *
     * @summary Get Events By Subscription
     * @throws FetchError<401, types.GetAllEventsFromSubscriptionResponse401> authentication error
     * @throws FetchError<402, types.GetAllEventsFromSubscriptionResponse402> payment required error
     * @throws FetchError<404, types.GetAllEventsFromSubscriptionResponse404> not found entity
     * @throws FetchError<422, types.GetAllEventsFromSubscriptionResponse422> parameter validation error
     * @throws FetchError<500, types.GetAllEventsFromSubscriptionResponse500> internal server error
     */
    getAllEventsFromSubscription(metadata: types.GetAllEventsFromSubscriptionMetadataParam): Promise<FetchResponse<200, types.GetAllEventsFromSubscriptionResponse200>>;
    /**
     * You can pause the subscription to stop the plans that your customers consume
     *
     * @summary Pause Subscription
     * @throws FetchError<401, types.PauseSubscriptionResponse401> authentication error
     * @throws FetchError<402, types.PauseSubscriptionResponse402> payment required error
     * @throws FetchError<404, types.PauseSubscriptionResponse404> not found entity
     * @throws FetchError<500, types.PauseSubscriptionResponse500> internal server error
     */
    pauseSubscription(metadata: types.PauseSubscriptionMetadataParam): Promise<FetchResponse<200, types.PauseSubscriptionResponse200>>;
    /**
     * You can resume the subscription to start the plans that your customers consume
     *
     * @summary Resume Subscription
     * @throws FetchError<401, types.ResumeSubscriptionResponse401> authentication error
     * @throws FetchError<402, types.ResumeSubscriptionResponse402> payment required error
     * @throws FetchError<404, types.ResumeSubscriptionResponse404> not found entity
     * @throws FetchError<422, types.ResumeSubscriptionResponse422> parameter validation error
     * @throws FetchError<500, types.ResumeSubscriptionResponse500> internal server error
     */
    resumeSubscription(metadata: types.ResumeSubscriptionMetadataParam): Promise<FetchResponse<200, types.ResumeSubscriptionResponse200>>;
    /**
     * Create new taxes for an existing orden
     *
     * @summary Create Tax
     * @throws FetchError<401, types.OrdersCreateTaxesResponse401> authentication error
     * @throws FetchError<404, types.OrdersCreateTaxesResponse404> not found entity
     * @throws FetchError<500, types.OrdersCreateTaxesResponse500> internal server error
     */
    ordersCreateTaxes(body: types.OrdersCreateTaxesBodyParam, metadata: types.OrdersCreateTaxesMetadataParam): Promise<FetchResponse<200, types.OrdersCreateTaxesResponse200>>;
    /**
     * Delete taxes for an existing orden
     *
     * @summary Delete Tax
     * @throws FetchError<401, types.OrdersDeleteTaxesResponse401> authentication error
     * @throws FetchError<404, types.OrdersDeleteTaxesResponse404> not found entity
     * @throws FetchError<422, types.OrdersDeleteTaxesResponse422> parameter validation error
     * @throws FetchError<500, types.OrdersDeleteTaxesResponse500> internal server error
     */
    ordersDeleteTaxes(metadata: types.OrdersDeleteTaxesMetadataParam): Promise<FetchResponse<200, types.OrdersDeleteTaxesResponse200>>;
    /**
     * Update taxes for an existing orden
     *
     * @summary Update Tax
     * @throws FetchError<401, types.OrdersUpdateTaxesResponse401> authentication error
     * @throws FetchError<404, types.OrdersUpdateTaxesResponse404> not found entity
     * @throws FetchError<422, types.OrdersUpdateTaxesResponse422> parameter validation error
     * @throws FetchError<500, types.OrdersUpdateTaxesResponse500> internal server error
     */
    ordersUpdateTaxes(body: types.OrdersUpdateTaxesBodyParam, metadata: types.OrdersUpdateTaxesMetadataParam): Promise<FetchResponse<200, types.OrdersUpdateTaxesResponse200>>;
    /**
     * Generate a payment token, to associate it with a card
     *
     *
     * @summary Create Token
     * @throws FetchError<401, types.CreateTokenResponse401> authentication error
     * @throws FetchError<422, types.CreateTokenResponse422> parameter validation error
     * @throws FetchError<500, types.CreateTokenResponse500> internal server error
     */
    createToken(body: types.CreateTokenBodyParam, metadata?: types.CreateTokenMetadataParam): Promise<FetchResponse<200, types.CreateTokenResponse200>>;
    /**
     * Get transaction details in the form of a list
     *
     * @summary Get List transactions
     * @throws FetchError<401, types.GetTransactionsResponse401> authentication error
     * @throws FetchError<500, types.GetTransactionsResponse500> internal server error
     */
    getTransactions(metadata?: types.GetTransactionsMetadataParam): Promise<FetchResponse<200, types.GetTransactionsResponse200>>;
    /**
     * Get the details of a transaction
     *
     * @summary Get transaction
     * @throws FetchError<401, types.GetTransactionResponse401> authentication error
     * @throws FetchError<404, types.GetTransactionResponse404> authentication error
     * @throws FetchError<500, types.GetTransactionResponse500> internal server error
     */
    getTransaction(metadata: types.GetTransactionMetadataParam): Promise<FetchResponse<200, types.GetTransactionResponse200>>;
    /**
     * Get transfers details in the form of a list
     *
     * @summary Get a list of transfers
     * @throws FetchError<401, types.GetTransfersResponse401> authentication error
     * @throws FetchError<500, types.GetTransfersResponse500> internal server error
     */
    getTransfers(metadata?: types.GetTransfersMetadataParam): Promise<FetchResponse<200, types.GetTransfersResponse200>>;
    /**
     * Get the details of a Transfer
     *
     * @summary Get Transfer
     * @throws FetchError<401, types.GetTransferResponse401> authentication error
     * @throws FetchError<404, types.GetTransferResponse404> authentication error
     * @throws FetchError<500, types.GetTransferResponse500> internal server error
     */
    getTransfer(metadata: types.GetTransferMetadataParam): Promise<FetchResponse<200, types.GetTransferResponse200>>;
    /**
     * Consume the list of webhook keys you have
     *
     * @summary Get List of Webhook Keys
     * @throws FetchError<401, types.GetWebhookKeysResponse401> authentication error
     * @throws FetchError<500, types.GetWebhookKeysResponse500> internal server error
     */
    getWebhookKeys(metadata?: types.GetWebhookKeysMetadataParam): Promise<FetchResponse<200, types.GetWebhookKeysResponse200>>;
    /**
     * Create a webhook key
     *
     * @summary Create Webhook Key
     * @throws FetchError<401, types.CreateWebhookKeyResponse401> authentication error
     * @throws FetchError<500, types.CreateWebhookKeyResponse500> internal server error
     */
    createWebhookKey(body?: types.CreateWebhookKeyBodyParam, metadata?: types.CreateWebhookKeyMetadataParam): Promise<FetchResponse<200, types.CreateWebhookKeyResponse200>>;
    /**
     * Delete Webhook key
     *
     * @throws FetchError<401, types.DeleteWebhookKeyResponse401> authentication error
     * @throws FetchError<404, types.DeleteWebhookKeyResponse404> not found entity
     * @throws FetchError<500, types.DeleteWebhookKeyResponse500> internal server error
     */
    deleteWebhookKey(metadata: types.DeleteWebhookKeyMetadataParam): Promise<FetchResponse<200, types.DeleteWebhookKeyResponse200>>;
    /**
     * Get Webhook Key
     *
     * @throws FetchError<401, types.GetWebhookKeyResponse401> authentication error
     * @throws FetchError<404, types.GetWebhookKeyResponse404> not found entity
     * @throws FetchError<500, types.GetWebhookKeyResponse500> internal server error
     */
    getWebhookKey(metadata: types.GetWebhookKeyMetadataParam): Promise<FetchResponse<200, types.GetWebhookKeyResponse200>>;
    /**
     * updates an existing webhook key
     *
     * @summary Update Webhook Key
     * @throws FetchError<401, types.UpdateWebhookKeyResponse401> authentication error
     * @throws FetchError<404, types.UpdateWebhookKeyResponse404> not found entity
     * @throws FetchError<500, types.UpdateWebhookKeyResponse500> internal server error
     */
    updateWebhookKey(body: types.UpdateWebhookKeyBodyParam, metadata: types.UpdateWebhookKeyMetadataParam): Promise<FetchResponse<200, types.UpdateWebhookKeyResponse200>>;
    updateWebhookKey(metadata: types.UpdateWebhookKeyMetadataParam): Promise<FetchResponse<200, types.UpdateWebhookKeyResponse200>>;
    /**
     * Consume the list of webhooks you have, each environment supports 10 webhooks (For
     * production and testing)
     *
     * @summary Get List of Webhooks
     * @throws FetchError<401, types.GetWebhooksResponse401> authentication error
     * @throws FetchError<500, types.GetWebhooksResponse500> internal server error
     */
    getWebhooks(metadata?: types.GetWebhooksMetadataParam): Promise<FetchResponse<200, types.GetWebhooksResponse200>>;
    /**
     * What we do at Conekta translates into events. For example, an event of interest to us
     * occurs at the time a payment is successfully processed. At that moment we will be
     * interested in doing several things: Send an email to the buyer, generate an invoice,
     * start the process of shipping the product, etc.
     *
     * @summary Create Webhook
     * @throws FetchError<401, types.CreateWebhookResponse401> authentication error
     * @throws FetchError<500, types.CreateWebhookResponse500> internal server error
     */
    createWebhook(body: types.CreateWebhookBodyParam, metadata?: types.CreateWebhookMetadataParam): Promise<FetchResponse<200, types.CreateWebhookResponse200>>;
    /**
     * Delete Webhook
     *
     * @throws FetchError<401, types.DeleteWebhookResponse401> authentication error
     * @throws FetchError<404, types.DeleteWebhookResponse404> not found entity
     * @throws FetchError<500, types.DeleteWebhookResponse500> internal server error
     */
    deleteWebhook(metadata: types.DeleteWebhookMetadataParam): Promise<FetchResponse<200, types.DeleteWebhookResponse200>>;
    /**
     * Get Webhook
     *
     * @throws FetchError<401, types.GetWebhookResponse401> authentication error
     * @throws FetchError<404, types.GetWebhookResponse404> not found entity
     * @throws FetchError<500, types.GetWebhookResponse500> internal server error
     */
    getWebhook(metadata: types.GetWebhookMetadataParam): Promise<FetchResponse<200, types.GetWebhookResponse200>>;
    /**
     * updates an existing webhook
     *
     * @summary Update Webhook
     * @throws FetchError<401, types.UpdateWebhookResponse401> authentication error
     * @throws FetchError<404, types.UpdateWebhookResponse404> not found entity
     * @throws FetchError<500, types.UpdateWebhookResponse500> internal server error
     */
    updateWebhook(body: types.UpdateWebhookBodyParam, metadata: types.UpdateWebhookMetadataParam): Promise<FetchResponse<200, types.UpdateWebhookResponse200>>;
    /**
     * Send a webhook.ping event
     *
     * @summary Test Webhook
     * @throws FetchError<401, types.TestWebhookResponse401> authentication error
     * @throws FetchError<404, types.TestWebhookResponse404> not found entity
     * @throws FetchError<500, types.TestWebhookResponse500> internal server error
     */
    testWebhook(metadata: types.TestWebhookMetadataParam): Promise<FetchResponse<200, types.TestWebhookResponse200>>;
}
declare const createSDK: SDK;
export = createSDK;
