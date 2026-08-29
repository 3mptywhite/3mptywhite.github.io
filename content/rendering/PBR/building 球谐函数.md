# 球面函数

> 输入是球面上的一个方向，输出是这个方向对应的数值。

输入方向 \(\omega\)，输出该方向上的RGB光照，这就是一个球面函数。

Cubemap其实就是球面函数的纹理化存储：

```
输入方向 → 查询Cubemap → 返回RGB
```

## 和SH的关系

球谐函数SH是一组特殊的球面函数，可以作为“基础积木”来近似其他球面函数：

\[ f(\omega)\approx\sum_i c_iY_i(\omega) \]

可以类比成：

```
普通声音信号 → 用多个正弦波表示
球面光照信号 → 用多个球谐函数表示
```

# SH函数的基函数

# 阅读清单

https://therealmjp.github.io/posts/sg-series-part-1-a-brief-and-incomplete-history-of-baked-lighting-representations/

https://lianera.github.io/post/2016/sh-lighting-exp/

https://lianera.github.io/post/2017/sh-lighting-apply/