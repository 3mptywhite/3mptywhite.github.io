---
layout: default
title: 分布函数 CDF
parent: 概率论概念 Wiki
grand_parent: 概率论
nav_order: 18
mathjax: true
---
# 分布函数 CDF

## 一句话

分布函数描述随机变量不超过 \(x\) 的累计概率。

## 解决什么问题

它用一个函数统一描述随机变量的整个分布，并且可以用相减计算区间概率。

## 定义

\[
F_X(x)=P(X\le x)
\]

更严格地说：

\[
F_X(x)=P(\{\omega\in\Omega:X(\omega)\le x\})
\]

## 直觉

从数轴左边往右扫，扫到 \(x\) 时，已经累计了多少概率。

## 前置概念

[随机变量](./随机变量.html)、[分布](./分布.html)。

## 相关概念

[分布律 PMF](./分布律-PMF.html)、[概率密度 PDF](./概率密度-PDF.html)。

## 公式

\[
P(a<X\le b)=F_X(b)-F_X(a)
\]

离散型：

\[
F_X(x)=\sum_{x_i\le x}P(X=x_i)
\]

连续型：

\[
F_X(x)=\int_{-\infty}^{x} f_X(t)\,dt
\]

若可导：

\[
F_X'(x)=f_X(x)
\]

## 例子

若 \(X\) 是骰子点数，则：

\[
F_X(3)=P(X\le 3)=\frac36=\frac12
\]

## 常见误区

\(F_X(x)\) 不是 \(P(X=x)\)，而是 \(P(X\le x)\)。

## 来源

本地学习材料：`P(X≤x) 表达也不复杂为啥要专门 搞个 F(x) 分布函数 呢？`；当前对话。
