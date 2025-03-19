import apiClient from "./api-client";

export type ExploreOutfitData = {
  id: number;
  src: {
    original: string;
  };
  alt: string;
  photographer: string;
};

export type ExploreOutfit = {
  photos: [ExploreOutfitData];
  next_page: string;
  total_results: number;
};

export const explore = () => {
  return new Promise<ExploreOutfit>((resolve, reject) => {
    apiClient
      .get("/outfits/explore")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(apiClient.defaults);
        reject(error);
      });
  });
};
