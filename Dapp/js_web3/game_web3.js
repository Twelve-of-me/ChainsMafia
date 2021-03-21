$(function() {
  // 这是相册和回收站
  var $gallery = $( "#gallery" ),
    $trash = $( "#trash" );

  // 让相册的条目可拖拽
  $( "img", $gallery).draggable({
    cancel: "a.ui-icon", // 点击一个图标不会启动拖拽
    revert: "invalid", // 当未被放置时，条目会还原回它的初始位置
    containment: "document",
    stop:function(e){
      var thisId = parseInt($(this).attr("alt"));
      console.log(thisId);
      // func_I_CostCard(thisId);
      contract_Game_Instance.methods.playTime(current_user_address,thisId).send({from:current_user_address}).then(function(result){
        console.log(result);
        setTimeout(()=>{
          contract_Game_Instance.methods.gettotalAggressivity(current_user_address).call().then(function(result){
            var myAggressivity = parseInt(result[0]);
            var hisAggressivity = parseInt(result[1]);
            console.log(result[0],result[1]);
            
            document.getElementById("his_point").innerHTML = hisAggressivity;
            document.getElementById("my_point").innerHTML = myAggressivity;
          });
        },0);
      });
    },
    helper: "clone",
    cursor: "move"
  });

  // 让回收站可放置，接受相册的条目
  $trash.droppable({
    accept: "#gallery > img",
    
    hoverClass: "blue",
    drop: function( event, ui ) {
      deleteImage( ui.draggable );
    }
  });


  // 图像删除功能
  var recycle_icon = "<a href='link/to/recycle/script/when/we/have/js/off' title='还原图像' class='ui-icon ui-icon-refresh'>还原图像</a>";
  function deleteImage( $item ) {
    $item.fadeOut(function() {
      var $list = $( "div", $trash ).length ?
        $( "div", $trash ) :
        $( "<div class='mid-my2 ui-helper-reset'/>" ).appendTo( $trash );

      $item.find( "a.ui-icon-trash" ).remove();
      $item.append( recycle_icon ).appendTo( $list ).fadeIn(function() {
      //   $item
      //     .animate({ width: "48px" })
      //     .find( "img" )
      //       .animate({ height: "36px" });
      });
    });
  }


  // 图像预览功能，演示 ui.dialog 作为模态窗口使用
 

 
});

var web3;
if (typeof web3 !== 'undefined') {
    console.log(web3.currentProvider);
    
    web3 = new Web3(ethereum);
    try{
      ethereum.enable();
    } catch (error) {
      console.error(error);
  }
    
    console.log("您已安装MetaMask插件.\nYou have installed the MetaMask.");
    console.log(web3.version);
 } else {
     console.log("No currentProvider for web3");
     console.log("请安装MetaMask插件.\nPlease install the MetaMask.");
 }

var current_user_address;
var current_user_accounts;
var contract_CardsMarket_address = "0xa5168f0c3DeB49bF2354412b9d604B956a91397E";
var contract_ERC777Token_address = "0x36211cE59E8499B9D6191cbB3CD09bFe10ffB1B7";
var contract_Game_address = "0x241FF6813B2139313F32667b0E63a1a76c02E6b5";
var contract_owner_address = "0xe8e4672454e8C0c27ba9a2d3C06196050dC1b40f";
var contract_CardsMarket_Instance;
var contract_ERC777Token_Instance;
var contract_Game_Instance;
var abi_cardsmarket;
var abi_game;
var abi_erc777;
var CardsOfMe = new Array();
var num_myCards;
var Opponent_address;
var $gallery = $( "#gallery" ),
      $trash = $( "#trash" );
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
      resolve();
  });
},0);
    })
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
          // contract = new web3.eth.Contract(contract_CardsMarket_abi,contract_CardsMarket_address);
        }
      };
      resolve();
},0);
  
    })
}
var func_get_Game_abi = async () => {
  await new Promise(
    (resolve,reject) => {
      setTimeout(()=>{
      var request = new XMLHttpRequest();
      request.open("get", 'Game.json');
      request.send(null);
      request.onload = function () {
        if (request.status == 200) {
          abi_Game_abi = JSON.parse(request.responseText);
          contract_Game_Instance = new web3.eth.Contract(abi_Game_abi["abi"], contract_Game_address);
          // contract_Game_Instance.methods.Link_CardsMarket(contract_CardsMarket_address).send({from:current_user_address}).then(function(result){
          //   console.log(result);
          // });
        }
      };resolve();
},0);
  
    })
}
var func_get_CardsOf_Me = async () => {
  await new Promise(
    (resolve,reject) => {
      setTimeout(() => {
        contract_CardsMarket_Instance.methods.balanceOf(current_user_address).call().then(function(result){
            num_myCards = result;
            console.log(num_myCards);
            for(var i=0;i<num_myCards;i++){
              contract_CardsMarket_Instance.methods.tokenOfOwnerByIndex(current_user_address,i).call({from: current_user_address}, function(error, result){
                  if (error) {
                      console.log(error);
                  } else {
                    var numofcard=result;
                    
                      contract_CardsMarket_Instance.methods.getTokenProperty(numofcard).call({from: current_user_address}).then(function (result){
                        CardsOfMe.push(parseInt(result["sort"]));
                      });
                    }
                  });
                }
                });resolve();
      },2000);
    }
  )
}
async function async_func_init() {
  await func_get_CardsOf_Me().then(func_get_cardsmarket_abi().then(func_get_Game_abi().then(func_getAccounts())));
}            
var func_If_Can_Play = async () =>{
  await new Promise(
    (resolve,reject) =>{
      setTimeout(()=>{
        contract_Game_Instance.methods.Can_I_Play(current_user_address).call().then(function (result){
          console.log(result);
            var result_Can_I_Play = result;
          if(result_Can_I_Play["Opponent"]!=current_user_address){
          document.getElementById("old_page").style.display="none";
          $("#app").css("display","block");
          for(var i=0;i<num_myCards;i++){
            var mycardsHTML = document.getElementById("gallery");
            mycardsHTML.children[i].src="images/cards/"+CardsOfMe[i]+".png";
            mycardsHTML.children[i].alt=CardsOfMe[i];
          }
          
            // if(result["DefaultMover"]==current_user_address){
            //   $( "img", $gallery).draggable({disabled:false});
            // }
            // else{
            //   $( "img", $gallery).draggable({disabled:true});
            // }
          }
          else{
            func_If_Can_Play();
          }
        });
      },10000);
    }
  )
}

