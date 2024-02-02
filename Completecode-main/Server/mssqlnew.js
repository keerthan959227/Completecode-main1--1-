const { Connection, Request } = require('tedious');

const config = {
    server: 'localhost',
    authentication: {
        type: 'default',
        options: {
            userName: 'sa1',
            password: 'root'
        }
    },
    options: {
        encrypt: false,
        database: 'PLC_Automation'
    }
};
const connection = new Connection(config);

function executeQuery(query) {
    return new Promise((resolve, reject) => {
        const request = new Request(query, (err, rowCount) => {
            if (err) {
                reject(err);
            } else {
                console.log(rowCount + ' row(s) returned');
                resolve();
            }
        });

        request.on('row', columns => {
            columns.forEach(column => {
                console.log(column.value);
            });
        });

        connection.execSql(request);
    });
}

function connectAndExecute() {
    return new Promise((resolve, reject) => {
        connection.on('connect', err => {
            if (err) {
                console.error('Error connecting to SQL Server:', err);
                reject(err);
            } else {
                console.log('Connected to SQL Server');

                const query = 'SELECT * FROM [PLC_Automation].[dbo].[L5XFiles]';

                executeQuery(query)
                    .then(() => {
                        connection.close();
                        resolve();
                    })
                    .catch(reject);
            }
        });

        connection.connect();
    });
}

connectAndExecute()
    .then(() => {
        console.log('Disconnected from SQL Server');
    })
    .catch(err => {
        console.error('Error:', err);
    });
