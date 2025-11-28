const axios = require('axios');

class PexelsService {
  constructor() {
    this.apiKey = process.env.PEXELS_API_KEY;
    this.baseUrl = 'https://api.pexels.com/v1';
    this.headers = {
      'Authorization': this.apiKey,
      'Content-Type': 'application/json'
    };
  }

  // Buscar fotos por query
  async searchPhotos(query, options = {}) {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          error: 'PEXELS_API_KEY no está configurada en las variables de entorno'
        };
      }

      const params = {
        query,
        per_page: options.perPage || 10,
        page: options.page || 1,
        orientation: options.orientation || 'all',
        color: options.color || 'all',
        size: options.size || 'all',
        locale: options.locale || 'es-ES'
      };

      const response = await axios.get(`${this.baseUrl}/search`, {
        headers: this.headers,
        params
      });

      return {
        success: true,
        data: response.data.photos.map(photo => this.formatPhoto(photo)),
        total: response.data.total_results,
        totalPages: Math.ceil(response.data.total_results / params.per_page),
        page: response.data.page,
        perPage: response.data.per_page
      };
    } catch (error) {
      console.error('Error searching photos from Pexels:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  // Obtener foto por ID
  async getPhotoById(photoId) {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          error: 'PEXELS_API_KEY no está configurada en las variables de entorno'
        };
      }

      const response = await axios.get(`${this.baseUrl}/photos/${photoId}`, {
        headers: this.headers
      });

      return {
        success: true,
        data: this.formatPhoto(response.data)
      };
    } catch (error) {
      console.error('Error getting photo from Pexels:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  // Obtener fotos populares/curated
  async getCuratedPhotos(count = 5, page = 1) {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          error: 'PEXELS_API_KEY no está configurada en las variables de entorno'
        };
      }

      const response = await axios.get(`${this.baseUrl}/curated`, {
        headers: this.headers,
        params: {
          per_page: count,
          page
        }
      });

      return {
        success: true,
        data: response.data.photos.map(photo => this.formatPhoto(photo)),
        total: response.data.total_results,
        page: response.data.page,
        perPage: response.data.per_page
      };
    } catch (error) {
      console.error('Error getting curated photos from Pexels:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  // Buscar fotos por categoría (mapeo de categorías)
  async searchByCategory(category, options = {}) {
    const searchTerms = this.getSearchTerms(category);
    // Usar el primer término de búsqueda
    return this.searchPhotos(searchTerms[0], options);
  }

  // Formatear foto de Pexels al formato estándar
  formatPhoto(photo) {
    return {
      id: photo.id.toString(),
      url: photo.src.large || photo.src.original,
      thumbUrl: photo.src.medium || photo.src.small,
      fullUrl: photo.src.original,
      altDescription: photo.alt || '',
      photographer: {
        name: photo.photographer,
        username: photo.photographer_id?.toString() || '',
        profileUrl: photo.photographer_url || ''
      },
      dimensions: {
        width: photo.width,
        height: photo.height
      },
      color: photo.avg_color || '#000000',
      description: photo.alt || '',
      tags: [] // Pexels no proporciona tags directamente
    };
  }

  // Mapear categorías de artículos a términos de búsqueda de Pexels
  getSearchTerms(category) {
    const categoryMap = {
      'electronica': ['electronics', 'technology', 'gadgets', 'smartphone', 'laptop', 'computer'],
      'ropa': ['fashion', 'clothing', 'style', 'outfit', 'dress', 'clothes'],
      'hogar': ['home', 'interior', 'furniture', 'decoration', 'kitchen', 'living room'],
      'deportes': ['sports', 'fitness', 'gym', 'running', 'bicycle', 'exercise'],
      'libros': ['books', 'reading', 'library', 'education', 'study', 'book'],
      'juegos': ['games', 'gaming', 'toys', 'board games', 'video games', 'play'],
      'musica': ['music', 'instruments', 'guitar', 'piano', 'concert', 'musical'],
      'arte': ['art', 'painting', 'sculpture', 'creative', 'design', 'artwork'],
      'coches': ['cars', 'automotive', 'vehicle', 'transport', 'road', 'car'],
      'motos': ['motorcycle', 'bike', 'motorcycle', 'scooter', 'two wheeler'],
      'bicicletas': ['bicycle', 'bike', 'cycling', 'bike ride', 'mountain bike'],
      'muebles': ['furniture', 'chair', 'table', 'sofa', 'bed', 'furnishing'],
      'herramientas': ['tools', 'workshop', 'diy', 'construction', 'repair', 'tool'],
      'jardineria': ['garden', 'plants', 'nature', 'outdoor', 'flowers', 'gardening'],
      'mascotas': ['pets', 'dog', 'cat', 'animals', 'pet care', 'animal'],
      'antigüedades': ['antique', 'vintage', 'old', 'retro', 'classic', 'antique furniture'],
      'otros': ['object', 'item', 'product', 'thing', 'stuff']
    };

    return categoryMap[category.toLowerCase()] || [category];
  }
}

module.exports = new PexelsService();

