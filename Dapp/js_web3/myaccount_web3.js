
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
var current_user_address;
var current_user_accounts;
var owner_cards_num;
var abi_cardsmarket;
var abi_game;
var abi_erc777;
var contract_CardsMarket_address = "0xa5168f0c3DeB49bF2354412b9d604B956a91397E";
var contract_ERC777Token_address = "0x36211cE59E8499B9D6191cbB3CD09bFe10ffB1B7";
var contract_Game_address = "0x241FF6813B2139313F32667b0E63a1a76c02E6b5";
var contract_owner_address = "0xe8e4672454e8C0c27ba9a2d3C06196050dC1b40f";
var contract_CardsMarket_Instance;
var contract_ERC777Token_Instance;
var contract_Game_Instance;

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
resolve();
    });
}
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
          contract_CardsMarket_Instance = new web3.eth.Contract(abi_cardsmarket["abi"], contract_CardsMarket_address);
          // contract_CardsMarket_Instance.methods.Link_ERC777Token(contract_ERC777Token_address).call().then(function(result){
          //   console.log(result);
          // });
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
          
        }
      };
},0);
  resolve();
    })
}
var func_init_the_group = async () => {
  await new Promise(
    (resolve,reject) => {
      setTimeout(()=>{
        contract_ERC777Token_Instance.methods.balanceOf(current_user_address).call().then(function(result){
          document.getElementById('777balance').innerHTML = result+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="badge badge-secondary">TF7</span>';
        });
        // console.log(owner_cards_num);
        contract_CardsMarket_Instance.methods.balanceOf(current_user_address).call({ from: current_user_address }).then(function (result) {
        owner_cards_num = result;
        document.getElementById('721balance').innerHTML = result+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="badge badge-secondary">NTF</span>';
        // console.log(owner_cards_num);
        var container = document.getElementById('container');
        container.style.height = ""+(Math.floor(owner_cards_num/3)+1)*800+"px";
        var indexCards = 0;
        for(var i=0;i<owner_cards_num;i++){
          
          contract_CardsMarket_Instance.methods.tokenOfOwnerByIndex(current_user_address,i).call({from: current_user_address}, function(error, result){
              if (error) {
                  console.log(error);
              } else {
                var numofcard=result;
                //  console.log(numofcard);
                // if(parseInt(numofcard)>parseInt(owner_cards_num)){
                //   numofcard = parseInt(numofcard)%parseInt(owner_cards_num);
                // }
                // console.log(numofcard);
                  contract_CardsMarket_Instance.methods.getTokenProperty(numofcard).call({from: current_user_address}).then(function (result){
                    // console.log(result);
                    var TokenProperty = result;
                  // if(parseInt(TokenProperty["sort"])>=0){
                  var button_disc = "交易";
                  contract_CardsMarket_Instance.methods.ifthiscardOnSaling(numofcard).call({from: current_user_address}).then(function (result){
                    var isornot = result;
                    if(isornot == true){
                      button_disc="取消交易";
                      contract_CardsMarket_Instance.methods.ifthiscardBeOffered(numofcard).call({from: current_user_address}).then(function (result){
                        var isornot_2 = result;
                        if(isornot_2 == true){
                          button_disc = "拒绝交易";
                          var sortable_position = document.getElementById('sortable');
                          var sortable_position_innerhtml=sortable_position.innerHTML;
                          sortable_position.innerHTML = sortable_position_innerhtml+'<div data-sjsel="flatty" style="width: 306.667px; display: block; transform: translate3d('+(indexCards%3)*365+'px, '+Math.floor(indexCards/3)*550+'px, 0px); opacity: 1;"><div class="card"> <img class="card__picture" src="images/cards/'+TokenProperty["sort"]+'.png" alt="" style=""><div class="card-infos"><h2 class="card__title"></h2><p class="card__text"><button class="button_rejectsale_card btn btn-danger btn-lg" id="button_card_'+numofcard+'" type="button">'+button_disc+'</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class="button_acceptsale_card btn btn-danger btn-lg" id="button_card_'+numofcard+'" type="button">确认交易</button></p></div></div></div>';
                        }
                        else{
                          var sortable_position = document.getElementById('sortable');
                          var sortable_position_innerhtml=sortable_position.innerHTML;
                          sortable_position.innerHTML = sortable_position_innerhtml+'<div data-sjsel="flatty" style="width: 306.667px; display: block; transform: translate3d('+(indexCards%3)*365+'px, '+Math.floor(indexCards/3)*550+'px, 0px); opacity: 1;"><div class="card"> <img class="card__picture" src="images/cards/'+TokenProperty["sort"]+'.png" alt="" style=""><div class="card-infos"><h2 class="card__title"></h2><p class="card__text"><button class="button_cancelsale_card btn btn-danger btn-lg" id="button_card_'+numofcard+'" type="button">'+button_disc+'</button></p></div></div></div>';
                          
                        }
                      });
                    }
                    else{
                      var sortable_position = document.getElementById('sortable');
                      var sortable_position_innerhtml=sortable_position.innerHTML;
                      sortable_position.innerHTML = sortable_position_innerhtml+'<div data-sjsel="flatty" style="width: 306.667px; display: block; transform: translate3d('+(indexCards%3)*365+'px, '+Math.floor(indexCards/3)*550+'px, 0px); opacity: 1;"><div class="card"> <img class="card__picture" src="images/cards/'+TokenProperty["sort"]+'.png" alt="" style=""><div class="card-infos"><h2 class="card__title"></h2><p class="card__text"><button class="button_sale_card btn btn-danger btn-lg" id="button_card_'+numofcard+'" type="button">'+button_disc+'</button></p></div></div></div>';                      
                      
                    }
                    indexCards++;
                  });
                // }
                });
              }
      });
      
      }
        
    });
  },2000);
      resolve();
      
    }
  );
}
async function async_func_init() {
  await func_init_the_group().then(func_get_ERC777Token_abi().then(func_get_cardsmarket_abi().then(func_getAccounts())));
}
async_func_init();

