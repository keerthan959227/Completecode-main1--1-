import pyodbc

def test_database_connection():
    try:
        # Replace these values with your MSSQL Server details
        server = 'CSGBTPLT647\\MSSQLSERVER01'
        database = 'PLC_Automation'
        username = 'sa'
        password = 'root'

        # Connection string
        connection_string = f'DRIVER={{SQL Server}};SERVER={server};DATABASE={database};UID={username};PWD={password}'

        # Establish the connection
        connection = pyodbc.connect(connection_string)

        print('Connected to the database successfully!')

    except Exception as e:
        print('Error connecting to the database:', str(e))

    finally:
        # Close the connection
        connection.close()

# Call the function to test the database connection
test_database_connection()

