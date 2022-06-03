import { Article } from "../../admin/adminarticle/article";
import {PaginationHeaders} from "./pagination-headers";

export interface ArticlesResponse extends PaginationHeaders{
  data: Article[];
}
