const crypto = require('crypto');
const axios = require('axios');

class MobicardBiinLookup {
    constructor(merchantId, apiKey, secretKey) {
        this.mobicardVersion = "2.0";
        this.mobicardMode = "LIVE";
        this.mobicardMerchantId = merchantId;
        this.mobicardApiKey = apiKey;
        this.mobicardSecretKey = secretKey;
        this.mobicardServiceId = "20000";
        this.mobicardServiceType = "BIINLOOKUP";
        
        this.mobicardTokenId = Math.floor(Math.random() * (1000000000 - 1000000 + 1)) + 1000000;
        this.mobicardTxnReference = Math.floor(Math.random() * (1000000000 - 1000000 + 1)) + 1000000;
    }

    generateJWT(cardInput) {
        // Accepts 6-digit BIN, 8-digit BIIN, or full card number
        let mobicardCardBiin;
        if (cardInput.length >= 8) {
            mobicardCardBiin = cardInput.substring(0, 8);
        } else if (cardInput.length >= 6) {
            mobicardCardBiin = cardInput.substring(0, 6);
        } else {
            throw new Error('Invalid card input - must be at least 6 digits');
        }

        const jwtHeader = { typ: "JWT", alg: "HS256" };
        const encodedHeader = Buffer.from(JSON.stringify(jwtHeader)).toString('base64url');

        const jwtPayload = {
            mobicard_version: this.mobicardVersion,
            mobicard_mode: this.mobicardMode,
            mobicard_merchant_id: this.mobicardMerchantId,
            mobicard_api_key: this.mobicardApiKey,
            mobicard_service_id: this.mobicardServiceId,
            mobicard_service_type: this.mobicardServiceType,
            mobicard_token_id: this.mobicardTokenId.toString(),
            mobicard_txn_reference: this.mobicardTxnReference.toString(),
            mobicard_card_biin: mobicardCardBiin
        };

        const encodedPayload = Buffer.from(JSON.stringify(jwtPayload)).toString('base64url');

        const headerPayload = `${encodedHeader}.${encodedPayload}`;
        const signature = crypto.createHmac('sha256', this.mobicardSecretKey)
            .update(headerPayload)
            .digest('base64url');

        return `${encodedHeader}.${encodedPayload}.${signature}`;
    }

    async lookupBiin(cardInput) {
        try {
            const jwtToken = this.generateJWT(cardInput);
            
            const url = "https://mobicardsystems.com/api/v1/biin_lookup";
            const payload = { mobicard_auth_jwt: jwtToken };

            const response = await axios.post(url, payload, {
                httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
            });

            const responseData = response.data;

            if (responseData.status === 'SUCCESS') {
                return {
                    status: 'SUCCESS',
                    cardScheme: responseData.card_biin_information.card_biin_scheme,
                    issuerBank: responseData.card_biin_information.card_biin_bank_name,
                    cardType: responseData.card_biin_information.card_biin_type,
                    country: responseData.card_biin_information.card_biin_country_name,
                    isPrepaid: responseData.card_biin_information.card_biin_prepaid,
                    rawResponse: responseData
                };
            } else {
                return {
                    status: 'ERROR',
                    statusCode: responseData.status_code,
                    statusMessage: responseData.status_message
                };
            }
        } catch (error) {
            return {
                status: 'ERROR',
                errorMessage: error.message
            };
        }
    }
}

// Usage
async function main() {
    const biinLookup = new MobicardBiinLookup(
        "4",
        "YmJkOGY0OTZhMTU2ZjVjYTIyYzFhZGQyOWRiMmZjMmE2ZWU3NGIxZWM3ZTBiZSJ9",
        "NjIwYzEyMDRjNjNjMTdkZTZkMjZhOWNiYjIxNzI2NDQwYzVmNWNiMzRhMzBjYSJ9"
    );

    // Can use 6-digit BIN, 8-digit BIIN, or full card number
    const result = await biinLookup.lookupBiin("5173350006475601"); // Full card number
    // const result = await biinLookup.lookupBiin("51733500"); // 8-digit BIIN
    // const result = await biinLookup.lookupBiin("517335");   // 6-digit BIN

    if (result.status === 'SUCCESS') {
        console.log("BIIN Lookup Successful!");
        console.log(`Card Scheme: ${result.cardScheme}`);
        console.log(`Issuer Bank: ${result.issuerBank}`);
        console.log(`Card Type: ${result.cardType}`);
        console.log(`Country: ${result.country}`);
        console.log(`Prepaid: ${result.isPrepaid}`);
        
        if (result.isPrepaid === 'Yes') {
            console.log("Note: Prepaid card detected - apply appropriate risk rules.");
        }
    } else {
        console.log(`Error: ${result.statusMessage}`);
    }
}

main();
