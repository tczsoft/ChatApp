import { Injectable } from '@angular/core';
import { DataUrl, NgxImageCompressService } from 'ngx-image-compress';

@Injectable({
  providedIn: 'root',
})
export class CompressimageService {


  constructor(private imageCompress: NgxImageCompressService) {}

  async compressFile(image : any) {
    var orientation = -1;
    const result : DataUrl = await this.imageCompress.compressFile(image, orientation, 50, 50);
    return result;
  }

}
