---
layout: default
title: 为什么指数分布里会出现 N(x) 和 lambda x
parent: 概率论学习札记
grand_parent: 概率论
nav_order: 5
mathjax: true
---
# 为什么指数分布里会出现 N(x) 和 lambda x

## 触发问题

学习指数分布时，为了解释等待时间 $X$ 的来源，引入了：

$$
N(x)\sim \operatorname{Poisson}(\lambda x)
$$

这里真正卡住的地方不是指数分布公式本身，而是：

- $N(x)$ 是什么？为什么突然出现？
- 为什么它服从泊松分布？
- 泊松分布的参数为什么是 $\lambda x$，而不是别的东西？
- 如果还没学数学期望，能不能不用“平均发生次数”来解释？

这些问题很重要，因为指数分布不是凭空给出一个密度，而是从“随机事件到来”和“等待第一次发生”自然建模出来的。

## 需要的泊松分布前提

这里不是要重新学习泊松分布，只是为了让后面的叙述顺起来，先放上最少需要的背景。

泊松分布用来描述某个固定时间、空间或范围内，事件发生了几次。若随机变量 $Y$ 服从参数为 $\mu$ 的泊松分布，记作：

$$
Y\sim \operatorname{Poisson}(\mu)
$$

它的分布律是：

$$
P(Y=k)=\frac{\mu^k}{k!}e^{-\mu},\quad k=0,1,2,\dots
$$

后面真正要用到的只是 $k=0$ 的情况：

$$
P(Y=0)=e^{-\mu}
$$

也就是说，如果一段时间内的事件发生次数服从泊松分布，那么“这段时间内一次都没有发生”的概率可以直接写出来。

## N(x) 是什么

$$
N(x)
$$

表示从时间 $0$ 到时间 $x$ 这段时间内，事件发生的次数。

例如研究公交车到站：

$$
N(10)=\text{未来 10 分钟内公交车到站的次数}
$$

它可能等于 $0,1,2,\dots$，所以 $N(x)$ 是一个随机变量。

引入 $N(x)$ 是为了把“等待时间问题”和“计数问题”连接起来。若

$$
X=\text{等待第一次事件发生的时间}
$$

那么

$$
X>x
$$

表示等了 $x$ 时间还没有等到第一次事件。也就是说，在前 $x$ 时间内事件发生了 $0$ 次：

$$
X>x \quad \Longleftrightarrow \quad N(x)=0
$$

所以：

$$
P(X>x)=P(N(x)=0)
$$

这就是 $N(x)$ 出现的原因。

## lambda x 从哪里来

暂时不使用数学期望，只把 $\lambda$ 理解成“单位时间内的发生强度”：

在非常短的时间 $\Delta t$ 内，事件发生一次的概率近似为

$$
P(\text{发生一次})\approx \lambda \Delta t
$$

同时假设：

- 不同小时间段内事件是否发生近似独立；
- 小时间段足够短时，发生两次及以上的概率可以忽略；
- 事件发生规律在时间上稳定，$\lambda$ 不随时间改变。

现在把长度为 $x$ 的时间切成 $n$ 个小段：

$$
\Delta t=\frac{x}{n}
$$

每个小段中发生一次的概率近似为：

$$
p_n=\lambda \Delta t=\frac{\lambda x}{n}
$$

于是 $N(x)$ 可以近似看成 $n$ 个小段中“发生事件”的小段数：

$$
N(x)\approx B\left(n,\frac{\lambda x}{n}\right)
$$

这里的 $\lambda x$ 来自：

$$
\lambda \cdot x
$$

也就是“单位时间的发生强度”乘以“观察的时间长度”。

## 简单证明

由二项分布近似：

$$
P(N(x)=k)
\approx
C_n^k
\left(\frac{\lambda x}{n}\right)^k
\left(1-\frac{\lambda x}{n}\right)^{n-k}
$$

当 $n\to\infty$，时间切得越来越细时，利用泊松极限定理：

$$
B\left(n,\frac{\lambda x}{n}\right)
\to
\operatorname{Poisson}(\lambda x)
$$

这里的“泊松极限定理”不是一个全新的想法。它和札记《泊松分布公式是怎么来的》里用过的思路是同一件事：二项分布在“次数很多、单次概率很小、总强度保持固定”时趋近于泊松分布。

区别只是这里固定下来的总强度是：

$$
\lambda x
$$

因为我们观察的是长度为 $x$ 的时间段。

于是：

$$
P(N(x)=k)
=
\frac{(\lambda x)^k}{k!}e^{-\lambda x}
$$

所以：

$$
N(x)\sim \operatorname{Poisson}(\lambda x)
$$

特别地：

$$
P(N(x)=0)=e^{-\lambda x}
$$

而因为

$$
P(X>x)=P(N(x)=0)
$$

所以：

$$
P(X>x)=e^{-\lambda x}
$$

从而：

$$
F(x)=P(X\le x)=1-e^{-\lambda x}
$$

对分布函数求导，得到指数分布的密度：

$$
f(x)=\lambda e^{-\lambda x},\qquad x\ge 0
$$

## 现在先记住

这次先不急着从数学期望角度理解 $\lambda x$。目前更适合记住这条建模链：

$$
\text{短时间发生概率约为 }\lambda\Delta t
$$

$$
\Downarrow
$$

$$
\text{总时间 }x\text{ 被切成很多小段}
$$

$$
\Downarrow
$$

$$
N(x)\approx B\left(n,\frac{\lambda x}{n}\right)
$$

$$
\Downarrow
$$

$$
N(x)\sim \operatorname{Poisson}(\lambda x)
$$

$$
\Downarrow
$$

$$
P(X>x)=P(N(x)=0)=e^{-\lambda x}
$$

等学完数学期望后，可以再回来看：泊松分布参数 $\lambda x$ 同时也是这段时间内的平均发生次数。那时对 $\lambda$ 的理解会更完整。
