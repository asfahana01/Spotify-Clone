async function main(){
let a =await fetch("http://127.0.0.1:5500/songs/")
const response = await a.text()
console.log(response)
let div = document.createElement("div")
dispatchEvent.innerHTML = response;
let tds = div.getElementsByTagName("td")
console.log(tds)
}

main()