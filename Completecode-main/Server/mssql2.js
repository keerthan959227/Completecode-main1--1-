var Connection = require('tedious').Connection;

var config = {
    server: 'localhost',  // Replace with your SQL Server address
    authentication: {
        type: 'default',
        options: {
            userName: 'sa1',   // Replace with your SQL Server username
            password: 'root'  // Replace with your SQL Server password
        }
    },
    options: {
        encrypt: false,
        database: 'PLC_Automation'
    }
};

var connection = new Connection(config);

// Handle errors during the connection process
connection.on('connect', function (err) {
    if (err) {
        console.error('Error connecting to SQL Server:', err);
        return;
    }

    console.log('Connected to SQL Server');
    // You can add your application logic here

    // Keep the connection open without executing any queries
    // ...

    // Explicitly close the connection when your application exits or at an appropriate point
    // connection.close();
});

// Handle errors during the connection process
connection.on('error', function (err) {
    console.error('Connection error:', err);
});

// Handle the close event
connection.on('end', function () {
    console.log('Connection closed');
});

// Optional: Set up an interval to keep the process running
// setInterval(function () {}, 1000);
