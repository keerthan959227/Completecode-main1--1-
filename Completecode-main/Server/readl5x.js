const fs = require('fs');
const sax = require('sax');

const xmlFilePath = 'D:/Alltest/V103_GC1.L5X';

// Create a readable stream from the XML file
const xmlStream = fs.createReadStream(xmlFilePath, { encoding: 'utf-8' });

// Create a new SAX parser
const saxParser = sax.createStream(true, {});

let currentTask = null;
let isInsideTasks = false;

// Event handlers for the SAX parser
saxParser.on('error', (error) => {
    console.error('Error parsing XML:', error);
});

saxParser.on('end', () => {
   // console.log('Parsing completed.');
});

saxParser.on('opentag', (node) => {
    // Print debug information for the <Tasks> element
    if (node.name === 'Tasks') {
        //console.log('Debug: Entering <Tasks> element');
        isInsideTasks = true;
    }

    // Customize this part to handle the elements you are interested in
    if (isInsideTasks && node.name === 'Task') {
        // Start capturing information for a new task
        currentTask = {
            name: node.attributes.Name,
            type: node.attributes.Type,
            rate: node.attributes.Rate,
            priority: node.attributes.Priority,
            watchdog: node.attributes.Watchdog,
            disableUpdateOutputs: node.attributes.DisableUpdateOutputs,
            inhibittask: node.attributes.InhibitTask 
        };


        // Print debug information for the <Task> element
       // console.log('Debug: Entering <Task> element');
       console.log(` ${currentTask.name}, Type: ${currentTask.type}, Rate: ${currentTask.rate}, Priority: ${currentTask.priority}`);

    }
});

saxParser.on('closetag', (tagName) => {
    // If it's the end of a <Task> tag inside <Tasks>, log and reset the currentTask
    if (isInsideTasks && tagName === 'Task' && currentTask) {
       // console.log('Debug: Exiting <Task> element');
        currentTask = null;
    }

    // If it's the end of the <Tasks> element, log and reset the isInsideTasks flag
    if (tagName === 'Tasks') {
        //console.log('Debug: Exiting <Tasks> element');
        isInsideTasks = false;
    }
});

// Pipe the XML stream into the SAX parser
xmlStream.pipe(saxParser);

// Handle the 'close' event to know when the parsing is done
xmlStream.on('close', () => {
    //console.log('Stream closed.');
});

// Handle errors during stream reading
xmlStream.on('error', (error) => {
    console.error('Error reading XML file:', error);
});
