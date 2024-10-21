import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parseAnimepaheImage } from '../utils/parseAnimepaheImage'
import { format } from 'date-fns'
import { Code, Skeleton } from '@radix-ui/themes'
import useGetAnimePaheEps from '../hooks/useGetAnimePahePlayData'
export default function AnimePaheEpisode({ data }) {
  const {
    id,
    anime_id,
    anime_session,
    episode,
    episode2,
    snapshot,
    session,
    created_at,
    anime_hash
  } = data

  const navigate = useNavigate()
  const [active, setActive] = useState(false)
  const progress = data?.progress || 0

  // on pressing escape, close the dropdown

  const {
    isLoading,
    data: episodePlayData,
    error
  } = useGetAnimePaheEps(anime_hash, active ? session : null)

  function handleClick() {
    // e.stopPropagation()
    if (active) {
      setActive(false)
      return
    }
    setActive((prevActive) => !prevActive)
  }

  return (
    <div className="flex w-full cursor-default flex-col border border-gray-700 font-space-mono transition-all duration-100 ease-in-out hover:bg-[#1e1e20] hover:opacity-100">
      <div className="flex">
        {snapshot && (
          <img
            src={parseAnimepaheImage(snapshot)}
            alt="episode_img"
            className="duration-400 mr-3 h-28 animate-fade object-cover transition-all ease-in-out hover:z-20 hover:scale-150 hover:rounded-md"
          />
        )}

        <div
          onClick={() => handleClick()}
          className={`h-full w-full cursor-default p-2 font-space-mono transition-all duration-100 ease-in-out hover:bg-[#1e1e20] hover:opacity-100`}
        >
          <div className={`flex h-full items-center justify-between`}>
            <div className="flex items-center gap-x-1 font-space-mono font-medium opacity-90">
              {/* <p className="text-lg">{episodeNumber}. </p> */}
              <div>
                <p className="flex items-center gap-2 font-space-mono text-lg font-medium opacity-100">
                  <p className="line-clamp-1">Episode. {episode}</p>
                </p>
              </div>
            </div>
            <div className="flex w-fit gap-x-2 text-xs">
              {/* <p className="">{data.filler ? "Filler" : "Not Filler"}</p> */}
              {/* <p>{data.recap ? "Recap" : "Not Recap"}</p> */}
              <div className="ml-4 h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
              {/* {isRecent && <div className="h-5 w-[1px] bg-[#333]"></div>} Divider */}
              {created_at && (
                <p className={`text-nowrap opacity-90`}>
                  {format(new Date(created_at), 'dd MMM yyyy')}
                </p>
              )}
              <div className="h-5 w-[1px] bg-[#333]"></div> {/* Divider */}
              {/* <p className="opacity-60">{data.score}</p> */}
            </div>
          </div>
        </div>
      </div>
      {active && (
        <div className="mx-3 my-3 flex flex-col gap-y-2">
          {isLoading && <Skeleton width={'50%'} className="mb-1" />}
          {error && <p className="font-space-mono text-red-500">Error fetching torrents</p>}
          {!isLoading && episodePlayData?.length === 0 && (
            <p className="font-space-mono text-red-500">No torrents found</p>
          )}
          {episodePlayData?.map((epdata) => (
            <div
              key={epdata.videoSrc}
              className="group flex animate-fade-down cursor-pointer flex-col gap-y-1 border-2 border-[#2c2d3c] bg-[#111113] px-2 py-2 transition-all duration-150 ease-in-out animate-duration-500 hover:border-[#c084fc90]" //0f1012
              onClick={() => navigate(`/animepahe/player/${encodeURIComponent(epdata.videoSrc)}`)}
            >
              <div className="flex gap-7">
                <p className="min-w-28 cursor-pointer font-space-mono text-sm tracking-wide opacity-55 transition-all duration-150 ease-in-out group-hover:text-purple-400 group-hover:opacity-100">
                  {epdata.fansub}
                </p>
                <p
                  className={`min-w-16 text-center text-sm tracking-wider ${epdata.resolution === '1080' ? 'text-green-500' : ''} ${
                    epdata.resolution === '720' ? 'text-blue-500' : ''
                  } ${epdata.resolution === '360' ? 'text-yellow-500' : ''} `}
                >
                  {epdata.resolution}p
                </p>
                <Code
                  color={epdata.audio === 'jpn' ? 'green' : 'blue'}
                  variant="soft"
                  size="1"
                  style={{
                    // tracking
                    letterSpacing: '0.1em',
                    padding: '0.2em 0.5em'
                  }}
                >
                  {epdata.audio.toUpperCase()}
                </Code>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}