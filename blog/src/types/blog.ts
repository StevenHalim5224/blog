import User from "./user";

export interface Blog {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl: string;
  prepTime?: string;
  difficulty?: string;
  authorId: string;
  author?:{
    name: string;
    email: string;
  } 
  createdAt: string | Date;
  updateAt: string;
}
