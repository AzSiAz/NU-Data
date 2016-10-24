# NU-Data
[![Build Status](https://travis-ci.org/AzSiAz/NU-Data.svg?branch=master)](https://travis-ci.org/AzSiAz/NU-Data)

# Description

    Get data from NovelUpdate

# API

## getSearchData :

```js
const {getSearchData} = require('nu-data');
let res = await getSearchData("antimagic", 1);
console.log(res);
```

```json
{
    
}
```

## getSerieData :

```js
const {getSerieData} = require('nu-data');
let res = await getSerieData("Absolute Duo", 1);
console.log(res);
```

```json
{

}
```

## getIndexData :

```js
const {getIndexData} = require('nu-data');
let res = await getIndexData();
console.log(res);
```

```json
{

}
```

## getGroupData :

```js
const {getGroupData} = require('nu-data');
let res = await getGroupData("AbsurdTL");
console.log(res);
```

```json
{

}
```

## getRankingData :

```js
const {getRankingData} = require('nu-data');
let res = await getRankingData("antimagic", 1);
console.log(res);
```

```json
{

}
```


# License
MIT