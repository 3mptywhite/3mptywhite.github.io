# 球面函数

> 输入是球面上的一个方向，输出是这个方向对应的数值。

这个数值可以是任何东西 输出距离就是一个形状的表面，输出漫反射Irradiance 就是这个方向的光照情况 

输入方向 \(\omega\)，输出该方向上的RGB光照，这就是一个球面函数。

Cubemap其实就是球面函数的纹理化存储：

```
输入方向 → 查询Cubemap → 返回RGB
```

## 和SH的关系

球谐函数SH是一组特殊的球面函数，可以在球面函数空间作为基函数来近似其他球面函数：

\[ f(\omega)\approx\sum_i c_iY_i(\omega) \]

和离散傅里叶变化模拟函数变化类似 。用一组球谐函数来近似一个球面函数

![img](https://www.patapom.com/blog/images/SH/SHSignalReconstruction.png)

```
普通声音信号 → 用多个正弦波表示
球面光照信号 → 用多个球谐函数表示
```


之前可能要存储一个cubemap 现在只需要存储前9个基函数的系数就可以有一个能用的漫反射光照信息。
# SH函数的应用
【SH函数公式推导非常复杂，目前的我是看不懂，~~问了下ai 前置知识大概需要 懂完整的勒让德多项式和球面拉普拉斯推导~~】 

但不影响我们利用它，既然是基函数 ，有些性质就是一样的

![img](https://www.patapom.com/blog/images/SH/Spherical_Harmonics.png)

## 利用与目标球面函数做内积来得到系数

如果有一个方向光照函数 \(L(\omega)\)，第 \(i\) 个系数可以直接计算：

\[ c_i=\langle L,Y_i\rangle = \int_{S^2}L(\omega)Y_i(\omega)d\omega \]

不需要同时求解九个未知数。因为不同基函数互不干扰，直接分别做内积就能得到系数。

## 完备性

完整的无限阶SH可以表示任意平方可积的球面函数：

\[ L(\omega) = \sum_{l=0}^{\infty} \sum_{m=-l}^{l} c_l^mY_l^m(\omega) \]

这意味着SH确实可以作为球面函数空间的一套坐标系。

**游戏中只取有限阶：**

\[ L(\omega)\approx\sum_{i=0}^{8}c_iY_i(\omega) \]

因此得到的是低频近似，不是精确还原。

## 线性性质

SH投影是线性的：

\[ P(af+bg)=aP(f)+bP(g) \]

所以光照可以直接在系数空间中相加：

```
resultSH[i] =
    sunSH[i]
  + skySH[i]
  + bounceSH[i];
```

调节灯光强度也很简单：

```
resultSH[i] = lightSH[i] * intensity;
```

RGB三个通道也可以分别计算。

物体位于多个探针之间时：

```
resultSH[i] =
    probe0[i] * weight0 +
    probe1[i] * weight1 +
    probe2[i] * weight2 +
    probe3[i] * weight3;
```

然后只对插值后的SH求值一次。

这里利用的就是线性性质。

## 球面卷积在SH空间里很便宜

【这个目前看不懂之后补充】


# 阅读清单

https://therealmjp.github.io/posts/sg-series-part-1-a-brief-and-incomplete-history-of-baked-lighting-representations/

https://lianera.github.io/post/2016/sh-lighting-exp/

https://lianera.github.io/post/2017/sh-lighting-apply/
https://zhuanlan.zhihu.com/p/351289217