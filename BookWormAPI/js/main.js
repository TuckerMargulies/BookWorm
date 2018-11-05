///var google_api_key = process.env.google_api_key
function bookSearch(){
  console.log('this function runs!')
  var search = document.getElementById('search').value
  document.getElementById('results').innerHTML = ""
  console.log(search)
   $.ajax({
    url: "https://www.googleapis.com/books/v1/volumes?q=isbn:" + search,
    dataType: "json",

    success: function(data) {
      for (i = 0; i < data.items.length; i++){
        results.innerHTML += "<h2>" + data.items[i].volumeInfo.title + "</h2>"
      }
      console.log("https://www.googleapis.com/books/v1/volumes?q=isbn:" + search)
      console.log("all data " + data)
      console.log("first result title " + data.totalItem)
    },
    type:'GET'
  });
}

document.getElementById('button').addEventListener('click',bookSearch, false)
