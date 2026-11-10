Reveal.initialize({
  width: 1920, height: 1080, margin: 0, minScale: 0.1, maxScale: 2,
  center: false, display: 'flex', hash: true,
  transition: 'fade', backgroundTransition: 'fade',
  controls: true, progress: true, slideNumber: 'c/t',
  plugins: [RevealNotes].concat(window.RevealMarkdown ? [RevealMarkdown] : []),
});
