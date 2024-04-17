//import {ModifierGroup} from './modifierGroup';
import { Modifier } from './modifier';

export class Item {
/*   id: string;
  orgUuid: string;
  itemUuid: string;
  name: string;
  price: number;
  categoryUuid: string;
  containsOptions: boolean;
  options: ModifierGroup[];
  selectedOptions: string[];
  // optionCapacity: number;
  // minimumOptionsSelection: number;
  imageData: string;
  imageName: string;
  imageType: string; */

  id: string;
  hidden: boolean;
  name: string;
  alternateName: string;
  code: string;
  sku: string;
  price: number;
  priceType: string;
  defaultTaxRates: boolean;
  unitName: string;
  cost: number;
  isRevenue: boolean;
  stockCount: number;
  modifiedTime: number;
  selectedOptions: Modifier[];    //* added to store the selected options
  imageData: string;
}
