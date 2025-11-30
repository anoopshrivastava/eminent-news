export interface Editor {
    _id: string;
    name?: string | null;
  }
  
  export interface News {
    _id: string;
    title: string;
    description: string;
    category: ICategory,
    url:string,
    images: string[];
    likes:number;
    editor?: Editor | null;
    createdAt:string
  }
  export type ICategory = "National" | "Sports" | "World" | "Entertainment" | "Education" | "Trending";
  export const categories = ["National", "Sports", "World", "Entertainment", "Education", "Trending"];
  