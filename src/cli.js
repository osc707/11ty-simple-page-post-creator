#!/usr/bin/env

import fs from 'fs';
import { format } from 'date-fns'
import inquirer from 'inquirer';

async function makeFile(answers) {
  const blogDate = `${format(new Date(), 'yyyy-MM-dd')}`; // YYYY-mm-dd
  const isPage = 'BlogPost' !== answers.templateType;
  const rawFileName = (answers.fileName || 'new-file');
  const fileName =  (answers.fileName || 'new-file').replace(/[\W_]+/g, '-').toLowerCase();
  let fileFolder = isPage ? './' : './blog/';
  const fileExtension = isPage ? '.njk' : '.md';
  const fileContents = isPage ? '---\r\n' +
    'layout: layouts/home.njk\r\n' +
    'title: \'' + rawFileName + '\'\r\n' +
    'tags:\r\n' +
    ' - nav\r\n' +
    'navTitle:\r\n' +
    'navAlt:\r\n' +
    'ariaLabel:\r\n' +
    'ogTitle: \'' + rawFileName + '\'\r\n' +
    'ogDesc: \r\n' + 
    'ogUrl: \'' + fileName + '\'\r\n' +
    'ogImg: \r\n' +
    '---\r\n\r\n' +
    '<!-- Add Your Awesome Photo Here\r\n' +
    ' <div>\r\n' +
    '   <img\r\n src=""\r\n class="hero-image"\r\n alt="">\r\n' +
    ' </div>\r\n\r\n' +
    '-->\r\n\r\n' +
    '<div>\r\n\r\n' +
    '  <h1>{{ title }}</h1>\r\n\r\n' +
    '</div>'
    :
    '---\r\n' + 
    'layout: layouts/post.njk\r\n' + 
    'title: \'' + rawFileName + '\'\r\n' + 
    'tags:\r\n' + 
    ' - posts\r\n' + 
    'description:\r\n' + 
    'amzn:\r\n' + 
    'tb:\r\n'  +
    'date: ' + blogDate + '\r\n' + 
    'ogTitle: \'' + rawFileName + '\'\r\n' +
    'ogDesc: \r\n' + 
    'ogUrl: \'' + fileName + '\'\r\n' +
    'ogImg: \r\n' +
    '---\r\n\r\n' +
    '<!-- Add Your Awesome Photo Here\r\n' +
    ' <div>\r\n' +
    '   <img\r\n src=""\r\n class="hero-image"\r\n alt="">\r\n' +
    ' </div>\r\n\r\n' +
    '-->\r\n\r\n' +
    '\r\n\r\n' +
    '# {{ title }}\r\n\r\n';

  if (!isPage && !fs.existsSync(fileFolder)) { // blog not found, so using posts
    fileFolder = './posts/';
  }

  const data = new Uint8Array(Buffer.from(fileContents));
  const wholeFileName = `${fileFolder}${fileName}${fileExtension}`;

  fs.writeFile(wholeFileName, data, { flag: 'w' }, err => {
    if (err) {
      return console.error(err);
    }
    fs.readFile(wholeFileName, 'utf-8', (err, data) => {
      if (err) {
        return console.error(err);
      }
      console.log(data);
    });
  });

  return {
    message: 'Successfully creating:',
    templateType: answers.templateType,
    fileName: wholeFileName
  };
}

async function promptUser(options) {
  const q = [
    {
      type: 'list',
      name:  'templateType',
      message: 'What type of page would you like to create?',
      choices: [ 'Page', 'BlogPost'],
      default: 'Page'
    },
    {
      type: 'input',
      name: 'fileName',
      message: 'Enter a Title for your Blog/Page:',
      default: 'new-blog-page'
    }
  ]
  return await inquirer.prompt(q).then(answers => makeFile(answers));
}

export async function cli(args) {
  const options = await promptUser();
  console.log(options);
}
