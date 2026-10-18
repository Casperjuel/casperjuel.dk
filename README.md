# casperjuel.dk

Personal site. Plain HTML, CSS and JavaScript. No build step, no framework, no `node_modules`.
The only dependency is three.js, loaded from a CDN through an import map.

## Run

```sh
node serve.mjs          # http://localhost:3000
PORT=4321 node serve.mjs
```

Or open `index.html` through any static server. The hero scene is an ES module, so `file://` won't work.

## Files

| File | What |
|---|---|
| `index.html` | The page. Read the HTML comment at the top of `<body>`. |
| `reset.css` | Eric Meyer's reset, kept for sentimental reasons. Also home of `.clearfix`. |
| `main.css` | All styling. Tokens on `:root`, dark mode via `prefers-color-scheme` and `data-theme`. |
| `main.js` | Theme, terminal, demos, easter eggs. |
| `scene.js` | Three.js hero: random shape, noise displacement, low-res render, Bayer dithering. |
| `sandbox/radius.html` | Interactive border-radius lab. |
| `sandbox/dither.html` | Full-screen version of the hero scene with controls. |
| `serve.mjs` | Dependency-free static server. |

## Keys

- `r` new shape
- `t` open the terminal
- `↑↑↓↓←→←→BA` 1999 mode

## Deploy

Any static host. Upload the folder. That's it.
