

### API预告
    https://juejin.im/post/5d0f64d4f265da1b67211893
    Vue 最黑暗的一天

    区别
        1. 在 Vue 2.x 中我们 没有办法把相关的东西放在一起。 我们不能把 petName 数据声明放在 petNameComment 计算属性或者 onPetNameBlur 方法旁边，因为在 Vue 2.x 中，这些选项是按照类型组织的。
        2. 更大的例子，它有很多功能，需要 data、computed、methods、甚至是一两个watcher。
        3. 目前还 没有好方法 来把相关的东西放一起！有人可能会使用诸如 Mixin 或高阶组件之类的办法，但是它们都有问题——很难辨别一个属性来自哪里，还有命名空间的冲突。
        4. 新提案不是按照选项的类型来组织组件，而是允许我们按照实际功能来组织组件。 



* 实战
```js
import { state, computed } from "vue";

function usePetName() {
  const petNameState = state({ name: "", touched: false });
  const petNameComment = computed(() => {
    if (petNameState.touched) {
      return "Hello " + petNameState.name;
    }
    return null;
  });
  const onPetNameBlur = () => {
    petNameState.touched = true;
  };
  return {
    petName: petNameState.name,
    petNameComment,
    onPetNameBlur
  };
}

function usePetSize() {
  // ...
  return {
    petSize: petSizeState.size,
    petSizeComment,
    onPetSizeChange
  };
}

export default {
  setup() {
    return { ...usePetName(),...usePetSize() };
  }
};
```


