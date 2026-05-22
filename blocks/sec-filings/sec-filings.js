export default async function decorate(block) {
  const url = block.textContent.trim();
  block.textContent = '';

  if (!url) {
    block.innerHTML = '<p>No URL provided.</p>';
    return;
  }

  const loading = document.createElement('p');
  loading.textContent = 'Loading filings…';
  block.append(loading);

  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'EDS-SEC-Filings admin@example.com' },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();

    const recent = data?.filings?.recent;
    if (!recent || !recent.filingDate?.length) {
      block.innerHTML = '<p>No filings data available.</p>';
      return;
    }

    const { cik } = data;
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    thead.innerHTML = `<tr>
      <th>Filing Date</th>
      <th>Form Type</th>
      <th>Description</th>
      <th>Primary Document</th>
    </tr>`;
    table.append(thead);

    const tbody = document.createElement('tbody');
    const count = recent.filingDate.length;
    for (let i = 0; i < count; i += 1) {
      const accession = recent.accessionNumber[i].replace(/-/g, '');
      const docUrl = `https://www.sec.gov/Archives/edgar/data/${cik}/${accession}/${recent.primaryDocument[i]}`;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${recent.filingDate[i]}</td>
        <td>${recent.form[i]}</td>
        <td>${recent.primaryDocDescription[i] || '—'}</td>
        <td><a href="${docUrl}" target="_blank" rel="noopener noreferrer">${recent.primaryDocument[i]}</a></td>
      `;
      tbody.append(row);
    }
    table.append(tbody);

    block.textContent = '';
    block.append(table);
  } catch (err) {
    block.innerHTML = `<p>Failed to load filings: ${err.message}</p>`;
  }
}
