$(() => {
  // banner
  const banner = new Banner('main', { focus: 2, delay: 8000 });
  banner.autoplay();

  // banner lite
  const bannerlite = new BannerLite('lite', { focus: 3, delay: 4000 });
  bannerlite.autoplay();
});
