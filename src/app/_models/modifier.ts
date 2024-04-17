/* export class Modifier {
  orgUuid: string;
  name: string;
  price: number;
  priceAddon: number;
  checked: boolean;
} */
import {ModifierGroup} from './modifierGroup';

export class Modifier {
  id: string;
  name: string;
  price: number;
  modifierGroup: ModifierGroup;

  orgUuid: string;
  priceAddon: number;
  checked: boolean;
}
