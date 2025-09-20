// Configuración de Supabase para imágenes
export const SUPABASE_CONFIG = {
  // Reemplaza estos valores con tu configuración real de Supabase
  url: 'https://your-project-id.supabase.co',
  bucket: 'your-bucket-name',
  publicUrl: 'https://your-project-id.supabase.co/storage/v1/object/public/your-bucket-name'
}

// Función para obtener la URL completa de una imagen de Supabase
export const getSupabaseImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/images/placeholder.svg'
  
  // Si ya es una URL completa, devolverla tal como está
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  
  // Si es una ruta local que empieza con /images/, usar tal como está
  if (imagePath.startsWith('/images/')) {
    return imagePath
  }
  
  // Si es un dato base64, devolverlo tal como está
  if (imagePath.startsWith('data:image/')) {
    return imagePath
  }
  
  // Si es una ruta de Supabase, construir la URL completa
  if (imagePath.startsWith('articles/') || imagePath.startsWith('images/')) {
    return `${SUPABASE_CONFIG.publicUrl}/${imagePath}`
  }
  
  // Si es una ruta relativa, asumir que está en el directorio público
  return `/images/${imagePath}`
}

// Función para obtener imagen basada en categoría (fallback)
export const getImageByCategory = (category: string): string => {
  const categoryImages: { [key: string]: string } = {
    'libros': '/images/libro-garcia-marquez.svg',
    'electrónica': '/images/smart-tv-samsung.svg',
    'hogar': '/images/sillon-cuero.svg',
    'tecnología': '/images/iphone-13.svg',
    'default': '/images/placeholder.svg'
  }
  
  return categoryImages[category] || categoryImages['default']
}

// Función para subir una imagen a Supabase (para uso futuro)
export const uploadToSupabase = async (file: File, path: string): Promise<string> => {
  // Esta función se implementaría cuando se configure Supabase Storage
  // Por ahora, devolvemos una URL simulada
  console.log('Uploading to Supabase:', { file, path })
  return `${SUPABASE_CONFIG.publicUrl}/${path}/${file.name}`
}
