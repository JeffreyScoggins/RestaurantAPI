import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Subscriber} from 'rxjs';
import {first} from 'rxjs/operators';
import { LineItem } from '../_models/lineItem';
@Injectable()
export class CartService {
  private lineItemsInCartSubject: BehaviorSubject<LineItem[]> = new BehaviorSubject([]);
  private lineItemsInCart: LineItem[] = [];

  constructor() {
    this.lineItemsInCartSubject.subscribe(_ => this.lineItemsInCart = _);
  }

  public addToCart(lineItem: LineItem) {
    console.log("in cart service");
    this.lineItemsInCartSubject.next([...this.lineItemsInCart, lineItem]);
  }

  public getItems(): Observable<LineItem[]> {
    return this.lineItemsInCartSubject;
  }

  public removeFromCart(lineItem: LineItem) {
    console.log("Removing lineitem" + lineItem.name);
    const currentItems = [...this.lineItemsInCart];
    const lineItemsWithoutRemoved = currentItems.filter(_ => _.cartId !== lineItem.cartId);
    this.lineItemsInCartSubject.next(lineItemsWithoutRemoved);
  }

  public removeAllFromCart() {
    this.lineItemsInCart = [];
    this.lineItemsInCartSubject.next([...this.lineItemsInCart]);
  }

  public getTotalAmount() {
    let total = 0;
    let lineItemList: LineItem[] = [];
    this.getItems().pipe(first()).subscribe(lineItem => {
      lineItemList = lineItem;
    });
    lineItemList.forEach(lineItem => {
      if (lineItem.priceWithModifiers > 0)
        total += lineItem.priceWithModifiers;
      else
        total += lineItem.price;
    });
    return total;
  }
}

