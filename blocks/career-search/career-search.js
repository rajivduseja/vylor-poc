export default function decorate(block) {
  const rows = [...block.children];
  const searchUrl = rows[0]?.textContent.trim() || '';
  const employeeRow = rows[1];
  const talentRow = rows[2];

  block.textContent = '';

  // Search section
  const searchSection = document.createElement('div');
  searchSection.className = 'career-search-form';

  const heading = document.createElement('h2');
  heading.textContent = 'Search Jobs';
  searchSection.append(heading);

  const form = document.createElement('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = form.querySelector('[name="title"]').value.trim();
    const location = form.querySelector('[name="location"]').value.trim();
    const url = new URL(searchUrl, window.location.origin);
    if (title) url.searchParams.set('query', title);
    if (location) url.searchParams.set('location', location);
    window.open(url.toString(), '_blank');
  });

  const titleWrapper = document.createElement('div');
  titleWrapper.className = 'career-search-autocomplete';

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.name = 'title';
  titleInput.placeholder = 'Search by job title';
  titleInput.setAttribute('aria-label', 'Search by job title');
  titleInput.setAttribute('autocomplete', 'off');

  const suggestionsList = document.createElement('ul');
  suggestionsList.className = 'career-search-suggestions';

  let debounceTimer;
  titleInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const term = titleInput.value.trim();
    if (term.length < 2) {
      suggestionsList.innerHTML = '';
      suggestionsList.hidden = true;
      return;
    }
    debounceTimer = setTimeout(async () => {
      try {
        const resp = await fetch(`https://corteva.eightfold.ai/api/suggest?&dictionary=job_search&domain=corteva.com&term=${encodeURIComponent(term)}`);
        if (!resp.ok) return;
        const data = await resp.json();
        const suggestions = Array.isArray(data) ? data : data.suggestions || [];
        suggestionsList.innerHTML = '';
        if (suggestions.length === 0) {
          suggestionsList.hidden = true;
          return;
        }
        suggestions.forEach((item) => {
          const label = typeof item === 'string' ? item : item.label || item.text || item.value || '';
          if (!label) return;
          const li = document.createElement('li');
          li.textContent = label;
          li.addEventListener('click', () => {
            titleInput.value = label;
            suggestionsList.innerHTML = '';
            suggestionsList.hidden = true;
          });
          suggestionsList.append(li);
        });
        suggestionsList.hidden = false;
      } catch { /* ignore */ }
    }, 300);
  });

  document.addEventListener('click', (e) => {
    if (!titleWrapper.contains(e.target)) {
      suggestionsList.innerHTML = '';
      suggestionsList.hidden = true;
    }
  });

  titleWrapper.append(titleInput, suggestionsList);

  const locationWrapper = document.createElement('div');
  locationWrapper.className = 'career-search-autocomplete';

  const locationInput = document.createElement('input');
  locationInput.type = 'text';
  locationInput.name = 'location';
  locationInput.placeholder = 'Search by location';
  locationInput.setAttribute('aria-label', 'Search by location');
  locationInput.setAttribute('autocomplete', 'off');

  const locationSuggestions = document.createElement('ul');
  locationSuggestions.className = 'career-search-suggestions';

  let locationDebounce;
  locationInput.addEventListener('input', () => {
    clearTimeout(locationDebounce);
    const term = locationInput.value.trim();
    if (term.length < 2) {
      locationSuggestions.innerHTML = '';
      locationSuggestions.hidden = true;
      return;
    }
    locationDebounce = setTimeout(async () => {
      try {
        const resp = await fetch(`https://careers.corteva.com/wp-admin/admin-ajax.php?action=locationList&domain=corteva.com&data=${encodeURIComponent(term)}`);
        if (!resp.ok) return;
        const data = await resp.json();
        const suggestions = Array.isArray(data) ? data : data.suggestions || [];
        locationSuggestions.innerHTML = '';
        if (suggestions.length === 0) {
          locationSuggestions.hidden = true;
          return;
        }
        suggestions.forEach((item) => {
          const label = typeof item === 'string' ? item : item.label || item.text || item.value || '';
          if (!label) return;
          const li = document.createElement('li');
          li.textContent = label;
          li.addEventListener('click', () => {
            locationInput.value = label;
            locationSuggestions.innerHTML = '';
            locationSuggestions.hidden = true;
          });
          locationSuggestions.append(li);
        });
        locationSuggestions.hidden = false;
      } catch { /* ignore */ }
    }, 300);
  });

  document.addEventListener('click', (e) => {
    if (!locationWrapper.contains(e.target)) {
      locationSuggestions.innerHTML = '';
      locationSuggestions.hidden = true;
    }
  });

  locationWrapper.append(locationInput, locationSuggestions);

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.setAttribute('aria-label', 'Search');
  submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

  form.append(titleWrapper, locationWrapper, submitBtn);
  searchSection.append(form);

  // Employee link row
  if (employeeRow) {
    const employeeDiv = document.createElement('div');
    employeeDiv.className = 'career-search-employee';
    employeeDiv.innerHTML = employeeRow.innerHTML;
    searchSection.append(employeeDiv);
  }

  block.append(searchSection);

  // Talent network section
  if (talentRow) {
    const talentSection = document.createElement('div');
    talentSection.className = 'career-search-talent';
    talentSection.innerHTML = talentRow.innerHTML;
    block.append(talentSection);
  }
}
