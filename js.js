/**
 * Created by Admin on 4/18/16.
 */
$(document).ready(function() {init()});

if (localStorage.length === 0 ) {
    localStorage.setItem("name",JSON.stringify([]));
    localStorage.setItem("stock",JSON.stringify([]));
    localStorage.setItem("symb",JSON.stringify([]));


}
function init() {
    displayList();
    var startarr=['ndaq','fb','tsla'];
    var results = [];
    for (var a = 0; a< startarr.length; a++){
        var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol='+startarr[a]+'&callback=?';
            $.getJSON(url)
                .done(function (data) {
                    results.push(data);
                 //   console.log('Data: '+data);
                    firstStocks(data);
                })
                .fail(function (err) {
                    console.log(err);
                });

    }

    function firstStocks(stocks) {
        $('#stuff').append(makeCard(stocks));
    }
    function makeCard(stock){
        var stockCard = $('<div>',{id:stock.Symbol, class:"card col-md-6"});
        var name = $('<div>',{class:'col-md-6'}).text(stock.Name);
        var high = $('<div>',{class:'col-md-6'}).text('High: ' + stock.High);
        var low = $('<div>',{class:'col-md-6'}).text('Low: ' + stock.Low);
        var sym = $('<div>',{class:'col-md-6'}).text(stock.Symbol);
        var lastprice = $('<div>').addClass('lastprice col-md-6').text('Price: ' + stock.LastPrice);
        //var addto=$('<button>').text('Track This Stock');
        var remove=$('<button>',{class:"glyphicon glyphicon-remove col-md-1 col-md-offset-11 btn btn-danger"});
        stockCard.append(remove,sym,high,lastprice,low);
        $(stockCard).on('click',function(){addToList(stockCard,stock,stock.Symbol)});
        $(remove).on('click',function() {removeStock(stock.Symbol);
        });

        return [stockCard,stock];
    }

    function showCard(card){
        $('#somestuff').append(card);
    }

    function startList(arr){
        for (var a = 0; a <arr.length; a++){
            makeCard(arr[a]);
        }
    }
    function addToList(stockname, stock, id){
        //alert(id);
        var arr = JSON.parse(localStorage.getItem("name"));
        var arr2 = JSON.parse(localStorage.getItem("stock"));
        var arr3 = JSON.parse(localStorage.getItem("symb"));


        if(arr3.indexOf(id) === -1) {
            arr.push(stockname);
            arr2.push(stock);
            arr3.push(id);

            localStorage.setItem("name", JSON.stringify(arr));
            localStorage.setItem("stock", JSON.stringify(arr2));
            localStorage.setItem("symb", JSON.stringify(arr3));
            displayList()
        }

    }
    function displayList() {
        var list = JSON.parse(localStorage.getItem("stock"));
        var arr=[];
        $('#tracked').html('').append($('<div>', {class: "col-md-12 text-center", text: 'Portfolio'}));
        for (var a=0; a<list.length; a++){
            $('#tracked').append(makeCard(list[a]));
        }

    }
    function removeStock(stock){
        var arr = JSON.parse(localStorage.getItem("symb"));
        var arr2 = JSON.parse(localStorage.getItem("name"));
        var arr3 = JSON.parse(localStorage.getItem("stock"));
      //  console.log(stock);
      //  console.log(arr);
        var ind = arr.indexOf(stock);
        arr.splice(ind,1);
        arr2.splice(ind,1);
        arr3.splice(ind,1);
      //  console.log(arr);
        localStorage.setItem("symb",JSON.stringify(arr));
        localStorage.setItem("name", JSON.stringify(arr2));
        localStorage.setItem("stock", JSON.stringify(arr3));
        displayList()
    }
    function previewCard(stock) {
        var cards = stock;
        for (var a =0; a<stock.length; a++) {
            console.log(stock[a]);
            var sym = $('<div>').text(stock[a].Symbol);
            var name = $('<div>').text(stock[a].Name);
            var ex = $('<div>').text(stock[a].Exchange);
            var card=$('<div>',{class:'card col-md-6'});
            var add=$('<button>',{class:'btn btn-success'}).text(stock[a].Symbol);
            card.append(name,ex,sym,add);
            $(add).on('click',function() {
                //alert($(this).text());
                var x = $(this).text();
                var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol='+$(this).text()+'&callback=?';
                $.getJSON(url)
                    .done(function (data) {
                      addToList(makeCard(data),data,x);
                    })
                    .fail(function (err) {
                        console.log(err);
                    });
            });
            $('.modal-result').append(card);

        }
    }
   
    $('#searchbut').on('click', function() {
        var stockname = $('#stocksearch').val();
        var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp?input='+stockname+'&callback=?';
        $.getJSON(url)
            .done(function (data) {
                //$('#stuff').append(makeCard(data));
                previewCard(data);
                $('#mymodal').modal('show');
            })
            .fail(function (err) {
                console.log(err);
            });
    })

};