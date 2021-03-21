window.onload = function(){
         var box = document.getElementById('mycards');
         var divs = box.getElementsByTagName('div');
         var jilu = true;

         setTimeout(function(){
             go();
         },1000);

        //8 222 270 +48
        //7 237 270 +33
        //6 252 270 +18
        // 15

        为每个div添加点击事件
        for(var i=0;i<divs.length - 1;i++){
             divs[i].index = i;
            divs[i].onclick = function(){
                for(var i = 0;i < divs.length;i++){
                    //当第i个div被点击，其他div的角度
                     if(this.index > i){
                        divs[i].style.transform = "rotate("+(0-342-(i*15) + this.index*15-72+10)+"deg)";
                    }
                       if( this.index < i){
                            divs[i].style.transform = "rotate("+(0-342-(i*15) + this.index*15-72-10)+"deg)";
                        }
                    }
                    //被点击div的角度
                    divs[this.index].style.transform = "rotate("+(0-342-(this.index*15) + this.index*15-72)+"deg)";
   
                }
            }

         //点击最后一个图片，合并扇形
         divs[9].onclick = function(){
             if(jilu){
                 back();
             }
             else{
                 go();
             }
             jilu = !jilu;

         }

         //使扇形打开
         function go(){
             for(var i = 0;i<divs.length;i++){
                 //"rotate("+345-(i*15)+"deg)"
                 //不行，因为这样会先算"rotate("+345
                 console.log(divs.length);
                 divs[i].style.transform = "rotate("+((i-parseInt(divs.length/2))*3)+"deg)";
                 divs[i].style.marginBottom = ""+(parseInt(divs.length/2)*35-Math.abs(i-parseInt(divs.length/2))*35)+"px";
                //  if(divs.length%2!=0){
                //     divs[i].style.transform = "rotate("+((i-parseInt(divs.length/2))*3)+"deg)";
                //     // divs[i].style.marginBottom = ""+(parseInt(divs.length/2)*35-Math.abs(i-parseInt(divs.length/2))*35)+"px";
                //  }
                 
             }
         }
         //是扇形合并
         function back(){
             for(var i=0;i<divs.length;i++){
                 divs[i].style.transform = "rotate(0deg)";
             }
         }
     }