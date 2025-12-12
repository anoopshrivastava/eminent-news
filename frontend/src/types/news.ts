export interface Editor {
    _id: string;
    username: string
    name: string;
    email:string;
    followers: string[]
  }
  
  export interface News {
    _id: string;
    title: string;
    description: string;
    category: ICategory,
    url:string,
    images: string[];
    likes:string[];
    editor?: Editor | null;
    createdAt:string
  }
  export type ICategory = "National" | "Sports" | "World" | "Entertainment" | "Education" | "Trending";
  export const categories = ["National", "Sports", "World", "Entertainment", "Education", "Trending"];
  