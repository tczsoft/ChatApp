import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash';
@Pipe({
  name: 'orderby'
})
export class OrderbyPipe implements PipeTransform {

  transform(array: any, field: any): any {
    console.log(array,field)
    if (!Array.isArray(array)) {
      return;
    }
    array.sort((a: any, b: any) => {
      console.log(a.count)
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }

}
