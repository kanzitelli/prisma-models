# 🌏 [Shopify Planet](https://apps.shopify.com/planet) API (TypeScript)

This is a TypeScript wrapper around [Shopify Planet](https://apps.shopify.com/planet) API which enables to get neccessary information about brands which use [Shopify Planet App](<(https://apps.shopify.com/planet)>). Currently, it only supports Server side (not Browsers).

<i>This library may have breaking changes in the future.</i>

## Usage

1. Install library

```
yarn add shopify-planet-api
```

2. Create API client

```tsx
import {ShopifyPlanetApi} from 'shopify-planet-api';

const planetApi = new ShopifyPlanetApi({
  // For credentials, please contact Shopify Planet Team
  clientId,
  token,
});
```

3. Make first API call

```tsx
const {shop} = await this.shopify.planetApi.getShopInfo({
  shopifyDomain: 'some-store.myshopify.com',
});
console.log(shop); // -> { allShipmentsCarbonNeutral: true }
```