async_func_init();
var func_Who_Mover = async () =>{
  await new Promise(
    (resolve,reject) =>{
      setTimeout(()=>{
        contract_Game_Instance.methods.WhoIsMover(current_user_address).call().then(function(result){
          console.log(result);
        });
      },0);
      resolve();
    }
  )
}
var func_I_CostCard = async (thisId) =>{//调用playTime
  await new Promise(
    (resolve,reject)=>{
      setTimeout(()=>{
        contract_Game_Instance.methods.playTime(current_user_address,parseInt(thisId)).send({from:current_user_address}).then(function(result){
          console.log(result);
        });
      },1000);
      resolve();
    }
  )
} 
var func_WaitFor = async ()=>{
  await new Promise(
    (resolve,reject)=>{
      setTimeout(()=>{
        contract_Game_Instance.methods.WhoIsMover(current_user_address).call().then(function(result){
          console.log(result);
          if(result==current_user_address){
            $( "img", $gallery).draggable({disabled:false});
            $("#yuan").attr("src","images/game/圆.png");
            contract_Game_Instance.methods.NumOfTempCards(current_user_address).call().then(function(result){
              var numoftempcard = result;
              for(var i=0;i<numoftempcard;i++){
                contract_Game_Instance.methods.ThisTempCards(current_user_address,i).call().then(function(result){
                  // console.log(result);
                  $("<img src='images/cards/"+result+".png' class='new animated bounceInDown'/>").appendTo(".mid-opp");
                });
              }
              if(parseInt(numoftempcard)>0){
                contract_Game_Instance.methods.DeleteHisTempCards(current_user_address).call({from:current_user_accounts}).then(function(result){
                  console.log(result);
                });
              }
                contract_Game_Instance.methods.gettotalAggressivity(current_user_address).call().then(function(result){
                  var myAggressivity = parseInt(result[0]);
                  var hisAggressivity = parseInt(result[1]);
                  console.log(result);
                  document.getElementById("his_point").innerText = hisAggressivity;
                  document.getElementById("my_point").innerText = myAggressivity;

                  
                });

              
            });
          }
          else{
            $("#yuan").attr("src","images/game/圆2.png");
           
          }
          func_WaitFor();
        });
      },20000);
      // setTimeout(()=>{
      // func_WaitFor();
      // },20000);
      
    }
  )
}
var func_dele_tempCard = async () =>{
  await new Promise(
    (resolve,reject)=>{
      setTimeout(()=>{
        contract_Game_Instance.methods.DeleteHisTempCards(current_user_address).send({from:current_user_accounts}).then(function(result){
          console.log(result);
        });
      },2000);
    }
  )
}
// var func_Get_Oppenont = async ()=>{
//   await new Promise(
//     (resolve,reject)=>{
//       setTimeout (()=>{
//         contract_Game_Instance.methods.GetTheOpponent(current_user_address).call().then(function(result){
//           $("#app").css("display","none");
//           $("#old_page").css("dispaly","block");
//               $("#iframe_loading").css("display","none");
//               console.log(result);
//             if(result!=undefined && result!=current_user_address){
//               Opponent_address = result;
//               alert("为您找到对手:"+Opponent_address);
//               console.log("为您找到对手:"+Opponent_address);
//               // setTimeout(()=>{   
//               // },5000);
              
