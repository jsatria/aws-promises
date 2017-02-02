var aws = require('./shared');


function KMS(region) {
  if (!(this instanceof KMS)) {
    return new KMS(region);
  }

  this.awsApi = aws.api('KMS', {region}, {
    decrypt: {property: 'Plaintext'},
    encrypt: {property: 'CiphertextBlob'}
  });
}

KMS.prototype.decrypt = function decrypt(ciphertext) {
  var CiphertextBlob = ciphertext;
  if (!(CiphertextBlob instanceof Buffer)) {
    try {
      CiphertextBlob = Buffer.from(ciphertext, 'hex');
    } catch (err) {}
    if (!CiphertextBlob.length) {
      try {
        CiphertextBlob = Buffer.from(ciphertext, 'base64');
      } catch (err) {}
    }
    if (!CiphertextBlob.length) {
      try {
        CiphertextBlob = Buffer.from(ciphertext, 'utf8');
      } catch (err) {}
    }
  }

  return this.awsApi
    .then(api => api.decrypt({CiphertextBlob}));
};

KMS.prototype.encrypt = function encrypt(KeyId, Plaintext) {
  return this.awsApi
    .then(api => api.encrypt({KeyId, Plaintext}));
};


module.exports = aws.regionCache(KMS);