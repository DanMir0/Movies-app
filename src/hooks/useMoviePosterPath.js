

export default function useMoviePosterPath(posterPath) {

    const getMoviePosterUrl = () => {
        if (!posterPath) {
            return
        }
        return `https://image.tmdb.org/t/p/w200${posterPath}`
    }

   return {
        getMoviePosterUrl
   }
}