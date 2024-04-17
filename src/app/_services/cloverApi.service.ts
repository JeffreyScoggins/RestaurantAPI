import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {User} from '../_models';
import {environment} from '../../environments/environment.prod';
import {throwError} from 'rxjs';
import { ClientCredentials } from '../_models/clientCredentials';
import { Object } from 'lodash';
import {stringDistance} from 'codelyzer/util/utils';

@Injectable({ providedIn: 'root' })
export class CloverApiService {

  constructor(private http: HttpClient) {

  }

  SaveClientCredentials(body: ClientCredentials) {
    console.log('in CloverApiService saveClientCredentials');
    return this.http.post<any>(`${environment.apiUrl}/clientCredentials/saveClientCredentials`, body);
  }


  GetMerchantId(localMerchantId: string)
  {
    console.log('in CloverApiService getMerchantId');

     const body = {
    'merchant_id': localMerchantId
              };
     return this.http.post<any>(`${environment.apiUrl}/clientCredentials/getMerchantId`, body );
  }

  GetCloverToken(storedMerchantId: any)
  {
    console.log('in CloverApiService getCloverToken');

     const body = {
    'merchant_id': storedMerchantId
              };
     return this.http.post<any>(`${environment.apiUrl}/clientCredentials/getCloverToken`, body );
  }

  getAllCategories(merchantId: string, cloverToken: string) {
    console.log('in CloverApiService getAllCategories'); //*MES*
    const body = {
      'merchant_id': merchantId,
      'token': cloverToken
    };
    return this.http.post<any>(`${environment.apiUrl}/cloverApi/categories`, body);
  }

  getAllItems(merchantId: string, cloverToken: string) {
    console.log('in CloverApiService getAllItems'); //*MES*

    const body = {
      'merchant_id': merchantId,
      'token': cloverToken
    };
    return this.http.post<any>(`${environment.apiUrl}/cloverApi/items`, body);
  }


  getAllItemsByCategoryId(id: string, merchantId: string, cloverToken: string) {
    console.log('in CloverApiService getAllItemsByCategoryId'); //*MES*

    const body = {
      'merchant_id': merchantId,
      'token': cloverToken,
      'category_id': id
    };
    return this.http.post<any>(`${environment.apiUrl}/cloverApi/itemsByCategory`, body);
  }

  getItemByItemId(id: string, merchantId: string, cloverToken: string) {
    console.log('in CloverApiService getItemByItemId'); //*MES*
    const body = {
      'merchant_id': merchantId,
      'token': cloverToken,
      'item_id': id
    };
    return this.http.post<any>(`${environment.apiUrl}/cloverApi/itemByItemId`, body);
  }

  getAllCategoriesByItemId(id: string, merchantId: string, cloverToken: string) {
    console.log('in CloverApiService getAllCategoriesByItemID'); //*MES*

    const body = {
      'merchant_id': merchantId,
      'token': cloverToken,
      'item_id': id
    };
    return this.http.post<any>(`${environment.apiUrl}/cloverApi/categoriesByItems`, body);
  }


  getModifierGroupsByItemId(id: string, merchantId: string, cloverToken: string) {
    console.log('in CloverApiService getModifierGroupsByItemId'); //*MES*
    const body = {
      'merchant_id': merchantId,
      'token': cloverToken,
      'item_id': id
    };
    return this.http.post<any>(`${environment.apiUrl}/cloverApi/modifierGroupsByItemId`, body);
  }

  getAllModifiersByGroupId(id: string, merchantId: string, cloverToken: string) {
        console.log('in CloverApiService getModifierGroupsByGroupId'); //*MES*
        const body = {
          'merchant_id': merchantId,
          'token': cloverToken,
          'modifiersGroupId': id
        };
        return this.http.post<any>(`${environment.apiUrl}/cloverApi/modifiersByGroupId`, body);
      }


}
