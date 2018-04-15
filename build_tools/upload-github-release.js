const fs = require('fs');
const path = require('path');

const AdmZip = require('adm-zip');
const TarGz = require('tar.gz');
const publishRelease = require('publish-release');
const inquirer = require('inquirer');

// Find changelog for a specific version
const getChangelog = (changelogFilePath, forVersion) => {
  const prefix = '<a name="';
  const skipLines = 1;
  return new Promise((resolve) => {
    let content = fs.readFileSync(changelogFilePath).toString();
    let lines = content.split('\n');
    let bodyStartIndex = lines.findIndex((str) => str.substr(0, prefix.length + forVersion.length) === `${prefix}${forVersion}`);
    if (bodyStartIndex > -1) {
      let bodyEndIndex = lines.findIndex((str, idx) => idx > bodyStartIndex && str.substr(0, prefix.length) === prefix);
      let header = forVersion;
      let body = lines.slice(bodyStartIndex + 1 + skipLines, bodyEndIndex).join('\n');
      resolve({header, body});
    } else {
      resolve({header : forVersion, body : ''});
    }
  });
};

// Build archive type .zip
const buildZipArchive = ({lookupDir, archiveFilePath}) => {
  return new Promise((resolve) => {
    let archive = new AdmZip();
    archive.addLocalFolder(lookupDir, 'angular-translate');
    archive.writeZip(archiveFilePath);
    resolve(archiveFilePath);
  });
};

// Build archive type .tar.gz
const buildTarGzArchive = ({lookupDir, archiveFilePath}) => {
  let gzipOptions = {
    level : 9,
    memLevel : 9,
  };
  let tarOptions = {
    fromBase : true
  };
  return new TarGz(gzipOptions, tarOptions)
    .compress(lookupDir, archiveFilePath)
    .then(() => archiveFilePath);
};

// Upload and apply release
const publish = ({ghApiToken, projectVersion, projectVersionName, projectOwner, projectRepo, changelog, assets}) => {
  return new Promise((resolve, reject) => {
    publishRelease({
      token : ghApiToken,
      owner : projectOwner,
      repo : projectRepo,
      tag : projectVersion,
      name : projectVersionName,
      notes : changelog.body,
      draft : false,
      prerelease : false,
      reuseRelease : true,
      reuseDraftOnly : true,
      assets : assets,
    }, function (err, release) {
      if (err) {
        reject(err);
      } else {
        resolve(release);
      }
    })
  });
};

// Main
// Load repo details
const pkg = require('./../package.json');

if (!process.env.GH_TOKEN) {
  console.log('Missing env key GH_TOKEN');
  process.exit(1);
}
//if (!process.env.PROJECT_OWNER) {
//  console.log('Missing env key PROJECT_OWNER');
//  process.exit(1);
//}

console.log(`Get changelog for version ${pkg.version}...`);
const changelogFilePath = path.normalize(path.join(__dirname, '../CHANGELOG.md'));
const dirDir = path.normalize(path.join(__dirname, '..', 'dist'));
const tmpDir = path.normalize(path.join(__dirname, '..', 'tmp'));

Promise.all([
  getChangelog(changelogFilePath, pkg.version),
  Promise.all([
    buildZipArchive({lookupDir : dirDir, archiveFilePath : `${tmpDir}/${pkg.name}-${pkg.version}.zip`}),
    buildTarGzArchive({lookupDir : dirDir, archiveFilePath : `${tmpDir}/${pkg.name}-${pkg.version}.tar.gz`}),
  ])
])
  .then(([changelog, assets]) => {
    //console.log(JSON.stringify(require('./../package.json')));
    return inquirer.prompt([
      {
        type : 'checkbox',
        name : 'assets',
        message : 'Please confirm generated assets:',
        choices : assets.map((asset) => {
          return {
            name : asset,
            value : asset,
            checked : true
          };
        })
      },
      {
        type : 'confirm',
        name : 'confirmed',
        message : `Please confirm upload with this changelog for version '${changelog.header}':\n${changelog.body || 'No changelog found!'}`,
        default : 'true',
        choices : [
          'true',
          'false'
        ],
      }
    ]).then((answers) => {
      if (!answers.confirmed) {
        throw 'Changelog not confirmed';
      }
      return [changelog, answers.assets];
    });
  })
  .then(([changelog, assets]) => {
    return publish({
      ghApiToken : process.env.GH_TOKEN,
      projectOwner : 'angular-translate',
      projectRepo : process.env.PROJECT_REPO || pkg.name,
      projectVersion : pkg.version,
      projectVersionName : `${pkg.name} ${changelog.header || pkg.version}`,
      changelog : changelog,
      assets : assets,
    });
  })
  .then(() => {
    console.log('Release published successfully');
    process.exit(0)
  })
  .catch((err) => {
    console.log('Failed: ' + err);
    process.exit(1);
  });