//             }
//             else{
//             }
//           });
//       },5000);
//     }
//     )
// }
$("#button_start_game").click(function(){
    var localCardsOfMe = CardsOfMe.concat();

    console.log(localCardsOfMe);
    var sorts = new Array();
      $("#iframe_loading").css("display","block");
      $("#old_page").css("dispaly","none");
          // if(num_myCards>=15){
          // }    
          $("#app").css("display","none");
          $("#old_page").css("dispaly","block");
              $("#iframe_loading").css("display","none");
                contract_Game_Instance.methods.PushWaitGamer(current_user_address).send({from:current_user_address}).then(function(result){
                  console.log(result);
                  // func_Get_Oppenont();
                 
                });
              });

$("#button_cancle_game").click(function(){
  contract_Game_Instance.methods.Can_I_Play(current_user_address).call().then(function(result){
    console.log(result);
    Opponent_address = result[0];
    console.log(Opponent_address);
    if(Opponent_address!=current_user_address && Opponent_address!=undefined){
      contract_Game_Instance.methods.cancelSingleGame(current_user_address,Opponent_address).send({from:current_user_address}).then(function(result){
        console.log(result);
        
      });
    }
    alert("取消成功.");
});
});
$("#button_count_gamer").click(function(){
  contract_Game_Instance.methods.getNumOfWaitGamer().call().then(function(result){
    console.log(result);
    alert("现在有"+result+"玩家正在排队......");
  });
});
$("#button_create_game").click(function(){
  contract_Game_Instance.methods.Can_I_Play(current_user_address).call().then(function(result){
    console.log(result);
    if(result!=undefined && result!=current_user_address && result!="0x0000000000000000000000000000000000000000"){
    alert("游戏已创建");
    }
    else{
      // Opponent_address = result[0];    
    if(Opponent_address!=current_user_address){
  contract_Game_Instance.methods.creatSingleGame(current_user_address,Opponent_address).send({from:current_user_address}).then(function(result){
    console.log(result);
    alert("游戏已创建");
  });
    }

}
});
});
$("#button_access_opponent").click(function(){
contract_Game_Instance.methods.Can_I_Play(current_user_address).call().then(function(result){
  console.log(result);
  Opponent_address = result[0];
  if(Opponent_address!=current_user_address){
    alert("可以进入游戏.");
    document.getElementById("old_page").style.display="none";
    $("#app").css("display","block");
    for(var i=0;i<num_myCards;i++){
      var mycardsHTML = document.getElementById("gallery");
      mycardsHTML.children[i].src="images/cards/"+CardsOfMe[i]+".png";
      mycardsHTML.children[i].alt=CardsOfMe[i];
    }
    contract_Game_Instance.methods.WhoIsMover(current_user_address).call().then(function(result){
      console.log(result);
      if(result==current_user_address){//如果是先手，可以出牌
        $( "img", $gallery).draggable({disabled:false});
        $("#yuan").attr("src","images/game/圆.png");
      }
      else{//不是先手，等待
        $( "img", $gallery).draggable({disabled:true});
        $("#yuan").attr("src","images/game/圆2.png");
      }func_WaitFor();
    });

  }
  else{
    
  }
  
});
});
$("#button_get_Oppenont").click(function(result){
  setTimeout (()=>{
    contract_Game_Instance.methods.GetTheOpponent(current_user_address).call().then(function(result){
      $("#app").css("display","none");
      $("#old_page").css("dispaly","block");
          $("#iframe_loading").css("display","none");
          console.log(result);
        if(result!=undefined && result!=current_user_address){
          Opponent_address = result;
          alert("为您找到对手:"+Opponent_address);
          console.log("为您找到对手:"+Opponent_address);
          // setTimeout(()=>{   
          // },5000);
          
        }
        else{
        }
      });
  },5000);
});
   function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
  } 
$("#yuan").click(function(){
  contract_Game_Instance.methods.restTime(current_user_address).send({from:current_user_address}).then(function(result){
    console.log(result);
    if(result==current_user_address){
      
      $("img", $gallery).draggable({disabled:false});
    }
    else{
      $("img", $gallery).draggable({disabled:true});
    }
  });
});
$("#drop_yuan").click(function(){
  contract_Game_Instance.methods.dropTime(current_user_address).call().then(function(result){
    if(result[0]==1){
      if(result[1]==current_user_address){
        console.log(current_user_address+"Win!");
      }
      else{
        console.log(Opponent_address+"Win!");
      }
    }
    else{
      
      document.getElementById("mid-opp").innerHTML="<!--Image Column-->";
      document.getElementById("trash").innerHTML="<!--Image Column-->";
      if(result[1]==current_user_address){
        console.log(current_user_address+"Win this time!");
      }
      else{
        console.log(Opponent_address+"Win this time!");
      }

    }
  });
})