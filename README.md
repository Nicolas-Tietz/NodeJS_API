# NodeJS RESTful API Project

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![JS](https://img.shields.io/badge/JAVASCRIPT-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![NODEJS](https://img.shields.io/badge/NODE_JS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![EXPRESS.JS](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Insomnia](https://img.shields.io/badge/Insomnia-black?style=for-the-badge&logo=insomnia&logoColor=5849BE)

This project consists of a backend for a Travel Company that allows to interact with a MongoDB Database.

### The Database contains collections for:
- Users
- Products
- Orders

## How to Clone

1. Clone the repository:  

```
git clone https://github.com/Nicolas-Tietz/NodeJS_API.git
```

2. Change directory: 

``` 
cd ./NodeJS_API 
```

3. Install all the dependencies 

```
npm install 
```

4. Create a .env file into the NodeJS_API folder and add YOUR database connection string in the URI variable.

```
URI =  " exampleConnectionString "
```
5. Start the server


```
npm start
```

## Document Schemas

### User Schema:

```
{
    "firstName": ""
    "lastName": ""
    "email": ""  
}
```
### Product Schema:

```
{
    "productName": ""
}
```
### Order Schema:

```
{
    products:[
        {
            "productName": "productName1"
        },
        {
            "productName": "productName2"
        }
    ],
    users:[
        {
            "email": "user1@example.com"
        },
        {
            "email": "user2@example.com"
        }
    ]
}

```



## How To Use

To use this RESTful API, you need to make Requests to the server with different URLs and different methods to perform different actions.
To test these, you need a program like Insomnia or Postman to be able to send requests to the server. For methods that expect a body, you'll have to send it as a JSON as shown in the examples below.


The API allows the following operations

- Create, Update, Delete and List Users
- Create, Update, Delete and List Products
- Create, Update, Delete, List and Filter Orders


Methods: 

- GET
- POST
- PATCH
- DELETE




## Users Requests 

### List Users

```
GET localhost:8000/users/
```



### Create User

```
POST localhost:8000/users/
```

#### Example Body


```
{
    "firstName": "exampleName",
    "lastName": "exampleSurname",
    "email": "email@example.com"
}

```



### Update User

```
PATCH localhost:8000/users/:id
```

The PATCH request can contain one or more fields of the User Schema like this:

#### Example Body

```
{
	"firstName":"newName",
	"email": "newEmail@example.com"
}
```
<b> Note :</b>

Updating the user's email will also update it into the orders that contained the old one.



### Delete User

```
DELETE localhost:8000/users/:id
```

## Products Requests

### List Products

```
GET localhost:8000/products/
```

### Create Product


```
POST localhost:8000/products/
```

#### Example Body

```
{
    "productName": "exampleName"
}

```

### Update Product

```
PATCH localhost:8000/products/:id
```

#### Example Body

```
{
    "productName": "newName"
}

```

### Delete Product

```
DELETE localhost:8000/products/:id
```


## Orders Requests


### List / Filter Orders

#### List All Orders
```
GET localhost:8000/orders/
```

### Filter Orders

Orders can be filtered by products contained and/or users


#### Example

```
GET localhost:8000/orders?date=2023-11-01&products=ProductName1,ProductName2
```

### Create Order

```
POST localhost:8000/orders/
```

#### Example Body

```
{
    "products":[
        {
            "productName":"productName1"
        },
        {
            "productName":"productName2"
        }
    ],
    "users":[
        {
            "email":"user1@example.com"
        },
        {
            "email":"user2@example.com"
        }
    ]
}
```

### Update Order

```
PATCH localhost:8000/orders/:id
```

Updating orders requires one field ('productName' for products or 'email' for users) and an additional field called 'operation' that will contain the operation type ( add / remove ).

To add new products or users they must already exist in the database.

#### Example Body

```
{
	"products":[
		
		{
			"productName":"productName1",
			"operation": "add"
			
		},
        {
            "productName":"productName2",
            "operation": "remove"
        }
	],
	"users":[
		{
			"email":"user1@example.com",
			"operation":"add"
		},
        {
            "email":"user2@example.com",
            "operation": "remove"
        }
	]
	
}
```

### Delete Order

```
DELETE localhost:8000/orders/:id
```


## <img src="https://github.com/Nicolas-Tietz/JavascriptAdvancedProject/assets/120263952/1a97ff89-6048-4f5c-85ac-df77f18c8578" width='25px'> Contact

<a href="https://nicolas-tietz.github.io/contact-me/">Portfolio Website</a>

Email : nicolastietz48@gmail.com