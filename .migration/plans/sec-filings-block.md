# SEC Filings Block Plan

## Overview

Create a new `sec-filings` block that fetches data from a SEC EDGAR JSON endpoint (authored as plain text URL in the block content), parses the response, and renders a table with columns: **Filing Date**, **Form Type**, **Description**, and **Primary Document**.

## Assumptions

- The SEC JSON endpoint structure: `data.filings.recent` contains arrays for `filingDate`, `form`, `primaryDocDescription`, and `primaryDocument`
- Client-side fetch with proper headers (SEC requires a User-Agent identifying the requester)
- Author provides the URL as plain text in the block's single cell
- Simple static HTML table (no sorting/pagination)

## Content Model (Author's View)

The block is authored as a single-row, single-column table:

| **SEC Filings** |
|---|
| https://data.sec.gov/submissions/CIK0001755672.json |

## Technical Approach

### Block JavaScript (`blocks/sec-filings/sec-filings.js`)

1. Extract the authored URL from the block's text content
2. Fetch the JSON data using `fetch()` with a User-Agent header
3. Parse `response.filings.recent` arrays
4. Build an HTML `<table>` with columns:
   - **Filing Date** → `filingDate[]`
   - **Form Type** → `form[]`
   - **Description** → `primaryDocDescription[]`
   - **Primary Document** → `primaryDocument[]` (rendered as a link to the SEC archives)
5. Replace block content with the generated table
6. Handle loading state and error gracefully

### Block CSS (`blocks/sec-filings/sec-filings.css`)

- Responsive table styling (horizontal scroll on mobile)
- Striped rows for readability
- Consistent typography with project styles
- Scoped selectors (`.sec-filings table`, `.sec-filings th`, etc.)

## File Changes

| File | Action | Purpose |
|------|--------|---------|
| `blocks/sec-filings/sec-filings.js` | Create | Block decoration logic: fetch, parse, render table |
| `blocks/sec-filings/sec-filings.css` | Create | Table styling, responsive layout |

## Checklist

- [ ] Create `blocks/sec-filings/` directory
- [ ] Create `sec-filings.js` with decorate function (fetch URL, parse JSON, build table)
- [ ] Create `sec-filings.css` with responsive table styles
- [ ] Test block renders correctly with the SEC endpoint
- [ ] Verify error handling (invalid URL, network failure, empty data)
- [ ] Run `npm run lint` and fix any issues

## Key Implementation Details

- The primary document link will point to: `https://www.sec.gov/Archives/edgar/data/{cik}/{accessionNumber}/{primaryDocument}`
- The CIK and accession number are available in the JSON response
- A loading indicator will display while data is being fetched
- If the fetch fails (e.g., CORS blocked), a user-friendly error message will be shown

---

*Execution requires exiting Plan mode.*
