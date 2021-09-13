# Serverless - Certificate Generator

## Description:

>Application created using DynamoDB, AWS Lambda and AWS 
S3. Functions created with NodeJS + Typescript. Based on any other education api, this serverless application focus in generate the final certificate for a certain student, after graduate in a certain course.

> Two main functions let this happen:
>
> - `/generateCertificate`:
><br> In the body of the request, using JSON format, it necessary to have the certificate id, the user name, and the user's grade for that certain course. It will respond a message confirming that the certificate was created and the url to it (pdf file on aws s3). In case of any 
>
> - `/verifyCertificate/{id}`:
><br> By passing the certificate id in the route params, you can check if it is a valid one.<br>
>In case of being a valid one, it will respond with __status code__ `200` and get as response some info such as: the name of the user, the certificate pdf url (on aws s3) and a message confirming it is a valid certificate. In case it's not a valid certificate, it will respond with  a __status code__ `400` and a message informing it is not valid.

### Details:

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

## Installation/deployment:

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Cloning this project:

- Run  `git clone https://github.com/joao-gabriel-gois/serverless-certificate.git && cd serverless-certificate` to clone this repo and move to new repo directory

### Using NPM:

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn:

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

## Testing services:

This template contains a single lambda function triggered by an HTTP request made on the provisioned API Gateway REST API `/generateCertificate` route with `POST` method and `/verifyCertificate` rout with `GET` method. The request body must be provided as `application/json`. 

- requesting any other path than `/generateCertificate` with any other method than `POST` or requesthing any other path than `/verifyCertificate` with any other method than `GET` will result in API Gateway returning a `403` HTTP error code.

> :warning: As is, this template, once deployed, opens a **public** endpoint within your AWS account resources. Anybody with the URL can actively execute the API Gateway endpoint and the corresponding lambda. You should protect this endpoint with the authentication method of your choice.

### Running Locally

In order to test the hello function locally, run the following command:

- `npx sls invoke local -f hello --path src/functions/hello/mock.json` if you're using NPM
- `yarn sls invoke local -f hello --path src/functions/hello/mock.json` if you're using Yarn

Check the [sls invoke local command documentation](https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/) for more information.

### Running Remotely

Copy and replace your `url` - found in Serverless `deploy` command output - and `name` parameter in the following `curl` command in your terminal or in Postman to test your newly deployed application. __All ids used in this application are `UUIDs`__.

```
curl --location --request POST 'https://myApiEndpoint/dev/generateCertificate' \
--header 'Content-Type: application/json' \
--data-raw '{
	"id": "d2d50ca0-59c5-449c-a32c-5055e7662e38",
	"name": "Test User",
	"grade": "10.00"
}'
```

## Template features

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas
- `templates` - containing templates used to generate html document used to generate PDF
- `utils` - containing DynamoDbClient handler (based on env)

```
.
├── src
│   ├── functions               # Lambda configuration and source code folder
│   │   ├── generateCertificate.ts  # exporting handle function
│   │   ├── verifyCertificate.ts    # exporting handle function
│   │
│   ├── libs                    # Lambda shared code
│   │   └── apiGateway.ts       # API Gateway specific helpers
│   │   └── handlerResolver.ts  # Sharable library for resolving lambda handlers
│   │   └── lambda.ts           # Lambda middleware
│   │
│   ├── templates               # Documents for PDFs created inside functions
│   │   └── certificate.hbs     # Certificate template
│   │   └── selo.png     # Asset used in certificate template
│   │
│   ├── utils                   # 3rd Party services / APIs / shared utilitary code
│   │   └── dynamoDbClient.ts   # DynamoDB Client / Handler - set differently based on env
│
├── package.json
├── serverless.yml              # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
```

### 3rd party libraries

- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - uses JSON-Schema definitions used by API Gateway for HTTP request validation to statically generate TypeScript types in your lambda's handler code base
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda. This template uses [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object
- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file
- [dayjs](https://github.com/iamkun/dayjs) - date handler
- [handlebards](https://github.com/handlebars-lang/handlebars.js/) - used on template creation
- [puppeteer-core](https://github.com/puppeteer/puppeteer) - used to handle with template and generate pdf

### Advanced usage

Any tsconfig.json can be used, but if you do, set the environment variable `TS_NODE_CONFIG` for building the application, eg `TS_NODE_CONFIG=./tsconfig.app.json npx serverless webpack`
