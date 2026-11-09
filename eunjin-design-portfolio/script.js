(() => {
  const openDetailFromHash = () => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const target = document.getElementById(id);
    if (target instanceof HTMLDetailsElement) {
      target.open = true;
      requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  };

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!(target instanceof HTMLDetailsElement)) return;
      event.preventDefault();
      target.open = true;
      history.pushState(null, '', href);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.querySelectorAll('.project-detail').forEach((detail) => {
    detail.addEventListener('toggle', () => {
      const label = detail.querySelector('.detail-toggle');
      if (!label) return;
      label.firstChild.textContent = detail.open ? '접기 ' : '상세 보기 ';
    });
  });


  // Horizontal carousel: the next slide enters from the RIGHT every 3 seconds.
  // The track moves left by one viewport, then the finished slide is rotated to the front.
  const heroTrack = document.querySelector('.hero-slide-track');
  const heroCaption = document.querySelector('.hero-caption');
  const heroIndex = document.querySelector('.hero-index-number');
  if (heroTrack && heroTrack.children.length > 1 && heroCaption && heroIndex) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      let transitioning = false;

      window.setInterval(() => {
        if (transitioning) return;

        const currentSlide = heroTrack.children[0];
        const nextSlide = heroTrack.children[1];
        if (!currentSlide || !nextSlide) return;

        transitioning = true;
        heroTrack.style.transition = 'none';
        heroTrack.style.transform = 'translateX(0)';
        void heroTrack.offsetWidth;

        currentSlide.setAttribute('aria-hidden', 'true');
        nextSlide.removeAttribute('aria-hidden');
        heroCaption.textContent = nextSlide.dataset.caption || '';
        heroIndex.textContent = nextSlide.dataset.index || '';

        requestAnimationFrame(() => {
          heroTrack.style.transition = 'transform .72s cubic-bezier(.22,.61,.36,1)';
          heroTrack.style.transform = 'translateX(-50%)';
        });

        heroTrack.addEventListener('transitionend', (event) => {
          if (event.target !== heroTrack || event.propertyName !== 'transform') return;
          heroTrack.style.transition = 'none';
          heroTrack.appendChild(currentSlide);
          heroTrack.style.transform = 'translateX(0)';
          void heroTrack.offsetWidth;
          transitioning = false;
        }, { once: true });
      }, 3000);
    }
  }

  window.addEventListener('hashchange', openDetailFromHash);
  openDetailFromHash();
})();
