---
title: AND PLUS OR
tags:
  - cs
  - bitmasks
---
You can find the statement [here](https://qoj.ac/problem/2554).

Let $f(i, j) = A_(i or j) - A_i - A_j + A_(i and j)$. Then, we just want to find a pair $(i, j)$ such that $f(i, j) > 0$. 

First, let's consider a different definition for $f(i, j)$ that makes this problem considerably easier to solve: $f(i, j) = A_i - A_j$. Indeed, for this choice of $f$, it suffices to only check adjacent pairs, that is, $(i, i + 1)$ and $(i, i - 1)$. The reason for this is that if $j > i + 1$, we can decompose $f(i, j)$ as $f(i, i + 1) + f(i + 1, i + 2) + ... + f(j - 1, j)$. Similar for $j < i - 1$. In other words, the set of pairs $(i, i + 1)$ and $(i, i - 1)$ **form a basis** for all possible pairs $f(i, j)$. Therefore:
1. If all basis elements have value $<= 0$, no combination of them can have value $<= 0$.
2. Otherwise, one of them has value $> 0$, so we just need to find which one it is.

Now, we can apply a transformation to our original definition of $f$ that makes the existence of such a basis more obvious. First, find the (unique) array $B_i$ such that 
$$
A_i = sum_(j ⊂ i) B_j
$$
Then, we see that
$$
f(i, j) = sum_(k subset(i or j)\ k subset.not i\ k subset.not j) B_k
$$
Or, if we let $x = i and j, y = i - x, z = j - x$, then we must pick a *non-empty subset* of both $y$ and $z$ to be in $k$, as well as a potentially empty subset of $x$.

For instance, let $x = {1}, y = {2, 3}, z = {4, 5}$. Then, some possible choices for $k$ are:
- ${2, 3, 4}$
- ${1, 2, 5}$
- ${1, 2, 3, 5}$

However, $k = {1, 2, 3}$ is not allowed because $k$ has no intersection with $z$.

Let the set of all possible $k$ be denoted as $S(x, y, z)$. For instance, the valid $k$ listed above would be members of $S({1}, {2, 3}, {4, 5})$. Then, note that we can actually break this into the union of the following smaller sets:
- $S({1}, {2}, {4})$
- $S({1, 2}, {3}, {4})$
- $S({1, 4}, {2}, {5})$
- $S({1, 2, 4}, {3}, {5})$

Essentially, we are casing on the **last elements** of both $y$ and $z$. Therefore, the set of configurations with $|y| = |z| = 1$ form a **basis** for all configurations, so we only have to check these for a total complexity of $cal(O) (2^n dot n^2)$.   