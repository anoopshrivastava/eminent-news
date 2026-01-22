import type { IComment } from "./news";

export interface Short {
    _id: string;
    title: string;
    description?: string;
    videoUrl: string;
    publicId?: string;
    thumbnail?: string;
    duration?: number;
    videoMimeType?: string;
    editor?: {
      _id?: string;
      name?: string;
      email?: string;
    } | string;
    createdAt: string;
    updatedAt: string;
    comments:IComment[]
  }
  