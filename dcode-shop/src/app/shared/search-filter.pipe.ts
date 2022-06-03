import { Pipe, PipeTransform } from '@angular/core';
import { Article } from '../admin/adminarticle/article';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(input: any, filter: Article): any {
    let items: Article[] = input;

    // Filter items where filter.name occurs somewhere in item.name (if not the case: indexOf returns -1)
    // If item.brand is defined: also filter on this
    // If item.description is defined: also filter on this
    items = items.filter(item =>
      item.name.toLowerCase().indexOf(filter.name.toLowerCase()) !== -1 ||
      (item.brand !== null ? (item.brand.toLowerCase().indexOf(filter.brand.toLowerCase()) !== -1) : '') ||
      (item.description !== null ? (item.description.toLowerCase().indexOf(filter.description.toLowerCase()) !== -1) : '')
    );
    
    return items;
  }

}
