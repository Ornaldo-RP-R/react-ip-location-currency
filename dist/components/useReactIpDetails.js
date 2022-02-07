"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.parse-float.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.number.to-fixed.js");

var _react = require("react");

var _countryCodeToCurrency = _interopRequireDefault(require("./countryCodeToCurrency"));

var _countryCodesToLocal = _interopRequireDefault(require("./countryCodesToLocal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const defaultProps = {
  defaultCurrency: "USD",
  shouldGetExchangeRate: true,
  shouldGetPosition: false,
  shouldGetIpDetails: true,
  forceUpdateLocation: false,
  numberToConvert: 0,
  detailsByIpUrl: "https://geolocation-db.com/json/",
  exchangeRateUrl: "https://api.exchangerate-api.com/v4/latest/"
};

const useReactIpDetails = function useReactIpDetails() {
  let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  const {
    defaultCurrency,
    detailsByIpUrl,
    exchangeRateUrl,
    shouldGetExchangeRate,
    shouldGetIpDetails,
    shouldGetPosition,
    forceUpdateLocation,
    numberToConvert,
    codeCountryToCurrency,
    codeCountryToLocal
  } = _objectSpread(_objectSpread({}, defaultProps), props);

  const [currency, setCurrency] = (0, _react.useState)(defaultCurrency);
  const [exchangeRate, setExchangeRate] = (0, _react.useState)("1.00");
  const [ipResponse, setIpResponse] = (0, _react.useState)();
  const [exchangeRateResponse, setExchangeRateResponse] = (0, _react.useState)();
  const [locale, setLocale] = (0, _react.useState)("en-US");
  const [errorMessage, setErrorMessage] = (0, _react.useState)();
  const [geoLocationPosition, setGeoLocationPosition] = (0, _react.useState)();
  const [geoLocationErrorMessage, setGeoLocationErrorMessage] = (0, _react.useState)();
  const [currencyString, setCurrencyString] = (0, _react.useState)();

  const onSuccess = (response, callback, onFail) => {
    if (response && response.status === 200) {
      response.json().then(data => callback(data));
    } else if (onFail) onFail();
  };

  const onExchangeRes = (response, callback) => {
    const onExchangeResSuccess = data => {
      setExchangeRateResponse(data);
      callback(data);
    };

    onSuccess(response, onExchangeResSuccess, reset);
  };

  const getCurrencyString = (0, _react.useCallback)(price => {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency
    });
    return formatter.format(parseFloat((exchangeRate * (!Number.isNaN(price) ? price : numberToConvert)).toString()));
  }, [locale, currency, numberToConvert, exchangeRate]);
  const reset = (0, _react.useCallback)(() => {
    setCurrency(defaultCurrency);
    setExchangeRate("1.00");
    setLocale("en-US");
    setErrorMessage("Make sure location is allowed by browser");
  }, [defaultCurrency]);

  const positionFound = position => setGeoLocationPosition(position);

  const positionNotFound = () => setGeoLocationErrorMessage("No location found");

  const getLocation = (0, _react.useCallback)(() => {
    if (shouldGetPosition) navigator.geolocation.getCurrentPosition(positionFound, positionNotFound);

    if (shouldGetIpDetails) {
      fetch(detailsByIpUrl).then(ipResponse => {
        onSuccess(ipResponse, ipResponseData => {
          setIpResponse(ipResponseData);
          const newCurrency = (codeCountryToCurrency || _countryCodeToCurrency.default)[ipResponseData.country_code] || defaultCurrency;
          setCurrency(newCurrency);
          setLocale((codeCountryToLocal || _countryCodesToLocal.default)[ipResponseData.country_code] || "en-US");

          if (newCurrency !== "USD" && shouldGetExchangeRate) {
            fetch("".concat(exchangeRateUrl).concat(defaultCurrency)).then(response => onExchangeRes(response, data => setExchangeRate(data.rates[newCurrency].toFixed(2))));
          }
        }, () => {
          reset();
          onExchangeRes();
        });
      }).catch(err => {
        setErrorMessage("Something went wrong");
      });
    }
  }, [shouldGetPosition, shouldGetIpDetails, detailsByIpUrl, shouldGetExchangeRate, exchangeRateUrl, reset, codeCountryToCurrency, codeCountryToLocal, defaultCurrency]);
  (0, _react.useEffect)(() => {
    setCurrencyString(getCurrencyString());
  }, [getCurrencyString]);
  (0, _react.useEffect)(() => {
    getLocation();
  }, []);
  (0, _react.useEffect)(() => {
    if (forceUpdateLocation) {
      getLocation();
    }
  }, [forceUpdateLocation]);
  return {
    currency,
    exchangeRate,
    ipResponse,
    exchangeRateResponse,
    errorMessage,
    geoLocationPosition,
    geoLocationErrorMessage,
    currencyString,
    getCurrencyString
  };
};

var _default = useReactIpDetails;
exports.default = _default;