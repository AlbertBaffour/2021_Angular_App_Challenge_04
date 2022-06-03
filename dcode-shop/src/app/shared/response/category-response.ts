import { Article } from "../../admin/adminarticle/article";
import {PaginationHeaders} from "./pagination-headers";
import {Category} from "../../admin/admincategory/category";

export interface CategoryResponse extends PaginationHeaders{
  category: Category;
  data: Article[];
}
