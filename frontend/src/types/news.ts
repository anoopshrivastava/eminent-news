  export interface Editor {
    _id: string;
    username: string
    name: string;
    email:string;
    avatar: string;
    followers: string[]
  }

  export interface IComment {
    user:string,
    comment:string,
  }
  
  export interface News {
    _id: string;
    title: string;
    description: string;
    category: ICategory,
    subCategories: string[],
    videoUrl:string,
    videoUrl2?:string,
    images: string[];
    likes:string[];
    editor?: Editor | null;
    createdAt:string
    comments:IComment[]
  }
  export type ICategory = "National" | "World" | "Trending" | "Sports" | "Entertainment" | "Exam Update";
  export const categories = ["National" , "World" , "Trending" , "Sports" , "Entertainment" , "Exam Update"];
  

  export const subCategoriesMap: Record<string, string[]> = {
  National: ["Daily Short News", "State News", "Government Scheme", "Economy & Business", "Judicial News", "Social Justice", "Indian Society", "Internal Security", "Editorial", "Essays"],
  World: ["World News", "Bilateral Relations", "World Organizations", "World Indexes & Reports","Conferences, meeting & Summits", "Space Technology", "Defense News", "Innovation & Technology", "Environment"],
  Trending: ["Honors and Awards", "Books & Authors", "Brand Ambassadors", "Eminent", "Health & Disease", "Important Days and Themes", "GI Tags", "Fairs, Festivals & Exhibitions"],
  Sports: ["Indian Sports", "Team 11", "Athelatic Events", "Olympic Games", "Sports Persons"],
  Entertainment: ["Automobiles", "Gadget", "Lovey Dovey", "Startups", "Travel"],
  "Exam Update": ["Exam Notification", "Job Notification", "Q/A", "Magazines", "Podcast", "TEN updates"],
};