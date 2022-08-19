const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data"),
  pinataSDK = require("@pinata/sdk"),
  path = require("path");

const uploadToPinata = async (pinataApiKey, pinataSecretApiKey, imageName) => {
  const pinata = pinataSDK(pinataApiKey, pinataSecretApiKey);
  const readableStreamForFile = fs.createReadStream(`./images/${imageName}`);
  const options = {
    pinataMetadata: {
      name: "My NFT Image",
      keyvalues: {
        customKey: "customValue",
        customKey2: "customValue2",
      },
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };
  return pinata
    .pinFileToIPFS(readableStreamForFile, options)
    .then((result) => {
      let url = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;

      // remove all the filese in images directory
      const directory = "images";
      fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
          fs.unlink(path.join(directory, file), (err) => {
            if (err) return err;
          });
        }
      });
      return url;
    })
    .catch((err) => {
      return err; //handle error here
    });
};

module.exports = { uploadToPinata };
