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

class RateLimiter {
    handler: () => void
    protected bucket: LeakyBucket
    constructor(capacity: number, leakRate: number, apiHandler: () => void) {
        this.bucket = new LeakyBucket(capacity, leakRate)
        this.handler = apiHandler
    }

    async handleRequest(req: any, res: any) {
        if (this.bucket.addToken() == false) {
            return res.status(429).send("Too Many Requests")

        }

        try {
            await this.handler
        } catch (error) {
            console.error("Error Handling Request: ", error)
            res.status(500).send("Internal Server Error")
        }
    }

    stop() {
        this.bucket.stop()
    }
}

export { RateLimiter }