$(".sortable").on('click','.button_sale_card',function(){
  var buttonid = $(this).attr("id");
  var arr=buttonid.split("_"); 
  var tokenid = parseInt(arr[2]);
  var disc=prompt("你的交易描述(不多于20字)","");
  if (disc!=null && disc!="" && disc.length<20) {
    var price = prompt("你的理想价格","");
    var intprice = parseInt(price);
    if (price!=null && price!="") {
    contract_CardsMarket_Instance.methods.CreateDeal(tokenid,disc,intprice).send({from: current_user_address}).then(function(receipt){
  //   if (error) {
  //       console.log(error);
  //   } else {
  //     console.log(result);
  // }
  console.log(receipt);
});
}
else{
  alert("你要求的价格不合理");
}
}
else{
  alert("你的交易描述不符");
}
});
$(".sortable").on('click','.button_rejectsale_card',function(){
  var buttonid = $(this).attr("id");
  var arr=buttonid.split("_"); 
  var tokenid = parseInt(arr[2]);
    if (confirm("确定拒绝交易吗？")) {
    contract_CardsMarket_Instance.methods.Reject(tokenid).send({from: current_user_address}).then(function(receipt){
  console.log(receipt);
});
    }
else{
}
});
$(".sortable").on('click','.button_cancelsale_card',function(){
  var buttonid = $(this).attr("id");
  var arr=buttonid.split("_"); 
  var tokenid = parseInt(arr[2]);
    if (confirm("确定取消交易吗？")) {
    contract_CardsMarket_Instance.methods.CancelDeal(tokenid).send({from: current_user_address}).then(function(receipt){
  console.log(receipt);
});
    }
else{
}
});
$(".sortable").on('click','.button_acceptsale_card',function(){
  var buttonid = $(this).attr("id");
  var arr=buttonid.split("_");
  var tokenid = parseInt(arr[2]);
    if (confirm("确定完成交易吗？")) {
      contract_CardsMarket_Instance.methods.getGoodAddresses(tokenid).call().then(function (result){
        var AddressesAndPrice = result;
        console.log(AddressesAndPrice);
        var Address = AddressesAndPrice["buyer"];
        var price = parseInt(AddressesAndPrice["askprice"]);
        console.log(Address,price);
          contract_ERC777Token_Instance.methods.transferFrom(Address,current_user_address,price).send({from:current_user_address}).then(function (result){
            console.log(result);
          });
          contract_CardsMarket_Instance.methods.AcceptOffer(tokenid).send({from: current_user_address}).then(function(receipt){
            console.log(receipt);
            });
        });


    }
else{
}
});
$("#getMyTF7").click(function(){
  contract_ERC777Token_Instance.methods.getMyErc777(current_user_address).send({from:current_user_address},function(error, result){
    if(error){
      console.log(error);
    }
    else{
      console.log(result);

    }
});
});