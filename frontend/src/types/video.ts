export type Video = {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  duration: number;
  likes: {
    user: string;
  }[];
  editor: {
    _id: string;
    name?: string;
    email?: string;
    avatar?:string;
  } | string;
  createdAt: string;
};
