
var web3;
if (typeof web3 !== 'undefined') { 
web3 = new Web3(ethereum);
try{
ethereum.enable();
} catch (error) {
console.error(error);
}

console.log("您已安装MetaMask插件.\nYou have installed the MetaMask.");
} else {
console.log("No currentProvider for web3");
console.log("请安装MetaMask插件.\nPlease install the MetaMask.");
}
 // 合约地址
 // var abi=JSON.parse(fs.readFileSync("./abi.js",'utf8'));
var contract_CardsMarket_abi;
var contract_Game_abi;
var contract_ERC777Token_abi;
var current_user_address;
var current_user_accounts;
var owner_cards_num;
var abi_cardsmarket;
var abi_game;
var abi_erc777;
var contract_CardsMarket_Instance;
var contract_ERC777Token_Instance;
var contract_Game_Instance;
var contract_CardsMarket_address = "0xa5168f0c3DeB49bF2354412b9d604B956a91397E";
var contract_ERC777Token_address = "0x36211cE59E8499B9D6191cbB3CD09bFe10ffB1B7";
var contract_Game_address = "0x241FF6813B2139313F32667b0E63a1a76c02E6b5";
var contract_owner_address = "0xe8e4672454e8C0c27ba9a2d3C06196050dC1b40f";
var func_get_cardsmarket_abi = async () => {
  await new Promise(
    (resolve,reject) => {
      setTimeout(()=>{
      var request = new XMLHttpRequest();
      request.open("get", 'CardsMarket.json');
      request.send(null);
      request.onload = function () {
        if (request.status == 200) {
          abi_cardsmarket = JSON.parse(request.responseText);
          // console.log(abi_cardsmarket);
          contract_CardsMarket_Instance = new web3.eth.Contract(abi_cardsmarket["abi"], contract_CardsMarket_address);
          contract_CardsMarket_Instance.methods.Link_ERC777Token(contract_ERC777Token_address).call({from:current_user_address}).then(function (result){
          console.log(result);
          });
        }
      };
},0);
  resolve();
    })
}
var func_get_ERC777Token_abi = async () => {
  await new Promise(
    (resolve,reject) => {
      setTimeout(()=>{
      var request = new XMLHttpRequest();
      request.open("get", 'ERC777Token.json');
      request.send(null);
      request.onload = function () {
        if (request.status == 200) {
          abi_erc777 = JSON.parse(request.responseText);
          contract_ERC777Token_Instance = new web3.eth.Contract(abi_erc777["abi"], contract_ERC777Token_address);
          // contract = new web3.eth.Contract(contract_CardsMarket_abi,contract_CardsMarket_address);
        }
      };
},0);
  resolve();
    })
}
var func_getAccounts = async () => {
  await new Promise(
    (resolve,reject) => {
      setTimeout(()=>{
   web3.eth.getAccounts((error,result) => {
      if (error) {
          console.log(error);
      } else {
        current_user_accounts = result;
        current_user_address = current_user_accounts[0];
        // console.log(current_user_accounts);
        // console.log(current_user_address);

      }
  });
},0);
    })
}

