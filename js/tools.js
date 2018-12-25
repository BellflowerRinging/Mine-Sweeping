/**
 * Created by Administrator on 2017/5/24.
 */


function GirdList(){

    var list = [];

    this.add = function (grid) {
        list.push(grid);
    };

    this.get= function (row,column) {
        if (arguments.length==1) {
            if (row<0||row>=list.length) return;
            return list[row];
        }else if (arguments.length==2){
            if (!RowColumnIsInGame(row,column)) return;
            return list[Number(row * ColumnCount) + Number(column)];
        }
    };

    this.getAll= function () {
        return list;
    };

    this.getGridRound= function (gird) {
        var result=[];
        result.push(this.get(gird.row-1, gird.column-1));
        result.push(this.get(gird.row-1, gird.column));
        result.push(this.get(gird.row-1, gird.column+1));
        result.push(this.get(gird.row, gird.column-1));
        result.push(this.get(gird.row, gird.column+1));
        result.push(this.get(gird.row+1, gird.column-1));
        result.push(this.get(gird.row+1, gird.column));
        result.push(this.get(gird.row+1, gird.column+1));
        return result;
    };

    this.openGridRound= function (gird) {
        if (gird.flag==true) return;

        openSoloGrid(gird);
        
        var round = this.getGridRound(gird);
        var wantOpen=[];
        var wantOpenBlack = [];
        var wantNotFlag = [];
        var roundFlagNum = 0;
        var roundNull = 0;

        for (var i=0;i<round.length;i++) {
            if (round[i]==null) {
                roundNull++;
                continue;
            }
            if (round[i].open==false) {

                if (round[i].flag==false){
                    wantNotFlag.push(round[i]);
                }else{
                    roundFlagNum++;
                }

                if (round[i].boom==false) {

                    if (round[i].roundBoom==0) {
                        wantOpenBlack.push(round[i]);
                    }

                    wantOpen.push(round[i]);
                }
            }

        }

        if (roundFlagNum==gird.roundBoom && gird.roundBoom!=0) {
            for (var j=0;j<wantNotFlag.length;j++) {
                if (wantNotFlag[j].roundBoom==0) {
                    this.openGridRound(wantNotFlag[j]);
                }else openSoloGrid(wantNotFlag[j]);

            }
            return;
        }

        if (gird.roundBoom==0) {
            for (var j=0;j<wantOpen.length;j++) {
                this.openGridRound(wantOpen[j]);
            }
        }else {
            for (var j=0;j<wantOpenBlack.length;j++) {
                this.openGridRound(wantOpenBlack[j]);
            }
        }

    };

    var openGridCount = 0;

    function openSoloGrid(gird){
        if (gird.open == true) {
            return;
        }
        
        gird.open = true;
        gird.button.addClass(OpenClass);

        if (gird.boom==true) {
            defeat();
            return;
        }

        if (gird.roundBoom!=0) {
            gird.button.text(gird.roundBoom);
        }
        
        openGridCount++;
        
        if (openGridCount==(GirdCount-BoomCount)) {
            victory();
        }
    }

}

function Grid(row, column){
    if (arguments.length==1) {
        var id = row;
        this.button = $('#' + id);
        if (this.button==null) return;
        this.id=this.button.attr("id");
        this.row = Math.floor(id/ColumnCount);
        this.column = id%ColumnCount;
    }else if (arguments.length==2){
        this.button = $('#' + (Number(row * ColumnCount) + Number(column)));
        if (this.button==null) return;
        this.id=this.button.attr("id");
        this.row = row;
        this.column = column;
    }

    this.boom = isBoom(this.id);
    this.roundBoom=0;
    this.open = false;
    this.flag = false;
}

function isBoom(id){
    for(var i=0;i<=MineGridIdList.length;i++){
        if (id==MineGridIdList[i]) {
            return true;
        }
    }
    return false;
}

function victory() {
    alert("Victory!");
    play = false;
    disabled();
    $("#Time").attr("disabled","disabled");

}

function defeat() {
	alert("boom!");
	
    for (i=0;i<MineGridIdList.length;i++){
        var g=TotalGird.get(MineGridIdList[i]);           
        g.button.addClass(BoomClass);
    }
    
    play = false;
    disabled();
    $("#Time").attr("disabled","disabled");
}

function disabled(){
    for (var i=0;i<GirdCount;i++) {
        TotalGird.get(i).button.attr("disabled","disabled");
    }
}

function able(){
    for (var i=0;i<GirdCount;i++) {
        TotalGird.get(i).button.removeAttr("disabled");
    }
}

/**
 * @return {boolean}
 */
function GridIsInGame(grid){
    return RowColumnIsInGame(grid.row,grid.column);
}

/**
 * @return {boolean}
 */
function RowColumnIsInGame(row,column){
    if (row<0||row>=RowCount) {
        return false;
    }else if (column<0||column>=ColumnCount) {
        return false;
    }
    return true;
}

jQuery.prototype.cssNum = function (css) {
    return this.css(css).substrlasting(2);
};

String.prototype.substrlasting= function (length) {
    return this.substr(0, this.length - length);
};
