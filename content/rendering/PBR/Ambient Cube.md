# Ambient Cube 

![image-20260830115916870](https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260830115916870.png)

## Ambient Cube的数据结构

```hlsl
// 固定顺序：+X, -X, +Y, -Y, +Z, -Z
float3 cAmbientCube[6];
```

对应关系：

```text
cAmbientCube[0] = +X方向辐照度
cAmbientCube[1] = -X方向辐照度
cAmbientCube[2] = +Y方向辐照度
cAmbientCube[3] = -Y方向辐照度
cAmbientCube[4] = +Z方向辐照度
cAmbientCube[5] = -Z方向辐照度
```

每个`float3`保存一个HDR RGB漫反射辐照度。 更严谨的Ambient Cube应该保存六个轴向经过余弦半球积分后的辐照度。

## 经典计算代码

![image-20260830115744148](https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260830115744148.png)

## 数学表达

根据法线正负选择三个颜色：

\[
C_X=
\begin{cases}
C_{+X},&n_x\geq0\\
C_{-X},&n_x<0
\end{cases}
\]

Y、Z同理。

最终结果：

\[
E(n)=n_x^2C_X+n_y^2C_Y+n_z^2C_Z
\]

## 为什么使用法线平方

1. 三个权重天然归一化。 不会出现比原来亮的情况

\[
n_x^2+n_y^2+n_z^2=1
\]



2. 法线正负已经用于选择Ambient Cube的正面或负面。后面的权重只需要表示贡献大小，不应出现负数；平方可以去掉符号，得到非负权重。

# 阅读素材

https://steamcdn-a.akamaihd.net/apps/valve/2004/GDC2004_Half-Life2_Shading.pdf  57-59页
