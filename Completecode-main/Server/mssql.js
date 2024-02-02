const sql = require('mssql');

const config = {
  user: 'sa1',
  password: 'root',
  server: 'CSGBTPLT432',
  database: 'PLC_Automation',
  options: {
    encrypt: false,
  },
};

// Create a pool that connects to the database
const pool = new sql.ConnectionPool(config);

async function connectToDatabase() {
  try {
    await pool.connect();
    console.log('Connected to SQL Server');
  } catch (err) {
    console.error('Error connecting to SQL Server:', err);
    throw err;
  }
}

async function findUserByEmail(email) {
  try {
    await connectToDatabase();

    const result = await pool.query`SELECT * FROM Users WHERE email = ${email}`;

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      console.log('User found:', user);
      return user;
    } else {
      console.log('User not found');
      return null;
    }
  } catch (err) {
    console.error('Error finding user by email:', err);
    throw err;
  } finally {
    await pool.close();
    console.log('Disconnected from SQL Server');
  }
}

async function findUserByuserId(userId) {
  try {
    await connectToDatabase();

    const result = await pool.query`SELECT * FROM Users WHERE userId = ${userId}`;

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      console.log('User found:', user);
      return user;
    } else {
      console.log('User not found');
      return null;
    }
  } catch (err) {
    console.error('Error finding user by email:', err);
    throw err;
  } finally {
    await pool.close();
    console.log('Disconnected from SQL Server');
  }
}

async function addUser(newUser) {
  try {
    await connectToDatabase();

    // Insert a new user into the Users table
    const result = await pool.query`
      INSERT INTO Users (email, password, name)
      VALUES (${newUser.email}, ${newUser.password}, ${newUser.name})
    `;

    if (result.rowsAffected > 0) {
      console.log('User added successfully');
      return true;
    } else {
      console.log('Failed to add user');
      return false;
    }
  } catch (err) {
    console.error('Error adding user:', err);
    throw err;
  } finally {
    await pool.close();
    console.log('Disconnected from SQL Server');
  }
}

async function addUserfile(data) {
  try {
    await connectToDatabase();

    const query = `
      INSERT INTO UserFiles (userId, filename, timestamp, fileContent)
      VALUES (@userId, @filename, @timestamp, CAST(@fileContent AS VARBINARY(MAX)))
    `;

    const result = await pool.request()
      .input('userId', data.userId)
      .input('filename', data.filename)
      .input('timestamp', data.timestamp)
      .input('fileContent', data.fileContent)
      .query(query);

    
    
      if (result.rowsAffected > 0) {
        console.log('User Files added successfully');
        return true;
      } else {
        console.log('Failed to add Files to user');
        return false;
      }
  } catch (error) {
    throw new Error(`Error adding user file: ${error.message}`);
  } finally {
    await pool.close();
    console.log('Disconnected from SQL Server');
  }
}

async function getUserFilesByUserId(userId) {
  try {
    await connectToDatabase();

    const result = await pool
      .request()
      .input('userId', userId)
      .query('SELECT * FROM UserFiles WHERE userId = @userId');

    return result.recordset;
  } catch (error) {
    console.error('Error fetching user files:', error);
    throw error;
  } finally {
    // Do not close the pool here
    console.log('Disconnected from SQL Server');
  }
}

const getFilePathByFileId = async (fileId) => {
  try {
    await connectToDatabase();

    const result = await pool
      .request()
      .input('fileId', fileId)
      .query('SELECT filecontent FROM UserFiles WHERE FileId = @fileId');

    return result.recordset[0].filecontent;
  } catch (error) {
    console.error('Error fetching file path by fileId:', error);
    throw error;
  } finally {
    console.log('Disconnected from SQL Server');
  }
};






module.exports = {
  connectToDatabase,
  findUserByEmail,
  addUser,
  findUserByuserId,
  addUserfile,
  getUserFilesByUserId,
  getFilePathByFileId
};
