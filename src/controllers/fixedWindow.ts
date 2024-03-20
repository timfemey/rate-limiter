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
    handler: () => void
    /**The window Size is the time window and should be specified in milliseconds and maxRequests is number of requests allowed in the windowSize */
    constructor(windowSize: number, maxRequests: number, apiHandler: () => void) {
        this.counter = new FixedWindow(windowSize, maxRequests)
        this.handler = apiHandler
    }

    public async handleRequest(req: any, res: any) {
        if (this.counter.increment() == false) {
            return res.status(429).send("Too many Requests")
        }

        try {
            await this.handler()
        } catch (error) {
            console.error("Error occured handling request: ", error)
            res.status(500).send("Internal Server Error")
        }

    }
}

export { FixedWindowRateLimiter }