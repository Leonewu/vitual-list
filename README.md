# 虚拟列表

当长列表渲染的列数太多的时候，产生大量的dom节点，会造成性能问题，特别是移动端，所以就有了虚拟列表的概念。只渲染可视区的dom节点，并且体验和原生的列表无异

## 变量定义

- `list`: 全量的数据列表
- `vitualList`: 渲染的数据列表
- `startIndex`: vitualList 截取 list 开始的下标
- `endIndex`: vitualList 截取 list 结束的下标
- `heightList`: 记录渲染过的每一列的 height 和 top 数组

## 实现过程

1. 初始化时，记录下渲染过的每一列的 `height` 和 `top`，存放在 `heightList`
2. 在滚动的时候一边遍历 `heightList`，并根据 `scrollTop`找出当前的 `startIndex`，然后截取数组进行渲染，并且一边补全 `heightList`
3. 设置 `paddingTop`，确定了 `startIndex`，并且记录了渲染的每一列的高度，就能知道渲染的第一个元素的距离列表顶部的距离 ， 计算公式为  
 ```paddingTop = heightList[startIndex].top```
4. 设置 `paddingBottom`，计算公式为  
```paddingBottom = heightList[heightList.length - 1].top + heightList[heightList.length - 1].height - heightList[endIndex].top - heightList[endIndex].height```

## 注意事项

1. 每一列都是固定高度（已实现）
2. 每一列是不固定高度（已实现）
3. 每一列都包含图片，必须等图片加载完才获取高度（未实现）

## 遇到的问题

- 先不要加 throttle

## 其他

- 如果是每一列的高度都是一致的话，不用维护 `heightList` 数组，用 `Math.floor(scrollTop / itemHeight)` 就可以计算出 `startindex`
- 如果每一列的高度是不一致的，就需要 `heightList` 去记录每一列的高度
- 为了覆盖更多的情况，这里都通过维护 `heightList` 去判断 `startIndex`

## 优化空间

- 可以对上一次的 `startIndex` 进行缓存，如果是往下滚动，在遍历 `heightList` 的时候起始下标就是上一个 `startIndex`，如果是向上滚动，就往相反方向遍历 `heightList`

## 存在的问题

- `paddingBottom` 并不是绝对准确的，因为只有知道下面所有列的高度，才能正确的设置 `paddingBottom`，所以第一次滚动到尽头的时候，滚动条会一直变小，这是因为把 `paddingBottom` 设置成剩余高度
