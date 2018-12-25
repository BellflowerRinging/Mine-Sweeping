var RowCount=36;
var ColumnCount=24;
var GirdCount=RowCount*ColumnCount;
var BoomCount=173;
//var Probability=BoomCount/(RowCount+CloumnCount);

var TotalGird;
var MineGridIdList;
var NotFlagBoom = BoomCount;

var MainDiv=$('#Main_div');
var PaoHui = $('#grid-paoHui');
var ButtonClass = "grid btn btn-info";
var OpenClass = "open";
var BoomClass = "boom glyphicon glyphicon-asterisk";

var time = 0;
var play=false;

var openGridCount = 0;
    
$('#Info_div input').change(function () {
	RowCount = $('#RowCount').val();
	ColumnCount = $('#ColumnCount').val();
	BoomCount = $('#BoomCount').val();

	var num = Math.round($(this).val()) ;
	$(this).val(num);
	switch ($(this).attr("id")) {
		case "RowCount":
			if (num<=6) {
				$(this).val(6);
				RowCount = 6;
			}else if (num>=720) {
				$(this).val(720);
				RowCount = 720;
			}
			break;
		case "ColumnCount":
			if (num<=6) {
				$(this).val(6)
				ColumnCount = 6;
			}else if (num>=24) {
				$(this).val(24)
				ColumnCount = 24;
			}
			break;
	}
	GirdCount=RowCount*ColumnCount;


	var min=Math.round(GirdCount * 0.1);
	var max=Math.round(GirdCount * 0.3);
	num = $('#BoomCount').val();
	if (num<=min) {
		$('#BoomCount').val(min);
		BoomCount = min;
	}else if (num>=max) {
		$('#BoomCount').val(max);
		BoomCount = max;
	}

});

$('#NewGameButton').click(function () {
	RowCount = $('#RowCount').val();
	ColumnCount = $('#ColumnCount').val();
	BoomCount = $('#BoomCount').val();
	GirdCount=RowCount*ColumnCount;

	MainDiv.text("");
	NewGame();
});

function NewGame() {

	var gclass = $('.grid-css');
	var gHeight = gclass.cssNum("height");
	var gWidth = gclass.cssNum("width");
	var MainDivBorder = Number(MainDiv.cssNum("border-left-width")) + Number(MainDiv.cssNum("border-right-width"));

	MainDiv.css({
		height:Number(RowCount * gHeight+4)+"px",
		width:Number(ColumnCount * gWidth + Number(MainDivBorder))+"px"
	});

	var i,j;
	TotalGird=new GirdList();
	MineGridIdList = [];
	NotFlagBoom = BoomCount;
	$("#NoFlagBoom").text("剩余雷数：" + NotFlagBoom + "个");
	time = 0;
	play=false;
	$("#Time").text("用时：0秒");
	$("#Time").removeAttr("disabled");

	// init button
	for (i=0;i<GirdCount;i++){
		MainDiv.append($('<button></button>').attr("id",i).attr("class",ButtonClass));
	}

	// init boom
	var putBoom=0;
	while(putBoom<BoomCount){
		var r=Math.round(Math.random()*(RowCount*ColumnCount-1));
		if (MineGridIdList.indexOf(r)==-1) {
			MineGridIdList.push(r);
			putBoom++;
		}
	}

	//init new all grid
	for(i=0;i<RowCount;i++){
		for(j=0;j<ColumnCount;j++){
			var g = new Grid(i, j);
			TotalGird.add(g);
		}
	}

	// init roundBoom Num first for all list
	for (i=0;i<MineGridIdList.length;i++){

		var checkList=TotalGird.getGridRound(TotalGird.get(MineGridIdList[i]));
		for (j=0;j<checkList.length;j++) {
			if (checkList[j]==null || !GridIsInGame(checkList[j])) continue;
			if (checkList[j].boom==false) {
				checkList[j].roundBoom = checkList[j].roundBoom + 1;
			}
		}

	}

	//init not right click
	$("body").bind("contextmenu", function () {
		return false;
	});

	// init---------------------------------------------------------------------
	InitEvent();
	//Event//---------------------------

	/*
	 var TimeFn,TimeFnGrid;
	 $('.grid').click(function () {
	 clearTimeout(TimeFn);
	 TimeFnGrid = TotalGird.get($(this).attr("id"));

	 TimeFn = setTimeout(function(){
	 //var grid = TotalGird.get($(this).attr("id"));
	 if (TimeFnGrid.boom == true) {
	 alert("boom!")
	 } else {
	 TotalGird.openGridRound(TimeFnGrid);
	 }
	 },200);
	 });

	 $(".grid").dblclick(function(){
	 clearTimeout(TimeFn);
	 alert("hello");
	 });
	 */

}

function InitEvent() {
	var GridClass = $(".grid");

	MainDiv.focusin(function () {
		play = true;
	});

	$("#Time").click(function () {
		if (play) {
			play = false;
			disabled();
			$(this).text("继续游戏");
		}else{
			play = true;
			able();
		}
	});

	GridClass.click(function () {
		var grid= TotalGird.get($(this).attr("id"));
		TotalGird.openGridRound(grid);
		$(this).blur();
	});

	GridClass.mousedown(function (e) {
		if (3 == e.which) {
			setFlag(TotalGird.get($(this).attr("id")));
		}
	});

	function setFlag(grid) {
		if (grid.open==true) return;
		if (grid.flag==false) {
			grid.button.addClass("flag glyphicon glyphicon-flag");
			grid.flag = true;
			NotFlagBoom--;
			$("#NoFlagBoom").text("剩余雷数：" + NotFlagBoom + "个");
		}else {
			grid.button.removeClass("flag glyphicon glyphicon-flag");
			grid.flag = false;
			NotFlagBoom++;
			$("#NoFlagBoom").text("剩余雷数：" + NotFlagBoom + "个");
		}
		grid.button.blur();
	}
}

$(document).ready(function(){
	NewGame();
	//TimeFn();
});

var TimeFn = setInterval(function(){
	if (play==true) {
		$('#Time').text("用时："+time+++"秒");
	}
},1000);