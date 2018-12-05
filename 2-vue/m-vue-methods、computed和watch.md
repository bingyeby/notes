
## methods computed watch
### 说明
    在Vue中有三种方法可以让你的组件使用Vue的响应性。这些是methods、computed和watch
    当你点击“添加”按钮后，data中的tests就有对应的变化，那么我们的总分和平均分也有对应的变化。Vue的观察者就会执行autoSave方法。你可以看到控制台中打印出autoSave方法中的log信息，
    原文: http://www.w3cplus.com/vue/when-to-use-methods-computed-properties-or-watchers.html

```html
|--------------------------------
|-学生:[    ]  分数:[     ]   [+]
|--------------------------------
|-Billy :   76
|-Suzy  :   85
|-Emma  :   93
|--------------------------------
|-总分 254    平均 84.67
|--------------------------------
```
```
let app = new Vue({
  el: '#app',
  data () {
    return {
      newTest: { studentName: 'Jack', score: 0 },
      tests: [
        { studentName: 'Billy', score: 76 }, { studentName: 'Suzy', score: 85 }, { studentName: 'Emma', score: 93 }
      ]
    }
  },
  watch: {
    averageScore: function () {
      this.autoSave()
    }
  },
  computed: {
    totalScore: function () { 
      let totalArray = this.tests.reduce((acc, test) => {
        return acc + parseInt(test.score)
      }, 0)
      return totalArray
    },
    averageScore: function () {
      let totalArray = this.tests.reduce((acc, test) => {
        return acc + parseInt(test.score)
      }, 0)
      
      return parseFloat(totalArray / this.tests.length).toFixed(2)
    }
  },
  methods: {
    addTestScore: function () {
      this.tests.push({
        studentName: this.newTest.studentName,
        score: this.newTest.score
      })
      this.newTest.studentName = 'Jack'
      this.newTest.score = 0      
    },
    autoSave: function() {
      // 假设我们正在调用我们的后端来保存数据
      console.log('Calling Api, Saving data')
    }
  }
})
```






