import apiClient from "./api-client";

export interface IComment {
  username: string;
  text: string;
}

export interface IPost {
  _id?: string;
  username?: string;
  outfitName?: string;
  imageUrl?: string;
  description?: string;
  comments?: IComment[];
}

export const createPost = (post: IPost) => {
  return new Promise<IPost>((resolve, reject) => {
    console.log("Registering user...");
    console.log(post);
    apiClient
      .post("/posts/create", post)
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const fetchPostsByUser = (userId: String) => {
  return new Promise<IPost[]>((resolve, reject) => {
    apiClient
      .get(`/posts/byUser/${userId}`)
      .then((response) => {
        if (response?.data) resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const fetchPostsById = (_id: String) => {
  return new Promise<IPost>((resolve, reject) => {
    apiClient
      .get(`/posts/${_id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const updatePostById = (_id: String, updatedPost: IPost) => {
  return new Promise<IPost>((resolve, reject) => {
    apiClient
      .put(`/posts/${_id}`, updatedPost)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const deletePostById = (_id: String) => {
  return new Promise<IPost>((resolve, reject) => {
    apiClient
      .delete(`/posts/${_id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export default { createPost };
