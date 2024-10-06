import { vi } from "vitest";
import { Readable } from "stream"; // Import Readable for creating a stream

export let db = [];

export const mockPosts = [
  {
    _id: 21312313413,
    id: 0,
    type: "plantyLife",
    title: "Plant Blog Post",
    image: ["plant.jpg"],
    content: "This is a post about plants.",
  },
  {
    _id: 2131231341323542345,
    id: 1,
    type: "mushroomBlog",
    title: "Mushroom Blog Post",
    image: ["mushroom.jpg"],
    content: "This is a post about mushrooms.",
  },
];

// Create a mock for the connectToDB function
export const mockConnectToDB = vi.fn();

// Create a mock for the MongoDB collection
export const mockFindOne = vi.fn();
export const mockInsertOne = vi.fn((post) => (db = [...db, post]));
export const mockFindOneAndUpdate = vi.fn(({ id }, update) => {
  update["$set"].id = id;
  update = update["$set"];

  db[id].id = id;
  db[id].type = update.type || db[id].type;
  db[id].title = update.title || db[id].title;
  db[id].image = update.image || db[id].image;
  db[id].content = update.content || db[id].content;
});
export const mockFindOneAndDelete = vi.fn((id) => db.splice(id));

export const mockAggregate = vi.fn((pipeline) => {
  let results = [];

  // $match operator
  const match = pipeline.find((array) => array.hasOwnProperty("$match"));
  if (match) {
    const matchArgs = match.$match;
    const key = Object.keys(matchArgs)[0];
    const value = matchArgs[key];

    // Filter posts in a single pass
    results = mockPosts.reduce((acc, post) => {
      if (post[key] === value) acc.push(post);
      return acc;
    }, []);
  }

  // $project operator
  const project = pipeline.find((array) => array.hasOwnProperty("$project"));
  if (project) {
    const projectArgs = project.$project;
    const keys = Object.keys(projectArgs);

    let keyCount = 0;
    let resultsCount = 0;
    while (keyCount < keys.length) {
      if (resultsCount === results.length) {
        resultsCount = 0;
        keyCount++;
      }
      if (
        results[resultsCount].hasOwnProperty(keys[keyCount]) &&
        projectArgs[keys[keyCount]] === 0
      ) {
        delete results[resultsCount][keys[keyCount]];
        resultsCount++;
      } else {
        resultsCount = 0;
        keyCount++;
      }
    }
    if (keyCount >= keys.length) keyCount = 0;

    let newResults = [];
    results.forEach(obj  => newResults.push({}))

    while (keyCount < keys.length) {
      if (resultsCount === results.length) {
        resultsCount = 0;
        keyCount++;
      }
      if (
        results[resultsCount].hasOwnProperty(keys[keyCount]) &&
        projectArgs[keys[keyCount]] === 1
      ) {
        newResults[resultsCount][keys[keyCount]] = results[resultsCount][keys[keyCount]]
        resultsCount++;
      } else {
        resultsCount = 0;
        keyCount++;
      }
    }
    if (!newResults.some(obj => Object.keys(obj).length === 0)) results = newResults;
  }

  // Return an object with a stream method
  return {
    stream: () => Readable.from(results),
  };
});

export const mockCollection = {
  findOne: mockFindOne,
  insertOne: mockInsertOne,
  findOneAndUpdate: mockFindOneAndUpdate,
  findOneAndDelete: mockFindOneAndDelete,
  aggregate: mockAggregate,
};

// Create a mock for the database instance
export const mockDb = { collection: vi.fn(() => mockCollection) };

// Create a mock return value for connectToDB
mockConnectToDB.mockResolvedValue({ db: mockDb });