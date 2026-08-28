---
description: Some notes on an interesting combinatorial operation.
---
The **falling factorial** $(n)_k$ is defined as
$$
n(n - 1)(n - 2)...(n - k + 1)
$$

When $n$ is a non-negative integer, we can interpret $(n)_k$ combinatorially as the number of ways to select and order $k$ elements from an $n$-element set. For instance, when $n = 3$ and $k = 2$, we have $(3)_2 = 6$ ways to select and order two elements from ${1, 2, 3}$:
1. $[1, 2]$
2. $[2, 1]$
3. $[1, 3]$
4. $[3, 1]$
5. $[2, 3]$
6. $[3, 2]$

## Discrete calculus

Falling factorials $(n)_k$ provide a nice discrete analogue to the power functions $x^k$. In particular, consider the difference
$$
Delta (n)_k &= (n + 1)_k - (n)_k \
&= ((n + 1)/(n - k + 1) - 1) (n)_k \
&= k/(n - k + 1)dot (n)_k \
&= k dot (n)_(k - 1),
$$

just like how
$$
dif/(dif x) x^k = k x^(k - 1).
$$

We can also interpret the identity
$$
(n + 1)_k - (n)_k = k dot (n)_(k - 1)
$$
from a combinatorial perspective. If we have $(n + 1)$ balls, $(n + 1)_k$ denotes the number of ways to select and permute $k$ of them, while $(n)_k$ represents the same quantity but *restricted only to the first $n$ balls.* Therefore, the selections that are included by the former but not the latter are precisely those that include the $(n + 1)$st ball. 

To count the number of selections that contain the $(n + 1)$st ball, we note that we may first select and order $k - 1$ other balls among the first $n$, then place the $(n + 1)$st ball at any position among them. This results in $(n)_(k - 1) dot k$ ways, as desired.

![[Pasted image 20260827171029.png|529]]

## Stirling numbers

```problem
How can we express $n^k$ as a weighted sum of falling factorials $(n)_k, (n)_(k - 1), ..., (n)_1$? 
```
For instance, we may express $n^2 = (n)_2 + (n)_1$ or $n^3 = (n)_3 + 3 (n)_2 + (n)_1$, but how does this generalize?

Again, we offer a combinatorial interpretation. Imagine $n^k$ as the number of ways to assign each label from $1$ to $k$ to exactly one of $n$ balls; one ball could be labelled multiple times or not at all.

We now decompose $n^k$ into cases based on how many balls have at least one label. For instance, when $k = 3$:
1. If we want all balls labelled, there are exactly $(n)_k = (n)_3$ ways by definition.
2. If we want two balls labelled, we may first pick and order the balls in $(n)_2$ ways. We must then distribute the 3 labels into 2 indistinguishable, non-empty sets, and the number of ways to do this is precisely the [[Sterling numbers|Sterling number]] $S(n, 2)$. Thus, the number of labellings that lead to exactly $2$ labelled balls is $(n)_2 dot S(3, 2)$.
3. By the same logic, there are exactly $(n)_3 dot S(3, 3)$ ways to label $3$ distinct balls.

So in general, we have that
$$
n^k &= (n)_k dot S(k, k) + (n)_(k - 1) dot S(k, k - 1) + (n)_(k - 2) dot S(k, k - 2) + ... + (n)_1 dot S(k, 1) \
&= sum_(i = 1)^k (n)_i dot S(k, i)
$$

```problem
Four people each call one of four technicians, independently and uniformly at random. What's the probability that exactly $i$ distinct technicians are called, for $i = 1, 2, 3, 4$?
```

We decompose 
$$
4^4 &= S(4, 4) dot (4)_4 + S(4, 3) dot (4)_3 + S(4, 2) dot (4)_2 + S(4, 1) dot (4)_1 \
&= (4)_4 + 6 dot (4)_3 + 7 dot (4)_2 + (4)_1
$$

Note that per our argument above, each of these summands correspond to one of our desired cases:
- There are $(4)_4 = 24$ ways for $i = 4$ technicians to be called.
- There are $6 dot (4)_3 = 144$ ways for $i = 3$ technicians to be called.
- There are $7 dot (4)_2 = 84$ ways for $i = 2$ technicians to be called.
- There are $(4)_1 = 4$ ways for $i = 1$ technician to be called.

