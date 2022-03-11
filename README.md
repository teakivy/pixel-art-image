# Pixel Art Image
Pixel Art Image is a (horrible) image format created just as a test, and because I had nothing better to do. Fun fact: this was a shower thought.

It is horribly implemented and takes a larger file size than both PNG and JPG (the formats it supports).

## How it works
- Pixel Art Image works by a series of lines.
- Each row of pixels is converted into a special pixel format, intended to work best with simple pixel art without much variation
- A row of pixels of the same color can be described as so:
  - `hex:w[xs]@hex:w[xs]&` ...
    - `hex` being the hex color code of the pixel
    - `w` being the width of the stretch of color
    - `[xs]` is an optional space for if 2 lines duplicate
      - If there are 2 duplicate lines, it would be something like this: `ff0000:16x2`
    - `@` being the "pixel seperator"
    - `:` being the width seperator
    - `x` being the size seperator
    - `&` being the row seperator
  - So a 2x2 of pure red would look something like this:
    - `f0000:2x2`
  - Seems simple enough, and horribly optimised, just how i like it!

## Installation
Install all node modules:
```cmd
npm install
```

## Running
- To run this example, add your image into the `assets` folder, then modify `src/toPai.ts` and `src/toPng.ts` accordingly.
- Either compile to JS by running `npx tsc` in the root directory, or run directly using `ts-node`:
  - `npm i ts-node -g`
  - `ts-node src/toPai.ts`
- Also includes `src/toPng.ts` to actually view the pai image

## Ending Notes
There is no guarentee this will ever be updated, and I highly discourage actually using this project. It is really just meant as a test and a learning experience for me.
