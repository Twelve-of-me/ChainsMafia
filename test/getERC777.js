var web3;
if (typeof web3 !== 'undefined') {
    console.log(web3.currentProvider);
    
    web3 = new Web3(ethereum);
    try{
      ethereum.enable();
    } catch (error) {
      console.error(error);
  }
}

var contract_CardsMarket_address = "0xa5168f0c3DeB49bF2354412b9d604B956a91397E";
var contract_ERC777Token_address = "0x36211cE59E8499B9D6191cbB3CD09bFe10ffB1B7";
var contract_Game_address = "0x241FF6813B2139313F32667b0E63a1a76c02E6b5";
var contract_owner_address = "0xe8e4672454e8C0c27ba9a2d3C06196050dC1b40f";
 // var result = web3.eth.call({
 // to: "0x0E803a57F39659c2cB841F2408ee801FD50C0660", 
 // // data: "0x" + "73d4a13a"
 // });
 var myaddress = "0xe8e4672454e8C0c27ba9a2d3C06196050dC1b40f";
 var hisaddress = "0xAb197418aed63102897cD3AFe12530B4Cff1D9A6";
 var contract_ERC777Token_Instance;
 var func_get_ERC777Token_abi = async () => {
  await new Promise(
    (resolve,reject) => {
      setTimeout(()=>{
      var request = new XMLHttpRequest();
      request.open("get", 'ERC777Token.json');
      request.send(null);
      request.onload = function () {
        if (request.status == 200) {
          abi_ERC777Token = JSON.parse(request.responseText);
          contract_ERC777Token_Instance = new web3.eth.Contract(abi_ERC777Token["abi"], contract_ERC777Token_address);
          // contract = new web3.eth.Contract(contract_CardsMarket_abi,contract_CardsMarket_address);
          // contract_ERC777Token_Instance.methods.Link_CardsMarket(contract_CardsMarket_address).send({from:myaddress}).then(function (result){
          //   console.log(result);
          // });
        }
      };
},0);
  resolve();
    })
}
func_get_ERC777Token_abi();
 $("#button_create_token").click(function(){
  contract_ERC777Token_Instance.methods.getMyErc777(myaddress).send({from:myaddress},function(error, result){
     if(error){
       console.log(error);
     }
     else{
       console.log("Create_The_Card:",result);
 
     }
     contract_ERC777Token_Instance.methods.totalSupply().call().then(function(result){
       console.log("totalSupply:",result);
     });
     contract_ERC777Token_Instance.methods.balanceOf(myaddress).call().then(function(result){
        console.log("balanceOfme:",result);
        });
    
   });
 });
 