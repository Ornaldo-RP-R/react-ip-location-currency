# React-Ip-Location-Currency

Get user location/ip-details/geo position/currency convert based on api or navigation

## Installation

npm install react-ip-location-currency <br/>
yarn add react-ip-location-currency

## Import Component

import TimePicker from 'react-ip-location-currency'

## Demo

[See Demo](https://ornaldo-rp-r.github.io/react-time-picker-test/)

## Usage

Here's an example of basic usage:

```JSX
import React, { useState } from 'react';
import TimePicker from 'react-time-picker-input';

function TimePickerTest() {
const [value, setValue] = useState('10:00');

    return (
        <div>
            <TimePicker
                onChange={(newValue)=>setValue(value)}
                value={value}
            />
        </div>
    );

}
```

## Props

| PropName                | Type     | default    | description                                                                                                                   |
| ----------------------- | -------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| onChange                | function | (date)=>{} | It fires every time that time is valid (minute hour exists) and returns date parameter which is date in string 24 hour format |
| onChangeEveryFormat     | function | (date)=>{} | Similar to onChange but it can be used when allowDelete is true to get every value no matter if it is valid                   |
| value                   | String   | "- -"      | Defines default value of TimePicker. Required format ("HH:mm") ex("22:04") -> always 24Hour format                            |
| hour12Format            | boolean  | false      | make it true to make input 12HourFormat support see on demo example                                                           |
| allowDelete             | boolean  | false      | make it true if you want to allow user to delete fields (hour and minutes) using Backspace                                    |
| disabled                | boolean  | false      | make it true if you want to block user editting (no change on input can happen and cursor is turned to disabled)              |
| eachInputDropdown       | boolean  | false      | make it true if you want to activate drodpown for each input (default is automatically not manually managed)                  |
| manuallyDisplayDropdown | boolean  | false      | make it true if use eachInputDropdown prop to turn each dropdown to manually controlled mode                                  |
| fullTimeDropdown        | boolean  | false      | make it true if you want to activate full dropdown time see demo                                                              |
# react-ip-location-currency
