import select, { Separator } from '@inquirer/select';
import { RateLimiter } from './controllers/tokenBucket';

const answer = await select({
    message: 'Select a Rate Limiting Algorithm',
    choices: [
        {
            name: 'token-bucket',
            value: 'Token Bucket Algorithm',
            description: 'A widely used rate limiting algorithm based on treating requests as tokens .',
        },

        new Separator(),
        {
            name: 'leak-bucket',
            value: 'Leaking Bucket Algorithm',
            description: 'Similar to Token bucket algorithm except that request are processed at a fixed rate',
        },
        {
            name: 'fixed-window',
            value: 'Fixed Window Counter Algorithm',
            description: "The algorithm divides the timeline into fix-sized time windows and assign a counter for each window",
            disabled: "(Not yet available)",
        },
        {
            name: 'sliding-window',
            value: 'Sliding Window Log Algorithm',
            description: "The algorithm keeps track of request timestamps, on new request outdated timestamps are removed",
            disabled: "(Not yet available)",
        },
    ],
});

function apiHandler() {

}

let rateLimiter: RateLimiter

if (answer == "token-bucket") {
    rateLimiter = new RateLimiter(10, 1, 5, apiHandler)
}

