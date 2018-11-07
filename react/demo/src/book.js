function bookSearch(){
  var search = document.getElementById('scandit-barcode-result').value
  console.log(document.getElementById('scandit-barcode-result').value)
  $.ajax({
    url: "https://www.googleapis.com/books/v1/volumes?q=isbn:" + search,
    dataType: "json",

    success: function(data) {
      console.log(data)
    },
    type: 'GET'
  });
}

document.getElementById('scandit-barcode-result').addEventListener('click', bookSearch, false)
