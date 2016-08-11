local-business
==============

Back-end for a mobile application targeting the needs of a local business.

## Prerequisites

* [Node.js](http://nodejs.org)
* [NPM](http://npmjs.org). We will also have npm installed when installing Node.js. We use NPM to install the Node dependencies.
* [Bower](http://bower.io/). We use Bower to install the front end dependencies.
* [Grunt](http://gruntjs.com). We use Grunt to automate some tasks.
* [Yeoman](http://yeoman.io/). We use Yeoman to scaffold the application based on the [generator-angular-fullstack](https://github.com/DaftMonk/generator-angular-fullstack).
* [MongoDB](http://www.mongodb.org/). We use MongoDB to store the data.

## Install the dependencies

```
# install the required Node.js modules
npm install
# install the required front end modules
bower install
```

## How to build

Execute the following command to build the application:

```
grunt build
```

The deployable application will be available on `/dist` directory.

## How to run

Execute the following command to run the application:

### In development mode

```
grunt serve
```

### In debug mode

```
grunt serve:debug
```

### In production mode

```
grunt serve:dist
```

This will open up a new window in browser http://localhost:8080/debug?port=5858

## How to test

Execute the following command to test the application:

```
# To test the client end
grunt test:client

# To test the server end
grunt test:server

# To test both client and server
grunt test
```

## API

API calls and endpoints

### Authentication

* method: `POST`
* endpoint: `auth/client`
* parameters: `client_id`, `client_secret`

#### Return
````
{
"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NTgyYzdjYTk3MzAzZTk1YzRmODc1ZmEiLCJpYXQiOjE0MzQ2MzU2NjM0OTIsImV4cCI6MTQzNDY1MzY2MzQ5Mn0.6HbAmq89XMvKQgXKwa5KOWcmlM3voXfy9Wks9t9rTw0"
}
````

#### Example

* http://localhost:9000/auth/client?client_id=b9acdae5-d525-4b07-941a-53e980ff225b&client_secret=123

### Articles

* method: `GET`
* endpoint: `api/articles`

Header:
* Content-Type: `application/json`
* Authorization: `Bearer {auth token}`

#### Example
* http://localhost:9000/api/articles

### Products

* method: `GET`
* endpoint: `api/products`

Header:
* Content-Type: `application/json`
* Authorization: `Bearer {auth token}`

#### Example
* http://localhost:9000/api/products

### Galleries

* method: `GET`
* endpoint: `api/galleries`

Header:
* Content-Type: `application/json`
* Authorization: `Bearer {auth token}`

#### Example
* http://localhost:9000/api/galleries

### Pages

* method: `GET`
* endpoint: `api/pages`

Header:
* Content-Type: `application/json`
* Authorization: `Bearer {auth token}`

#### Example
* http://localhost:9000/api/pages

### Reviews

* method: `GET`
* endpoint: `api/reviews`

Header:
* Content-Type: `application/json`
* Authorization: `Bearer {auth token}`

#### Example
* http://localhost:9000/api/reviews

### Services

* method: `GET`
* endpoint: `api/services`

Header:
* Content-Type: `application/json`
* Authorization: `Bearer {auth token}`

#### Example
* http://localhost:9000/api/services

### Catalogs

* method: `GET`
* endpoint: `api/catalogs`

Header:
* Content-Type: `application/json`
* Authorization: `Bearer {auth token}`

#### Example
* http://localhost:9000/api/catalogs


### Accounts

* method: `GET`
* endpoint: `api/accounts`

Header:
* Content-Type: `application/json`
* Authorization: `Bearer {auth token}`

#### Example
* http://localhost:9000/api/accounts
