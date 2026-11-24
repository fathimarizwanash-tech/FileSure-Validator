# FileSure — Company Identifier Validator

FileSure is a responsive web application for bulk structural validation of Corporate Identification Numbers (CINs) and Limited Liability Partnership Identification Numbers (LLPINs).

It allows users to paste multiple identifiers, validate their formats, identify structurally invalid inputs, extract available identifier fields, filter results and export results as CSV.

## Live Demo

**Live Application:** https://filesure-validator-abc.vercel.app

**GitHub Repository:** https://github.com/fathimarizwanash-tech/FileSure-Validator

---

## Features

- **Bulk validation:** Process up to 500 identifiers in a single batch.
- **CIN validation:** Check CIN structure and extract available structural fields.
- **LLPIN validation:** Validate LLPINs against the application's expected format.
- **Automatic identifier detection:** Identify CINs and LLPINs based on their input structure.
- **Duplicate detection:** Flag duplicate identifiers within the same batch.
- **Case normalization:** Handle lowercase inputs by normalizing identifiers.
- **Input handling:** Ignore blank lines and handle empty or malformed entries.
- **Batch limit:** Prevent processing batches containing more than 500 non-empty identifiers.
- **Result filtering:** Filter results by all, valid and invalid identifiers.
- **CSV export:** Download filtered validation results.
- **Responsive interface:** Designed to work across different screen sizes.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| JavaScript | Application logic |
| Vite | Development server and build tool |
| Tailwind CSS | Styling |
| Vitest | Unit testing |
| ESLint | Code quality and linting |
| Git & GitHub | Version control |
| Vercel | Deployment |

---

## What FileSure Extracts

For structurally valid CINs, FileSure attempts to extract:

- Identifier type
- Listing prefix classification
- State code
- Incorporation year
- Company classification code

LLPINs are checked against the application's expected structural format.

---

## Validation Scope and Limitations

FileSure performs **structural validation** based on programmed format rules.

It does not currently connect to the Ministry of Corporate Affairs (MCA) database or perform live registry verification.

Therefore, a structurally valid identifier does not necessarily mean that the company or LLP exists, is active, or has a verified current listing status.

The results should be treated as format-validation results rather than official registry confirmation.

---

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository:

\`\`\`bash
git clone https://github.com/fathimarizwanash-tech/FileSure-Validator.git
\`\`\`

Navigate into the project directory:

\`\`\`bash
cd FileSure-Validator
\`\`\`

Install dependencies:

\`\`\`bash
npm install
\`\`\`

Start the development server:

\`\`\`bash
npm run dev
\`\`\`

Open the local URL displayed in your terminal.

---

## Testing

Run the automated tests:

\`\`\`bash
npm run test
\`\`\`

Run the production build:

\`\`\`bash
npm run build
\`\`\`

Run ESLint:

\`\`\`bash
npm run lint
\`\`\`

---

## Batch Processing

FileSure supports batches of up to 500 non-empty identifiers.

The application:

1. Accepts identifiers separated by lines.
2. Normalizes input.
3. Detects identifier type.
4. Validates structural formats.
5. Flags duplicates.
6. Produces validation results.
7. Allows filtering and CSV export.

---

## Deployment

The application is deployed using Vercel and connected to the GitHub repository.

Deployment URL: https://filesure-validator-abc.vercel.app
---

## Project

Developed as a technical assignment demonstrating frontend development, input validation, batch processing, testing, responsive UI design, CSV export and deployment.