import { Component, OnInit ,ElementRef, ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';


@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css']
})
export class CvComponent implements OnInit {
 
  myForm: FormGroup;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  langageCtrl = new FormControl();
  filteredLangages: Observable<string[]>;
  langages: string[] = [];
  allLangages: string[] = ['javascript', 'PHP', 'python', 'c', 'java'];

  @ViewChild('langageInput') langageInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;


  constructor(private fb: FormBuilder) { 
    this.filteredLangages = this.langageCtrl.valueChanges.pipe(
      startWith(null),
      map((langage: string | null) => langage ? this._filter(langage) : this.allLangages.slice()));

  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      nom: '',
      prenom: '',
      email: '',
      age: '',
      experience: this.fb.array([]),
      skills: this.fb.array([])
    })

  }
  get expsForms() {
    return this.myForm.get('experience') as FormArray
  }
  get expForms() {
    return this.myForm.get('skills') as FormArray
  }
  addExp() {

    const phone = this.fb.group({ 
      exp:[],
      date1: [],
     date2: [],
    })

    this.expsForms.push(phone);
  }

  addSkills(valeur) {
    const langajt = this.fb.group({ 
      exp: valeur,
    
     
    })
    this.expForms.push(langajt);
  }
  deleteSkill(i) {
    this.expForms.removeAt(i)
  }
  deleteExp(i) {
    this.expsForms.removeAt(i)
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.langages.push(value.trim());
      this.addSkills(value.trim());

    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.langageCtrl.setValue(null);
  }

  remove(langage: string): void {
    const index = this.langages.indexOf(langage);

    if (index >= 0) {
      this.langages.splice(index, 1);
    }
    this.deleteSkill(langage);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.langages.push(event.option.viewValue);
    this.addSkills(event.option.viewValue);

    this.langageInput.nativeElement.value = '';
    this.langageCtrl.setValue(null);
  }

  submit(){
    console.log(this.myForm.value);
    
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allLangages.filter( langage=> langage.toLowerCase().indexOf(filterValue) === 0);
  }
}


