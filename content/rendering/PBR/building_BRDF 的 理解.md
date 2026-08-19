
BRDF 要描述的是：

> 表面接收到一份入射能量后，把它以多高的“方向密度”分配到某个出射方向。

于是 BRDF 定义为：

$$
 f_r(\omega_o,\omega_i) = \frac{dL_o(\omega_o)}{dE_i(\omega_i)} 
$$

其单位自然是：

$$
 [f_r] = \frac{\mathrm{W/(m^2\,sr)}}{\mathrm{W/m^2}} = \mathrm{sr}^{-1} 
$$

这正好表明 BRDF 是一个关于出射方向的分布密度。