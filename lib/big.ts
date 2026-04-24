import Big from "big.js"

Big.DP = 18
Big.RM = Big.roundHalfUp

export { Big }

export function toBig(value: string | number | Big): Big {
  return new Big(value)
}

export function formatBig(value: Big, dp: number = 2): string {
  const fixed = value.toFixed(dp)
  const [intPart, decPart] = fixed.split(".")
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return decPart !== undefined ? `${formatted}.${decPart}` : formatted
}

export function safeDivide(numerator: Big, denominator: Big): Big {
  if (denominator.eq(0)) return new Big(0)
  return numerator.div(denominator)
}

export function clampZero(value: Big): Big {
  return value.lt(0) ? new Big(0) : value
}
