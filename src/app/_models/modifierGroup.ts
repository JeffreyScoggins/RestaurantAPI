import {Modifier} from './modifier';

export class ModifierGroup {
  id: string;
  name: string;
  showByDefault: Boolean;
  minRequired: number;
  maxAllowed: number;
  groupName: string;
  groupLimit: number;
  minimumSelect: number;
  selected: 0;
//  modifiers: Modifier[];
//  modifiers: any[];
  modifiers: {
    elements: Modifier[];
    modifierIds: string[];
  }
}


/* export class ModifierGroup {
  groupName: string;
  groupLimit: number;
  minimumSelect: number;
  modifiers: Modifier[];
  selected: number;
} */