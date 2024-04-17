import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-dropdown-language-selector',
  templateUrl: './dropdown-language-selector.component.html',
  styleUrls: ['./dropdown-language-selector.component.scss']
})
export class DropdownLanguageSelectorComponent implements OnInit {

  categories: string[] = ['English', 'Arabic','Spanish', 'Urdu'];

  constructor(private translate: TranslateService) {
  }

  ngOnInit() {
  }

  sendMessage(selected: string) {
    this.translate.setDefaultLang(selected);
  }
}
