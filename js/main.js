$(document).ready(function(){
	window.onload = function() {
		var myObject = (function() {
			// cm convert to px
			// 1cm = 0.39inches
			// 0.39inches * 80dpi = 31.5px

			//文档中定义的变量
			var circlesize = 25;   //圆形的大小，3°是50像素
			var fixsize = 28;    //小方块的边长，4°是60像素		
			var linesize = 46;   //垂线的长度，6°是90像素
			var eccentricitysize1 = 80;  //10度距中心的距离:160px
			var eccentricitysize2 = 160;  //20度距中心的距离:320px
			var eccentricitysize3 = 240;  //30度距中心的距离:520px

			var fixtime = 1000;   //小方框出现的时间		
			var targettime1 = 6;   //10度呈现时间
			var targettime2 = 12;   //20、30度呈现时间
			var backupcolor = '#595959';   //背景色调
			var distractime = 750;   //干扰图出现的时间
			var distractorsize = 100;   //干扰图的大小，与上大小类似。
			var digitsize = 20;   //线段数字大小
			var digitlocation = 20;   //线段数字位置
			var digit = ['1','2','3','4','5','6','7','8'];   //线段数字内容
			var presentnumb = 4;   //目标在每个方框位置上呈现的次数

			//自己定义的变量
			var x_1 = 0;   //斜上角10°，x应该移动的距离
			var x_2 = 0;   //斜上角20°，x应该移动的距离
			var x_3 = 0;   //斜上角30°，x应该移动的距离
			var set_rect;   //第一个方框显示的计时函数
			var set_circle;   //第一个方框显示的计时函数
			var set_distrac;  //干扰图显示的计时函数
			var set_feedback;  //反馈显示的计时函数
			var sign_array;   //0-max内容唯一且不重复的数组
			var rect_num = 24;   //圆形会出现的方框个数
			var c = 0;   //第c次游戏
			var c_rect = 0;   //第c_rect个矩形
			var width = 550;
			var height = 550;
			var text_pos = 20;   //数字的位置
			var num_height = 18;   //数字的高度
			var num_width = 8;   //数字的宽度
			var center_6 = 0;   //6°垂线到中心的距离:55
			var sign_click = 0;   //line出现，sign_click=1开始对点击做反应
			var line_appear = 0;  //line出现的时间
			var line_disappear = 0;  //line消失的时间，也就是在方框内的时间
			var answer = 0;   //最后的答案，是0还是1
			var click_num = 0;   //点击区域所对应的数字
			var quadrant_1_num = 0;   //在第一象限内所对应的数字
			var min_2_x = 11;      //第2条线上的位置微调
			var min_2_y = 2;
			var min_4_x = 10;      //第4条线上的位置微调
			var min_4_y = 10;
			var min_6_x = 4;      //第6条线上的位置微调
			var min_6_y = 12;
			var phase = 0;   //表示阶段，0表示练习，1表示正是开始
			var cricle_rect_num = 0;   //cricle对应的数字
			var click_pos_x = 0;    //鼠标在x的位置
			var click_pos_y = 0;    //鼠标在y的位置
			var circle_pos_x = 0;    //圆在x的位置
			var circle_pos_y = 0;    //圆在y的位置

			//需要记录的字段
			var radioset="";
			var buttonset="";
			var numset="";
			var commentset="";
			var type4set="";
			var timeset="";
			var stimidset="";
			var eventtimeset="";
			var eventelapseset="";
			var correctanswerset="";
			var radiolist1set="";
			var radiolist2set="";
			var radiolist3set="";
			var radiolist4set="";
			var radiolist5set="";
			var radiolist6set="";
			var radiolist7set="";
			var radiolist8set="";
			var radiolist9set="";
			var radiolist10set="";
			

			//程序开始前的准备工作
			var prepare = function() {
				x_1 = em2X(eccentricitysize1);
				x_2 = em2X(eccentricitysize2);
				x_3 = em2X(eccentricitysize3);
				sign_array=signArray(presentnumb*rect_num);
				center_6 = Math.floor(linesize/2/getTanDeg(22.5));
				$('.container').css('backgroundColor',backupcolor);
				
				drawLine();
				draw24();
				
				$("#container").click(function(e){
					if(sign_click == 1) {   //line出现，点击会进行判断
					    var relativeX = e.pageX - this.offsetLeft; 
					    var relativeY = e.pageY - this.offsetTop;
					    click_pos_x = relativeX-width/2;
					    click_pos_y = relativeY-width/2;
					 
					    answer =  is1_0(Math.abs(click_pos_x), Math.abs(click_pos_y));
						if(answer != 0) {
							var quadrant = quaDrant(click_pos_x, click_pos_y);
							if(quadrant != 1){
								click_num = clickNum(quadrant, quadrant_1_num);    //需要修改
							}else {
								click_num = quadrant_1_num;
							}						
						}
						line_disappear = new Date();
						if(c_rect%8 == 0) {
								cricle_rect_num = 8;
							}else {
								cricle_rect_num = c_rect%8;
							}
						if(phase == 0) {							
							if(cricle_rect_num == click_num) {                      //数字要对应
								$('#feedback').text('反应正确');
							}else {
								$('#feedback').text('反应错误');
							}
							$('#line').css('display','none');
							$('#feedback').css('display','block');
							set_feedback = setTimeout(function(){
								$('#feedback').css('display','none');

								endPhase();
							},2000);
						}else {
							endPhase();
						}
						
					}
				});				
				
				start();
			}

			//开始运行程序
			var start = function() {
				console.log('c:'+c);
				c_rect = Math.floor(sign_array[c]/4)+1;
				drawCircle();   //只有生成了c_rect,才能确定圆的位置
				set_rect = setTimeout(function(){    //第一个矩形单独出现的时间
					//需要出现一个圆形
					
					$('.ele25 div').css('display','block');
					$($('.ele25 div')[c_rect]).css('display','none');
					$('#my_canvas').css('display','block');				
					var circle_time = class2Time($('.ele25 div')[c_rect].className);
					set_circle = setTimeout(function(){   //圆形出现的时间
						$('.ele25').css('display','none');
						$('.distrac').css({'width':width,'height':height});
						$('.distrac').css('display','block');
						set_distrac = setTimeout(function(){   //干扰图出现的时间
							$('.distrac').css('display','none');
							$('.line').css({'width':width,'height':height});
							$('.line').css('display','block');
							sign_click=1;
							line_appear = new Date();

						},distractime);
					},circle_time);				
				},fixtime);			
			};

			/**
			 * 一次游戏结束
			 * @param 
			 * @return 
			 */
			var endPhase=function(){

				$('.line').css('display','none');
				
				$('.ele25').css('display','block');
				$('.ele25 div').css('display','none');
				$('#mid').css('display','block');
				if(phase == 1) {
					//记录数据
					numset+=click_pos_x+';'+click_pos_y+';';
					timeset+=(line_disappear-line_appear)+';'+(line_disappear-line_appear)+';';
					stimidset+=(c+1)+';'+(c+1)+';';
					correctanswerset+=circle_pos_x+';'+circle_pos_y+';';
					if(cricle_rect_num == click_num) {
						radioset+=circle_pos_x+';'+circle_pos_y+';';
					}else {
						radioset+=click_pos_x+';'+click_pos_y+';';
					}			
				}

				sign_click=0;   //点击无效
				quadrant_1_num = 0;			

				if(phase == 0) {     //练习阶段
					if(c < 1) {           //练习的次数，10
						c++;
						start();   //下一次游戏
					}else{
						$('.container').css('display','none');
						$('.begin_stand').css('display','block');
					
						$('.begin_stand').click(function(){
							$('.begin_stand').css('display','none');
							$('.container').css('display','block');
							c = 0;
							phase = 1;						
							prepare();
						});					
					}
				} else {            //正式阶段
					if(c < (presentnumb*rect_num-1)) {   //presentnumb*rect_num，游戏的次数
						c++;
						start();   //下一次游戏				
					}else{
						endOperate();
					}
				}			
			};

			/**
			 * 游戏结束时的操作
			 * @param 
			 * @return 
			 */
			var endOperate=function(){
				$('.ele25').css('display','none');
				$('.container').css('backgroundColor','white');
				var result='';

				numset=numset.substring(0,numset.length-1);    //最后一个分号不要。
				timeset=timeset.substring(0,timeset.length-1);         //最后一个分号不要。
				stimidset=stimidset.substring(0,stimidset.length-1);
				correctanswerset=correctanswerset.substring(0,correctanswerset.length-1);
				radioset=radioset.substring(0,radioset.length-1);
						

				result+='numset:'+numset+'<br>';
				result+='timeset:'+timeset+'<br>';
				result+='stimidset:'+stimidset+'<br>';
				result+='correctanswerset:'+correctanswerset+'<br>';
				result+='radioset:'+radioset+'<br>';			
				
				$('#record').html(result);
				$('#record').css('display','block');
			};

			/**
			 * 点击在哪个象限
			 * @param [10, 10]
			 * @return 1
			 */
			var quaDrant=function(x, y){
				var result = 0;

				if(x >= 0 && y <= 0) {
					result = 1;
				}else if(x <= 0 && y <= 0) {
					result = 2;
				}else if(x <= 0 && y >= 0) {
					result = 3;
				}else if(x >= 0 && y >= 0) {
					result = 4;
				}else {

				}

				return result;
			}

			/**
			 * 点击区域所对应的数字，从第二象限开始算起
			 * @param 
			 * @return 
			 */
			var clickNum=function(a, b){
				var result = 0;

				if(a == 2){
					if(b == 1) {
						result = 5;
					}else if(b == 2) {
						result = 4;
					}else {
						result = 3;
					}
				}else if(a == 3) {
					if(b == 1) {
						result = 5;
					}else if(b == 2) {
						result = 6;
					}else {
						result = 7;
					}
				}else {     //a ==4
					if(b == 1) {
						result = 1;
					}else if(b == 2) {
						result = 8;
					}else {
						result = 3;
					}
				}

				return result;
			}

			/**
			 * 根据坐标判断结果是1还是0
			 * @param 
			 * @return 
			 */
			var is1_0=function(x, y){
				var result = 0;
				var center_6_x = em2X(center_6);
				if(center_6 < x && 0 < y && y < linesize/2) {   //靠近x的半个矩形
					result = 1;
					quadrant_1_num = 1;
				}

				if(center_6 < y && 0 < x && x < linesize/2) {   //靠近y的半个矩形
					result = 1;
					quadrant_1_num = 3;
				}

				if(x < y) {      //第一象限上半部分
					// var is_sign = 0;
					if(x > linesize/2 && x < center_6) {     //距离中心最近的区域
						if(((y - x) <= linesize/2/getSinDeg(45)) && ((y - x) >= (2*center_6_x-x))) {  //在方形内
							result = 1;
							// is_sign = 1;
						}
					}else {
						if((y - x) <= linesize/2/getSinDeg(45)) {  //在方形内
							result = 1;
							// is_sign = 1;
						}
					}
					if(result ==1 && quadrant_1_num == 0) {
						quadrant_1_num = 2;
					}	

				}else if(x > y) {     //第一象限下半部分
					if(x > linesize/2 && x < center_6) {      //距离中心最近的区域
						if((x - y) >= (2*center_6_x-x)) {  //在方形内
							result = 1;
						}
					}else {
						if((x - y) <= linesize/2/getSinDeg(45)) {  //在方形内
							result = 1;
						}
					}
					if(result ==1 && quadrant_1_num == 0) {
						quadrant_1_num = 2;   //这里有问题
					}
					
				}else {      //第一象限对角线上 
					if(x*x+y*y > center_6*center_6) {   //在对角线上，且不在center_6内
						result = 1;
						if(quadrant_1_num == 0) {
						quadrant_1_num = 2;
						}
					}
				}

				return result;
			};

			/**
			 * 用canvas画圆
			 * @param 
			 * @return 
			 */
			var class2Time=function(class_name){
				var result = targettime2;
				var argu_class = class_name.replace(/ele/i,'').split('_');
				var distance = argu_class[0];
				if(distance == 10){
					result = targettime1;
				}

				return result;
			};

			/**
			 * 用canvas画直线
			 * @param 
			 * @return 
			 */
			var drawLine=function(){
				$('#my_line').css({'width':width,'height':height});
				var canvas=document.getElementById("my_line");
				var cxt=canvas.getContext("2d");
				cxt.beginPath();
				//1
	            cxt.moveTo(width/2, width/2);
	            cxt.lineTo(width-text_pos, width/2);
	            $('#num_1').text(digit[0]);
	            $('#num_1').css({'marginTop':'-'+num_height/2+'px','marginLeft':''+width/2-text_pos+'px'})
	            
	            //2
	            cxt.moveTo(width/2, width/2);
	            cxt.lineTo(width/2+em2X(eccentricitysize3+(fixsize+2)/2), width/2-em2X(eccentricitysize3+(fixsize+2)/2));
	            $('#num_2').text(digit[1]);
	            $('#num_2').css({'marginTop':''+(-(em2X(eccentricitysize3+(fixsize+2)/2)+min_2_x))+'px','marginLeft':''+((em2X(eccentricitysize3+(fixsize+2)/2)+min_2_y))+'px'})
	            //3
	            cxt.moveTo(width/2, width/2);
	            cxt.lineTo(width/2, 0+text_pos);
	            $('#num_3').text(digit[2]);
	            $('#num_3').css({'marginTop':''+(-(width/2-text_pos+num_height))+'px','marginLeft':'-'+num_width/2+'px'})
	            //4
	            cxt.moveTo(width/2, width/2);
	            cxt.lineTo(width/2-em2X(eccentricitysize3+(fixsize+2)/2), width/2-em2X(eccentricitysize3+(fixsize+2)/2));
	            $('#num_4').text(digit[3]);
	            $('#num_4').css({'marginTop':''+(-(em2X(eccentricitysize3+(fixsize+2)/2)+min_4_x))+'px','marginLeft':''+(-(em2X(eccentricitysize3+(fixsize+2)/2)+min_4_y))+'px'})
	            //5
	            cxt.moveTo(width/2, width/2);
	            cxt.lineTo(0+text_pos, width/2);
	            $('#num_5').text(digit[4]);
	            $('#num_5').css({'marginTop':''+(-num_height/2)+'px','marginLeft':''+(-(width/2-text_pos+num_width))+'px'})
	            //6
	            cxt.moveTo(width/2, width/2);
	            cxt.lineTo(width/2-em2X(eccentricitysize3+(fixsize+2)/2), width/2+em2X(eccentricitysize3+(fixsize+2)/2));
	            $('#num_6').text(digit[5]);
	            $('#num_6').css({'marginTop':''+((em2X(eccentricitysize3+(fixsize+2)/2)-min_6_x))+'px','marginLeft':''+(-(em2X(eccentricitysize3+(fixsize+2)/2)+min_6_y))+'px'})
	            //7
	            cxt.moveTo(width/2, width/2);
	            cxt.lineTo(width/2, width-text_pos);
	            $('#num_7').text(digit[6]);
				$('#num_7').css({'marginTop':''+(width/2-text_pos)+'px','marginLeft':''+(-(num_width/2))+'px'})
	            //8
	            cxt.moveTo(width/2, width/2);
	            cxt.lineTo(width/2+em2X(eccentricitysize3+(fixsize+2)/2), width/2+em2X(eccentricitysize3+(fixsize+2)/2));
	            $('#num_8').text(digit[7]);
	            $('#num_8').css({'marginTop':''+((em2X(eccentricitysize3+(fixsize+2)/2)))+'px','marginLeft':''+((em2X(eccentricitysize3+(fixsize+2)/2)))+'px'})
	                        
	            cxt.strokeStyle = '#ffffff';
	            
	            cxt.stroke();
			};

			/**
			 * 用canvas画圆
			 * @param 
			 * @return 
			 */
			var drawCircle=function(){
				var canvas=document.getElementById("my_canvas");
				var cxt=canvas.getContext("2d");
				cxt.beginPath();
				cxt.arc(13,13,13,0,Math.PI*2,true);
				cxt.fillStyle = '#ffffff';
				cxt.fill();
				cxt.moveTo(5,5);
				cxt.lineTo(26,13);
				cxt.lineTo(5,21);
				cxt.lineTo(5,5);
				cxt.closePath();
				cxt.fillStyle = backupcolor;
				cxt.fill();
				cxt.strokeStyle = '#ffffff';
	      		cxt.stroke();

				var circle_name = $('.ele25 div')[c_rect].className;
				var circle_pos = class2Pos(circle_name,1);   //1表示是找圆的位置

				$('#my_canvas').css({'marginTop':''+circle_pos[0]+''+circle_pos[1]+'px','marginLeft':''+circle_pos[2]+''+circle_pos[3]+'px'});

				circle_pos_x = +(circle_pos[2]+circle_pos[3]) + (circlesize+1)/2;
				circle_pos_y = -(+(circle_pos[0]+circle_pos[1])) - (circlesize+1)/2;

				$('#my_canvas').css('display','none');
			};

			/**
			 * 生成不重复且唯一的数组
			 * @param 10
			 * @return [1, 2, 3, 0, 8, 7, 6, 4, 5, 9]
			 */
			var signArray=function(max){
				var result=new Array();
				for(var i=0;i<max;i++){
					result[i]=i;
				}
				result.sort(function(){				
					return Math.random()>.5 ? -1 : 1;//用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
				});
				return result;
			};

			/**
			 * 根据类名找位置
			 * @param ele10_1
			 * @return ['-','15','+','60']
			 */
			var class2Pos = function(class_name,circle) {
				var result = [];
				var temp = fixsize;   //如果circle=1，则需要把fixsize转为circlesize，temp作为中间变量，此函数结束之前，需要把fixsize还原

				var argu_class = class_name.replace(/ele/i,'').split('_');
				var distance = argu_class[0];
				var index = argu_class[1];
				result[0] = '+';
				result[1] = 0;
				result[2] = '+';
				result[3] = 0;  //margintop和marginleft的四个参数
				if(index < 6) {
					result[0] = '-';
				}
				
				if(2 < index&&index < 8) {
					result[2] = '-';
				}

				if(circle == 1) {
					fixsize = (circlesize-1);
				}
				if(index == 1||index == 5) {
					result[1] = (fixsize+2)/2;
				}
				if(index == 3) {
					result[1] = (eval('eccentricitysize'+(distance/10))+(fixsize+2)/2);
				}
				if(index == 7) {
					result[1] = (eval('eccentricitysize'+(distance/10))-(fixsize+2)/2);
				}
				if(index == 2||index == 4) {
					result[1] = (eval('x_'+(distance/10))+(fixsize+2)/2);
				}
				if(index == 6||index == 8) {
					result[1] = (eval('x_'+(distance/10))-(fixsize+2)/2);
				}

				if(index == 3||index ==7) {
					result[3] = (fixsize+2)/2;
				}
				if(index == 1) {
					result[3] = (eval('eccentricitysize'+(distance/10))-(fixsize+2)/2);					
				}
				if(index == 5) {
					result[3] = (eval('eccentricitysize'+(distance/10))+(fixsize+2)/2);
				}
				if(index == 4||index == 6) {
					result[3] = (eval('x_'+(distance/10))+(fixsize+2)/2);
				}
				if(index == 2||index == 8) {
					result[3] = (eval('x_'+(distance/10))-(fixsize+2)/2);
				}
				fixsize = temp;

				return result;
			};

			/**
			 * 绘制24个矩形
			 * @param 
			 * @return 
			 */
			var draw24 = function() {
				for(var i=1,l=$('.ele25 div').length;i<l;i++){
					var class_name = $('.ele25 div')[i].className;
					var pos = class2Pos(class_name)

					$($('.ele25 div')[i]).css({'marginTop':''+pos[0]+''+pos[1]+'px','marginLeft':''+pos[2]+''+pos[3]+'px'});
				}
			};

			/**
			 * 根据斜角的距离，计算x方向的距离
			 * @param 80
			 * @return 57
			 */
			var em2X = function(em) {
			   var x = Math.sqrt((em * em)/2);
			   return Math.round(x);
			};

			/**
			 * 使用度数返回正切值，最初估算距离时用
			 * @param 45°
			 * @return 1
			 */
			var getTanDeg = function(deg) {
			   var rad = deg * Math.PI/180;
			   return Math.tan(rad);
			};

			/**
			 * 使用度数返回正弦值，最终比较是否在长方形内用
			 * @param 45°
			 * @return .5
			 */
			var getSinDeg = function(deg) {
			   var rad = deg * Math.PI/180;
			   return Math.sin(rad);
			};		

			return {
				prepare : prepare,
			}
		})();

		$("#begin_prac").click(function(){
			// console.log('click');
			$('#begin_prac').css('display','none');
			$('#container').css('display','block');
			myObject.prepare();
		});
	}
});






