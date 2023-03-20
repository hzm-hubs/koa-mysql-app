// 个性化Promise
export default class MyPromise {
    // pengding 待定 / fulfilled 已兑现 / rejected已拒绝
    status = 'pending'

    // 当前值
    value = null
  
    // 错误信息
    error = null
  
    // 成功的回调
    onFulfilledCallbacks = []
  
    // 失败的回调
    onRejectedCallbacks = []
  
    constructor(executor) {
      // console.log('传入数据', executor)
      try {
        executor(this.resolve.bind(this), this.reject.bind(this))
      } catch (error) {
        this.reject(error)
      }
    }
  
    // 成功
    resolve(value) {
      if (this.status !== 'pending') {
        return
      }
      this.status = 'fulfilled'
      this.value = value
      // 调用then里面的回调
      while (this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()(this.value)
      }
    }
  
    // 失败
    reject(reason) {
      if (this.status !== 'pending') {
        return
      }
      this.status = 'rejected'
      this.value = reason
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(this.value)
      }
    }
  
    threwError(value) {
      this.error = value
      throw new Error(value)
    }
  
    then(onFulfilled, onRejected) {
      onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (val) => val
      onRejected = typeof onRejected === 'function' ? onRejected : (val) => this.threwError(val)
  
      const thenPromise = new MyPromise((resolve, reject) => {
        const resolvePromise = (callback) => {
          // 让整个回调函数比同步代码晚一点执行
          setTimeout(() => {
            try {
              const x = () => callback(this.value)
              if (x === thenPromise) {
                // 你正在返回自身
                throw new Error('不允许返回自身！')
              }
              if (x instanceof MyPromise) {
                // 返回的是一个Promise对象
                x.then(resolve, reject)
              } else {
                // 直接返回一个值，作为resolve的值，传递给下一个.then
                resolve(x)
              }
            } catch (error) {
              reject(error)
              this.threwError(error)
            }
          })
        }
        if (this.status === 'fulfilled') {
          resolvePromise(onFulfilled)
        } else if (this.status === 'rejected') {
          resolvePromise(onRejected)
        } else if (this.status === 'pending') {
          this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFulfilled))
          this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected))
        }
      })
  
      return thenPromise
    }
  }
  