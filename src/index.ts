import select from '@inquirer/select';
import { TokenBucketRateLimiter } from './controllers/tokenBucket.js';
import { LeakBucketRateLimiter } from './controllers/leakBucket.js';
import { FixedWindowRateLimiter } from './controllers/fixedWindow.js';
import { SlidingWindowLogRateLimiter } from './controllers/slidingWindowLog.js';

const answer = await select({
    message: 'Select a Rate Limiting Algorithm',
    choices: [
        {
            name: 'token-bucket',
            value: 'Token Bucket Algorithm',
            description: 'A widely used rate limiting algorithm based on treating requests as tokens .',
        },
        {
            name: 'leak-bucket',
            value: 'Leaking Bucket Algorithm',
            description: 'Similar to Token bucket algorithm except that request are processed at a fixed rate',
        },

        {
            name: 'fixed-window',
            value: 'Fixed Window Counter Algorithm',
            description: "The algorithm divides the timeline into fix-sized time windows and assign a counter for each window",

        },
        {
            name: 'sliding-window',
            value: 'Sliding Window Log Algorithm',
            description: "The algorithm keeps track of request timestamps, on new request outdated timestamps are removed",
            disabled: "(Not yet available)",
        },
    ],
});


if (answer == "token-bucket") {
    let rateLimiter = new TokenBucketRateLimiter(10, 1)
}

if (answer == "leak-bucket") {
    let rateLimiter = new LeakBucketRateLimiter(10, 1)
}

if (answer == "fixed-window") {
    let rateLimiter = new FixedWindowRateLimiter(1000, 10)
}

if (answer == "sliding-window") {
    let rateLimiter = new SlidingWindowLogRateLimiter(1000, 10)
}