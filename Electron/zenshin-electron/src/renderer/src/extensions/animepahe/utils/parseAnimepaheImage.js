const BASE_URL = 'http://localhost:64621/animepahe'

// convert the image URL to the localhost animepahe image URL
export const parseAnimepaheImage = (url) => {
  // if the url is a poster image
  if (url.includes('poster')) {
    const id = url.split('/').pop()
    return `${BASE_URL}/image/poster/${id}`
  }

  // if the url is a snapshot image
  if (url.includes('snapshot')) {
    const id = url.split('/').pop()
    return `${BASE_URL}/image/snapshot/${id}`
  }
}
