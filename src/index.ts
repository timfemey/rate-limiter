import { TokenBucketRateLimiter } from './controllers/tokenBucket.js';
import { LeakBucketRateLimiter } from './controllers/leakBucket.js';
import { FixedWindowRateLimiter } from './controllers/fixedWindow.js';
import { SlidingWindowLogRateLimiter } from './controllers/slidingWindowLog.js';


/**
 * value: Token Bucket Algorithm
 * 
 * description: A widely used rate limiting algorithm based on treating requests as tokens .
 * @param capacity  The number of tokens in the bucket
 * @param fillRate  in milliseconds, sets the time rate at which tokens are added.
 * @returns TokenBucketRateLimiter  
 */
const TokenBucket = (capacity: number, fillRate: number) => {
    return new TokenBucketRateLimiter(capacity, fillRate)
}

/**
 * value: Leaking Bucket Algorithm
 * 
 * description: Similar to Token bucket algorithm except that request are processed at a fixed rate
 * @param capacity The number of tokens in the bucket
 * @param leakRate in milliseconds, sets the time rate at which tokens are removed./'
 * @returns LeakBucketRateLimiter
 */
const LeakBucket = (capacity: number, leakRate: number) => {
    return new LeakBucketRateLimiter(capacity, leakRate)
}


/**
 * value: Fixed Window Counter Algorithm
 * 
 * description: The algorithm divides the timeline into fix-sized time windows and assign a counter for each window
 * @param windowSize should be specified in milliseconds
 * @param maxRequests The max amount of requests allowed in the windowSize
 * @returns FixedWindowRateLimiter
 */
const FixedWindow = (windowSize: number, maxRequests: number) => {
    return new FixedWindowRateLimiter(windowSize, maxRequests)
}

/**
 * value: Sliding Window Log Algorithm
 * 
 * description: The algorithm keeps track of request timestamps, on new request outdated timestamps are removed
 * @param windowSize should be specified in milliseconds
 * @param maxRequests The max amount of requests allowed in the windowSize
 * @returns 
 */
const SlidingWindowLog = (windowSize: number, maxRequests: number) => {
    return new SlidingWindowLogRateLimiter(windowSize, maxRequests)
}

function RateLimiter(type: 'token-bucket'): typeof TokenBucket;

function RateLimiter(type: 'leak-bucket'): typeof LeakBucket;

function RateLimiter(type: 'fixed-window'): typeof FixedWindow;

function RateLimiter(type: 'fixed-window'): typeof SlidingWindowLog;

function RateLimiter(type: 'token-bucket' | 'leak-bucket' | 'fixed-window' | 'sliding-window'): typeof TokenBucket | typeof LeakBucket | typeof FixedWindow | typeof SlidingWindowLog {

    switch (type) {
        case "token-bucket":
            return TokenBucket

        case "leak-bucket":
            return LeakBucket

        case "fixed-window":
            return FixedWindow

        case 'sliding-window':
            return SlidingWindowLog

    }
}


export default RateLimiter