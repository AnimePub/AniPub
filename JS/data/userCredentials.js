let Info = JSON.parse(localStorage.getItem("Info"))|| [
    {
      id: 0,
      Name:"Abdullah Al Adnan",
      Email:"abdullahal467bp@gmail.com",
      Password:"Admin1234",
      FavGenre:"Isekai,Fantasy,Action",
      "Joined-Date": Date(),
    },
  
  ]

export let getDetailes = () => Info ;
export let setDetailes = (Detailes) => {
  Info.push(
    Detailes   
  )
  
  localStorage.setItem("Info",JSON.stringify(Info))
}
