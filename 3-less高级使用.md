### less的使用
    //extract函数可以从数组中取值，.loop是个循环，它们两个组合在一起实现循环数组e;
    .for(@list) {
      .loop(@index:1) when ( @index<=length(@list) ) {
        @item: extract(@list, @index);
        .each(@item); //这里的each相当于一个抽象方法，谁调用for谁来实现
        .loop(@index + 1);
      }
      .loop();
    }

    .animation(@name, @duration, @count, @timing-function:linear, @delay:0s, @direction:normal) {
      @rule: ~'@{name} @{duration} @{timing-function} @{delay} @{count} @{direction} running forwards';
      @anim: animation;
      @prefixList: -o- -ms- -moz- -webkit-;
      .for(@prefixList);
      .each(@item) { //这里的each相当于override之后的方法
          @{item}@{anim}: @rule;
      }
    }




      .imgList(@index,@src) {
        .img-list:nth-child(@{index}) {
          background-image: url("../../assets/productTopImg/@{src}");
        }
      }

      .loop(@i) when (@i < (length(@productTopList) + 1)) {
        .imgList(@i, extract(@productTopList, @i));
        .loop(@i+1);
      }

      .loop(1);