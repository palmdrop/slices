/* eslint-disable @typescript-eslint/no-var-requires */
// convert "${image}" -format %c -depth 8  histogram:info:- | tr -d ':' | sed -e 's/( *//' -e 's/, */,/g' -e 's/^  *//' | sort -n -u -r | tr ' ' '|' | head -n 40

const path = require('path');
const fs = require('fs');
const { exec } = require("child_process");


const IMAGE_DIR = 'images';
const IMAGE_ROOT_PATH = `static/${ IMAGE_DIR }`;
const IMAGE_DATA_PATH = `../src/data.json`;
const IMAGE_DIRECTORY = `../${ IMAGE_ROOT_PATH }`;

const FILE_TYPE_REGEX = /\w+(.png|.jpg|.PNG|.JPG)\b/
const SRGB_REGEX = /(\d+).*(\d+).*(\d+).*/

const NUMBER_OF_COLORS = 10;

const ABSOLUTE_IMAGE_DIRECTORY = 
  path.join(
    __dirname,
    IMAGE_DIRECTORY
  );

const getCommand = file => `convert "${ABSOLUTE_IMAGE_DIRECTORY}/${file}" -format %c -depth 8  histogram:info:- | tr -d ':' | sed -e 's/( *//' -e 's/, */,/g' -e 's/^  *//' | sort -n -u -r | tr ' ' '|' | head -n ${ NUMBER_OF_COLORS }`

const processImageData = (data) => {
  const processColor = (colorData) => {
    const splitData = colorData.split('|');
    const srgbMatch = splitData[1].match(SRGB_REGEX);
    return {
      count: Number.parseInt(splitData[0]),
      hex: splitData[2],
      srgb: {
        r: Number.parseInt(srgbMatch[1]),
        g: Number.parseInt(srgbMatch[2]),
        b: Number.parseInt(srgbMatch[3]),
      }
    }
  }

  const colorData = data.split('\n')
    .filter(data => data && data.length)
    .map(processColor);

  const mainColors = colorData.slice(0, 3);

  const averageColor = colorData.reduce(
    (average, current) => {
      return {
        r: average.r + current.srgb.r / colorData.length,
        g: average.g + current.srgb.g / colorData.length,
        b: average.b + current.srgb.b / colorData.length,
      }
    },
    { r: 0, g: 0, b: 0 }
  );

  return {
    mainColors,
    averageColor
  };
}

let imageCount = 0;
const processImage = (file, numberOfImages) => new Promise((resolve, reject) => {
  const filePath = `${ IMAGE_DIR }/${ file }`;
  if (!FILE_TYPE_REGEX.test(file)) return resolve({
    status: 'invalid',
    file: "/" + filePath,
    error: 'Not a valid image file'
  });

  exec(getCommand(file), (error, stdout, stderr) => {
    imageCount++;

    if (error || stderr) {
      console.error(`Failed to analyze image ${file} (${ imageCount + 1 }/${ numberOfImages })`);
      reject({
        status: 'error',
        file: filePath, 
        error: error ?? stderr
      });
    } else {
      console.log(`Analyzed image ${file} (${ imageCount + 1 }/${ numberOfImages })`);
      resolve({
        status: 'success',
        file: filePath,
        data: processImageData(stdout)
      });
    }
  });
})

const processImages = async (files) => {
  const promises = files.map(file => processImage(file, files.length))
  return await Promise.all(promises);
}

const files = fs.readdirSync(ABSOLUTE_IMAGE_DIRECTORY);

processImages(files)
  .then(result => {
    result = result
      .filter(entry => entry.status === 'success')
      .map(entry => {
        delete entry.status
        return entry
      });

    const json = JSON.stringify(result, undefined, 2);

    fs.writeFileSync(
      path.join(__dirname, IMAGE_DATA_PATH),
      json
    );
  })
  .catch(error => {
    console.log(error)
  });