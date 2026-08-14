const SECRET_PATTERNS = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /\b(?:sk|pk)_(?:live|test)_[A-Za-z0-9]{16,}\b/,
  /\bgh[opusr]_[A-Za-z0-9_]{20,}\b/,
  /\bAIza[A-Za-z0-9_-]{30,}\b/,
  /\b(?:api[_ -]?key|password|private[_ -]?key|access[_ -]?token)\s*[:=]\s*\S{8,}/i,
]

export function containsLikelySecret(values: string[]): boolean {
  return values.some(value => SECRET_PATTERNS.some(pattern => pattern.test(value)))
}
