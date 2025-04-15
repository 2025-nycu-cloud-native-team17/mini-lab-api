# mini-lab-api

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