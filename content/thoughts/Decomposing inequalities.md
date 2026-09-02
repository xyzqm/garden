---
draft: true
---
Let $x in R_(>= 0)^n$ be a set of $n$ non-negative real numbers, and let $f(x)$ and $g(x)$ be linear combinations of terms of the form $max(S)$ or $min(S)$ where $S$ is some subset of $x$.

For instance, $f$ could be $max(x_0, x_2, x_3) + 3 min(x_1, x_2)$.

The goal is to maximize $f(x)/g(x)$ over all possible vectors $x$. However, the critical observation is that we only need to consider $x$ where each entry is either $0$ or $1$.

There are a few ways to go about proving this, but one is to do a "layer-cake" decomposition of the numerator and denominator. Let $S_t$ denote the subset of elements in $x$ such that $x_i <= t$ (e.g. if $x = (0, 2, 1)$, $S_1 = (1, 0, 1)$ and $S_2 = (1, 1, 1)$). Then, we can rewrite $f(x)$ as 
$$
integral_0^oo f(S_t) dif t
$$
and $g(x)$ in the same fashion. However, the mediant inequality also tells us that
$$
(integral_0^oo f(S_t) dif t)/(integral_0^oo g(S_t) dif t) <= max_t f(S_t)/g(S_t)
$$

Moreover, all $S_t$ are themselves valid values for $x$, and hence we only need to consider the case when all $x_i in {0, 1}$, as desired.