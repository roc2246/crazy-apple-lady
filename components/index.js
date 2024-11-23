function top(pageName) {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Crazy Apple Lady - ${pageName}</title>
        <link rel="stylesheet" href="style.css" />
      </head>
      `;
}

function hero() {
  return `<header class="hero">
    <h1 class="hero__heading">Crazy Apple Lady</h1>
    <p class="hero__slogan">
      “Cultivate Life: Where Fungi Flourish, Greenery Grows, and Style Speaks
      Volumes!”
    </p>
  
    <nav class="hero__nav">
      <button class="btn btn__hero-nav">
        <a href="/" class="hero__link">Crazy Apple Lady Tee-Shirt Co</a>
      </button>
      <button class="btn btn__hero-nav">
        <a href="/mushroom-blogs" class="hero__link">Mushroom Blogs</a>
      </button>
      <button class="btn btn__hero-nav">
        <a href="planty-life" class="hero__link">It's a Planty Life</a>
      </button>
    </nav>
  </header>
    `;
}

function bottom(script) {
  return `<footer class="footer">
    <h3 class="footer__heading">Social Media</h3>
    <nav class="social-media">
      <a href="" class="social-media__link"
        ><img src="" alt="" class="social-media__icon"
      /></a>
      <a href="" class="social-media__link"
        ><img src="" alt="" class="social-media__icon"
      /></a>
    </nav>
  </footer>
  <script type="module" src="../${script}"></script>
</body>
</html>`;
}

function blogPost(blogTitle, blogContent, blogImg) {
  return `${top(blogTitle)}
  ${hero()}
  <main class="post">
    ${blogImg
      .map(
        (img, index) =>
          `<img src="${img}" alt="${blogTitle}-${
            index + 1
          }" class="post__img" />`
      )
      .join("")}
    <h1 class="post__heading">${blogTitle}</h1>
    <section class="post__content">
        ${blogContent}
    </section>
  </main>
  ${bottom("post.js")}`;
}

module.exports = {
  top,
  hero,
  bottom,
  blogPost,
};
