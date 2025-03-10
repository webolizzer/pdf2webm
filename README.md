# pdf2webm

## What is this?

This is a tool that converts PDFs to WebM in the browser using pdf.js and ffmpeg.wasm.

## Build & Usage

Files will be generated under `dist/` with the following command:
```bash
npm run build
```
then
```
cd dist
```
then

```bash
npm run preview
```

It can be used by publishing the output as a website.

## Development

Developed using [Vite](https://vitejs.dev/). You can start the development server with the following command:

```bash
npm run dev
```                                                                                                          
## Deployment

Cloudflare Pages deployment is supported. Please upload the `dist/` directory after building using wrangler.

```
set
wrangler pages dist
```

## LICENSE

Please refer to [LICENSE](https://www.google.com/url?sa=E&source=gmail&q=LICENSE).

As exceptions, please refer to the separate licenses for the following files:

### pdf.js

`public/vXXXXXXXXX/pdf.worker.min.js` is an output of [pdf.js](https://github.com/mozilla/pdf.js/).

### ffmpeg.wasm-core

`public/vXXXXXXXXX/ffmpeg-core.js` and `public/vXXXXXXXX/ffmpeg-core.wasm` are outputs of [ffmpeg.wasm-core](https://github.com/ffmpegwasm/ffmpeg.wasm-core).

### Adobe CMap Resources

Files under `public/vXXXXXXXXX/cmaps/` are outputs of [Adobe CMap Resources](https://www.google.com/url?sa=E&source=gmail&q=https://github.com/adobe-type-tools/cmap-resources/).
