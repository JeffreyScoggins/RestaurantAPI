import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Modifier} from '../_models/modifier';
import {ModifierGroup} from '../_models/modifierGroup';
import { Item } from '../_models/Item';
import { first } from 'rxjs/operators';
import {CloverApiService} from '../_services/cloverApi.service';

@Component({
  selector: 'app-item-options-dialog-component',
  templateUrl: './item-options-dialog-component.component.html',
  styleUrls: ['./item-options-dialog-component.component.scss']
})
export class ItemOptionsDialogComponentComponent implements OnInit {

  description: string;
  item: Item;
  modifierGroups: ModifierGroup[];
  modifiers: Modifier[];
  selectedOptions: Modifier[] = [];
  limitSelection: number;
  total = 0;
  selectionError = false;
  priceModification = 0;
  modificationCount = 0;
  modifiers_loading = true;
  firsttime = true;
  localMerchantId: any;
  storedMerchantId: string;
  storedCloverToken: any;

  constructor(private dialogRef: MatDialogRef<ItemOptionsDialogComponentComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private cloverApiService: CloverApiService )
  {
    console.log("in item-option-dialog constructor");
    this.description = data.title;
    console.log("data title" + data.title);
    this.item = data.options;
    console.log("options :" + data.options);
    // this.limitSelection = data.limitSelection;
    this.storedMerchantId = ' ';
  }

  ngOnInit() {
    this.loadAllModifierGroupsByItemId(this.item.id);
    // this.modifiers_loading = false;
  }

  private loadAllModifierGroupsByItemId(itemId: string) {
    const localMerchantId = localStorage.getItem('merchant_id');
    this.cloverApiService.GetMerchantId(localMerchantId).pipe(first()).subscribe(
      id => {
        this.storedMerchantId = id;

        this.cloverApiService.GetCloverToken(this.storedMerchantId).pipe(first()).subscribe(
          token => {
            this.storedCloverToken = token;

            this.cloverApiService.getModifierGroupsByItemId(itemId, this.storedMerchantId, this.storedCloverToken).pipe(first()).subscribe(modifierG => {
              this.modifierGroups = modifierG.elements;
              this.modifiers_loading = false;
            });
          });
      },
      error => {
        console.log(error);
      });
  }

  // private loadAllModifierGroupsByItemId(itemId: string) {

  //   this.cloverApiService.getModifierGroupsByItemId(itemId).pipe(first()).toPromise().then(modifierG => {
  //     this.modifierGroups = modifierG.elements;
  //     this.modifiers_loading = false;
  //     console.log("promise resolved")
  //   });
  //   console.log('I will not wait until promise is resolved..');
  // }

  initModifierSelected() {
    console.log("In dialog" + this.modifierGroups.length);
    if (this.modifierGroups.length > 0) {
      this.modifierGroups.forEach((group) => {
        console.log("group.sel :" + group.selected);
        group.selected = 0;
      });
    }
    this.firsttime = false;
  }

  onItemSelect(index: number, modifier: Modifier, isChecked: boolean) {
    console.log("index: " + index);
    if (this.firsttime)
      this.initModifierSelected();

    if (isChecked) {
      this.selectedOptions.push(modifier);
      this.modifierGroups[index].selected += 1;
    } else {
      console.log("is it here");
      const position = this.selectedOptions.indexOf(modifier);
      if (position !== -1) {
        this.selectedOptions.splice(position, 1);
        this.modifierGroups[index].selected -= 1;
      };
    }
    console.log("no of selected: " + this.modifierGroups[index].selected);
  }


  private checkSelectionError() : boolean {
    this.selectionError = false;
    console.log("check if required options are selected");
    this.modifierGroups.forEach((group) => {
      console.log("group.min :" + group.minRequired);
      console.log("group.sel :" + group.selected);
      if ((group.minRequired && group.minRequired > group.selected) ||
        (group.maxAllowed && group.maxAllowed < group.selected))
      {
        console.log("group.req :" + group.minRequired + " ERROR in Selection");
        this.selectionError = true;
      }
    });
    return this.selectionError;
  }


  save() {
    if (this.firsttime) {
      this.initModifierSelected();
    }

    if (this.checkSelectionError()) {
      console.log("not enough options selected");
      return;
    }

    console.log("no of selected options :" + this.selectedOptions.length);
    const customMessage: string = (<HTMLInputElement>document.getElementById('custom-message-input')).value;
    console.log("customize :" + customMessage);

    this.dialogRef.close({
      selectedOptions: this.selectedOptions,
      note: customMessage
    });

  }

  close() {
    this.dialogRef.close();
  }

  private performUpdateSelected(isChecked: boolean, item: ModifierGroup, modifier: Modifier) {
    if (isChecked) {
      item.selected++;
      this.modificationCount++;
      modifier.checked = true;
      this.selectedOptions.push(modifier);
      this.total += Number(modifier.price);
    } else {

      item.selected--;
      this.modificationCount--;
      modifier.checked = false;
      const index = this.selectedOptions.indexOf(modifier);
      if (index !== -1) {
        this.selectedOptions.splice(index, 1);
        this.total -= Number(modifier.price);
      }
    }
  }

  /*   onItemSelect(item: ModifierGroup, modifier: Modifier, isChecked: boolean, modificationPrice?: number) {
    if (modificationPrice) {
      this.priceModification = modificationPrice;
      this.selectedOptions = [];
      this.total = 0;
      this.selectedOptions.push(modifier);
      this.total += Number(modifier.price);
    } else {
      this.performUpdateSelected(isChecked, item, modifier);
    }
  } */
}