var func_init_the_Market = async () => {
  await new Promise(
    (resolve,reject) => {
      setTimeout(()=>{
    contract_CardsMarket_Instance.methods.getNumOfSaleCards().call().then(function (result){
      console.log("NumOfSaleCards:"+result);
      var NumOfSaleCards = parseInt(result);
      var indexCards = 0;
      for(let i=0;i<NumOfSaleCards;i++){
        contract_CardsMarket_Instance.methods.getthatSalecard(i).call().then(function (result){
          var numofcard=result;
          var DomIndex=result;
          console.log(result);
          if(parseInt(DomIndex)>parseInt(NumOfSaleCards)){
            DomIndex = parseInt(DomIndex)%parseInt(NumOfSaleCards);
          }
          contract_CardsMarket_Instance.methods.getSalingTokenProperty(numofcard).call().then(function (result){
            var SalingTokenProperty =result;
            // console.log(result);
            var container = document.getElementById('container');
            container.style.height = ""+(Math.floor(NumOfSaleCards/3)+1)*800+"px";
            
            // var disX = (numofcard%3)*365;
            // var disY = Math.floor(numofcard/3)*600;
            contract_CardsMarket_Instance.methods.ifthiscardBeOffered(numofcard).call().then(function (result){
              if(result){
                var sortable_position = document.getElementById('sortable');
            var sortable_position_innerhtml=sortable_position.innerHTML;
                sortable_position.innerHTML = sortable_position_innerhtml+'<div data-sjsel="flatty" style="width: 306.667px; display: block; transform: translate3d('+(indexCards%3)*365+'px, '+Math.floor(indexCards/3)*600+'px, 0px); opacity: 1;"><div class="card"> <img class="card__picture" src="images/cards/'+SalingTokenProperty["sort"]+'.png" alt="" style=""><div class="card-infos"><h2 class="card__title">价格：'+SalingTokenProperty["AskingPrice"]+'&nbsp;TF7</h2><p class="card__text"><button class="button_offerring_card btn btn-danger btn-lg" id="button_card_'+numofcard+'" type="button" sytle="display:inline;" alt="'+SalingTokenProperty["AskingPrice"]+'">交易中...</button>&nbsp;&nbsp;&nbsp;&nbsp;<p style="font-weight:bold; display:inline;">卖家描述：</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+SalingTokenProperty["Description"]+'</p></div></div></div>';
              }
              else{
                var sortable_position = document.getElementById('sortable');
            var sortable_position_innerhtml=sortable_position.innerHTML;
                sortable_position.innerHTML = sortable_position_innerhtml+'<div data-sjsel="flatty" style="width: 306.667px; display: block; transform: translate3d('+(indexCards%3)*365+'px, '+Math.floor(indexCards/3)*600+'px, 0px); opacity: 1;"><div class="card"> <img class="card__picture" src="images/cards/'+SalingTokenProperty["sort"]+'.png" alt="" style=""><div class="card-infos"><h2 class="card__title">价格：'+SalingTokenProperty["AskingPrice"]+'&nbsp;TF7</h2><p class="card__text"><button class="button_buy_card btn btn-danger btn-lg" id="button_card_'+numofcard+'" type="button" sytle="display:inline;" alt="'+SalingTokenProperty["AskingPrice"]+'">购买</button>&nbsp;&nbsp;&nbsp;&nbsp;<p style="font-weight:bold; display:inline;">卖家描述：</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+SalingTokenProperty["Description"]+'</p></div></div></div>';
              }
              indexCards++;
            });
          });
        });
      }
    });
},2000);
resolve();

}
);
}
async function async_func_init() {
  await func_init_the_Market().then(func_get_ERC777Token_abi().then(func_get_cardsmarket_abi().then(func_getAccounts())));
}
async_func_init();

$(".sortable").on('click','.button_buy_card',function(){
  var buttonid = $(this).attr("id");
  var attr_askprice = $(this).attr("alt");
  var arr=buttonid.split("_"); 
  var tokenid = parseInt(arr[2]);
  var askprice = parseInt(attr_askprice);
    var price = prompt("你的出价","");
    var intprice = parseInt(price);
    if (intprice >= askprice) {
      contract_CardsMarket_Instance.methods.getGoodAddresses(tokenid).call().then(function (result){
        var AddressesAndPrice = result;
        var Address = AddressesAndPrice["owner"];
        var price = parseInt(AddressesAndPrice["askprice"]);
      contract_ERC777Token_Instance.methods.approve(Address,price).send({from:current_user_address}).then(function (result){
        console.log(result);
    });
    contract_CardsMarket_Instance.methods.MakeOffer(tokenid,intprice).send({from: current_user_address}).then(function(receipt){
      console.log(receipt);
    });
  });

}
else{
  alert("你的价格不合理");
}
});