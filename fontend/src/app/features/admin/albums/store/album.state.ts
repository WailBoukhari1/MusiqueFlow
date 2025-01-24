import { Album } from '../models/album.model';

export interface AlbumState {
  albums: Album[];
  selectedAlbum: Album | null;
  loading: boolean;
  error: string | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export const initialAlbumState: AlbumState = {
  albums: [],
  selectedAlbum: null,
  loading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 10
}; 