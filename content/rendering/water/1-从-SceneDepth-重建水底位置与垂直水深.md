---
layout: default
date: 2026-07-27
title: 从 SceneDepth 重建水底位置与垂直水深
parent: 水的渲染
grand_parent: 图形渲染
nav_order: 1
mathjax: true
---

# 从 SceneDepth 重建水底位置与垂直水深

在水材质中，我们经常会用 `SceneDepth - PixelDepth` 估计水深。这个做法很直接，但得到的是屏幕深度方向上的差值，并不一定等于水面到水底的垂直距离。

这一篇从 `SceneDepth` 出发，先求相机到水底点的射线距离，再重建水底的世界坐标，最后得到垂直水深。

![SceneDepth、视线方向与水底点的几何关系](/assets/images/water-rendering/01-depth-reconstruction.jpg)

## 图中的点和方向

- $A$：相机位置。
- $\mathbf L$：归一化后的相机前向，也就是图中的 `LookDir`。
- $\mathbf V$：归一化后的当前像素射线方向，也就是图中的 `ViewDir`。
- $W$：当前像素在水面上的世界坐标。
- $P$：视线穿过水面后击中的河底或其他不透明物体。
- $C$：点 $P$ 在相机前向 $\mathbf L$ 上的投影点。
- $\alpha$：$\mathbf V$ 与 $\mathbf L$ 的夹角。

本文把 `SceneDepth` 记作 $AC$：它是点 $P$ 在相机前向上的线性深度。我们真正想要的则是沿当前像素射线的距离 $AP$。

## 从 SceneDepth 得到射线距离

$AC$ 是 $AP$ 在相机前向上的投影，所以：

$$
\cos\alpha=\frac{AC}{AP}
$$

移项得到：

$$
AP=\frac{AC}{\cos\alpha}
$$

代入 `SceneDepth`：

$$
\boxed{
AP=\frac{\text{SceneDepth}}{\cos\alpha}
}
$$

如果 $\mathbf V$ 和 $\mathbf L$ 都已经归一化，那么：

$$
\cos\alpha=\mathbf V\cdot\mathbf L
$$

于是：

$$
\boxed{
AP=
\frac{\text{SceneDepth}}
{\mathbf V\cdot\mathbf L}
}
$$

这一步把相机前向上的深度，转换成了沿当前像素射线的实际距离。

## 重建水底位置

知道相机位置 $A$、射线方向 $\mathbf V$ 和射线距离 $AP$ 后，水底点就是：

$$
\boxed{
P=A+\mathbf V\,AP
}
$$

把前面的结果代入：

$$
\boxed{
P=
A+
\mathbf V
\frac{\text{SceneDepth}}
{\mathbf V\cdot\mathbf L}
}
$$

这样得到的是水底点 $P$ 的完整世界坐标，而不只是一个深度数值。

## 计算垂直水深

水面点 $W$ 可以直接使用当前水面像素的 `Absolute World Position`。

UE 的世界空间通常以 $Z$ 轴向上。水底点低于水面，因此通常有：

$$
P_z<W_z
$$

正的垂直水深应写成：

$$
\boxed{
\text{VerticalDepth}=W_z-P_z
}
$$

如果无法确定上下关系，也可以根据材质的使用范围做 `Abs` 或 `Max(0, W_z-P_z)`。

## 水面倾斜或视角很斜时

传统的屏幕深度差仍然可以保留：

```hlsl
float DeltaDepthInaccuracy = FixedSceneDepth - PixelDepth;
```

它的优点是稳定直接；问题是它沿屏幕深度方向，而不是世界空间的垂直方向。水面倾斜或视角很斜时，它会和真实的垂直水深产生偏差。

可以根据水面法线在世界 $Z$ 轴上的分量，在两种结果之间混合：

```hlsl
float cosTheta = pow(saturate(normalize(VertexNormal).z), 16);
float weight = smoothstep(0.9, 1.0, cosTheta);
float Result = lerp(DeltaDepthInaccuracy, VerticalDepth, weight);
```

逻辑是：

- 水面法线越接近世界 $Z$ 轴，越相信重建得到的垂直水深。
- 水面越倾斜，越退回传统的屏幕深度差。

`pow(z, 16)` 会让权重变化很陡，只有法线几乎朝上时才明显使用垂直水深。指数和 `smoothstep` 的范围都可以根据项目调整。

## 大世界中的进一步处理

在大世界项目中，还可以把实时计算的水深与烘焙深度图混合：

- 近处使用重建结果，保留局部精度。
- 远处采样烘焙深度图，降低成本并提高稳定性。
- 使用 `SceneDepth` 或距离信息控制两者的混合区域。

至此，一般水面的垂直深度已经足够使用。下一篇继续讨论另一个情况：当相机进入水下以后，散射需要的水中路径长度应该怎样计算。

[下一篇：相机在水下时，如何计算光线在水中的路径长度](./2-水下视角的水中路径长度)

---

本文整理自我此前发布在知乎的文章：[水深度的算法](https://zhuanlan.zhihu.com/p/2058187515182555495)。
