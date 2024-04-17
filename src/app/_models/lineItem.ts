import { Modification } from './modification';

export class LineItem {

  id: string;
  cartId: string;     // used while deleting items in cart
  item: {id:string};  //references the item id
  name: string;
  alternateName: string;
  price: number;  // if not empty its price of a single unit
  priceWithModifiers: number; // used for reporting
  priceWithModifiersAndItemAndOrderDiscounts: number; //Price of item after adding all modifications and subtracting all line item and order level discounts. This is used only for reporting.
  unitQty: number; //Unitquantity if this line item is priced by quantity, or null if the item is not priced by quantity.
  unitName: string; //eg oz, lb etc or null
  itemCode: string;
  note: string;
  printed: boolean; //True if this line item has been printed out on an order printer at least once already.
  createdTime: number;
  orderClientCreatedTime: number;
 // discounts: any[]; //list of line items discounts
  modifications:  {elements: Modification[]} ;
  newModifications: Modification[];
}
