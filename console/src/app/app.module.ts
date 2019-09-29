import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DetailPopupComponent } from './search-list/detail-popup/detail-popup.component';
import { SearchListComponent } from './search-list/search-list.component';
import { SearchSubmitComponent } from './search-submit/search-submit.component';
import { PersonService } from './services/person.service';
import { MatDialog, MatDialogModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    SearchSubmitComponent,
    SearchListComponent,
    DetailPopupComponent
  ],
  entryComponents: [
    DetailPopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatInputModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    FlexLayoutModule,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    MatSelectModule,
    MatChipsModule,
    HttpClientModule,
    MatIconModule,
    MatDialogModule,
  ],
  providers: [PersonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
