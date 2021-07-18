import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import {
  createBook,
  createReadingListItem,
  SharedTestingModule
} from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { okReadsConstants } from '@tmo/shared/models';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;
  let matSnackBar: MatSnackBar;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule, MatSnackBarModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
    matSnackBar = TestBed.inject(MatSnackBar);
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
  });

  describe('loadReadingList$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne(`${okReadsConstants.API_LINKS.READING_API}`).flush([]);
    });
  });

  describe('addBook$', () => {
    it('should add book to the reading list', () => {
      actions = new ReplaySubject();
      const book = createBook('AA');

      actions.next(ReadingListActions.addToReadingList({ book, showSnackBar:true }));

      effects.addBook$.subscribe(() => {
        expect(store.dispatch).toHaveBeenCalledWith(
          ReadingListActions.confirmedAddToReadingList({ book })
        );
      });
    });

    it('should undo add book to the reading list action when snackbar action is clicked', () => {
      actions = new ReplaySubject();
      const book = createBook('AA');

      actions.next(ReadingListActions.addToReadingList({ book, showSnackBar:true }));

      effects.addBook$.subscribe(() => {
        matSnackBar._openedSnackBarRef.dismissWithAction();

        expect(store.dispatch).toHaveBeenCalledWith(
          ReadingListActions.undoAddToReadingList({ book })
        );
      });
    });
  });

  describe('removeBook$', () => {
    it('should remove book from the reading list', () => {
      actions = new ReplaySubject();
      const item = createReadingListItem('AA');

      actions.next(ReadingListActions.removeFromReadingList({ item, showSnackBar:true }));

      effects.removeBook$.subscribe(() => {
        expect(store.dispatch).toHaveBeenCalledWith(
          ReadingListActions.confirmedRemoveFromReadingList({ item })
        );
      });
    });

    it('should undo remove book from the reading list action when snackbar action is clicked', () => {
      actions = new ReplaySubject();
      const item = createReadingListItem('AA');

      actions.next(ReadingListActions.removeFromReadingList({ item, showSnackBar:true }));

      effects.removeBook$.subscribe(() => {
        matSnackBar._openedSnackBarRef.dismissWithAction();
        
        expect(store.dispatch).toHaveBeenCalledWith(
          ReadingListActions.undoRemoveFromReadingList({ item })
        );
      });
    });
  });
});
