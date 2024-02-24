export interface Future {
  ticker: string
  asset: string
  expiration: string
  strikePrice: number
  quantity: number
  premium: number
}

export interface FutureResult {
  FutureId: number
  Ticker: string
  Asset: string
  Expiration: string
  StrikePrice: number
  Quantity: number
  Premium: number
}
