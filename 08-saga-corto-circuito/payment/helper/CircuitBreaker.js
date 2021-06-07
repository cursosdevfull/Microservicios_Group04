class CircuitBreaker {
  constructor(request, options = {}) {
    const defaults = {
      failureThreshold: 3,
      successThreshold: 2,
      timeout: 6000,
    };

    Object.assign(this, defaults, options, {
      request: request,
      state: 'CLOSED',
      failureCount: 0,
      successCount: 0,
      nextAttempt: Date.now(),
    });
  }

  async trigger() {
    if (this.state === 'OPENED') {
      if (this.nextAttempt <= Date.now()) {
        this.state = 'HALF';
      } else {
        throw new Error('Circuit is opened');
      }
    }

    try {
      const response = await this.request();
      return this.success(response);
    } catch (error) {
      return this.fail(error);
    }
  }

  status(action) {
    console.table({
      Action: action,
      Timestamp: Date.now(),
      Successes: this.successCount,
      Failures: this.failureCount,
      State: this.state,
    });
  }

  success(response) {
    if (this.state === 'HALF') {
      this.successCount++;
      if (this.successCount > this.successThreshold) {
        this.successCount = 0;
        this.state = 'CLOSED';
      }
    }

    this.failureCount = 0;
    this.status('Success');
    return response;
  }

  fail(err) {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPENED';
      this.nextAttempt = Date.now() + this.timeout;
    }

    this.status('Failure');
    return err;
  }
}

module.exports = CircuitBreaker;
