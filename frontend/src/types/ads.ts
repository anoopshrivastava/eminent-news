  
  export interface Ads {
    _id: string;
    title: string;
    description: string;
    category: ICategory;
    url:string;
    images?: string[];
    video?:{
      url: string,
      publicId: string,
    }
    createdAt:string;
    isApproved:boolean;
    createdBy?:{
      name:string,
      role:string
    }
  }
  export type ICategory = "Banner" | "Highlights" | "FullPageShorts" | "VideoShorts"
  export const categories = [
  "Banner",
  "Highlights",
  "FullPageShorts",
  "VideoShorts",
];

  