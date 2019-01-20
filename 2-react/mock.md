


```js
import mockjs from 'mockjs';
 
export default {
  'GET /api/img': mockjs.mock({
    'list|10': [{ src: '@image' }],
  })
};

{"list":[{"src":"http://dummyimage.com/120x60"},{"src":"http://dummyimage.com/240x400"}]}
```







