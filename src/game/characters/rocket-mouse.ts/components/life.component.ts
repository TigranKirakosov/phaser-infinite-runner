type onLifeChange = (amount: number) => void

class LifeComponent {
  private _amount: number
  private _immune: boolean = false
  private decreaseCallbacks: onLifeChange[] = []
  private immuneTID: number = 0
  
  constructor (amount: number) {
    this._amount = amount > 0 ? amount : 0
  }

  get amount () { return this._amount }
  
  isImmune () { return this._immune }
  setTempImmune () {
    clearTimeout(this.immuneTID)
    this._immune = true
    this.immuneTID = setTimeout(() => (this._immune = false), 10 * 200)
  }
  
  increase () { this._amount++ }
  decrease () {
    if (this._amount >= 0) this._amount--
    this.decreaseCallbacks.forEach(cb => cb(this._amount))
  }

  onDecrease (fn: onLifeChange) {
    this.decreaseCallbacks.push(fn)
    return () => this.decreaseCallbacks.filter(cb => cb !== fn)
  }
}

export default LifeComponent
