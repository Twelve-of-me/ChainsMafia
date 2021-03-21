// var Web3 = require("web3");
window.addEventListener('load', function() {
// 检查web3是否已经注入到(Mist/MetaMask)
var web3;
if (typeof web3 !== 'undefined') {
// 使用 Mist/MetaMask 的提供者
web3 = new Web3(web3.currentProvider);  
// result = {
//     web3:web3
// };
alert("您已安装MetaMask插件.\nYou have installed the MetaMask.");
}
else {
    // 处理用户没安装的情况， 比如显示一个消息     
    // 告诉他们要安装 MetaMask 来使用我们的应用
    alert("请安装MetaMask插件.\nPlease install the MetaMask.");
}
    // 现在你可以启动你的应用并自由访问 Web3.js:   
    startApp(); 
})
