---
title: The exponential
tags:
  - math
  - combinatorics
---
The exponential distribution is defined such that it's growth rate at any instant is equal to its value. It's also well known that $exp(x) = sum x^k/k!$. There's a nice combinatorial way to connect these two definitions:

First, consider the discrete version of $exp(x)$, $2^x$. We can find $2^x$ by the following process: let $S_(-1)$ be ${{}}$ (that is, an empty set of sets). Then, define $S_i$ for $i >= 0$ to be $S_-1 union {s union i | s in S}$. That is, we take every set from $S_(i - 1)$, then decide whether to add $i$ into it or not. Here a few values of $S_i$:
- $S_(-1) = {{}}$
- $S_0 = {{}, {0}}$
- $S_1 = {{}, {0}, {1}, {0, 1}}$

We can see how this simulates a growth rate equal to value, since clearly, $|S_(i + 1) - S_i| = |S_i|$. Therefore, $|S_i| = 2^i$ as desired.
However, $S_i$ is also just the number of ways to select a subset of the integers in $[0, i]$. How can we express this in a continuous fashion?

Loosely speaking, the "number of ways" to select $k$ numbers in the range $[0, x]$ should just be $x^k/k!$ (since in the continuous case, there is 0 chance of picking two equal numbers). Therefore, summing over all possible values of $k$, we arrive at our desired expression. 

Let's formalize "number of ways." Note that instead of $|S_(i + 1) - S_i| = |S_i|$, we now want $|S_(x + dif x) - S_x| = |S_x| dif x$. This means we need to slightly redefine $|S_i|$. Currently, it's simply defined as the number of sets in $S_i$, or $sum_(s in S_i) 1$, but instead we want
$$
|S_i| = sum_(s in S_i) (dif x)^(|s|)
$$
It can be shown that under this definition, the loose argument made above can be made precise.

