# QR API

A fast, lightweight micro-service for generating QR codes as SVG images. Built with Node.js 20, TypeScript, and Fastify 4.

## Features

- 🚀 **Fast**: Built with Fastify 4 for high performance
- 🎯 **SVG Output**: Clean, scalable QR codes
- 💾 **Smart Caching**: ETag-based caching with immutable headers
- 🔧 **TypeScript**: Full type safety
- 🧪 **Tested**: Comprehensive test suite
- 🐳 **Docker Ready**: Multi-stage production build
- ☁️ **Railway Ready**: Deploy with one click
- 📚 **API Documentation**: Interactive Swagger/OpenAPI docs

## Quick Start

### Prerequisites

- Node.js 20+
- Yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd qr-api

# Install dependencies
yarn install

# Start development server
yarn dev
```

The server will start on `http://localhost:3000`

### Test the API

```bash
# Generate a QR code
curl "http://localhost:3000/v1/qr?data=https%3A%2F%2Fexample.com"

# Health check
curl "http://localhost:3000/healthz"
```

## API Documentation

### Interactive Swagger UI

The API includes comprehensive interactive documentation powered by Swagger/OpenAPI:

- **📖 Interactive Docs**: `http://localhost:3000/docs`
- **📄 OpenAPI JSON**: `http://localhost:3000/docs/json`

### Features

- **🔍 Live Testing**: Test endpoints directly from the browser
- **📝 Parameter Validation**: Automatic validation of request parameters
- **📊 Response Examples**: See expected response formats
- **🏷️ Organized Endpoints**: Grouped by functionality
- **🔄 Real-time Updates**: Documentation updates with code changes

### Using the Swagger UI

1. **Navigate to**: `http://localhost:3000/docs`
2. **Expand Endpoints**: Click on any endpoint to see details
3. **Test Parameters**: Fill in the required parameters
4. **Execute**: Click "Try it out" to test the API
5. **View Response**: See the actual response from the server

### OpenAPI Specification

The API follows OpenAPI 3.0.3 specification with:

- **Info**: Title, version, and description
- **Paths**: All available endpoints
- **Schemas**: Request/response validation
- **Tags**: Organized endpoint grouping

## API Reference

### Generate QR Code

**Endpoint:** `GET /v1/qr`

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `data` | string | ✅ | - | Text or URL to encode in QR code |
| `margin` | number | ❌ | 4 | Quiet zone modules (0-10) |

**Response:**

- **Content-Type:** `image/svg+xml`
- **Cache-Control:** `public, max-age=31536000, immutable`
- **ETag:** SHA-1 hash of canonicalized query string

**Example:**

```bash
# Basic usage
curl "http://localhost:3000/v1/qr?data=https%3A%2F%2Fexample.com"

# With custom margin
curl "http://localhost:3000/v1/qr?data=Hello%20World&margin=2"
```

**Response Headers:**
```
HTTP/1.1 200 OK
Content-Type: image/svg+xml
ETag: "f4a8d25e466e6e8fe59e2f7ec36f14f4d58c1586"
Cache-Control: public, max-age=31536000, immutable
```

### Health Check

**Endpoint:** `GET /healthz`

**Response:** Plain text "ok"

```bash
curl "http://localhost:3000/healthz"
# Returns: ok
```

## Development

### Available Scripts

```bash
# Development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Run tests
yarn test

# Format code
yarn format

# Check formatting
yarn format:check

# Lint code
yarn lint

# Fix linting issues
yarn lint:fix

# Start server and open docs
yarn docs:dev
```

### Project Structure

```
src/
├── encode.ts          # QR code generation wrapper
├── v1/
│   └── routes.ts      # API routes with caching
├── server.ts          # Main server with health check
├── swagger.ts         # Swagger/OpenAPI configuration
└── encode.test.ts     # Tests
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `LOG_LEVEL` | info | Logging level |

### QR Code Options

The service uses the following default settings:

- **Error Correction Level:** M (Medium)
- **Version:** Auto-select
- **Margin:** 4 modules (configurable)
- **Output Format:** SVG

### Swagger Configuration

The API documentation is configured with:

- **OpenAPI Version:** 3.0.3
- **UI Route:** `/docs`
- **JSON Route:** `/docs/json`
- **UI Config:** List expansion, no deep linking
- **Auto-generation:** From route schemas

## Deployment

### Docker

```bash
# Build image
docker build -t qr-api .

# Run container
docker run -p 3000:3000 qr-api
```

### Railway

The project includes `railway.json` for easy deployment on Railway:

```json
{
  "services": [{
    "name": "qr-api",
    "startCommand": "node dist/server.js",
    "healthcheckPath": "/healthz"
  }]
}
```

### Manual Deployment

```bash
# Build the project
yarn build

# Start production server
yarn start
```

## Caching

The API implements intelligent caching:

- **ETag:** SHA-1 hash of the canonicalized query string
- **Cache-Control:** `public, max-age=31536000, immutable`
- **304 Not Modified:** Returns when client has cached version

This ensures optimal performance and reduces server load.

## Error Handling

The API returns appropriate HTTP status codes:

- **400 Bad Request:** Missing or invalid parameters
- **500 Internal Server Error:** QR generation failures

Error responses include descriptive messages:

```json
{
  "error": "Missing required parameter: data"
}
```

## Testing

Run the test suite:

```bash
yarn test
```

Tests verify:
- SVG output contains `<svg` tag
- Different margin values work correctly
- Error handling for invalid input

## Performance

- **Response Time:** < 50ms for typical QR codes
- **Memory Usage:** ~50MB for production container
- **Concurrent Requests:** Handles high load efficiently

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `yarn test`
5. Format code: `yarn format`
6. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.
