import { Request, Response, NextFunction } from "express"

class TokenBucket {
    readonly capacity: number
    readonly fillRate: number
    tokens: number
    lastFilled: number
    intervalId: NodeJS.Timeout

    constructor(capacity: number, fillRate: number) {
        this.capacity = capacity
        this.fillRate = fillRate
        this.tokens = capacity
        this.lastFilled = Date.now()
        this.intervalId = setInterval(() => this.fill(), 2000)
    }

    protected fill() {
        const now = Date.now()
        const delta = (now - this.lastFilled) / 1000
        const tokensToAdd = delta * this.fillRate
        this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd)
        this.lastFilled = now
    }

    public take(tokens: number) {
        if (tokens > this.tokens) {
            return false
        }
        this.tokens -= tokens
        return true;
    }

    public stop() {
        clearInterval(this.intervalId)
    }
}

class TokenBucketRateLimiter {
    private tokenBucket: TokenBucket

    constructor(capacity: number, fillRate: number) {
        this.tokenBucket = new TokenBucket(capacity, fillRate)

    }

    handleRequest(req: Request, res: Response, next: NextFunction) {
        if (this.tokenBucket.take(1) == false) {
            res.status(429).send("Too Many Requests")
            return
        }

        next()


    }

    protected stop() {
        this.tokenBucket.stop()
    }
}

export { TokenBucketRateLimiter }