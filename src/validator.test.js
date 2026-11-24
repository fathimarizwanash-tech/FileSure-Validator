import { describe, it, expect } from 'vitest'
import { validateIdentifier, validateBatch } from './utils/validator'

describe('Identifier Validation', () => {
  it('accepts a structurally valid CIN', () => {
    const result = validateIdentifier('L17110MH1973PLC019786')

    expect(result.valid).toBe(true)
    expect(result.identifierType).toBe('CIN')
    expect(result.stateCode).toBe('MH')
    expect(result.incorporationYear).toBe('1973')
  })

  it('rejects an incorrectly formatted CIN', () => {
    const result = validateIdentifier('ABC123')

    expect(result.valid).toBe(false)
  })

  it('accepts an LLPIN in the provisional expected format', () => {
    const result = validateIdentifier('AAA-1234')

    expect(result.valid).toBe(true)
    expect(result.identifierType).toBe('LLPIN')
  })

  it('rejects an incorrectly formatted LLPIN', () => {
    const result = validateIdentifier('AA-12345')

    expect(result.valid).toBe(false)
  })

  it('ignores empty lines when validating a batch', () => {
    const results = validateBatch(
      'L17110MH1973PLC019786\n\nAAA-1234\n\nABC123'
    )

    expect(results).toHaveLength(3)
  })

  it('handles lowercase input', () => {
    const result = validateIdentifier('l17110mh1973plc019786')

    expect(result.valid).toBe(true)
    expect(result.identifierType).toBe('CIN')
  })
  it('flags duplicate identifiers in a batch', () => {
  const results = validateBatch(
    'L17110MH1973PLC019786\nl17110mh1973plc019786'
  )

  expect(results).toHaveLength(2)
  expect(results[0].valid).toBe(true)
  expect(results[1].valid).toBe(false)
  expect(results[1].error).toBe('Duplicate identifier in this batch.')
})
})