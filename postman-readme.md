# Postman Collection for Automation Config Service

This directory contains Postman collection and environment files for testing the ONDC Automation Config Service API.

## Files

- `postman-collection.json` - Main Postman collection with all API endpoints
- `postman-environment.json` - Environment variables for easy testing
- `postman-readme.md` - This documentation file

## Quick Start

### 1. Import into Postman

1. Open Postman
2. Click "Import" button
3. Select both `postman-collection.json` and `postman-environment.json`
4. Select the "Automation Config Service Environment" environment

### 2. Start the Service

Before testing, make sure your service is running:

```bash
npm run dev
# or
npm start
```

The service should be running on `http://localhost:3000`

### 3. Test the APIs

The collection includes all available endpoints with pre-configured parameters and examples.

## Available Endpoints

### UI Routes (`/ui`)

| Endpoint        | Method | Required Parameters            | Description            |
| --------------- | ------ | ------------------------------ | ---------------------- |
| `/ui/flow`      | GET    | `domain`, `version`, `usecase` | Get flow configuration |
| `/ui/reporting` | GET    | `domain`, `version`            | Get reporting status   |
| `/ui/senario`   | GET    | None                           | Get scenario form data |

### API Service Routes (`/api-service`)

| Endpoint                        | Method | Required Parameters | Description           |
| ------------------------------- | ------ | ------------------- | --------------------- |
| `/api-service/supportedActions` | GET    | `domain`, `version` | Get supported actions |

### Mock Routes (`/mock`)

| Endpoint     | Method | Required Parameters                      | Description            |
| ------------ | ------ | ---------------------------------------- | ---------------------- |
| `/mock/flow` | GET    | `domain`, `version`, `usecase`, `flowId` | Get specific mock flow |

## Available Domains and Versions

### Retail (RET)

- **RET10** - v-1.2.5 (GROCERY)
- **RET11** - V-1.2.5 (F&B)
- **RET12** - V-1.2.5 (FASHION)
- **RET13** - V-1.2.5 (BPC)
- **RET14** - v-1.2.5 (ELECTRONICS)
- **RET15** - v-1.2.5 (APPLIANCES)
- **RET16** - v-1.2.5 (HOME&KITCHEN)
- **RET18** - V-1.2.5 (Health&Wellness)

### Financial Services (FIS)

- **FIS10** - V-2.1.0 (giftCard)
- **FIS11** - V-2.0.0 (metroCardRecharge)
- **FIS12** - V-2.0.2 (goldLoan)
- **FIS13** - V-2.0.0 (insurance products)

### Logistics (LOG)

- **LOG10** - V-1.2.5 (logistics)
- **LOG11** - V-1.2.5 (logistics)

### Travel (TRV)

- **TRV10** - V-2.1.0 (ride-hailing)
- **TRV11** - V-2.0.0, V-2.0.1 (bus, metro)
- **TRV12** - V-2.0.0
- **TRV13** - V-2.0.0, V-2.0.1
- **TRV14** - V-2.0.0

## Environment Variables

The environment includes these variables that you can modify:

- `baseUrl`: Service base URL (default: `http://localhost:3000`)
- `domain`: Domain code (default: `RET10`)
- `version`: API version (default: `v-1.2.5`)
- `usecase`: Use case (default: `GROCERY`)
- `flowId`: Flow ID for mock endpoints (default: `flow1`)

## Example Usage

### Test Retail Grocery Flow

1. Set environment variables:

   - `domain`: `RET10`
   - `version`: `v-1.2.5`
   - `usecase`: `GROCERY`

2. Run "Get Flows" request

### Test Financial Services

1. Set environment variables:

   - `domain`: `FIS10`
   - `version`: `V-2.1.0`
   - `usecase`: `giftCard`

2. Run "Get Supported Actions" request

### Test Error Handling

Use the "Error Handling Examples" folder to test:

- Missing parameter validation
- Invalid domain/version combinations
- Server error responses

## Automated Tests

The collection includes automated tests that run after each request:

- **Response Time**: Ensures responses are under 5 seconds
- **Content Type**: Verifies JSON responses
- **Success Responses**: Checks for `data` property in 200 responses
- **Error Responses**: Checks for `message` property in 400 responses

## Tips for Testing

1. **Use Variables**: Leverage environment variables for different test scenarios
2. **Check Console**: View request logs and test results in Postman console
3. **Batch Testing**: Use Collection Runner to test multiple scenarios
4. **Monitor Performance**: Watch response times for performance testing

## Troubleshooting

### Common Issues

1. **Connection Refused**: Make sure the service is running on localhost:3000
2. **404 Errors**: Check that the endpoint paths are correct
3. **400 Validation Errors**: Ensure all required parameters are provided
4. **Invalid Domain/Version**: Use combinations that exist in the config files

### Service Not Starting?

```bash
# Check if dependencies are installed
npm install

# Check if TypeScript compiles
npm run build

# Start in development mode
npm run dev
```

### Need to Test Different Port?

Update the `baseUrl` environment variable to point to your service:

```
http://localhost:8080  # if running on port 8080
https://your-domain.com  # if deployed
```

## Support

For API documentation and service details, refer to:

- Service README.md
- Source code in `src/` directory
- Configuration files in `src/config/` directory
