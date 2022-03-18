import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {

  public editForm!: FormGroup;
  public countries: any;
  closeResult: string | undefined;
  public deleteId: number | undefined;

  constructor(
    private httpClient: HttpClient,
    public dialog:  MatDialog,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getCountries();
    this.editForm = this.fb.group({
      id: [''],
      description: [''],
      capital: [''],
      code: [''],
      nationality: [''],
      continent: ['']
    });
  }

  openAdd(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, {
      width: '40%',
      height: '70%'
    });
  }

  openDetails(templateRef: TemplateRef<any>, country: any) {
    console.log(country)
    this.dialog.open(templateRef, {
      width: '40%',
      height: '70%'
    });
    document.getElementById('dcr')!.setAttribute('value', country.description);
    document.getElementById('cpl')!.setAttribute('value', country.capital);
    document.getElementById('cod')!.setAttribute('value', country.code);
    document.getElementById('nlt')!.setAttribute('value', country.nationality);
    document.getElementById('cnt')!.setAttribute('value', country.continent);
  }

  openEdit(templateRef: TemplateRef<any>, country: any) {
    console.log(country)
    this.dialog.open(templateRef, {
      width: '40%',
      height: '70%'
    });
    this.editForm.patchValue({
      id: country.id,
      description: country.description,
      capital: country.capital,
      code: country.code,
      nationality: country.nationality,
      continent: country.continent
    });
  }


  openDelete(templateRef: TemplateRef<any>, country: any) {
    this.deleteId = country.id;
    console.log(country.id)
    this.dialog.open(templateRef, {
      width: '40%',
      height: '40%'
    });
  }

  getCountries(){
    this.httpClient.get<any>('http://localhost:8880/countries').subscribe(
      response => {
        console.log(response);
        this.countries = response;
      }
    );
  }

  onSubmit(f: NgForm) {
    console.log(f.value)
    const url = 'http://localhost:8880/countries';
    this.httpClient.post(url, f.value)
      .subscribe((result) => {
        this.ngOnInit(); //reload the table
      });
    this.dialog.closeAll();
  }

  onSave(){
    const editURL = 'http://localhost:8880/countries/' + this.editForm.value.id;
    this.httpClient.put(editURL, this.editForm.value)
    .subscribe((result) => {
      this.ngOnInit();
    });
    this.dialog.closeAll();
  }

  onDelete() {
    const deleteURL = 'http://localhost:8880/countries/' + this.deleteId ;
    this.httpClient.delete(deleteURL)
      .subscribe((results) => {
        this.ngOnInit();
      });
      this.dialog.closeAll();
  }


}
