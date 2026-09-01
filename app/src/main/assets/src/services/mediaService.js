/**
 * HUFFAZ ETAWAH - Media Manager & Storage Abstraction Service
 * Manages branding assets, program photos, thumbnails, and gallery albums.
 * Uses local IndexedDB / base64 storage with cloud storage adapter readiness.
 */

const mediaService = {
  STORAGE_KEY: "huffaz_media_items",
  ALBUMS_KEY: "huffaz_gallery_albums",

  getDefaultMedia: function() {
    return [
      {
        id: "media-1",
        name: "Official Crest Logo",
        category: "logo",
        url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80",
        date: "2026-08-15",
        size: "45 KB"
      },
      {
        id: "media-2",
        name: "Etawah Jamea Masjid Banner",
        category: "home_banner",
        url: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&auto=format&fit=crop&q=80",
        date: "2026-08-20",
        size: "120 KB"
      },
      {
        id: "media-3",
        name: "Jumma Khutba Thumbnail",
        category: "bayan_thumbnails",
        url: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600&auto=format&fit=crop&q=80",
        date: "2026-08-28",
        size: "85 KB"
      },
      {
        id: "media-4",
        name: "Annual Dastarbandi Program",
        category: "program_photos",
        url: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&auto=format&fit=crop&q=80",
        date: "2026-08-25",
        size: "110 KB"
      },
      {
        id: "media-5",
        name: "Kids Quran Learning",
        category: "kids_thumbnails",
        url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80",
        date: "2026-08-30",
        size: "95 KB"
      }
    ];
  },

  getDefaultAlbums: function() {
    return [
      {
        id: "album-1",
        albumName: "Salana Jalsa Dastarbandi 2026",
        programName: "HUFFAZ ETAWAH Annual Convocation",
        date: "15 August 2026",
        description: "Hifz-e-Quran mukammal karne wale talaba ki dastarbandi aur azeemush-shaan ijtima.",
        coverPhoto: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&auto=format&fit=crop&q=80",
        photos: [
          "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
        ]
      },
      {
        id: "album-2",
        albumName: "Ramadan Iftar & Taraweeh Gathering",
        programName: "Ijtima-e-Ramadan",
        date: "March 2026",
        description: "Etawah markaz mein ijtimai iftar aur khashu-o-khuzoo ke sath namaz-e-taraweeh.",
        coverPhoto: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&auto=format&fit=crop&q=80",
        photos: [
          "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80"
        ]
      }
    ];
  },

  getAllMedia: function(categoryFilter = "all") {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const items = stored ? JSON.parse(stored) : this.getDefaultMedia();
      if (categoryFilter === "all") return items;
      return items.filter(i => i.category === categoryFilter);
    } catch (e) {
      return this.getDefaultMedia();
    }
  },

  addMedia: function(mediaObj) {
    const items = this.getAllMedia("all");
    const newItem = {
      id: "media-" + Date.now(),
      name: mediaObj.name || "Untitled Media",
      category: mediaObj.category || "gallery_images",
      url: mediaObj.url,
      date: new Date().toISOString().split("T")[0],
      size: mediaObj.size || "100 KB"
    };
    items.unshift(newItem);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return newItem;
  },

  deleteMedia: function(id) {
    const items = this.getAllMedia("all").filter(i => i.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return true;
  },

  // Albums & Photo Gallery
  getAllAlbums: function() {
    try {
      const stored = localStorage.getItem(this.ALBUMS_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultAlbums();
    } catch (e) {
      return this.getDefaultAlbums();
    }
  },

  addAlbum: function(albumData) {
    const albums = this.getAllAlbums();
    const newAlbum = {
      id: "album-" + Date.now(),
      albumName: albumData.albumName,
      programName: albumData.programName || "HUFFAZ ETAWAH Program",
      date: albumData.date || new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }),
      description: albumData.description || "",
      coverPhoto: albumData.coverPhoto || (albumData.photos && albumData.photos[0]) || "",
      photos: albumData.photos || []
    };
    albums.unshift(newAlbum);
    localStorage.setItem(this.ALBUMS_KEY, JSON.stringify(albums));
    return newAlbum;
  },

  deleteAlbum: function(id) {
    const albums = this.getAllAlbums().filter(a => a.id !== id);
    localStorage.setItem(this.ALBUMS_KEY, JSON.stringify(albums));
    return true;
  }
};

if (typeof window !== "undefined") {
  window.mediaService = mediaService;
}
