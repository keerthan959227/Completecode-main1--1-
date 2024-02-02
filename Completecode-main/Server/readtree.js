const fs = require('fs');
const readline = require('readline');
const { parseString } = require('xml2js');

const xmlFilePath = 'D:/P2_Lorem_l5x/Completecode/V103_GC1.L5X';

// Create a readable stream from the XML file
const xmlStream = fs.createReadStream(xmlFilePath, { encoding: 'utf-8' });
const lineReader = readline.createInterface({ input: xmlStream });

let xmlLines = '';

// Read the XML file line by line
lineReader.on('line', (line) => {
  xmlLines += line;
});

// Process the entire XML content when all lines are read
lineReader.on('close', () => {
  parseXml(xmlLines);
});

// Parse the XML content
function parseXml(xmlContent) {
  parseString(xmlContent, { explicitArray: false }, (err, result) => {
    if (err) {
      console.error('Error parsing XML:', err);
    } else {
      const tree = convertXmlToTree(result);
      console.log(tree);
    }
  });
}

// Convert the XML object to a tree structure
function convertXmlToTree(xmlObj) {
  const nodeName = Object.keys(xmlObj)[0];
  const nodeValue = xmlObj[nodeName];

  if (typeof nodeValue === 'object') {
    return {
      title: nodeName,
      children: Object.keys(nodeValue).map((key) =>
        convertXmlToTree({ [key]: nodeValue[key] })
      ),
    };
  } else {
    return { title: `${nodeName}: ${nodeValue}` };
  }
}
