package com.backend.music.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.backend.music.dto.request.AlbumRequest;
import com.backend.music.dto.response.AlbumResponse;

public interface AlbumService {
    Page<AlbumResponse> getAllAlbums(Pageable pageable);
    Page<AlbumResponse> searchByTitle(String title, Pageable pageable);
    Page<AlbumResponse> searchByArtist(String artist, Pageable pageable);
    Page<AlbumResponse> filterByYear(Integer year, Pageable pageable);
    AlbumResponse getAlbumById(String id);
    AlbumResponse createAlbum(AlbumRequest request);
    AlbumResponse updateAlbum(String id, AlbumRequest request);
    void deleteAlbum(String id);
    AlbumResponse addTrackToAlbum(String albumId, String trackId);
} 