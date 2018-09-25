export const bundleScript = filename => `
    <script id='bundle-script' type="text/javascript" charset="utf-8">
      (function () {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '${filename}';
        var s = document.getElementById('bundle-script');
        s.parentNode.insertBefore(script, s);
      })();
    </script>`;

export const devConfig = (projectConfig) => {
  let config = {
    url: 'https://www.currys.co.uk/gbuk/index.html',
    port: 8080
  };

  config = Object.assign({}, config, projectConfig);

  return config;
};

// Emojis yeay
// https://www.webpagefx.com/tools/emoji-cheat-sheet/
