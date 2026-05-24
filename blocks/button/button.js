export default function decorate(block) {
  const links = block.querySelectorAll('a');
  const wrapper = document.createElement('div');
  wrapper.className = 'button-group';

  links.forEach((a) => {
    a.className = 'button-link';
    const li = a.closest('div');
    if (li) {
      const text = a.textContent.trim();
      a.title = a.title || text;
    }
    wrapper.append(a);
  });

  block.textContent = '';
  block.append(wrapper);

  // Apply variant classes from block variants
  if (block.classList.contains('secondary')) {
    wrapper.querySelectorAll('.button-link').forEach((a) => a.classList.add('secondary'));
  } else if (block.classList.contains('cta')) {
    wrapper.querySelectorAll('.button-link').forEach((a) => a.classList.add('cta'));
  } else {
    wrapper.querySelectorAll('.button-link').forEach((a) => a.classList.add('primary'));
  }
}
