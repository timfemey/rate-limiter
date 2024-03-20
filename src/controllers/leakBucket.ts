import { Request, Response, NextFunction } from "express"

class LeakyBucket {
    readonly capacity: number;
    tokens: number;
    leakRate: number;
    lastLeakTime: number
    intervalId: NodeJS.Timeout


    constructor(capacity: number, leakRate: number) {
        this.capacity = capacity
        this.tokens = 0
        this.leakRate = leakRate
        this.lastLeakTime = Date.now()
        this.intervalId = setInterval(() => this.leak(), 1000)

    }

    private leak() {
        const now = Date.now()
        const delta = (now - this.lastLeakTime) / 1000
        const leakedTokens = delta * this.leakRate
        this.tokens = Math.max(0, this.tokens - leakedTokens)
        this.lastLeakTime = now
    }

    public addToken() {
        if (this.capacity > this.tokens) {
            this.tokens += 1
            return true
        }
        return false
    }

    public stop() {
        clearInterval(this.intervalId)
    }
}

class LeakBucketRateLimiter {
    protected bucket: LeakyBucket
    constructor(capacity: number, leakRate: number) {
        this.bucket = new LeakyBucket(capacity, leakRate)
    }

    async handleRequest(req: Request, res: Response, next: NextFunction) {
        if (this.bucket.addToken() == false) {
            return res.status(429).send("Too Many Requests")

        }

        next()
    }

    stop() {
        this.bucket.stop()
    }
}

export { LeakBucketRateLimiter }