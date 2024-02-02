const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { parseString } = require('xml2js');
const fs = require('fs');

const router = express.Router();

// Define a route to get the XML tree structure
router.get('/getXmlTree', (req, res) => {
  // Read XML content from the file
  const xmlFilePath = 'D:\\P2_Lorem_l5x\\Completecode\\V103_GC1.L5X';

  fs.readFile(xmlFilePath, 'utf-8', (err, xmlContent) => {
    if (err) {
      console.error('Error reading XML file:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    parseString(xmlContent, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const rsLogix5000Content = result.RSLogix5000Content;
        const controllerChildren = Object.keys(rsLogix5000Content.Controller).filter(key => key !== '$');

        // Check if 'Tasks' exists in the RSLogix5000Content
        const tasksIndex = controllerChildren.indexOf('Tasks');

        // Extract the 'Tasks' array directly from the XML result
        const tasks = rsLogix5000Content.Controller.Tasks.Task || [];

        const tasksNode = {
          title: 'Tasks',
          key: 'Tasks',
          children: tasks.map(task => ({
            title: task.$.Name,
            key: task.$.Name,
            type: task.$.Type,
            rate: task.$.Rate,
            priority: task.$.Priority,
            watchdog: task.$.Watchdog,
            children: task.ScheduledPrograms ? (Array.isArray(task.ScheduledPrograms.ScheduledProgram)
              ? task.ScheduledPrograms.ScheduledProgram.map(program => ({
                  title: program.$.Name,
                  key: program.$.Name,
                }))
              : [{
                  title: task.ScheduledPrograms.ScheduledProgram.$.Name,
                  key: task.ScheduledPrograms.ScheduledProgram.$.Name,
                }])
              : [],
          })),
        };

        if (tasksIndex !== -1) {
          controllerChildren.splice(tasksIndex, 1, tasksNode);
        }

        res.json({
          RSLogix5000Content: {
            Controller: controllerChildren,
          },
        });
      }
    });
  });
});

module.exports = router;
