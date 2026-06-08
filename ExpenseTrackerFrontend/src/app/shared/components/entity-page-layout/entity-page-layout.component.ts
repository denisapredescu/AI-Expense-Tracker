import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-entity-page-layout',
  templateUrl: './entity-page-layout.component.html',
  styleUrls: ['./entity-page-layout.component.scss']
})

export class EntityPageLayoutComponent {

  @Input() title = '';

  @Input() subtitle = '';

  @Input() entityName = '';

  @Input() newSectionIsOpen = false;

  @Input() isEmpty = true;

  @Output() toggleSection = new EventEmitter<boolean>();
}