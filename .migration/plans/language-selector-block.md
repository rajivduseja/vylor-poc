Let me check the existing project structure to understand what's already in place.Now I have enough context to build the plan. Let me look at an existing block to understand the pattern.# Language Selector Block Plan

## Overview
Create a new **language-selector** block that renders a dropdown menu with flag icons and language names. Clicking a language navigates to a corresponding URL path. The block is standalone and can be placed anywhere on the page.

## Content Model (Authoring Structure)

Authors create the block as a table in their document:

| Language Selector |
|---|
| :flag-us: English \| /en/ |
| :flag-fr: Français \| /fr/ |
| :flag-de: Deutsch \| /de/ |
| :flag-es: Español \| /es/ |

Each row contains:
- An icon reference (flag) — uses the standard `:icon-name:` syntax rendered by `decorateIcons`
- The language display name
- A link (the URL path to navigate to for that language)

The first row (or the row matching the current path) is treated as the currently active language.

## File Structure

```
blocks/
  language-selector/
    language-selector.js    # Block decoration logic
    language-selector.css   # Block styles
icons/
    flag-us.svg             # US flag icon
    flag-fr.svg             # France flag icon
    flag-de.svg             # Germany flag icon
    flag-es.svg             # Spain flag icon
```

## Behavior

1. **Initialization**: Parse authored rows to extract flag icon, language name, and target URL for each language
2. **Active language detection**: Match current `window.location.pathname` against authored URLs to determine active language
3. **Dropdown toggle**: Click the trigger button to open/close the dropdown list
4. **Language switch**: Clicking a language option navigates to its URL
5. **Outside click**: Clicking outside the dropdown closes it
6. **Keyboard accessibility**: Support `Escape` to close, arrow keys to navigate options, `Enter` to select

## Rendered DOM Structure

```html
<div class="language-selector">
  <button class="language-selector-toggle" aria-expanded="false" aria-haspopup="listbox">
    <span class="icon icon-flag-us"><img src="/icons/flag-us.svg" alt=""></span>
    <span class="language-selector-label">English</span>
    <span class="language-selector-chevron"></span>
  </button>
  <ul class="language-selector-list" role="listbox" hidden>
    <li class="language-selector-item active" role="option" aria-selected="true">
      <a href="/en/">
        <span class="icon icon-flag-us"><img src="/icons/flag-us.svg" alt=""></span>
        English
      </a>
    </li>
    <li class="language-selector-item" role="option">
      <a href="/fr/">
        <span class="icon icon-flag-fr"><img src="/icons/flag-fr.svg" alt=""></span>
        Français
      </a>
    </li>
    <!-- ... more items -->
  </ul>
</div>
```

## Styling

- Compact trigger button with flag, label, and chevron indicator
- Dropdown list positioned absolutely below the trigger
- Hover/focus states for items
- Active language highlighted
- Mobile-friendly touch targets (min 44px height)
- Respects project design tokens (colors, fonts, border-radius)
- Smooth open/close transition

## Accessibility

- `aria-expanded` on toggle button
- `aria-haspopup="listbox"` on toggle
- `role="listbox"` on the list, `role="option"` on items
- `aria-selected="true"` on active language
- Focus trapping within open dropdown
- Keyboard navigation (Escape, ArrowUp/Down, Enter)

## Flag Icons

Simple, clean SVG flag icons will be added to the `/icons/` directory. These follow the existing icon convention (`:icon-name:` in content maps to `/icons/{name}.svg`).

## Checklist

- [ ] Create `/workspace/blocks/language-selector/` directory
- [ ] Create `language-selector.js` with dropdown decoration logic
- [ ] Create `language-selector.css` with responsive dropdown styles
- [ ] Add flag SVG icons (`flag-us.svg`, `flag-fr.svg`, `flag-de.svg`, `flag-es.svg`)
- [ ] Create test content HTML file to demonstrate the block
- [ ] Start dev server and verify rendering in preview
- [ ] Test dropdown open/close behavior
- [ ] Test keyboard accessibility (Escape, arrows, Enter)
- [ ] Test active language detection based on current URL path
- [ ] Run linting (`npm run lint`) and fix any issues

## Notes

- No external dependencies — pure vanilla JS/CSS per project standards
- The block is self-contained and reusable
- Authors control which languages appear and their URLs via the content table
- To switch to Execute mode, exit Plan mode and request implementation
