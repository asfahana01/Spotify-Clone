
let currentSong = new Audio();

function secondsToMinutesSeconds(totalSeconds) {
  totalSeconds = Math.floor(totalSeconds); // remove decimals

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}


async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/")
    const response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

const playMusic = (track,pause = false) => {
    //let audio = new Audio("/songs/" + track)
    currentSong.src = "/songs/" + track
    if(!pause){
        currentSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
async function main() {
    // get the list of all songs
    let songs = await getSongs()
    playMusic(songs[0],true)
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert"src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Asfa </div>
                            </div>
                            <div class="playnow">
                             <span>Play Now</span>
                             <img class="invert" src="play.svg" alt="" >
                             <div> </li>`;
    }

    //attach an event listener to each song.

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    /* play the first song
     var audio = new Audio(songs[0])
     audio.play()

    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration
        console.log(audio.duration, audio.currentSrc, audio.currentTime)
        //The duration variable now holds the duration (in seconds) of the audio clip
    });*/

    //Attach an event listener to play, next and previous

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })
    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = 
        `${secondsToMinutesSeconds(currentSong.currentTime)} /
         ${secondsToMinutesSeconds(currentSong.duration)}`
         document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 +"%"
    })
    //Add event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e =>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })
}
main()