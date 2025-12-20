  
  export interface Ads {
    _id: string;
    title: string;
    description: string;
    category: ICategory,
    url:string,
    images: string[];
    createdAt:string
  }
  export type ICategory = "Banner" | "Highlights";
  export const categories = ["Banner", "Highlights"];
  