const stateCodes = [
  'AN', 'AP', 'AR', 'AS', 'BR', 'CH', 'CG',
  'DD', 'DL', 'DN', 'GA', 'GJ', 'HR', 'HP',
  'JK', 'JH', 'KA', 'KL', 'LA', 'LD', 'MH',
  'ML', 'MN', 'MP', 'MZ', 'NL', 'OD', 'OR',
  'PB', 'PY', 'RJ', 'SK', 'TN', 'TG', 'TS',
  'TR', 'UK', 'UT', 'UP', 'WB',
]

const companyTypeCodes = {
  PTC: 'Private Limited Company',
  PLC: 'Public Limited Company',
  OPC: 'One Person Company',
  NPL: 'Section 8 / Non-Profit Company',
  GOI: 'Government of India Company',
  SGC: 'State Government Company',
  FLC: 'Foreign Company - Public',
  FTC: 'Foreign Company - Private',
  ULL: 'Unlimited Public Company',
  ULT: 'Unlimited Private Company',
  GAP: 'Guarantee and Association - Public',
  GAT: 'Guarantee and Association - Private',
}

function validateCIN(cin) {
  const pattern = /^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/

  if (!pattern.test(cin)) {
    return {
      valid: false,
      identifierType: 'CIN',
      error: 'CIN must contain 21 characters in the expected format.',
    }
  }

  const stateCode = cin.substring(6, 8)

  if (!stateCodes.includes(stateCode)) {
    return {
      valid: false,
      identifierType: 'CIN',
      error: `Unrecognized state code: ${stateCode}`,
    }
  }

  const year = Number(cin.substring(8, 12))
  const currentYear = new Date().getFullYear()

  if (year < 1900 || year > currentYear) {
    return {
      valid: false,
      identifierType: 'CIN',
      error: `Invalid incorporation year: ${year}`,
    }
  }

  const classificationCode = cin.substring(12, 15)

  const listingStatus = cin.startsWith('L')
    ? 'Listed'
    : 'Unlisted'

  return {
    valid: true,
    identifierType: 'CIN',
    stateCode,
    incorporationYear: String(year),
    listingStatus,
    companyType:
      companyTypeCodes[classificationCode] ||
      `Unknown classification code (${classificationCode})`,
  }
}

function validateLLPIN(llpin) {
  const pattern = /^[A-Z]{3}-\d{4}$/

  if (!pattern.test(llpin)) {
    return {
      valid: false,
      identifierType: 'LLPIN',
      error: 'LLPIN must follow the expected format: ABC-1234.',
    }
  }

  return {
    valid: true,
    identifierType: 'LLPIN',
  }
}

export function validateIdentifier(identifier) {
  const value = identifier.trim().toUpperCase()

  if (!value) {
    return {
      input: identifier,
      valid: false,
      error: 'Empty identifier.',
    }
  }

  if (value.startsWith('L') || value.startsWith('U')) {
    return {
      input: identifier,
      ...validateCIN(value),
    }
  }

  if (/^[A-Z]{3}-/.test(value)) {
    return {
      input: identifier,
      ...validateLLPIN(value),
    }
  }

  return {
    input: identifier,
    valid: false,
    error: 'Identifier type could not be determined.',
  }
}

export function validateBatch(input) {
  const identifiers = input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '')

  const seen = new Set()

  return identifiers.map((identifier) => {
    const normalized = identifier.toUpperCase()
    const result = validateIdentifier(identifier)

    if (seen.has(normalized)) {
      return {
        ...result,
        valid: false,
        error: 'Duplicate identifier in this batch.',
      }
    }

    seen.add(normalized)

    return result
  })
}