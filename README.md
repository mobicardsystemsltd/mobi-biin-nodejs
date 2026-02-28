# BIIN / BIN Lookup API
## MobiBiin by MobiCard
### NodeJS

Use this API to retrieve detailed card issuer information using the Bank Identification Number (BIN/IIN). Identify card schemes, issuer banks, card types, and geographical information for risk management, fraud prevention, and payment processing optimization.

Get instant access to comprehensive card metadata including issuer bank details, card scheme, card type, country information, and prepaid status. Perfect for fraud screening, payment routing decisions, and customer experience enhancement.

### BIIN Lookup API Overview

Retrieve comprehensive card issuer information using the first 6-8 digits (BIN/IIN) of a payment card. The API returns detailed metadata about the card issuer, card type, and geographical information.

### BIIN Lookup Implementation

Generate a signed JWT token with embedded request.

Send card BIN/BIIN (first 6-8 digits) or full card number to receive comprehensive issuer information.

### Success Response Format

The BIIN Lookup API returns comprehensive card issuer information upon successful lookup.

```json
{
  "status": "SUCCESS",
  "status_code": "200",
  "status_message": "SUCCESS",
  "mobicard_card_biin": "5173350006475601",
  "mobicard_txn_reference": "287972875",
  "timestamp": "2026-01-27 14:21:52",
  "card_biin_information": {
    "card_biin_flag": 1,
    "card_biin_number": "51733500",
    "card_biin_scheme": "MASTERCARD",
    "card_biin_prefix": "",
    "card_biin_type": "PREPAID",
    "card_biin_brand": "Mastercard Prepaid General Spend",
    "card_biin_prepaid": "Yes",
    "card_biin_bank_name": "KCB BANK KENYA LIMITED",
    "card_biin_bank_url": "",
    "card_biin_bank_city": "",
    "card_biin_bank_phone": "",
    "card_biin_bank_logo": "",
    "card_biin_country_two_letter_code": "",
    "card_biin_country_name": "KENYA",
    "card_biin_country_numeric": "404",
    "card_biin_risk_flag": 0
  }
}
```
### Response Fields Explanation:

    * status: Always "SUCCESS" or "FAILED" - use this to determine subsequent actions
    * status_code: HTTP status code (200 for success)
    * card_biin_information.card_biin_scheme: Card network (VISA, MASTERCARD, etc.)
    * card_biin_information.card_biin_bank_name: Issuing bank name
    * card_biin_information.card_biin_type: Card type (PREPAID, DEBIT, CREDIT)
    * card_biin_information.card_biin_prepaid: "Yes" if prepaid card, otherwise empty
    * card_biin_information.card_biin_country_name: Issuing country
    * card_biin_information.card_biin_flag: 1 if BIN found, 0 if not found
    * card_biin_information.card_biin_risk_flag: 1 if BIN is flagged as high risk, 0 if not

### Error Response Format

Error responses have a simplified format with only 3 fields of essential information.

Use the "status" field to determine if any API request is successful or not. The value is always either "SUCCESS" or "FAILED".
```json
{
  "status": "FAILED",
  "status_code": "400",
  "status_message": "BAD REQUEST"
}
```
### Status Codes Reference

Complete list of status codes returned by the API.

| Status Code | Status | Status Message Interpretation | Action Required |
| :--- | :--- | :--- | :--- |
| **200** | `SUCCESS` | SUCCESS | Process the response data |
| **400** | `FAILED` | BAD REQUEST - Invalid parameters or malformed request | Check request parameters |
| **429** | `FAILED` | TOO MANY REQUESTS - Rate limit exceeded | Wait before making more requests |
| **250** | `FAILED` | INSUFFICIENT TOKENS - Token account balance insufficient | Top up your account |
| **500** | `FAILED` | UNAVAILABLE - Server error | Try again later or contact support |
| **430** | `FAILED` | TIMEOUT - Request timed out | Issue new token and retry |

