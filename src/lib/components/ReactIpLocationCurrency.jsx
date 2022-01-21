import { useState, useCallback, useEffect } from "react";
import codeToCurrency from "./countryCodeToCurrency";
import codeToLocal from "./countryCodesToLocal";

const defaultProps = {
  defaultCurrency: "USD",
  onlyExchangeRate: false,
  onlyPosition: false,
  onlyIpDetails: false,
  forceUpdateLocation: false,
  detailsByIpUrl: "https://geolocation-db.com/json/",
  exchangeRateUrl: "https://api.exchangerate-api.com/v4/latest/",
};

const useReactIpLocationCurrency = (props = {}) => {
  const {
    defaultCurrency,
    detailsByIpUrl,
    exchangeRateUrl,
    onlyExchangeRate,
    onlyIpDetails,
    onlyPosition,
    forceUpdateLocation,
    numberToConvert,
    codeCountryToCurrency,
    codeCountryToLocal,
  } = { ...defaultProps, ...props };
  const [currency, setCurrency] = useState(defaultCurrency);
  const [exchangeRate, setExchangeRate] = useState("1.00");
  const [ipResponse, setIpResponse] = useState();
  const [exchangeRateResponse, setExchangeRateResponse] = useState();
  const [locale, setLocale] = useState("en-US");
  const [errorMessage, setErrorMessage] = useState();
  const [geoLocationPosition, setGeoLocationPosition] = useState();
  const [geoLocationErrorMessage, setGeoLocationErrorMessage] = useState();
  const [currencyString, setCurrencyString] = useState();

  const onSuccess = (response, callback, onFail) => {
    if (response && response.status === 200) {
      response.json().then((data) => callback(data));
    } else if (onFail) onFail();
  };

  const getCurrencyString = useCallback(() => {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    });
    return formatter.format(parseFloat((exchangeRate * numberToConvert || 0).toString()));
  }, [locale, currency, numberToConvert, exchangeRate]);

  const reset = useCallback(() => {
    setCurrency(defaultCurrency);
    setExchangeRate("1.00");
    setLocale("en-US");
    setErrorMessage("Make sure location is allowed by browser");
  }, [defaultCurrency]);

  const requests = useCallback(
    () =>
      Promise.all([
        !onlyExchangeRate && fetch(detailsByIpUrl),
        !onlyIpDetails && fetch(`${exchangeRateUrl}${defaultCurrency}`),
      ]),
    [onlyExchangeRate, detailsByIpUrl, onlyIpDetails, exchangeRateUrl, defaultCurrency]
  );

  const positionFound = (position) => setGeoLocationPosition(position);
  const positionNotFound = () => setGeoLocationErrorMessage("No location found");

  const getLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(positionFound, positionNotFound);
    if (!onlyPosition) {
      requests()
        .then(([ipResponse, exchangeResponse]) => {
          const onExchangeRes = (callback) => {
            const onExchangeResSuccess = (data) => {
              setExchangeRateResponse(data);
              callback(data);
            };
            onSuccess(exchangeResponse, onExchangeResSuccess, reset);
          };
          onSuccess(
            ipResponse,
            (ipResponseData) => {
              setIpResponse(ipResponseData);
              const newCurrency = (codeCountryToCurrency || codeToCurrency)[ipResponseData.country_code];
              setCurrency(newCurrency || "USD");
              setLocale((codeCountryToLocal || codeToLocal)[ipResponseData.country_code] || "en-US");
              onExchangeRes((data) => setExchangeRate(data.rates[newCurrency].toFixed(2)));
            },
            () => {
              reset();
              onExchangeRes();
            }
          );
        })
        .catch((err) => {
          setErrorMessage("Something went wrong");
        });
    }
  }, [onlyPosition, requests, reset]);

  useEffect(() => {
    setCurrencyString(getCurrencyString());
  }, [getCurrencyString]);
  useEffect(getLocation, []);
  useEffect(forceUpdateLocation && getLocation, [forceUpdateLocation]);

  return {
    currency,
    exchangeRate,
    ipResponse,
    exchangeRateResponse,
    locale,
    errorMessage,
    geoLocationPosition,
    geoLocationErrorMessage,
    currencyString,
  };
};

export default useReactIpLocationCurrency;