# velocity的应用

## 执行动画序列
###  通过设置第二个动画的延迟时间来控制
	$("#el1").velocity({ width: "100" }, { duration: 3000 })
	$("#el2").velocity({ width: "100" }, { duration: 3000, delay: 3000 })

###  将第二个动画放到第一个动画的complete中进行回调
	$("#el1").velocity({ width: "100" }, {
		duration: 3000,
		complete: function () {
			$("#el2").velocity({ width: "100" }, { duration: 3000 })
		}
	})
###  通过定义动画序列来实现
	var seq = [{
		elements: $("#el1"),
		properties: { width: "100px" },
		options: { duration: 2000 }
	}, {
		elements: $("#el2"),
		properties: { width: "100px" },
		options: {
			delay: 1000,
			duration: 1000
		}
	}, {
		elements: $("#el3"),
		properties: "callout.shake",//添加"./js/velocity.ui.min.js"
		options: {
			sequenceQueue: false //第一个执行完后 与第二个同步执行
		}
	}];
	$.Velocity.RunSequence(seq);

###  自定义动画
	velocity.ui中预定义的动画：
		$ele.velocity("callout.shake");

	velocity自定义动画：
		$.Velocity.RegisterEffect("me.pulse", {
			defaultDuration: 300,
			calls: [
				[{ scaleX: 2 }, 0.25],//0.25 时间段
				[{ scaleY: 2 }, 0.25],
				[{ scaleX: 1 }, 0.25],
				[{ scaleY: 1 }, 0.25]
			]
		});
		$("#el1").on("mouseover", function () {
			$(this).velocity("me.pulse")
		});

		$.Velocity.RegisterUI("me.pulse", {
			defaultDuration: 300,
			calls: [
				[{ scaleX: [0, 1], scaleY: [2, 1] }],//[0,1] 开始，结束
				[{ scaleX: 9 }, 0.25],
			]
		});
		$("#el1").on("mouseover", function () {
			$(this).velocity("me.pulse")
		});