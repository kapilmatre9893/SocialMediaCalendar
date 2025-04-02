import dummyPosts from "../data/data";

export const fetchPosts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(dummyPosts), 1000);
  });
};

export const getCategories = () => {
  return [...new Set(dummyPosts.map((post) => post.category))]; // Extract unique categories
};
