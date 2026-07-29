---
layout: default
date: 2026-06-08
title: 2. 从 FT 到 DFT：采样、频率格子与标准公式
parent: 傅里叶
grand_parent: 数学
nav_order: 7
mathjax: true
---

# 从 FT 到 DFT：采样、频率格子与标准公式

这一篇只解决一个问题：为什么傅里叶变换会在数字世界里变成 DFT。

## FT 不能直接被计算机使用

连续傅里叶变换是：

$$
F(\omega)=\int_{-\infty}^{\infty}f(t)e^{-j\omega t}\,dt
$$

它有两个连续对象：$t$ 是连续时间，$\omega$ 是连续角频率。

计算机拿不到完整的 $f(t)$，只能拿到有限个采样值：

```text
x[0], x[1], x[2], ..., x[N-1]
```

所以从 FT 到 DFT，本质上做了两件事：

```text
时间轴：连续 → 离散
频率轴：连续 → 离散
```

## 第一步：时间采样，把积分变成黎曼和

设采样间隔为 $\Delta t$，第 $n$ 个采样时刻是 $t_n=n\Delta t$。

定义：

$$
x[n]=f(n\Delta t)
$$

把 FT 的积分近似成黎曼和：

$$
F(\omega)\approx\sum_{n=0}^{N-1}f(n\Delta t)e^{-j\omega n\Delta t}\Delta t
$$

用 $x[n]$ 替换 $f(n\Delta t)$：

$$
F(\omega)\approx\sum_{n=0}^{N-1}x[n]e^{-j\omega n\Delta t}\Delta t
$$

这里的 $\Delta t$ 就是 $dt$ 的离散版本。它没有消失，只是在标准 DFT 定义里被整体尺度吸收了。

## 第二步：只取有限个频率

观察时间为：

$$
T=N\Delta t
$$

DFT 不计算所有 $\omega$，只计算一组频率格子：

$$
\omega_k=k\Delta\omega
$$

频率间隔为：

$$
\Delta\omega=\frac{2\pi}{T}=\frac{2\pi}{N\Delta t}
$$

所以第 $k$ 个频率为：

$$
\omega_k=\frac{2\pi k}{N\Delta t}
$$

其中 $k=0,1,\dots,N-1$。

## 代入离散频率

把 $\omega_k$ 代入黎曼和：

$$
F(\omega_k)\approx\sum_{n=0}^{N-1}x[n]e^{-j\omega_k n\Delta t}\Delta t
$$

代入 $\omega_k=\frac{2\pi k}{N\Delta t}$：

$$
F(\omega_k)\approx\sum_{n=0}^{N-1}x[n]e^{-j\left(\frac{2\pi k}{N\Delta t}\right)n\Delta t}\Delta t
$$

指数里的 $\Delta t$ 抵消：

$$
F(\omega_k)\approx\Delta t\sum_{n=0}^{N-1}x[n]e^{-j2\pi kn/N}
$$

标准 DFT 定义为：

$$
X[k]=\sum_{n=0}^{N-1}x[n]e^{-j2\pi kn/N}
$$

所以：

$$
F(\omega_k)\approx\Delta t\,X[k]
$$

或者：

$$
X[k]\approx\frac{1}{\Delta t}F(\omega_k)
$$

这说明标准 DFT 不是直接等于 FT，而是和 FT 在离散频率点上的取值差一个尺度因子。

## 为什么 DFT 要写成 X[k]

FT 里的 $F(\omega)$ 仍然带着物理频率 $\omega$。DFT 里的 $X[k]$ 只表示第 $k$ 个频率格子的结果。

这是一次坐标切换：

```text
连续物理坐标：f(t), F(ω)
离散索引坐标：x[n], X[k]
```

其中 $n$ 是第几个时间采样点，$k$ 是第几个频率格子。

所以 DFT 公式里的指数：

$$
e^{-j2\pi kn/N}
$$

可以看成 FT 指数 $e^{-j\omega t}$ 的离散版本。对应关系是：

| FT | DFT | 含义 |
|---|---|---|
| $t$ | $n$ | 时间位置，从连续时间变成采样点编号 |
| $\omega$ | $k$ | 频率位置，从连续频率变成频率格编号 |
| $dt$ | $\Delta t$ | 时间微元变成采样间隔 |
| $\omega_k$ | $\frac{2\pi k}{N\Delta t}$ | 第 $k$ 个物理角频率 |
| $\omega t$ | $\frac{2\pi kn}{N}$ | 离散相位 |

## 为什么说 k 是频率格子

如果采样率 $f_s=1000Hz$，采样点数 $N=1000$，则观察时间 $T=1s$，频率分辨率为：

$$
\Delta f=\frac{f_s}{N}=1Hz
$$

DFT 的频率编号对应：

```text
k=0 → 0Hz
k=1 → 1Hz
k=2 → 2Hz
...
```

如果真实信号是 $2Hz$，能量会主要落在 $k=2$。如果真实信号是 $2.13Hz$，DFT 没有 $k=2.13$ 这个格子，只能把能量分配到附近的频率格里。

所以 $k$ 更适合理解成 frequency bin，也就是频率桶或频率格子。它不是在说“精确等于这个频率”，而是在说“这个频率区域的代表值”。

## DFT 和傅里叶级数的关系

DFT 公式是：

$$
X[k]=\sum_{n=0}^{N-1}x[n]e^{-j2\pi kn/N}
$$

反变换是：

$$
x[n]=\frac{1}{N}\sum_{k=0}^{N-1}X[k]e^{j2\pi kn/N}
$$

这和复指数傅里叶级数非常像：

$$
f_T(t)=\sum C_me^{jm\omega_0t}
$$

对应关系可以这样看：

| 傅里叶级数 | DFT | 含义 |
|---|---|---|
| $t$ | $n$ | 时间变量 |
| $m$ | $k$ | 第几个频率 |
| $\omega_0$ | $\frac{2\pi}{N}$ | 离散周期中的基本角频率 |
| $m\omega_0t$ | $\frac{2\pi kn}{N}$ | 相位 |

从数学角度看，DFT 是离散周期序列的傅里叶级数。因为 DFT 默认 $x[n]$ 会周期重复，即 $x[n+N]=x[n]$。

从工程角度看，DFT 是可计算的傅里叶变换近似。因为它来自对 FT 的时间采样和频率采样。

## 本篇核心

DFT 标准形式不是凭空来的：

$$
F(\omega)\approx\sum x[n]e^{-j\omega n\Delta t}\Delta t
$$

在频率点 $\omega_k=\frac{2\pi k}{N\Delta t}$ 上取值：

$$
F(\omega_k)\approx\Delta t\sum x[n]e^{-j2\pi kn/N}
$$

去掉整体尺度 $\Delta t$，定义：

$$
X[k]=\sum_{n=0}^{N-1}x[n]e^{-j2\pi kn/N}
$$

这就是 DFT。

所以 DFT 可以理解成：在时间上把积分变成求和，在频率上把连续频率轴变成有限个频率格子。

