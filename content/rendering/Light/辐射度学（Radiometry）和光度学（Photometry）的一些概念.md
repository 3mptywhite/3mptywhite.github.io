
## 辐射度量单位与光度量单位的转换

在辐射度量单位与光度量单位之间进行转换时，需要使用 **the CIE photopic luminous efficiency function**$V(\lambda)$。它也被称为“光谱响应曲线”，描述了人眼对不同波长光线的敏感程度。

该曲线由 **国际照明委员会（CIE）**于 1924 年制定。尽管后来有人提出过修正方案，它至今仍是通用标准。

曲线在波长为 **555 nm** 的黄绿色光处达到峰值，这也是人眼最敏感的波长。超出 **370～780 nm** 的范围后，人眼的敏感度会急剧下降。

实验表明，可以通过以下非线性回归公式近似该曲线：
$$
V(\lambda) = 1.019e^{-285.4(\lambda-0.559)^2}
$$

- $\lambda$：光的波长，单位为微米（$\mu\text{m}$）。
# 光谱辐亮度 Spectral radiance


 光谱辐亮度：

$$  
L(x,t,\omega,\lambda)  
$$

  

描述光在位置 x、时间 t、方向 $\omega$、波长$\lambda$ 上的 Radiance。

两个光谱可能具有相同的总辐射亮度，却有完全不同的颜色。例如总能量相同的一束绿光和一束蓝光，辐射亮度可以相同

光谱辐射亮度是“按波长划分的辐射亮度**密度**”，辐射亮度是它在指定波长范围内的积分总量。

https://en.wikipedia.org/wiki/Spectral_radiance

#  CIE XYZ color matching functions

![[Pasted image 20260823225221.png]]

 [CIE XYZ color matching functions](https://en.wikipedia.org/wiki/CIE_1931_color_space#Color_matching_functions)

 它们模拟了人类标准观察者对颜色的感知方式，CIE 提供了这些值的表格。利用这些函数，我们可以将光谱辐射度转换为 XYZ 值：
 

人眼对不同波长的响应不同。CIE 用三条颜色匹配函数：

$$  
\bar{x}(\lambda),\qquad \bar{y}(\lambda),\qquad \bar{z}(\lambda)  
$$

  ![[Pasted image 20260823225221.png]]

描述标准观察者对不同波长的颜色响应。

因此，把光谱 Radiance 分别乘以这三个函数，并沿波长积分：

$$  
L_X(x,t,\omega) = \int_{360\text{ nm}}^{830\text{ nm}} L(x,t,\omega,\lambda)\bar{x}(\lambda)\,d\lambda  
$$

  

$$  
L_Y(x,t,\omega) = \int_{360\text{ nm}}^{830\text{ nm}} L(x,t,\omega,\lambda)\bar{y}(\lambda)\,d\lambda  
$$

  

$$  
L_Z(x,t,\omega) = \int_{360\text{ nm}}^{830\text{ nm}} L(x,t,\omega,\lambda)\bar{z}(\lambda)\,d\lambda  
$$

  

本质上就是：

$$  
\boxed{ \text{Spectral Radiance} \xrightarrow{\text{对波长加权积分}} (X,Y,Z) }  
$$


其中比较特殊的是：

$$  
\bar y(\lambda)=V(\lambda)  
$$

  

也就是说，CIE XYZ 中的 $\bar y(\lambda)$与人眼的明视觉光效函数 $V(\lambda)$ 对应。

因此 Y 不仅参与描述颜色，也对应人眼感受到的明暗信息。

光度学中的 Luminance 可以写成：

$$  
L_v = 683 \int L_{e,\lambda}(\lambda)V(\lambda)\,d\lambda  
$$

  

所以可以把整个关系理解成：

$$  
\text{Spectral Radiance} \rightarrow \begin{cases} X & \bar{x}(\lambda)\text{ 加权}\\ Y & \bar{y}(\lambda)\text{ 加权}\\ Z & \bar{z}(\lambda)\text{ 加权} \end{cases}  
$$

  

而 Photometry 所关心的亮度信息，本质上正对应其中的 Y 方向。
 
# Metamerism 现象

不同的Spectral radiance 可能最终转化 相同的 XYZ 使得人感知起来相同 

https://en.wikipedia.org/wiki/Metamerism_%28color%29


---
参考文章：

[Youngdo-Radiometry & Photometry](https://leeyngdo.github.io/blog/computer-graphics/2024-03-13-radiometry-and-photometry/?utm_source=chatgpt.com)

[Radiometry, part 1: I got it backwards](https://momentsingraphics.de/Radiometry1Backwards.html)
[Radiometry, part 2: Spectra and photometry](https://momentsingraphics.de/Radiometry2Photometry.html?utm_source=chatgpt.com)

[radiometry-versus-photometry](https://www.reedbeta.com/blog/radiometry-versus-photometry/?utm_source=chatgpt.com)