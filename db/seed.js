const { client, getAllUsers, createUser } = require('./index');

async function dropTables() {
    try {
      await client.query(`
         DROP TABLE IF EXISTS users
      `);
    } catch (error) {
      throw error; 
    }
  }
  
  async function createTables() {
    try {
      await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL
      );
      `);
    } catch (error) {
      throw error; 
    }
  }
  
  async function rebuildDB() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
      await createInitialUsers();
    } catch (error) {
      console.error(error);
    } 
  }


  async function testDB(){
    try{
        const result = await getAllUsers()

        console.log(result)
    }catch(error){
    console.error(error)}
}


async function createInitialUsers() {
    try {
      console.log("Starting to create users...");
      

      const riley = await createUser({ username: 'riley', password: 'smith' });

      console.log("Finished creating users!");
    } catch(error) {
      console.error("Error creating users!");
      throw error;
    }
  }

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());

