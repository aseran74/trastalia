const axios = require('axios');

class UnsplashService {
  constructor() {
    this.accessKey = process.env.UNSPLASH_ACCESS_KEY;
    this.baseUrl = 'https://api.unsplash.com';
    this.headers = {
      'Authorization': `Client-ID ${this.accessKey}`,
      'Accept-Version': 'v1'
    };
  }

  // Buscar fotos por categoría
  async searchPhotos(query, options = {}) {
    try {
      const params = {
        query,
        per_page: options.perPage || 10,
        page: options.page || 1,
        orientation: options.orientation || 'all',
        color: options.color || 'all',
        order_by: options.orderBy || 'relevant'
      };

      const response = await axios.get(`${this.baseUrl}/search/photos`, {
        headers: this.headers,
        params
      });

      return {
        success: true,
        data: response.data.results.map(photo => this.formatPhoto(photo)),
        total: response.data.total,
        totalPages: response.data.total_pages
      };
    } catch (error) {
      console.error('Error searching photos from Unsplash:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obtener foto por ID
  async getPhotoById(photoId) {
    try {
      const response = await axios.get(`${this.baseUrl}/photos/${photoId}`, {
        headers: this.headers
      });

      return {
        success: true,
        data: this.formatPhoto(response.data)
      };
    } catch (error) {
      console.error('Error getting photo from Unsplash:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obtener fotos aleatorias por categoría
  async getRandomPhotos(category, count = 5) {
    try {
      const response = await axios.get(`${this.baseUrl}/photos/random`, {
        headers: this.headers,
        params: {
          query: category,
          count,
          orientation: 'landscape'
        }
      });

      return {
        success: true,
        data: response.data.map(photo => this.formatPhoto(photo))
      };
    } catch (error) {
      console.error('Error getting random photos from Unsplash:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Formatear foto de Unsplash
  formatPhoto(photo) {
    return {
      id: photo.id,
      url: photo.urls.regular,
      thumbUrl: photo.urls.thumb,
      fullUrl: photo.urls.full,
      altDescription: photo.alt_description || '',
      photographer: {
        name: photo.user.name,
        username: photo.user.username,
        profileUrl: photo.user.links.html
      },
      dimensions: {
        width: photo.width,
        height: photo.height
      },
      color: photo.color,
      description: photo.description,
      tags: photo.tags ? photo.tags.map(tag => tag.title) : []
    };
  }

  // Mapear categorías de artículos a términos de búsqueda de Unsplash
  getSearchTerms(category) {
    const categoryMap = {
      'electronica': ['electronics', 'technology', 'gadgets', 'smartphone', 'laptop'],
      'ropa': ['fashion', 'clothing', 'style', 'outfit', 'dress'],
      'hogar': ['home', 'interior', 'furniture', 'decoration', 'kitchen'],
      'deportes': ['sports', 'fitness', 'gym', 'running', 'bicycle'],
      'libros': ['books', 'reading', 'library', 'education', 'study'],
      'juegos': ['games', 'gaming', 'toys', 'board games', 'video games'],
      'musica': ['music', 'instruments', 'guitar', 'piano', 'concert'],
      'arte': ['art', 'painting', 'sculpture', 'creative', 'design'],
      'coches': ['cars', 'automotive', 'vehicle', 'transport', 'road'],
      'muebles': ['furniture', 'chair', 'table', 'sofa', 'bed'],
      'herramientas': ['tools', 'workshop', 'diy', 'construction', 'repair'],
      'jardineria': ['garden', 'plants', 'nature', 'outdoor', 'flowers']
    };

    return categoryMap[category.toLowerCase()] || [category];
  }
}

module.exports = new UnsplashService();
