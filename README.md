# FG Joomla Extensions site

Deploy these files to the `master` branch of `ferino75/ferino75.github.io`.

## Structure

- `index.html`
- `404.html`
- `projects.json`
- `assets/favicon.svg`
- `.github/workflows/update-projects.yml`

The workflow runs every 6 hours, but it commits `projects.json` only when real repository/release metadata changes.

### Optional screenshots

The v2 cards support screenshots. In `index.html`, set a project's `preview` value to a real image URL, for example:

```js
preview: "https://raw.githubusercontent.com/ferino75/REPOSITORY/master/assets/screenshot.png",
```

If `preview` is `null`, no screenshot area is rendered.
