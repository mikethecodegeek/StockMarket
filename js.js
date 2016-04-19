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
        var stockCard = $('<div>',{id:stock.Symbol, class:"card col-md-4"});
        var name = $('<div>').text(stock.Name);
        var high = $('<div>').text('High: ' + stock.High);
        var low = $('<div>').text('Low: ' + stock.Low);
        var sym = $('<div>').text('Symb: ' + stock.Symbol);
        var lastprice = $('<div>').addClass('lastprice').text('Last Price: ' + stock.LastPrice);
        var addto=$('<button>').text('Track This Stock');
        var remove=$('<button>').text('Remove');


        stockCard.append(name,high,low,sym,lastprice,addto,remove);
        $(addto).on('click',function() {addToList(stockCard,stock, stock.Symbol) });
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
        $('#tracked').html('');
        for (var a=0; a<list.length; a++){
            $('#tracked').append(makeCard(list[a]));
        }

    }
    function removeStock(stock){
        var arr = JSON.parse(localStorage.getItem("symb"));
        var arr2 = JSON.parse(localStorage.getItem("name"));
        var arr3 = JSON.parse(localStorage.getItem("stock"));
        console.log(stock);
        console.log(arr);
        var ind = arr.indexOf(stock);
        arr.splice(ind,1);
        arr2.splice(ind,1);
        arr3.splice(ind,1);
        console.log(arr);
        localStorage.setItem("symb",JSON.stringify(arr));
        localStorage.setItem("name", JSON.stringify(arr2));
        localStorage.setItem("stock", JSON.stringify(arr3));
        displayList()
    }
   
    $('#searchbut').on('click', function() {
        var stockname = $('#stocksearch').val();
        var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol='+stockname+'&callback=?';
        $.getJSON(url)
            .done(function (data) {
                $('#stuff').append(makeCard(data));
            })
            .fail(function (err) {
                console.log(err);
            });
    })

};