// Script for downloading all icons from Camelot Unchained's S3 bucket

const { parseString } = require('xml2js');
const { join } = require('path');
const { createWriteStream, unlink, mkdirSync, existsSync } = require('fs');
const http = require('http');

const awsURL = 'http://camelot-unchained.s3.amazonaws.com';
const prefixes = ['icons', 'game/4/icons'];

const destination = join(__dirname, '..', 'camelot', 'src', 'images', 'gameicons');

const downloadQueue = [];

const download = (url, dest, cb) => {
  downloadQueue.push(() => {
    mkdirSync(dest.substring(0, dest.lastIndexOf('\\')), {
      recursive: true
    });
    let file = createWriteStream(dest);

    file.on('error', (error) => {
      console.error(error);
    });

    let request = http
      .get(url, (response) => {
        response.pipe(file);
        file.on('finish', function () {
          file.close(() => {
            cb(true);
          });
        });
      })
      .on('error', function (error) {
        unlink(dest, () => {});
        console.error(error);
        cb(false);
      });

    request.on('error', (error) => {
      console.error(error);
    });
  });
};

setInterval(() => {
  if (downloadQueue.length > 0) {
    downloadQueue.shift()();
  }
}, 100);

const downloadURLs = [];

const processURLs = () => {
  let downloaded = 0;
  let failed = 0;
  let skipped = 0;
  for (const url of downloadURLs) {
    const downloadURL = `${awsURL}/${url}`;
    const downloadDestination = join(destination, url).toLowerCase().replaceAll(" ", "_");
    if (existsSync(downloadDestination)) {
      console.log(`Skipped already downloaded icon from ${downloadURL}`);
      skipped++;
      if (downloaded + failed + skipped === downloadURLs.length) {
        console.log(`Finished downloading files.`);
        console.log(`${downloaded} icons successfully downloaded`);
        console.log(`${failed} icons failed to download`);
        console.log(`${skipped} already downloaded icons skipped`);
        process.exit(0);
      }
    } else {
      download(downloadURL, downloadDestination, (successful) => {
        if (successful) {
          console.log(`Downloaded icon successfully from ${downloadURL}`);
          downloaded++;
        } else {
          console.log(`Failed to download icon from ${downloadURL}`);
          failed++;
        }
        if (downloaded + failed + skipped === downloadURLs.length) {
          console.log(`Finished downloading files.`);
          console.log(`${downloaded} icons successfully downloaded`);
          console.log(`${failed} icons failed to download`);
          console.log(`${skipped} already downloaded icons skipped`);
          process.exit(0);
        }
      });
    }
  }
};

let finishedRequests = 0;

const makeAWSRequest = ({ prefix, marker = '' }) => {
  fetch(`${awsURL}/?prefix=${prefix}&marker=${marker}`)
    .then((response) => {
      response
        .text()
        .then((text) => {
          parseString(text, (error, xml) => {
            if (error) {
              console.error(error);
              process.exit(1);
            }
            for (const object of xml.ListBucketResult.Contents) {
              for (const url of object.Key) {
                if (!url.endsWith('/') && !url.endsWith('.zip') && !url.endsWith('.txt')) {
                  downloadURLs.push(url);
                }
              }
            }
            if (xml.ListBucketResult.IsTruncated[0] === 'true') {
              makeAWSRequest({
                prefix,
                marker: xml.ListBucketResult.Contents[xml.ListBucketResult.Contents.length - 1].Key[0]
              });
            } else {
              finishedRequests++;
              if (finishedRequests === prefixes.length) {
                processURLs();
              }
            }
          });
        })
        .catch((error) => {
          console.error(error);
          process.exit(1);
        });
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
};

for (const prefix of prefixes) {
  makeAWSRequest({ prefix });
}
