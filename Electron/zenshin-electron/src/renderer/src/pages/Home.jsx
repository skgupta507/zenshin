import AnimeCard from '../components/AnimeCard'
import useTopAiringAnime from '../hooks/useTopAiringAnime'
import zenshin1 from '../assets/zenshin2.png'
import zenshinLogo from '../assets/zenshinLogo.png'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getTopAnime } from '../utils/helper'
import { useEffect, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Skeleton, Spinner } from '@radix-ui/themes'
import { toast } from 'sonner'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
// import loundraw from "../assets/loundraw.jpg";
import gradient1 from '../assets/gradient1.jpg'
import SkeletonAnimeCard from '../skeletons/SkeletonAnimeCard'
import { getCurrentSeason } from '../utils/currentSeason'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

export default function Home() {
  // GET RECENT GLOBAL ACTIVITY : UI NOT IMPLEMENTED
  // const {
  //   isLoading: isLoadingRecentActivity,
  //   data: recentActivity,
  //   error: errorRecentActivity,
  //   status: statusRecentActivity,
  // } = useGetRecentGlobalActivity();

  // State to store background opacity
  const [bgOpacity, setBgOpacity] = useState(1)

  // Update opacity on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      // Adjust the value as per your requirement, this reduces opacity with scroll
      const newOpacity = Math.max(0, 1 - scrollY / 500) // Minimum opacity is 0.3
      setBgOpacity(newOpacity)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const { isLoading, topAiringAnime, error, status } = useTopAiringAnime()

  // get current year and season
  const currentYear = new Date().getFullYear()
  // season: WINTER, SPRING, SUMMER, FALL
  const currentSeason = getCurrentSeason()

  const scrollPosition = window.scrollY

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    error: infiniteQueryError
  } = useInfiniteQuery({
    queryKey: ['top_animes'],
    queryFn: ({ pageParam = 1 }) => getTopAnime(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return allPages.length + 1
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 // 1 hour
  })

  if (infiniteQueryError) {
    toast.error('Error fetching Top Animes', {
      icon: <ExclamationTriangleIcon height="16" width="16" color="#ffffff" />,
      description: infiniteQueryError?.message,
      classNames: {
        title: 'text-rose-500'
      }
    })
  }

  const [topAnime, setTopAnime] = useState([])

  useEffect(() => {
    if (data) {
      const newTopAnime = data.pages
        .map((page) => page)
        .flat()
        .filter(Boolean)
      setTopAnime(newTopAnime)
    }
  }, [data])

  return (
    <div className="font-space-mono tracking-tight select-none">
      <div
        className="flex min-h-[96svh] animate-fade flex-col items-center justify-around gap-y-11 lg:flex-row"
        style={{
          // backgroundImage: `url(${gradient1})`,
          // backgroundSize: 'cover',
          background: `linear-gradient(rgba(17,17,19,${1 - bgOpacity}), rgba(17,17,19,${1 - bgOpacity})), url(${gradient1})`
        }}
      >
        <div className="flex h-full w-8/12 flex-col items-center justify-start gap-y-10 p-3 lg:w-2/5">
          <img src={zenshinLogo} alt="" className="h-[6rem] object-scale-down drop-shadow-xl" />
          <p className="font-space-mono">
            Stream your favourite torrents instantly with our service, no waiting for downloads,
            reliable and seamless streaming directly to your browser / VLC Media Player.
          </p>
        </div>

        <img
          src={zenshin1}
          alt="zenshin"
          className="h-48 object-scale-down drop-shadow-lg sm:h-64 md:h-80 lg:h-96"
        />
      </div>

      {topAiringAnime?.length > 0 && (
        <div
          className={`w-full`}
          style={{
            opacity: 1 - bgOpacity
          }}
        >
          <Carousel
            axis="horizontal"
            showArrows={true}
            showThumbs={false}
            // autoPlay
            interval={4000} // 3 seconds interval for autoplay
          >
            {topAiringAnime
              ?.filter(
                (anime) =>
                  anime.seasonYear === currentYear &&
                  anime.season.toLowerCase() === currentSeason.toLowerCase() &&
                  anime.bannerImage !== null
              )
              .map((anime) => (
                // gradient from left to right black to transparent
                <div key={anime.id + 'bannerAnime'} className="relative h-72">
                  <div className="absolute w-9/12 h-full bg-gradient-to-r from-[#141414]"></div>
                  <div className="absolute  h-full flex flex-col justify-center items-center">
                    <div className="font-semibold tracking-wider text-xl shadow-3xl">
                      {anime.title.romaji}
                    </div>
                  </div>
                  <img src={anime.bannerImage} alt="" className="h-72 w-full object-cover " />
                </div>
              ))}
          </Carousel>
        </div>
      )}

      {error && (
        <div className="text-red-500">Failed to fetch Top Airing Anime : {error.message}</div>
      )}

      {/* {status === 'success' && !error && ( */}
      {!error && (
        <div className="mx-5 mt-8">
          <div className="mb-2 ml-5 border-b border-gray-700 pb-1 font-space-mono text-lg font-bold tracking-wider">
            Top Airing Anime
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg2:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-9">
            {!isLoading &&
              !error &&
              topAiringAnime?.map((anime) => (
                <AnimeCard key={anime.id + 'topAiringAnime'} data={anime} />
              ))}
            {isLoading && (
              <>
                <SkeletonAnimeCard />
                <SkeletonAnimeCard />
                <SkeletonAnimeCard />
                <SkeletonAnimeCard />
                <SkeletonAnimeCard />
                <SkeletonAnimeCard />
                <SkeletonAnimeCard />
              </>
            )}
          </div>
        </div>
      )}

      {infiniteQueryError && (
        <div className="text-red-500">Failed to fetch Top Anime : {infiniteQueryError.message}</div>
      )}

      {!infiniteQueryError && topAnime.length > 0 && (
        <div className="mx-5 mt-12">
          <div className="mb-2 ml-5 border-b border-gray-700 pb-1 font-space-mono text-lg font-bold tracking-wider">
            Top Anime
          </div>
          <InfiniteScroll
            style={{ all: 'unset' }}
            dataLength={topAnime.length}
            next={() => fetchNextPage()}
            hasMore={topAnime?.length < 500}
            loader={
              <div className="flex items-center justify-center gap-x-2 overflow-hidden">
                <h4>Loading...</h4>
                <Spinner />
              </div>
            }
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg2:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-9">
              {topAnime?.map((anime) => {
                return <AnimeCard key={anime.id + 'topAnime'} data={anime} />
              })}
              {isFetching && (
                <>
                  <SkeletonAnimeCard />
                  <SkeletonAnimeCard />
                  <SkeletonAnimeCard />
                  <SkeletonAnimeCard />
                  <SkeletonAnimeCard />
                  <SkeletonAnimeCard />
                  <SkeletonAnimeCard />
                </>
              )}
            </div>
          </InfiniteScroll>
        </div>
      )}
    </div>
  )
}
