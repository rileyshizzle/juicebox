const { client, getAllUsers, createUser, updateUser, createPost, getAllPosts, updatePost,getUserById, createTags, addTagsToPost, getPostsByTagName } = require('./index');

async function dropTables() {
    try {
      await client.query(`
         DROP TABLE IF EXISTS post_tags;
         DROP TABLE IF EXISTS tags;
         DROP TABLE IF EXISTS posts;
         DROP TABLE IF EXISTS users;
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
        password varchar(255) NOT NULL,
        name varchar(255) NOT NULL,
        location varchar(255) NOT NULL,
        active BOOLEAN DEFAULT true

      );
        
      CREATE TABLE posts (
          id SERIAL PRIMARY KEY,
          "authorId" INTEGER REFERENCES users(id) NOT NULL,
          title varchar(255) NOT NULL,
          content TEXT NOT NULL,
          tags varchar(255),
          active BOOLEAN DEFAULT TRUE
      );

      CREATE TABLE tags (
          id SERIAL PRIMARY KEY,
          name varchar(255) UNIQUE NOT NULL
      );
      
      CREATE TABLE post_tags (
        "postId" INTEGER REFERENCES posts(id),
        "tagId" INTEGER REFERENCES tags(id),
        UNIQUE ("postId","tagId")
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
      await createInitialPosts();
    } catch (error) {
      console.error(error);
    } 
  }

  async function testDB() {
    try {
        console.log("Starting to test database...");
 
        console.log("Finished database tests!");
    } catch (error) {
      console.error("Error testing database!");
      throw error;
    }
  }
  

async function createInitialUsers() {
    try {
      console.log("Starting to create initial users...");
      await createUser({ username: 'riley', password: 'smith', name: 'not riley', location: 'not SLO' });
      console.log("Finished creating users!");
    } catch(error) {
      console.error("Error creating users!");
      throw error; 
    }
  }

  async function createInitialPosts() {
    try {
      const [riley] = await getAllUsers();
  
      await createPost({
        authorId: riley.id,
        title: "(f)irst Post",
        content: "lit",
        tags:["#hungry","#tired"]
      });
  
    } catch (error) {
      throw error;
    }
  }
  
rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());

