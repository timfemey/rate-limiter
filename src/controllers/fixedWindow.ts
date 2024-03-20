import { Request, Response, NextFunction } from "express"

class FixedWindow {

    readonly windowSize: number
    readonly maxRequests: number
    protected requestCount: number
    protected windowStart: number

    constructor(windowSize: number, maxRequests: number) {
        this.windowSize = windowSize
        this.maxRequests = maxRequests
        this.requestCount = 0
        this.windowStart = Date.now()
    }

    public increment() {
        const now = Date.now()
        if ((now - this.windowStart) >= this.windowSize) {
            this.requestCount = 1
            this.windowStart = now
        } else {
            this.requestCount += 1
        }
        return this.maxRequests >= this.requestCount;
    }
}

class FixedWindowRateLimiter {
    counter: FixedWindow;

    /**The window Size is the time window and should be specified in milliseconds and maxRequests is number of requests allowed in the windowSize */
    constructor(windowSize: number, maxRequests: number) {
        this.counter = new FixedWindow(windowSize, maxRequests)

    }

    public async handleRequest(req: Request, res: Response, next: NextFunction) {
        if (this.counter.increment() == false) {
            return res.status(429).send("Too many Requests")
        }

        next()

    }
}

export { FixedWindowRateLimiter }