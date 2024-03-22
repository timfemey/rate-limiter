# Rate Limiter Library for Node.js

This is a flexible and efficient rate limiter library for Node.js, designed to help you control the rate of incoming requests to your server. It supports multiple rate limiting algorithms, including:

- Token Bucket Algorithm
- Sliding Window Log Algorithm
- Leaking Bucket Algorithm
- Fixed Window Counter Algorithm

With this library, you can easily implement rate limiting in your Node.js applications, ensuring that your server resources are used responsibly and fairly.

## Features

- **Support for Multiple Algorithms:** Choose the rate limiting algorithm that best suits your application's requirements.
- **Customizable Configuration:** Adjust parameters such as window size, maximum requests, and leak rate to fine-tune the rate limiter's behavior.
- **Integration with HTTP Libraries:** Use the rate limiter as middleware with popular HTTP libraries like Express, enabling seamless integration into your Node.js web applications.

## Installation

You can install the rate limiter library via npm:

```bash
npm install dynamic-rate-limiter
```

## Usage

### Using as Middleware with Express

```javascript
const express = require("express");
const RateLimiter = require("dynamic-rate-limiter");

const app = express();

// Create a rate limiter instance with desired configuration
const windowSize = 60000; // 1 minute window
const maxRequests = 70; // Maximum 70 requests allowed in a minute
const rateLimiter = RateLimiter("fixed-window");

// Use rate limiter as middleware
app.use((req, res, next) =>
  rateLimiter(windowSize, maxRequests).handleRequest(req, res, next)
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

### Supported Algorithms

- **Token Bucket Algorithm:** Provides a smooth and adjustable rate limiting mechanism based on token replenishment.
- **Sliding Window Log Algorithm:** Tracks the number of requests within a sliding time window, allowing for more granular rate control.
- **Leaking Bucket Algorithm:** Offers a leaky bucket rate limiting mechanism, allowing bursts of requests while maintaining a steady overall rate.
- **Fixed Window Counter Algorithm:** Limits the number of requests within fixed time windows, providing simple yet effective rate limiting.

## Contributing

Contributions are welcome! If you have any suggestions, bug fixes, or new features to propose, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