### API Request Parameters Reference

Complete reference of all request parameters used in the BIIN Lookup API.

| Parameter | Required | Description | Example Value | Notes |
| :--- | :---: | :--- | :--- | :--- |
| `mobicard_version` | **Yes** | API version | `"2.0"` | Fixed value |
| `mobicard_mode` | **Yes** | Environment mode | `"TEST"` or `"LIVE"` | Use `TEST` for development |
| `mobicard_merchant_id` | **Yes** | Your merchant ID | `""` | Provided by MobiCard |
| `mobicard_api_key` | **Yes** | Your API key | `""` | Provided by MobiCard |
| `mobicard_secret_key` | **Yes** | Your secret key | `""` | Provided by MobiCard |
| `mobicard_service_id` | **Yes** | Service ID | `"20000"` | Fixed value for card services |
| `mobicard_service_type` | **Yes** | Service type | `"BIINLOOKUP"` | Fixed value |
| `mobicard_token_id` | **Yes** | Unique token identifier | `String/number` | Must be unique per request |
| `mobicard_txn_reference` | **Yes** | Your transaction reference | `String/number` | Your internal reference |
| `mobicard_card_biin` | **Yes** | Card BIN/BIIN or card number | `"51733500"` | 6-8 digits or full card number |

### API Response Parameters Reference

Complete reference of all response parameters returned by the API.

The value for the "status" response parameter is always either "SUCCESS" or "FAILED". Use this to determine subsequent actions.

| Parameter | Always Returned | Description | Example Value |
| :--- | :---: | :--- | :--- |
| `status` | **Yes** | Transaction status | `"SUCCESS"` or `"FAILED"` |
| `status_code` | **Yes** | HTTP status code | `"200"` |
| `status_message` | **Yes** | Status description | `"SUCCESS"` |
| `mobicard_card_biin` | **Yes** | Original BIN/BIIN/card number from request | `"5173350006475601"` |
| `mobicard_txn_reference` | **Yes** | Your original transaction reference | `"287972875"` |
| `timestamp` | **Yes** | Response timestamp | `"2026-01-27 14:21:52"` |
| `card_biin_information.card_biin_flag` | **Yes** | `1` if BIN found, `0` if not found | `1` |
| `card_biin_information.card_biin_number` | **Yes** | 8-digit BIIN used for lookup | `"51733500"` |
| `card_biin_information.card_biin_scheme` | **Yes** | Card network scheme | `"MASTERCARD"` |
| `card_biin_information.card_biin_prefix` | **Yes** | Card prefix (if available) | `""` |
| `card_biin_information.card_biin_type` | **Yes** | Card type | `"PREPAID"` |
| `card_biin_information.card_biin_brand` | **Yes** | Card brand description | `"Mastercard Prepaid General Spend"` |
| `card_biin_information.card_biin_prepaid` | **Yes** | Prepaid status indicator | `"Yes"` |
| `card_biin_information.card_biin_bank_name` | **Yes** | Issuing bank name | `"KCB BANK KENYA LIMITED"` |
| `card_biin_information.card_biin_bank_url` | **Yes** | Bank website (if available) | `""` |
| `card_biin_information.card_biin_bank_city` | **Yes** | Bank city (if available) | `""` |
| `card_biin_information.card_biin_bank_phone` | **Yes** | Bank phone (if available) | `""` |
| `card_biin_information.card_biin_bank_logo` | **Yes** | Bank logo URL (if available) | `""` |
| `card_biin_information.card_biin_country_two_letter_code` | **Yes** | Country ISO code (if available) | `""` |
| `card_biin_information.card_biin_country_name` | **Yes** | Issuing country name | `"KENYA"` |
| `card_biin_information.card_biin_country_numeric` | **Yes** | Country numeric code | `"404"` |
| `card_biin_information.card_biin_risk_flag` | **Yes** | Fraud Control (Chargebacks). Turns on for high risk BIINs. | `0` |

