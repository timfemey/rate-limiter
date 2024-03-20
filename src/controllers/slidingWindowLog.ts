import { Request, Response, NextFunction } from "express"

class SlidingWindowLog {
    readonly windowSize: number
    readonly maxRequests: number
    log: number[]
    constructor(windowSize: number, maxRequests: number) {
        this.windowSize = windowSize
        this.maxRequests = maxRequests
        this.log = []
    }

    public addReq(timestamp: number) {
        this.log = this.log.filter((reqTime) => (timestamp - reqTime) <= this.windowSize)
        this.log.push(timestamp)
        return this.log.length <= this.maxRequests
    }
}

class SlidingWindowLogRateLimiter {

    readonly windowSize: number
    readonly maxRequests: number
    slidingWindowLog: SlidingWindowLog

    /** windowSize is supposed to be in milliiseconds, The time window
     * maxRequests is the number of requests allowed in the time window
     */
    constructor(windowSize: number, maxRequests: number) {
        this.windowSize = windowSize
        this.maxRequests = maxRequests

        this.slidingWindowLog = new SlidingWindowLog(windowSize, maxRequests)
    }

    async handleRequest(req: Request, res: Response, next: NextFunction) {
        const timestamp = Date.now()
        if (this.slidingWindowLog.addReq(timestamp) == false) {
            return res.status(429).send("Too Many Requests")
        }

        next()
    }
}

export { SlidingWindowLogRateLimiter }