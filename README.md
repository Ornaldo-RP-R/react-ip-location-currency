# react-ip-details

Get user location/ip-details/geo position/currency convert based on api or navigation using simple hook on react

## Installation

npm install react-ip-details <br/>
yarn add react-ip-details

## Usage
Here's an example of basic usage:

```JSX
import React from "react";
import useReactIpLocation from "react-ip-details";

function TimePickerTest() {
  const {
    currency,
    exchangeRate,
    ipResponse,
    exchangeRateResponse,
    errorMessage,
    geoLocationPosition,
    geoLocationErrorMessage,
    currencyString,
  } = useReactIpLocation({ numberToConvert: 100 });
  console.log(`Full ip response ${ipResponse}`);
  console.log(`Full ip exchange-rate response ${exchangeRateResponse}`);
  return (
    <div>
      {`Local currency string format is ${currencyString}`}
      {`Local currency is ${currency}`}
      {`Geo location details: ${geoLocationPosition}`}
      {`Exchange rate is ${exchangeRate}`}
      {`Error Message: ${errorMessage}`}
      {`Geo Error Message: ${geoLocationErrorMessage}`}
    </div>
  );
}
```

## Import Component

import TimePicker from 'react-ip-details'

## Props

| PropName                | Type     | default                                      | description                                                                                                                   |
| ----------------------- | -------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| defaultCurrency         | string   | USD                                          | Default currency (your webpage currency) if u want to make an exchange to local currency                                      | 
|                         |          |                                              | Check currency supported on api used or change url to support it=> https://www.exchangerate-api.com/docs/supported-currencies | 
| detailsByIpUrl          | string   | https://geolocation-db.com/json/             | You can change url to , make sure endpoint return country_code inside response data                                           |
| exchangeRateUrl         | string   | https://api.exchangerate-api.com/v4/latest/  | You can change url to , make sure ndpoint accept /${currency} addition and return rates in response data                      |
| onlyIpDetails           | boolean  | false                                        | Will not use exchange rate request.Use this if you want to see only api details not exchange rate like (country,currency etc) |
| onlyExchangeRate        | boolean  | false                                        | Will not use api details request.Use this if you want to see only exchangeRateResponse                                        |
| onlyPosition            | boolean  | false                                        | It will return position object (latitude,longitude) without using api,but build in navigator. But will not return country     |
| numberToConvert         | number   | 0                                            | If you want to convert number to current currency and format (ex:200 => $100.00(in US) / ALL 10,742(in Albania))              |
| codeCountryToCurrency   | object   | json object (see countryCodeToCurrency.js)   | You can pass as prop if you want to edit specific country currency for ex : you want to use Eur in Al(Albania)                |
| codeCountryToLocal      | object   | json object (see countryCodesToLocal.js)     | You can pass as prop if you want to edit based on your desire (similar to countryToCurrency)                                  |

## Return Props

| PropName                | Type     | example                                      | description                                                                                                                   |
| ----------------------- | -------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| currencyString          | string   | $100.00                                      | It will return local currency string formated based on currency and exchange rate and numberToConvert                         | 
| currency                | string   | USD                                          | It will return local currency based on api at (detailsByIpUrl prop)                                                           | 
| exchangeRate            | string   | 1.23                                         | Exchange rate of default currency to local currency based on ip api and currency exchange api                                 |
| geoLocationPosition     | object   | cords: {latitude: 41.342,longitude: 19.811}  | Get location position based on navigation built in without using api (if you need only this use onlyPosition:true)            |
| ipResponse              | object   | response of api at (endpoint:detailsByIpUrl) |                                                                                                                               |
| exchangeRateResponse    | object   | response of api at (endpoint:exchangeRateUrl |                                                                                                                               |
| errorMessage            | string   | Make sure location is allowed by browser     | If api fails or anything get wrong it will display messages (messages are static not based on api) replace based on your need |         
| geoLocationErrorMessage | string   | No location found                            | If navigation location fails to find coords it will display error message                                                     |         