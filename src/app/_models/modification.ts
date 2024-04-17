import { Modifier } from "./modifier";

export class Modification {

    id: string;
    name: string;
    alternateName: string;
    amount: number;
    modifier: Modifier;
    quantitySold: number; // This is only used in reports. The count of how many of these modifiers that were sold
    refunded: boolean;
  
}
