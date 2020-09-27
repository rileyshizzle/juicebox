const { client, getAllUsers, createUser, updateUser, createPost, getAllPosts, updatePost,getUserById, createTags, addTagsToPost, getPostsByTagName, getAllTags } = require('./index');

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
      console.log("Starting to build tables...");
  
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username varchar(255) UNIQUE NOT NULL,
          password varchar(255) NOT NULL,
          name varchar(255) NOT NULL,
          location varchar(255) NOT NULL,
          active boolean DEFAULT true
        );
  
        CREATE TABLE posts (
          id SERIAL PRIMARY KEY,
          "authorId" INTEGER REFERENCES users(id),
          title varchar(255) NOT NULL,
          content TEXT NOT NULL,
          active BOOLEAN DEFAULT true
        );
  
        CREATE TABLE tags (
          id SERIAL PRIMARY KEY,
          name varchar(255) UNIQUE NOT NULL
        );
  
        CREATE TABLE post_tags (
          "postId" INTEGER REFERENCES posts(id),
          "tagId" INTEGER REFERENCES tags(id),
          UNIQUE ("postId", "tagId")
        );
      `);
  
      console.log("Finished building tables!");
    } catch (error) {
      console.error("Error building tables!");
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
        tags:["#hungry","#tired", "#tagme"]
      }
      );

      await createPost({
        authorId: riley.id,
        title: "Second Post",
        content: "lit",
        tags: ["#hungry","#hungrier", "#confused"]
      }
      );

      await createPost({
        authorId: riley.id,
        title: "Third Post",
        content: " Not lit",
        tags:["#myehhhh"]
      }
      );

      await createPost({
        authorId: riley.id,
        title: "First Post",
        content: "This is my first post. I hope I love writing blogs as much as I love writing them.",
        tags: ["#happy", "#youcandoanything"]
      });

    } catch (error) {
      throw error;
    }
  }
  

  async function testDB() {
    try {
      console.log("Starting to test database...");
  
      console.log("Calling getAllUsers");
      const users = await getAllUsers();
      console.log("Result:", users);
  
      console.log("Calling updateUser on users[0]");
      const updateUserResult = await updateUser(users[0].id, {
        name: "Newname Sogood",
        location: "Lesterville, KY"
      });
      console.log("Result:", updateUserResult);
  
      console.log("Calling getAllPosts");
      const posts = await getAllPosts();
      console.log("Result:", posts);
  
      console.log("Calling updatePost on posts[0]");
      const updatePostResult = await updatePost(posts[0].id, {
        title: "New Title",
        content: "Updated Content"
      });
      console.log("Result:", updatePostResult);
  
      console.log("Calling updatePost on posts[1], only updating tags");
      const updatePostTagsResult = await updatePost(posts[1].id, {
        tags: ["#youcandoanything", "#redfish", "#bluefish"]
      });
      console.log("Result:", updatePostTagsResult);
  
      console.log("Calling getUserById with 1");
      const albert = await getUserById(1);
      console.log("Result:", albert);
  
      console.log("Calling getAllTags");
      const allTags = await getAllTags();
      console.log("Result:", allTags);
  
      console.log("Calling getPostsByTagName with #happy");
      const postsWithHappy = await getPostsByTagName("#happy");
      console.log("Result:", postsWithHappy);
  
      console.log("Finished database tests!");
    } catch (error) {
      console.log("Error during testDB");
      throw error;
    }
  }
rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());

