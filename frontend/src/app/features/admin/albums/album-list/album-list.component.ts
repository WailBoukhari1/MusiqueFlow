import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AlbumService } from '../../../../core/services/album.service';
import { Album } from '../../../../core/models/album.model';
import { Store } from '@ngrx/store';
import { 
  selectAllAlbums,
  selectAlbumLoading,
  selectAlbumError,
  selectTotalElements
} from '../../../../store/album/album.selectors';
import { AlbumActions } from '../../../../store/album/album.actions';
import { Observable } from 'rxjs';
import { AppState } from '../../../../store/app.state';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-album-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h2>Albums</h2>
        <button mat-raised-button color="primary" routerLink="create">
          <mat-icon>add</mat-icon>
          Add New Album
        </button>
      </div>

      <div class="loading-shade" *ngIf="loading$ | async">
        <mat-spinner></mat-spinner>
      </div>

      <ng-container *ngIf="!(loading$ | async)">
        <ng-container *ngIf="albums$ | async as albums">
          <mat-table [dataSource]="albums">
            <ng-container matColumnDef="imageUrl">
              <mat-header-cell *matHeaderCellDef>Cover</mat-header-cell>
              <mat-cell *matCellDef="let album">
                <img [src]="getImageUrl(album.imageUrl)" 
                     [alt]="album.title" 
                     class="album-image">
              </mat-cell>
            </ng-container>

            <ng-container matColumnDef="title">
              <mat-header-cell *matHeaderCellDef>Title</mat-header-cell>
              <mat-cell *matCellDef="let album">{{album.title}}</mat-cell>
            </ng-container>

            <ng-container matColumnDef="artist">
              <mat-header-cell *matHeaderCellDef>Artist</mat-header-cell>
              <mat-cell *matCellDef="let album">{{album.artist}}</mat-cell>
            </ng-container>

            <ng-container matColumnDef="releaseDate">
              <mat-header-cell *matHeaderCellDef>Release Date</mat-header-cell>
              <mat-cell *matCellDef="let album">{{album.releaseDate | date}}</mat-cell>
            </ng-container>

            <ng-container matColumnDef="actions">
              <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
              <mat-cell *matCellDef="let album">
                <button mat-icon-button color="primary" (click)="onEdit(album)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="onDelete(album)">
                  <mat-icon>delete</mat-icon>
                </button>
              </mat-cell>
            </ng-container>

            <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
            <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
          </mat-table>
        </ng-container>

        <mat-paginator
          [length]="(total$ | async) || 0"
          [pageSize]="pageSize"
          [pageSizeOptions]="[5, 10, 25, 100]"
          (page)="onPageChange($event)">
        </mat-paginator>
      </ng-container>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .album-image {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
      background-color: #f5f5f5;
    }
    mat-table {
      margin-bottom: 20px;
    }
    .loading-shade {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.15);
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class AlbumListComponent implements OnInit {
  albums$: Observable<Album[]> = this.store.select(selectAllAlbums);
  loading$ = this.store.select(selectAlbumLoading);
  error$ = this.store.select(selectAlbumError);
  total$ = this.store.select(selectTotalElements);
  
  currentPage = 0;
  pageSize = 10;
  displayedColumns = ['imageUrl', 'title', 'artist', 'releaseDate', 'actions'];

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAlbums();
  }

  loadAlbums() {
    this.store.dispatch(AlbumActions.loadAlbums({
      page: this.currentPage,
      size: this.pageSize
    }));
  }

  onCreateAlbum(formData: FormData) {
    this.store.dispatch(AlbumActions.createAlbum({ album: formData }));
  }

  onUpdateAlbum(id: string, formData: FormData) {
    this.store.dispatch(AlbumActions.updateAlbum({ id, album: formData }));
  }

  onDeleteAlbum(id: string) {
    this.store.dispatch(AlbumActions.deleteAlbum({ id }));
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAlbums();
  }

  onEdit(album: Album) {
    this.router.navigate(['/admin/albums/edit', album.id]);
  }

  onDelete(album: Album) {
    const songCount = album.songs?.length || 0;
    const message = songCount > 0 
      ? `This will also delete ${songCount} song${songCount > 1 ? 's' : ''} associated with this album. Are you sure?`
      : 'Are you sure you want to delete this album?';

    if (confirm(message)) {
      this.onDeleteAlbum(album.id);
    }
  }

  getImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) {
      return 'assets/images/default-album.png';
    }
    return `${environment.apiUrl}/files/${imageUrl}`;
  }
} 