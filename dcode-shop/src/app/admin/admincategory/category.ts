import {Article} from "../adminarticle/article";

export interface Category {
  id: number;
  name: string;
  description: string;
  products?: Article[];
}
