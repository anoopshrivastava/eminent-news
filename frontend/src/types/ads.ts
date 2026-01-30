  
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
      ratio:"9:16" | "16:9"
    }
    createdAt:string;
    isApproved:boolean;
    createdBy?:{
      name:string,
      role:string
    }
  }
  export type ICategory = "Banner" | "Highlights" | "FullPageShorts" | "Video"
  export const categories = [
  "Banner",
  "Highlights",
  "FullPageShorts",
  "Video",
];

  