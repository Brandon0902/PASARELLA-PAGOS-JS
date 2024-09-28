"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var oas_1 = __importDefault(require("oas"));
var core_1 = __importDefault(require("api/dist/core"));
var openapi_json_1 = __importDefault(require("./openapi.json"));
var SDK = /** @class */ (function () {
    function SDK() {
        this.spec = oas_1.default.init(openapi_json_1.default);
        this.core = new core_1.default(this.spec, 'conekta-dev-center/2.1.0 (api/6.1.2)');
    }
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    SDK.prototype.config = function (config) {
        this.core.setConfig(config);
    };
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
    SDK.prototype.auth = function () {
        var _a;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        (_a = this.core).setAuth.apply(_a, values);
        return this;
    };
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
    SDK.prototype.server = function (url, variables) {
        if (variables === void 0) { variables = {}; }
        this.core.setServer(url, variables);
    };
    /**
     * Return all rules
     *
     * @summary Get a list of whitelisted rules
     * @throws FetchError<401, types.GetRuleWhitelistResponse401> authentication error
     * @throws FetchError<403, types.GetRuleWhitelistResponse403> forbidden error
     * @throws FetchError<500, types.GetRuleWhitelistResponse500> internal server error
     */
    SDK.prototype.getRuleWhitelist = function (metadata) {
        return this.core.fetch('/antifraud/whitelists', 'get', metadata);
    };
    /**
     * Create whitelisted rule
     *
     * @throws FetchError<401, types.CreateRuleWhitelistResponse401> authentication error
     * @throws FetchError<403, types.CreateRuleWhitelistResponse403> forbidden error
     * @throws FetchError<500, types.CreateRuleWhitelistResponse500> internal server error
     */
    SDK.prototype.createRuleWhitelist = function (body, metadata) {
        return this.core.fetch('/antifraud/whitelists', 'post', body, metadata);
    };
    /**
     * Delete whitelisted rule
     *
     * @throws FetchError<401, types.DeleteRuleWhitelistResponse401> authentication error
     * @throws FetchError<403, types.DeleteRuleWhitelistResponse403> forbidden error
     * @throws FetchError<404, types.DeleteRuleWhitelistResponse404> not found entity
     * @throws FetchError<500, types.DeleteRuleWhitelistResponse500> internal server error
     */
    SDK.prototype.deleteRuleWhitelist = function (metadata) {
        return this.core.fetch('/antifraud/whitelists/{id}', 'delete', metadata);
    };
    /**
     * Return all rules
     *
     * @summary Get list of blacklisted rules
     * @throws FetchError<401, types.GetRuleBlacklistResponse401> authentication error
     * @throws FetchError<500, types.GetRuleBlacklistResponse500> internal server error
     */
    SDK.prototype.getRuleBlacklist = function (metadata) {
        return this.core.fetch('/antifraud/blacklists', 'get', metadata);
    };
    /**
     * Create blacklisted rule
     *
     * @throws FetchError<401, types.CreateRuleBlacklistResponse401> authentication error
     * @throws FetchError<500, types.CreateRuleBlacklistResponse500> internal server error
     */
    SDK.prototype.createRuleBlacklist = function (body, metadata) {
        return this.core.fetch('/antifraud/blacklists', 'post', body, metadata);
    };
    /**
     * Delete blacklisted rule
     *
     * @throws FetchError<401, types.DeleteRuleBlacklistResponse401> authentication error
     * @throws FetchError<404, types.DeleteRuleBlacklistResponse404> not found entity
     * @throws FetchError<500, types.DeleteRuleBlacklistResponse500> internal server error
     */
    SDK.prototype.deleteRuleBlacklist = function (metadata) {
        return this.core.fetch('/antifraud/blacklists/{id}', 'delete', metadata);
    };
    /**
     * Consume the list of api keys you have
     *
     * @summary Get list of Api Keys
     * @throws FetchError<401, types.GetApiKeysResponse401> authentication error
     * @throws FetchError<500, types.GetApiKeysResponse500> internal server error
     */
    SDK.prototype.getApiKeys = function (metadata) {
        return this.core.fetch('/api_keys', 'get', metadata);
    };
    /**
     * Create a api key
     *
     * @summary Create Api Key
     * @throws FetchError<401, types.CreateApiKeyResponse401> authentication error
     * @throws FetchError<422, types.CreateApiKeyResponse422> parameter validation error
     * @throws FetchError<500, types.CreateApiKeyResponse500> internal server error
     */
    SDK.prototype.createApiKey = function (body, metadata) {
        return this.core.fetch('/api_keys', 'post', body, metadata);
    };
    /**
     * Deletes a api key that corresponds to a api key ID
     *
     * @summary Delete Api Key
     * @throws FetchError<401, types.DeleteApiKeyResponse401> authentication error
     * @throws FetchError<404, types.DeleteApiKeyResponse404> not found entity
     * @throws FetchError<500, types.DeleteApiKeyResponse500> internal server error
     */
    SDK.prototype.deleteApiKey = function (metadata) {
        return this.core.fetch('/api_keys/{id}', 'delete', metadata);
    };
    /**
     * Gets a api key that corresponds to a api key ID
     *
     * @summary Get Api Key
     * @throws FetchError<401, types.GetApiKeyResponse401> authentication error
     * @throws FetchError<404, types.GetApiKeyResponse404> not found entity
     * @throws FetchError<500, types.GetApiKeyResponse500> internal server error
     */
    SDK.prototype.getApiKey = function (metadata) {
        return this.core.fetch('/api_keys/{id}', 'get', metadata);
    };
    SDK.prototype.updateApiKey = function (body, metadata) {
        return this.core.fetch('/api_keys/{id}', 'put', body, metadata);
    };
    /**
     * Get a company's balance
     *
     * @summary Get a company's balance
     * @throws FetchError<401, types.GetBalanceResponse401> authentication error
     * @throws FetchError<500, types.GetBalanceResponse500> internal server error
     */
    SDK.prototype.getBalance = function (metadata) {
        return this.core.fetch('/balance', 'get', metadata);
    };
    /**
     * Get A List of Charges
     *
     * @throws FetchError<422, types.GetChargesResponse422> whitelist validation error
     * @throws FetchError<500, types.GetChargesResponse500> internal server error
     */
    SDK.prototype.getCharges = function (metadata) {
        return this.core.fetch('/charges', 'get', metadata);
    };
    /**
     * Update a charge
     *
     * @throws FetchError<404, types.UpdateChargeResponse404> not found entity
     * @throws FetchError<422, types.UpdateChargeResponse422> whitelist validation error
     * @throws FetchError<500, types.UpdateChargeResponse500> internal server error
     */
    SDK.prototype.updateCharge = function (body, metadata) {
        return this.core.fetch('/charges/{id}', 'put', body, metadata);
    };
    /**
     * Create charge for an existing orden
     *
     * @summary Create charge
     * @throws FetchError<401, types.OrdersCreateChargeResponse401> authentication error
     * @throws FetchError<404, types.OrdersCreateChargeResponse404> not found entity
     * @throws FetchError<428, types.OrdersCreateChargeResponse428> Precondition Required
     * @throws FetchError<500, types.OrdersCreateChargeResponse500> internal server error
     */
    SDK.prototype.ordersCreateCharge = function (body, metadata) {
        return this.core.fetch('/orders/{id}/charges', 'post', body, metadata);
    };
    /**
     * Consume the list of child companies.  This is used for holding companies with several
     * child entities.
     *
     * @summary Get List of Companies
     * @throws FetchError<401, types.GetCompaniesResponse401> authentication error
     * @throws FetchError<500, types.GetCompaniesResponse500> internal server error
     */
    SDK.prototype.getCompanies = function (metadata) {
        return this.core.fetch('/companies', 'get', metadata);
    };
    /**
     * Get Company
     *
     * @throws FetchError<401, types.GetCompanyResponse401> authentication error
     * @throws FetchError<404, types.GetCompanyResponse404> not found entity
     * @throws FetchError<500, types.GetCompanyResponse500> internal server error
     */
    SDK.prototype.getCompany = function (metadata) {
        return this.core.fetch('/companies/{id}', 'get', metadata);
    };
    /**
     * The purpose of business is to create and maintain a client, you will learn what elements
     * you need to obtain a list of clients, which can be paged.
     *
     * @summary Get a list of customers
     * @throws FetchError<401, types.GetCustomersResponse401> authentication error
     * @throws FetchError<500, types.GetCustomersResponse500> internal server error
     */
    SDK.prototype.getCustomers = function (metadata) {
        return this.core.fetch('/customers', 'get', metadata);
    };
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
    SDK.prototype.createCustomer = function (body, metadata) {
        return this.core.fetch('/customers', 'post', body, metadata);
    };
    /**
     * Deleted a customer resource that corresponds to a customer ID.
     *
     * @summary Delete Customer
     * @throws FetchError<401, types.DeleteCustomerByIdResponse401> authentication error
     * @throws FetchError<404, types.DeleteCustomerByIdResponse404> not found entity
     * @throws FetchError<422, types.DeleteCustomerByIdResponse422> parameter validation error
     * @throws FetchError<500, types.DeleteCustomerByIdResponse500> internal server error
     */
    SDK.prototype.deleteCustomerById = function (metadata) {
        return this.core.fetch('/customers/{id}', 'delete', metadata);
    };
    /**
     * Gets a customer resource that corresponds to a customer ID.
     *
     * @summary Get Customer
     * @throws FetchError<401, types.GetCustomerByIdResponse401> authentication error
     * @throws FetchError<404, types.GetCustomerByIdResponse404> not found entity
     * @throws FetchError<500, types.GetCustomerByIdResponse500> internal server error
     */
    SDK.prototype.getCustomerById = function (metadata) {
        return this.core.fetch('/customers/{id}', 'get', metadata);
    };
    /**
     * You can update customer-related data
     *
     * @summary Update customer
     * @throws FetchError<401, types.UpdateCustomerResponse401> authentication error
     * @throws FetchError<402, types.UpdateCustomerResponse402> payment required error
     * @throws FetchError<422, types.UpdateCustomerResponse422> parameter validation error
     * @throws FetchError<500, types.UpdateCustomerResponse500> internal server error
     */
    SDK.prototype.updateCustomer = function (body, metadata) {
        return this.core.fetch('/customers/{id}', 'put', body, metadata);
    };
    /**
     * Create Fiscal entity resource that corresponds to a customer ID.
     *
     * @summary Create Fiscal Entity
     * @throws FetchError<401, types.CreateCustomerFiscalEntitiesResponse401> authentication error
     * @throws FetchError<404, types.CreateCustomerFiscalEntitiesResponse404> not found entity
     * @throws FetchError<422, types.CreateCustomerFiscalEntitiesResponse422> parameter validation error
     * @throws FetchError<500, types.CreateCustomerFiscalEntitiesResponse500> internal server error
     */
    SDK.prototype.createCustomerFiscalEntities = function (body, metadata) {
        return this.core.fetch('/customers/{id}/fiscal_entities', 'post', body, metadata);
    };
    /**
     * Update Fiscal Entity resource that corresponds to a customer ID.
     *
     * @summary Update  Fiscal Entity
     * @throws FetchError<401, types.UpdateCustomerFiscalEntitiesResponse401> authentication error
     * @throws FetchError<404, types.UpdateCustomerFiscalEntitiesResponse404> not found entity
     * @throws FetchError<422, types.UpdateCustomerFiscalEntitiesResponse422> parameter validation error
     * @throws FetchError<500, types.UpdateCustomerFiscalEntitiesResponse500> internal server error
     */
    SDK.prototype.updateCustomerFiscalEntities = function (body, metadata) {
        return this.core.fetch('/customers/{id}/fiscal_entities/{fiscal_entities_id}', 'put', body, metadata);
    };
    /**
     * Get discount lines for an existing orden
     *
     * @summary Get a List of Discount
     * @throws FetchError<401, types.OrdersGetDiscountLinesResponse401> authentication error
     * @throws FetchError<500, types.OrdersGetDiscountLinesResponse500> internal server error
     */
    SDK.prototype.ordersGetDiscountLines = function (metadata) {
        return this.core.fetch('/orders/{id}/discount_lines', 'get', metadata);
    };
    /**
     * Create discount lines for an existing orden
     *
     * @summary Create Discount
     * @throws FetchError<401, types.OrdersCreateDiscountLineResponse401> authentication error
     * @throws FetchError<404, types.OrdersCreateDiscountLineResponse404> not found entity
     * @throws FetchError<500, types.OrdersCreateDiscountLineResponse500> internal server error
     */
    SDK.prototype.ordersCreateDiscountLine = function (body, metadata) {
        return this.core.fetch('/orders/{id}/discount_lines', 'post', body, metadata);
    };
    /**
     * Delete an existing discount lines for an existing orden
     *
     * @summary Delete Discount
     * @throws FetchError<401, types.OrdersDeleteDiscountLinesResponse401> authentication error
     * @throws FetchError<404, types.OrdersDeleteDiscountLinesResponse404> not found entity
     * @throws FetchError<422, types.OrdersDeleteDiscountLinesResponse422> parameter validation error
     * @throws FetchError<500, types.OrdersDeleteDiscountLinesResponse500> internal server error
     */
    SDK.prototype.ordersDeleteDiscountLines = function (metadata) {
        return this.core.fetch('/orders/{id}/discount_lines/{discount_lines_id}', 'delete', metadata);
    };
    /**
     * Get an existing discount lines for an existing orden
     *
     * @summary Get Discount
     * @throws FetchError<401, types.OrdersGetDiscountLineResponse401> authentication error
     * @throws FetchError<404, types.OrdersGetDiscountLineResponse404> not found entity
     * @throws FetchError<422, types.OrdersGetDiscountLineResponse422> parameter validation error
     * @throws FetchError<500, types.OrdersGetDiscountLineResponse500> internal server error
     */
    SDK.prototype.ordersGetDiscountLine = function (metadata) {
        return this.core.fetch('/orders/{id}/discount_lines/{discount_lines_id}', 'get', metadata);
    };
    /**
     * Update an existing discount lines for an existing orden
     *
     * @summary Update Discount
     * @throws FetchError<401, types.OrdersUpdateDiscountLinesResponse401> authentication error
     * @throws FetchError<404, types.OrdersUpdateDiscountLinesResponse404> not found entity
     * @throws FetchError<422, types.OrdersUpdateDiscountLinesResponse422> parameter validation error
     * @throws FetchError<500, types.OrdersUpdateDiscountLinesResponse500> internal server error
     */
    SDK.prototype.ordersUpdateDiscountLines = function (body, metadata) {
        return this.core.fetch('/orders/{id}/discount_lines/{discount_lines_id}', 'put', body, metadata);
    };
    /**
     * Get list of Events
     *
     * @throws FetchError<401, types.GetEventsResponse401> authentication error
     * @throws FetchError<500, types.GetEventsResponse500> internal server error
     */
    SDK.prototype.getEvents = function (metadata) {
        return this.core.fetch('/events', 'get', metadata);
    };
    /**
     * Returns a single event
     *
     * @summary Get Event
     * @throws FetchError<401, types.GetEventResponse401> authentication error
     * @throws FetchError<404, types.GetEventResponse404> not found entity
     * @throws FetchError<500, types.GetEventResponse500> internal server error
     */
    SDK.prototype.getEvent = function (metadata) {
        return this.core.fetch('/events/{id}', 'get', metadata);
    };
    /**
     * Try to send an event
     *
     * @summary Resend Event
     * @throws FetchError<401, types.ResendEventResponse401> authentication error
     * @throws FetchError<404, types.ResendEventResponse404> not found entity
     * @throws FetchError<500, types.ResendEventResponse500> internal server error
     */
    SDK.prototype.resendEvent = function (metadata) {
        return this.core.fetch('/events/{event_id}/webhook_logs/{webhook_log_id}/resend', 'post', metadata);
    };
    /**
     * Get log details in the form of a list
     *
     * @summary Get List Of Logs
     * @throws FetchError<401, types.GetLogsResponse401> authentication error
     * @throws FetchError<500, types.GetLogsResponse500> internal server error
     */
    SDK.prototype.getLogs = function (metadata) {
        return this.core.fetch('/logs', 'get', metadata);
    };
    /**
     * Get the details of a specific log
     *
     * @summary Get Log
     * @throws FetchError<401, types.GetLogByIdResponse401> authentication error
     * @throws FetchError<404, types.GetLogByIdResponse404> not found entity
     * @throws FetchError<500, types.GetLogByIdResponse500> internal server error
     */
    SDK.prototype.getLogById = function (metadata) {
        return this.core.fetch('/logs/{id}', 'get', metadata);
    };
    /**
     * Get order details in the form of a list
     *
     * @summary Get a list of Orders
     * @throws FetchError<401, types.GetOrdersResponse401> authentication error
     * @throws FetchError<500, types.GetOrdersResponse500> internal server error
     */
    SDK.prototype.getOrders = function (metadata) {
        return this.core.fetch('/orders', 'get', metadata);
    };
    /**
     * Create a new order.
     *
     * @summary Create order
     * @throws FetchError<401, types.CreateOrderResponse401> authentication error
     * @throws FetchError<402, types.CreateOrderResponse402> payment required error
     * @throws FetchError<422, types.CreateOrderResponse422> parameter validation error
     * @throws FetchError<500, types.CreateOrderResponse500> internal server error
     */
    SDK.prototype.createOrder = function (body, metadata) {
        return this.core.fetch('/orders', 'post', body, metadata);
    };
    /**
     * Info for a specific order
     *
     * @summary Get Order
     * @throws FetchError<401, types.GetOrderByIdResponse401> authentication error
     * @throws FetchError<404, types.GetOrderByIdResponse404> not found entity
     * @throws FetchError<500, types.GetOrderByIdResponse500> internal server error
     */
    SDK.prototype.getOrderById = function (metadata) {
        return this.core.fetch('/orders/{id}', 'get', metadata);
    };
    /**
     * Update an existing Order.
     *
     * @summary Update Order
     * @throws FetchError<401, types.UpdateOrderResponse401> authentication error
     * @throws FetchError<404, types.UpdateOrderResponse404> not found entity
     * @throws FetchError<422, types.UpdateOrderResponse422> parameter validation error
     * @throws FetchError<500, types.UpdateOrderResponse500> internal server error
     */
    SDK.prototype.updateOrder = function (body, metadata) {
        return this.core.fetch('/orders/{id}', 'put', body, metadata);
    };
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
    SDK.prototype.cancelOrder = function (metadata) {
        return this.core.fetch('/orders/{id}/cancel', 'post', metadata);
    };
    /**
     * Processes an order that has been previously authorized.
     *
     * @summary Capture Order
     * @throws FetchError<401, types.OrdersCreateCaptureResponse401> authentication error
     * @throws FetchError<404, types.OrdersCreateCaptureResponse404> not found entity
     * @throws FetchError<428, types.OrdersCreateCaptureResponse428> Precondition Required
     * @throws FetchError<500, types.OrdersCreateCaptureResponse500> internal server error
     */
    SDK.prototype.ordersCreateCapture = function (body, metadata) {
        return this.core.fetch('/orders/{id}/capture', 'post', body, metadata);
    };
    /**
     * Create a new product for an existing order.
     *
     * @summary Create Product
     * @throws FetchError<401, types.OrdersCreateProductResponse401> authentication error
     * @throws FetchError<404, types.OrdersCreateProductResponse404> not found entity
     * @throws FetchError<500, types.OrdersCreateProductResponse500> internal server error
     */
    SDK.prototype.ordersCreateProduct = function (body, metadata) {
        return this.core.fetch('/orders/{id}/line_items', 'post', body, metadata);
    };
    /**
     * Delete product for an existing orden
     *
     * @summary Delete Product
     * @throws FetchError<401, types.OrdersDeleteProductResponse401> authentication error
     * @throws FetchError<404, types.OrdersDeleteProductResponse404> not found entity
     * @throws FetchError<422, types.OrdersDeleteProductResponse422> parameter validation error
     * @throws FetchError<500, types.OrdersDeleteProductResponse500> internal server error
     */
    SDK.prototype.ordersDeleteProduct = function (metadata) {
        return this.core.fetch('/orders/{id}/line_items/{line_item_id}', 'delete', metadata);
    };
    /**
     * Update an existing product for an existing orden
     *
     * @summary Update Product
     * @throws FetchError<401, types.OrdersUpdateProductResponse401> authentication error
     * @throws FetchError<404, types.OrdersUpdateProductResponse404> not found entity
     * @throws FetchError<422, types.OrdersUpdateProductResponse422> parameter validation error
     * @throws FetchError<500, types.OrdersUpdateProductResponse500> internal server error
     */
    SDK.prototype.ordersUpdateProduct = function (body, metadata) {
        return this.core.fetch('/orders/{id}/line_items/{line_item_id}', 'put', body, metadata);
    };
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
    SDK.prototype.orderRefund = function (body, metadata) {
        return this.core.fetch('/orders/{id}/refunds', 'post', body, metadata);
    };
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
    SDK.prototype.orderCancelRefund = function (metadata) {
        return this.core.fetch('/orders/{id}/refunds/{refund_id}', 'delete', metadata);
    };
    /**
     * Get Payout order details in the form of a list
     *
     * @summary Get a list of Payout Orders
     * @throws FetchError<401, types.GetPayoutOrdersResponse401> authentication error
     * @throws FetchError<500, types.GetPayoutOrdersResponse500> internal server error
     */
    SDK.prototype.getPayoutOrders = function (metadata) {
        return this.core.fetch('/payout_orders', 'get', metadata);
    };
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
    SDK.prototype.createPayoutOrder = function (body, metadata) {
        return this.core.fetch('/payout_orders', 'post', body, metadata);
    };
    /**
     * Gets a payout Order resource that corresponds to a payout order ID.
     *
     * @summary Get Payout Order
     * @throws FetchError<401, types.GetPayoutOrderByIdResponse401> authentication error
     * @throws FetchError<404, types.GetPayoutOrderByIdResponse404> not found entity
     * @throws FetchError<500, types.GetPayoutOrderByIdResponse500> internal server error
     */
    SDK.prototype.getPayoutOrderById = function (metadata) {
        return this.core.fetch('/payout_orders/{id}', 'get', metadata);
    };
    /**
     * Returns a list of links generated by the merchant
     *
     * @summary Get a list of payment links
     * @throws FetchError<401, types.GetCheckoutsResponse401> authentication error
     * @throws FetchError<402, types.GetCheckoutsResponse402> payment required error
     * @throws FetchError<422, types.GetCheckoutsResponse422> parameter validation error
     * @throws FetchError<500, types.GetCheckoutsResponse500> internal server error
     */
    SDK.prototype.getCheckouts = function (metadata) {
        return this.core.fetch('/checkouts', 'get', metadata);
    };
    /**
     * Create Unique Payment Link
     *
     * @throws FetchError<401, types.CreateCheckoutResponse401> authentication error
     * @throws FetchError<402, types.CreateCheckoutResponse402> payment required error
     * @throws FetchError<422, types.CreateCheckoutResponse422> parameter validation error
     * @throws FetchError<500, types.CreateCheckoutResponse500> internal server error
     */
    SDK.prototype.createCheckout = function (body, metadata) {
        return this.core.fetch('/checkouts', 'post', body, metadata);
    };
    /**
     * Get a payment link by ID
     *
     * @throws FetchError<401, types.GetCheckoutResponse401> authentication error
     * @throws FetchError<402, types.GetCheckoutResponse402> payment required error
     * @throws FetchError<404, types.GetCheckoutResponse404> not found entity
     * @throws FetchError<422, types.GetCheckoutResponse422> parameter validation error
     * @throws FetchError<500, types.GetCheckoutResponse500> internal server error
     */
    SDK.prototype.getCheckout = function (metadata) {
        return this.core.fetch('/checkouts/{id}', 'get', metadata);
    };
    /**
     * Cancel Payment Link
     *
     * @throws FetchError<401, types.CancelCheckoutResponse401> authentication error
     * @throws FetchError<402, types.CancelCheckoutResponse402> payment required error
     * @throws FetchError<404, types.CancelCheckoutResponse404> not found entity
     * @throws FetchError<422, types.CancelCheckoutResponse422> parameter validation error
     * @throws FetchError<500, types.CancelCheckoutResponse500> internal server error
     */
    SDK.prototype.cancelCheckout = function (metadata) {
        return this.core.fetch('/checkouts/{id}/cancel', 'put', metadata);
    };
    /**
     * Send an email
     *
     * @throws FetchError<401, types.EmailCheckoutResponse401> authentication error
     * @throws FetchError<402, types.EmailCheckoutResponse402> payment required error
     * @throws FetchError<404, types.EmailCheckoutResponse404> not found entity
     * @throws FetchError<422, types.EmailCheckoutResponse422> parameter validation error
     * @throws FetchError<500, types.EmailCheckoutResponse500> internal server error
     */
    SDK.prototype.emailCheckout = function (body, metadata) {
        return this.core.fetch('/checkouts/{id}/email', 'post', body, metadata);
    };
    /**
     * Send an sms
     *
     * @throws FetchError<401, types.SmsCheckoutResponse401> authentication error
     * @throws FetchError<402, types.SmsCheckoutResponse402> payment required error
     * @throws FetchError<404, types.SmsCheckoutResponse404> not found entity
     * @throws FetchError<422, types.SmsCheckoutResponse422> parameter validation error
     * @throws FetchError<500, types.SmsCheckoutResponse500> internal server error
     */
    SDK.prototype.smsCheckout = function (body, metadata) {
        return this.core.fetch('/checkouts/{id}/sms', 'post', body, metadata);
    };
    /**
     * Get a list of Payment Methods
     *
     * @summary Get Payment Methods
     * @throws FetchError<401, types.GetCustomerPaymentMethodsResponse401> authentication error
     * @throws FetchError<404, types.GetCustomerPaymentMethodsResponse404> not found entity
     * @throws FetchError<500, types.GetCustomerPaymentMethodsResponse500> internal server error
     */
    SDK.prototype.getCustomerPaymentMethods = function (metadata) {
        return this.core.fetch('/customers/{id}/payment_sources', 'get', metadata);
    };
    /**
     * Create a payment method for a customer.
     *
     * @summary Create Payment Method
     * @throws FetchError<401, types.CreateCustomerPaymentMethodsResponse401> authentication error
     * @throws FetchError<404, types.CreateCustomerPaymentMethodsResponse404> not found entity
     * @throws FetchError<422, types.CreateCustomerPaymentMethodsResponse422> parameter validation error
     * @throws FetchError<500, types.CreateCustomerPaymentMethodsResponse500> internal server error
     */
    SDK.prototype.createCustomerPaymentMethods = function (body, metadata) {
        return this.core.fetch('/customers/{id}/payment_sources', 'post', body, metadata);
    };
    /**
     * Delete an existing payment method
     *
     * @summary Delete Payment Method
     * @throws FetchError<401, types.DeleteCustomerPaymentMethodsResponse401> authentication error
     * @throws FetchError<404, types.DeleteCustomerPaymentMethodsResponse404> not found entity
     * @throws FetchError<422, types.DeleteCustomerPaymentMethodsResponse422> parameter validation error
     * @throws FetchError<500, types.DeleteCustomerPaymentMethodsResponse500> internal server error
     */
    SDK.prototype.deleteCustomerPaymentMethods = function (metadata) {
        return this.core.fetch('/customers/{id}/payment_sources/{payment_method_id}', 'delete', metadata);
    };
    /**
     * Gets a payment Method that corresponds to a customer ID.
     *
     * @summary Update Payment Method
     * @throws FetchError<401, types.UpdateCustomerPaymentMethodsResponse401> authentication error
     * @throws FetchError<404, types.UpdateCustomerPaymentMethodsResponse404> not found entity
     * @throws FetchError<422, types.UpdateCustomerPaymentMethodsResponse422> parameter validation error
     * @throws FetchError<500, types.UpdateCustomerPaymentMethodsResponse500> internal server error
     */
    SDK.prototype.updateCustomerPaymentMethods = function (body, metadata) {
        return this.core.fetch('/customers/{id}/payment_sources/{payment_method_id}', 'put', body, metadata);
    };
    /**
     * Get A List of Plans
     *
     * @throws FetchError<401, types.GetPlansResponse401> authentication error
     * @throws FetchError<422, types.GetPlansResponse422> parameter validation error
     * @throws FetchError<500, types.GetPlansResponse500> internal server error
     */
    SDK.prototype.getPlans = function (metadata) {
        return this.core.fetch('/plans', 'get', metadata);
    };
    /**
     * Create a new plan for an existing order
     *
     * @summary Create Plan
     * @throws FetchError<401, types.CreatePlanResponse401> authentication error
     * @throws FetchError<422, types.CreatePlanResponse422> parameter validation error
     * @throws FetchError<500, types.CreatePlanResponse500> internal server error
     */
    SDK.prototype.createPlan = function (body, metadata) {
        return this.core.fetch('/plans', 'post', body, metadata);
    };
    /**
     * Delete Plan
     *
     * @throws FetchError<401, types.DeletePlanResponse401> authentication error
     * @throws FetchError<404, types.DeletePlanResponse404> not found entity
     * @throws FetchError<422, types.DeletePlanResponse422> parameter validation error
     * @throws FetchError<500, types.DeletePlanResponse500> internal server error
     */
    SDK.prototype.deletePlan = function (metadata) {
        return this.core.fetch('/plans/{id}', 'delete', metadata);
    };
    /**
     * Get Plan
     *
     * @throws FetchError<401, types.GetPlanResponse401> authentication error
     * @throws FetchError<404, types.GetPlanResponse404> not found entity
     * @throws FetchError<422, types.GetPlanResponse422> parameter validation error
     * @throws FetchError<500, types.GetPlanResponse500> internal server error
     */
    SDK.prototype.getPlan = function (metadata) {
        return this.core.fetch('/plans/{id}', 'get', metadata);
    };
    /**
     * Update Plan
     *
     * @throws FetchError<401, types.UpdatePlanResponse401> authentication error
     * @throws FetchError<404, types.UpdatePlanResponse404> not found entity
     * @throws FetchError<422, types.UpdatePlanResponse422> parameter validation error
     * @throws FetchError<500, types.UpdatePlanResponse500> internal server error
     */
    SDK.prototype.updatePlan = function (body, metadata) {
        return this.core.fetch('/plans/{id}', 'put', body, metadata);
    };
    /**
     * Create new shipping for an existing orden
     *
     * @summary Create Shipping
     * @throws FetchError<401, types.OrdersCreateShippingResponse401> authentication error
     * @throws FetchError<404, types.OrdersCreateShippingResponse404> not found entity
     * @throws FetchError<500, types.OrdersCreateShippingResponse500> internal server error
     */
    SDK.prototype.ordersCreateShipping = function (body, metadata) {
        return this.core.fetch('/orders/{id}/shipping_lines', 'post', body, metadata);
    };
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
    SDK.prototype.ordersDeleteShipping = function (metadata) {
        return this.core.fetch('/orders/{id}/shipping_lines/{shipping_id}', 'delete', metadata);
    };
    /**
     * Update existing shipping for an existing orden
     *
     * @summary Update Shipping
     * @throws FetchError<401, types.OrdersUpdateShippingResponse401> authentication error
     * @throws FetchError<404, types.OrdersUpdateShippingResponse404> not found entity
     * @throws FetchError<422, types.OrdersUpdateShippingResponse422> parameter validation error
     * @throws FetchError<500, types.OrdersUpdateShippingResponse500> internal server error
     */
    SDK.prototype.ordersUpdateShipping = function (body, metadata) {
        return this.core.fetch('/orders/{id}/shipping_lines/{shipping_id}', 'put', body, metadata);
    };
    /**
     * Create a shipping contacts for a customer.
     *
     * @summary Create a shipping contacts
     * @throws FetchError<401, types.CreateCustomerShippingContactsResponse401> authentication error
     * @throws FetchError<404, types.CreateCustomerShippingContactsResponse404> not found entity
     * @throws FetchError<422, types.CreateCustomerShippingContactsResponse422> parameter validation error
     * @throws FetchError<500, types.CreateCustomerShippingContactsResponse500> internal server error
     */
    SDK.prototype.createCustomerShippingContacts = function (body, metadata) {
        return this.core.fetch('/customers/{id}/shipping_contacts', 'post', body, metadata);
    };
    /**
     * Delete shipping contact that corresponds to a customer ID.
     *
     * @summary Delete shipping contacts
     * @throws FetchError<401, types.DeleteCustomerShippingContactsResponse401> authentication error
     * @throws FetchError<404, types.DeleteCustomerShippingContactsResponse404> not found entity
     * @throws FetchError<422, types.DeleteCustomerShippingContactsResponse422> parameter validation error
     * @throws FetchError<500, types.DeleteCustomerShippingContactsResponse500> internal server error
     */
    SDK.prototype.deleteCustomerShippingContacts = function (metadata) {
        return this.core.fetch('/customers/{id}/shipping_contacts/{shipping_contacts_id}', 'delete', metadata);
    };
    /**
     * Update shipping contact that corresponds to a customer ID.
     *
     * @summary Update shipping contacts
     * @throws FetchError<401, types.UpdateCustomerShippingContactsResponse401> authentication error
     * @throws FetchError<404, types.UpdateCustomerShippingContactsResponse404> not found entity
     * @throws FetchError<422, types.UpdateCustomerShippingContactsResponse422> parameter validation error
     * @throws FetchError<500, types.UpdateCustomerShippingContactsResponse500> internal server error
     */
    SDK.prototype.updateCustomerShippingContacts = function (body, metadata) {
        return this.core.fetch('/customers/{id}/shipping_contacts/{shipping_contacts_id}', 'put', body, metadata);
    };
    /**
     * Get Subscription
     *
     * @throws FetchError<401, types.GetSubscriptionResponse401> authentication error
     * @throws FetchError<404, types.GetSubscriptionResponse404> not found entity
     * @throws FetchError<500, types.GetSubscriptionResponse500> internal server error
     */
    SDK.prototype.getSubscription = function (metadata) {
        return this.core.fetch('/customers/{id}/subscription', 'get', metadata);
    };
    /**
     * You can create the subscription to include the plans that your customers consume
     *
     * @summary Create Subscription
     * @throws FetchError<401, types.CreateSubscriptionResponse401> authentication error
     * @throws FetchError<404, types.CreateSubscriptionResponse404> not found entity
     * @throws FetchError<422, types.CreateSubscriptionResponse422> parameter validation error
     * @throws FetchError<500, types.CreateSubscriptionResponse500> internal server error
     */
    SDK.prototype.createSubscription = function (body, metadata) {
        return this.core.fetch('/customers/{id}/subscription', 'post', body, metadata);
    };
    /**
     * You can modify the subscription to change the plans that your customers consume
     *
     * @summary Update Subscription
     * @throws FetchError<401, types.UpdateSubscriptionResponse401> authentication error
     * @throws FetchError<404, types.UpdateSubscriptionResponse404> not found entity
     * @throws FetchError<422, types.UpdateSubscriptionResponse422> parameter validation error
     * @throws FetchError<500, types.UpdateSubscriptionResponse500> internal server error
     */
    SDK.prototype.updateSubscription = function (body, metadata) {
        return this.core.fetch('/customers/{id}/subscription', 'put', body, metadata);
    };
    /**
     * You can cancel the subscription to stop the plans that your customers consume
     *
     * @summary Cancel Subscription
     * @throws FetchError<401, types.CancelSubscriptionResponse401> authentication error
     * @throws FetchError<404, types.CancelSubscriptionResponse404> not found entity
     * @throws FetchError<500, types.CancelSubscriptionResponse500> internal server error
     */
    SDK.prototype.cancelSubscription = function (metadata) {
        return this.core.fetch('/customers/{id}/subscription/cancel', 'post', metadata);
    };
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
    SDK.prototype.getAllEventsFromSubscription = function (metadata) {
        return this.core.fetch('/customers/{id}/subscription/events', 'get', metadata);
    };
    /**
     * You can pause the subscription to stop the plans that your customers consume
     *
     * @summary Pause Subscription
     * @throws FetchError<401, types.PauseSubscriptionResponse401> authentication error
     * @throws FetchError<402, types.PauseSubscriptionResponse402> payment required error
     * @throws FetchError<404, types.PauseSubscriptionResponse404> not found entity
     * @throws FetchError<500, types.PauseSubscriptionResponse500> internal server error
     */
    SDK.prototype.pauseSubscription = function (metadata) {
        return this.core.fetch('/customers/{id}/subscription/pause', 'post', metadata);
    };
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
    SDK.prototype.resumeSubscription = function (metadata) {
        return this.core.fetch('/customers/{id}/subscription/resume', 'post', metadata);
    };
    /**
     * Create new taxes for an existing orden
     *
     * @summary Create Tax
     * @throws FetchError<401, types.OrdersCreateTaxesResponse401> authentication error
     * @throws FetchError<404, types.OrdersCreateTaxesResponse404> not found entity
     * @throws FetchError<500, types.OrdersCreateTaxesResponse500> internal server error
     */
    SDK.prototype.ordersCreateTaxes = function (body, metadata) {
        return this.core.fetch('/orders/{id}/tax_lines', 'post', body, metadata);
    };
    /**
     * Delete taxes for an existing orden
     *
     * @summary Delete Tax
     * @throws FetchError<401, types.OrdersDeleteTaxesResponse401> authentication error
     * @throws FetchError<404, types.OrdersDeleteTaxesResponse404> not found entity
     * @throws FetchError<422, types.OrdersDeleteTaxesResponse422> parameter validation error
     * @throws FetchError<500, types.OrdersDeleteTaxesResponse500> internal server error
     */
    SDK.prototype.ordersDeleteTaxes = function (metadata) {
        return this.core.fetch('/orders/{id}/tax_lines/{tax_id}', 'delete', metadata);
    };
    /**
     * Update taxes for an existing orden
     *
     * @summary Update Tax
     * @throws FetchError<401, types.OrdersUpdateTaxesResponse401> authentication error
     * @throws FetchError<404, types.OrdersUpdateTaxesResponse404> not found entity
     * @throws FetchError<422, types.OrdersUpdateTaxesResponse422> parameter validation error
     * @throws FetchError<500, types.OrdersUpdateTaxesResponse500> internal server error
     */
    SDK.prototype.ordersUpdateTaxes = function (body, metadata) {
        return this.core.fetch('/orders/{id}/tax_lines/{tax_id}', 'put', body, metadata);
    };
    /**
     * Generate a payment token, to associate it with a card
     *
     *
     * @summary Create Token
     * @throws FetchError<401, types.CreateTokenResponse401> authentication error
     * @throws FetchError<422, types.CreateTokenResponse422> parameter validation error
     * @throws FetchError<500, types.CreateTokenResponse500> internal server error
     */
    SDK.prototype.createToken = function (body, metadata) {
        return this.core.fetch('/tokens', 'post', body, metadata);
    };
    /**
     * Get transaction details in the form of a list
     *
     * @summary Get List transactions
     * @throws FetchError<401, types.GetTransactionsResponse401> authentication error
     * @throws FetchError<500, types.GetTransactionsResponse500> internal server error
     */
    SDK.prototype.getTransactions = function (metadata) {
        return this.core.fetch('/transactions', 'get', metadata);
    };
    /**
     * Get the details of a transaction
     *
     * @summary Get transaction
     * @throws FetchError<401, types.GetTransactionResponse401> authentication error
     * @throws FetchError<404, types.GetTransactionResponse404> authentication error
     * @throws FetchError<500, types.GetTransactionResponse500> internal server error
     */
    SDK.prototype.getTransaction = function (metadata) {
        return this.core.fetch('/transactions/{id}', 'get', metadata);
    };
    /**
     * Get transfers details in the form of a list
     *
     * @summary Get a list of transfers
     * @throws FetchError<401, types.GetTransfersResponse401> authentication error
     * @throws FetchError<500, types.GetTransfersResponse500> internal server error
     */
    SDK.prototype.getTransfers = function (metadata) {
        return this.core.fetch('/transfers', 'get', metadata);
    };
    /**
     * Get the details of a Transfer
     *
     * @summary Get Transfer
     * @throws FetchError<401, types.GetTransferResponse401> authentication error
     * @throws FetchError<404, types.GetTransferResponse404> authentication error
     * @throws FetchError<500, types.GetTransferResponse500> internal server error
     */
    SDK.prototype.getTransfer = function (metadata) {
        return this.core.fetch('/transfers/{id}', 'get', metadata);
    };
    /**
     * Consume the list of webhook keys you have
     *
     * @summary Get List of Webhook Keys
     * @throws FetchError<401, types.GetWebhookKeysResponse401> authentication error
     * @throws FetchError<500, types.GetWebhookKeysResponse500> internal server error
     */
    SDK.prototype.getWebhookKeys = function (metadata) {
        return this.core.fetch('/webhook_keys', 'get', metadata);
    };
    /**
     * Create a webhook key
     *
     * @summary Create Webhook Key
     * @throws FetchError<401, types.CreateWebhookKeyResponse401> authentication error
     * @throws FetchError<500, types.CreateWebhookKeyResponse500> internal server error
     */
    SDK.prototype.createWebhookKey = function (body, metadata) {
        return this.core.fetch('/webhook_keys', 'post', body, metadata);
    };
    /**
     * Delete Webhook key
     *
     * @throws FetchError<401, types.DeleteWebhookKeyResponse401> authentication error
     * @throws FetchError<404, types.DeleteWebhookKeyResponse404> not found entity
     * @throws FetchError<500, types.DeleteWebhookKeyResponse500> internal server error
     */
    SDK.prototype.deleteWebhookKey = function (metadata) {
        return this.core.fetch('/webhook_keys/{id}', 'delete', metadata);
    };
    /**
     * Get Webhook Key
     *
     * @throws FetchError<401, types.GetWebhookKeyResponse401> authentication error
     * @throws FetchError<404, types.GetWebhookKeyResponse404> not found entity
     * @throws FetchError<500, types.GetWebhookKeyResponse500> internal server error
     */
    SDK.prototype.getWebhookKey = function (metadata) {
        return this.core.fetch('/webhook_keys/{id}', 'get', metadata);
    };
    SDK.prototype.updateWebhookKey = function (body, metadata) {
        return this.core.fetch('/webhook_keys/{id}', 'put', body, metadata);
    };
    /**
     * Consume the list of webhooks you have, each environment supports 10 webhooks (For
     * production and testing)
     *
     * @summary Get List of Webhooks
     * @throws FetchError<401, types.GetWebhooksResponse401> authentication error
     * @throws FetchError<500, types.GetWebhooksResponse500> internal server error
     */
    SDK.prototype.getWebhooks = function (metadata) {
        return this.core.fetch('/webhooks', 'get', metadata);
    };
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
    SDK.prototype.createWebhook = function (body, metadata) {
        return this.core.fetch('/webhooks', 'post', body, metadata);
    };
    /**
     * Delete Webhook
     *
     * @throws FetchError<401, types.DeleteWebhookResponse401> authentication error
     * @throws FetchError<404, types.DeleteWebhookResponse404> not found entity
     * @throws FetchError<500, types.DeleteWebhookResponse500> internal server error
     */
    SDK.prototype.deleteWebhook = function (metadata) {
        return this.core.fetch('/webhooks/{id}', 'delete', metadata);
    };
    /**
     * Get Webhook
     *
     * @throws FetchError<401, types.GetWebhookResponse401> authentication error
     * @throws FetchError<404, types.GetWebhookResponse404> not found entity
     * @throws FetchError<500, types.GetWebhookResponse500> internal server error
     */
    SDK.prototype.getWebhook = function (metadata) {
        return this.core.fetch('/webhooks/{id}', 'get', metadata);
    };
    /**
     * updates an existing webhook
     *
     * @summary Update Webhook
     * @throws FetchError<401, types.UpdateWebhookResponse401> authentication error
     * @throws FetchError<404, types.UpdateWebhookResponse404> not found entity
     * @throws FetchError<500, types.UpdateWebhookResponse500> internal server error
     */
    SDK.prototype.updateWebhook = function (body, metadata) {
        return this.core.fetch('/webhooks/{id}', 'put', body, metadata);
    };
    /**
     * Send a webhook.ping event
     *
     * @summary Test Webhook
     * @throws FetchError<401, types.TestWebhookResponse401> authentication error
     * @throws FetchError<404, types.TestWebhookResponse404> not found entity
     * @throws FetchError<500, types.TestWebhookResponse500> internal server error
     */
    SDK.prototype.testWebhook = function (metadata) {
        return this.core.fetch('/webhooks/{id}/test', 'post', metadata);
    };
    return SDK;
}());
var createSDK = (function () { return new SDK(); })();
module.exports = createSDK;
