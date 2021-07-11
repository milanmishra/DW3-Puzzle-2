import { async, ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule } from '@tmo/shared/testing';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';

describe('BookSearchComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it("should search book when searchBooks() is called", fakeAsync(()=>{
    component.ngOnInit();
    const searchBook = jest.spyOn(component, "searchBooks");

    component.searchForm.setValue({term: "javascript"});
    
    tick(500);
    
    expect(searchBook).toHaveBeenCalled();
  }));

  it("should search book when book search value is javascript",  () => {
    component.searchExample();

    expect(component.searchForm.value.term).toEqual("javascript");
  });

  it('should not search book when searchBooks() is called and time spent after entering search term is less than 500ms', fakeAsync(() => {
    component.ngOnInit();
    const searchBook = jest.spyOn(component, "searchBooks");

    component.searchForm.setValue({term: "javascript"});

    tick(400);

    expect(searchBook).not.toHaveBeenCalled();
    discardPeriodicTasks();
  }));
});
