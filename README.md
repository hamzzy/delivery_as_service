# A delivery  as a Service  HTTP API

# Tools use
-  Node js
- Express js
- Typescript 
- PostgresSQL

## Folder Structure
```
src/
    config/development.json ...
    
    controllers/
            .... #contains the logic 

    dtos/
        ... this folder contains validation logic,type strict logic.

    entities/.. this folder contains the model logic where db design is been implemented.
    exceptions

```



This application consist of two part using an mvc Architecture approach

- Auth
- customer core part



# Auth 
 The auth section which control  api such as
 - /api/auth/signup
 - /api/auth/login

# Customer Core path
 This section includes the core features used to manage the delivery service logic and the api includes.

 - api/customer/createApikey
 - api/customer/getApikey
 - api/customer/quote
 - api/customer/order
 - api/customer/cancel_order
 

> To run this application check


# How to Run and test this application


```bash
yarn install | npm install
```

### Before you start  populate the .env  with your choice of db config

```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=new
POSTGRES_PASSWORD=1234
POSTGRES_DB=tinymile
PORT=5000
secret_key=loremipsum
LOG_FORMAT=dev
```
You need to create two db  which is as followe
- tinymile  for (dev)
- new  for unit (test)

Incase you are using the macbook postgresSQL app
- start your postgresSQL server
- go to your terminal and paste 

```
creatdb tinymile
createdb new 
```

### To start  the application
```bash
yarn  dev | npm dev
```

make sure it is  running on port 5000 and db is connected also. Sync the app model with 
```
yarn schema:sync | npx schema:sync
```
This seed is needed to populate robots and robotmovement history model
```
yarn seed:run | npx seed:run
```
or run to execute both command

```bash
./db.sh 
```

To check the application unit test, check the test folder.
To run the test file use
```
yarn test 
```
and watch it do magic 

# API REQ AND RES  DESCRIPTION

> You can either use the postman collections to test  or follow this description.

<a href="https://documenter.getpostman.com/view/4098871/UVXknEZm#34092b40-22cf-45fd-966c-817a82a6679d">  Public PostMan  Document </a>
 ## Auth Request and Response
 ```
    -> localhost:5000/api/auth/signup

    Request Sample
    {

        "email":"john@mail.com",
        "password":"johnny1234"
    }

    Response Sample

    {
        message: 'signup' 
    }

    -> localhost:5000/api/auth/login
      Request Sample
    {

        "email":"john@mail.com",
        "password":"johnny1234"
    }

    Response Sample

    {
        token: 'xxxxxxxxxxxxxxxxxxxxxxxxxx' 
    }


 ```

  # customer Request and Response
 ```
    GET
    localhost:5000/api/customer/createApikey
    Header : Bearer xxxxxxxxxxxxxxgxxgxxxxxxxxxxx
    use the user bearer token generated here to get a public apiKey which will be use to access order services.


     Response Sample

    {
        'xxxxxxxxxxxxxxxxxxxxxxxxxx' 
    }
    

    # get user generated ApiKey
    localhost:5000/api/customer/key

 ```