import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  searchBooks,
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book, Constants } from '@tmo/shared/models';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  takeUntil,
} from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit, OnDestroy {
  constants = Constants;
  books$ = this.store.select(getAllBooks);

  public instantSearchText: string;
  private componentDestroyed: Subject<boolean> = new Subject();

  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.searchForm.valueChanges
      .pipe(
        map((val) => val.term),
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.componentDestroyed)
      )
      .subscribe((searchTerm) => {
        this.instantSearchText = searchTerm;
        this.searchBooks();
      });
  }

  addBookToReadingList = (book: Book) => {
    this.store.dispatch(addToReadingList({ book }));
  };

  searchExample = () => {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  };

  searchBooks = () => {
    this.searchForm.value.term
      ? this.store.dispatch(searchBooks({ term: this.searchTerm }))
      : this.store.dispatch(clearSearch());
  };

  ngOnDestroy = () => {
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  };
}
