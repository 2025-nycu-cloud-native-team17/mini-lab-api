# mini-lab-api

## for front-end group
Louis has prepared one docker-compose file to build and run our API-server and mongoDB. Please run following command.

```bash
cd mini-lab-api
docker compose up --build
```
You may need API-SPEC to understand how to use our api. Please refer to `API_SPEC.md` file or click this link https://hackmd.io/@CvXjhAT1Q7WWB84ITUmIHA/Bk-iBmRA1x

## Backend

Express Server

### Set your environment variable

```bash
cd backend
cp .env.sample .env
```

### Development

Run a mongo container

```bash
docker run -d -p 27017:27017 mongo
```

Install dependencies

```bash
npm install
```

Start development mode

```bash
npm run dev
```

### Run the test

```bash
npm run test
```