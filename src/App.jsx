import { useState } from 'react'
import { validateBatch } from './utils/validator'

function App() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [filter, setFilter] = useState('all')

  const MAX_IDENTIFIERS = 500

  const validCount = results.filter((result) => result.valid).length
  const invalidCount = results.length - validCount
  const filteredResults = results.filter((result) => {
  if (filter === 'valid') return result.valid
  if (filter === 'invalid') return !result.valid
  return true
})

  const cinCount = results.filter(
    (result) => result.valid && result.identifierType === 'CIN'
  ).length

  const llpinCount = results.filter(
    (result) => result.valid && result.identifierType === 'LLPIN'
  ).length

  const identifiers = input
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item !== '')

const sampleData = `L17110MH1973PLC019786
AAA-1234
U72200KA2015PTC082236
ABC123`

  const handleClear = () => {
    setInput('')
    setFilter('all')
    setResults([])
    setErrorMessage('')
  }

  const handleValidate = () => {
    setErrorMessage('')
    setFilter('all')
    setResults([])

    if (identifiers.length === 0) {
      setErrorMessage('Please enter at least one identifier.')
      return
    }

    if (identifiers.length > MAX_IDENTIFIERS) {
      setErrorMessage(
        `You can validate a maximum of ${MAX_IDENTIFIERS} identifiers at a time.`
      )
      return
    }

    const validationResults = validateBatch(input)
    setResults(validationResults)
  }

  const handleExportCSV = () => {
    if (results.length === 0) return

    const headers = [
      'Identifier',
      'Type',
      'Status',
      'Listing',
      'State',
      'Incorporation Year',
      'Company Type',
      'Error',
    ]

   const rows = filteredResults.map((result) => [
      result.input ?? '',
      result.identifierType ?? '',
      result.valid ? 'Valid Format' : 'Invalid',
      result.listingStatus ?? '',
      result.stateCode ?? '',
      result.incorporationYear ?? '',
      result.companyType ?? '',
      result.error ?? '',
    ])

    const escapeCSV = (value) => {
      let text = String(value ?? '')

      // Prevent spreadsheet formula injection
      if (/^[=+\-@]/.test(text)) {
        text = `'${text}`
      }

      return `"${text.replace(/"/g, '""')}"`
    }

    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map((row) => row.map(escapeCSV).join(',')),
    ].join('\n')

    // BOM helps Excel recognize UTF-8 correctly
    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'filesure-validation-results.csv'

    document.body.appendChild(link)
    link.click()
    link.remove()

    // Allow the browser time to process the download
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>

            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white">
                FileSure
              </h1>
              <p className="text-xs text-slate-400">
                Identifier Validation
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-slate-700 px-3 py-1.5 sm:flex">
            <span className="h-2 w-2 rounded-full bg-teal-400"></span>
            <span className="text-xs text-slate-300">
              Validation Workspace
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Intro */}
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
              Company & LLP Verification Tool
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Company Identifier Checker
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-500">
              Validate CINs and LLPINs in bulk. Identify invalid formats
              and extract key registration details from company
              identifiers.
            </p>
          </div>

          {/* Input Workspace */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {/* Input Header */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Enter identifiers
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Paste CINs and LLPINs below, one per line.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setInput(sampleData)
                  setResults([])
                  setErrorMessage('')
                }}
                className="self-start rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-100"
              >
                Load sample data
              </button>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  setResults([])
                  setErrorMessage('')
                }}
                placeholder={`Paste identifiers here...

Example:
L17110MH1973PLC019786
AAA-1234`}
                spellCheck={false}
                className="min-h-64 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 font-mono text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-50"
              />
            </div>

            {/* Input Footer */}
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-slate-500">
                  {identifiers.length} / {MAX_IDENTIFIERS} identifiers
                </span>

                {identifiers.length > MAX_IDENTIFIERS && (
                  <span className="font-medium text-red-600">
                    Limit exceeded
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleClear}
                disabled={input.length === 0}
                className="self-start text-sm font-medium text-slate-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Clear input
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex gap-3">
                <div className="mt-0.5 text-teal-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700">
                    How it works
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Enter one CIN or LLPIN per line. Empty lines will
                    be ignored. You can process multiple identifiers
                    in a single batch.
                  </p>
                </div>
              </div>
            </div>

            {/* Validation Error */}
            {errorMessage && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            {/* Validate Button */}
            <button
              type="button"
              onClick={handleValidate}
              disabled={identifiers.length === 0}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
                <path d="m9 12 2 2 4-4" />
              </svg>

              Validate identifiers
            </button>
          </div>

          {/* Disclaimer */}
          <p className="mt-6 text-center text-xs leading-5 text-slate-400">
            This tool performs structural validation. Format validity
            does not confirm registration or official company status.
          </p>

          {/* Summary Cards */}
          {results.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {/* Total */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Total Processed</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {results.length}
                </p>
              </div>

              {/* Valid */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Valid</p>
                <p className="mt-2 text-2xl font-bold text-teal-700">
                  {validCount}
                </p>
              </div>

              {/* Invalid */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Invalid</p>
                <p className="mt-2 text-2xl font-bold text-red-600">
                  {invalidCount}
                </p>
              </div>

              {/* Identifier Types */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">CIN / LLPIN</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {cinCount} / {llpinCount}
                </p>
              </div>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
{/* Results Header */}
<div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h3 className="text-lg font-semibold text-slate-900">
        Validation Results
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Showing {filteredResults.length} of {results.length} identifiers
      </p>
    </div>

    <button
      type="button"
      onClick={handleExportCSV}
      disabled={filteredResults.length === 0}
      className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Download CSV
    </button>
  </div>

  {/* Result Filters */}
  <div className="flex flex-wrap gap-2">
    {[
      { key: 'all', label: `All (${results.length})` },
      { key: 'valid', label: `Valid (${validCount})` },
      { key: 'invalid', label: `Invalid (${invalidCount})` },
    ].map((option) => (
      <button
        key={option.key}
        type="button"
        onClick={() => setFilter(option.key)}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
          filter === option.key
            ? 'bg-teal-700 text-white'
            : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
</div>

              {/* Results Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3">Identifier</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Listing</th>
                      <th className="px-4 py-3">State</th>
                      <th className="px-4 py-3">Year</th>
                      <th className="px-4 py-3">Company Type</th>
                      <th className="px-4 py-3">Error</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredResults.map((result, index) => (
                      <tr key={`${result.input}-${index}`}>
                        <td className="px-4 py-4 font-mono text-slate-800">
                          {result.input}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {result.identifierType || '-'}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                              result.valid
                                ? 'bg-teal-50 text-teal-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {result.valid ? 'Valid Format' : 'Invalid'}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {result.listingStatus || '-'}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {result.stateCode || '-'}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {result.incorporationYear || '-'}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {result.companyType || '-'}
                        </td>

                        <td className="px-4 py-4 text-red-600">
                          {result.error || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App