export type Video = {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  duration: number;
  editor: {
    _id: string;
    name?: string;
    email?: string;
  } | string;
  createdAt: string;
};
