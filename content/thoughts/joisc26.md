---
title: JOISC 2026
tags:
  - joi
  - cs
  - contests
---
## Baker

first, consider how to solve for baker 1. let's say the currently active orders are at times $t_1, t_2,...,t_n$in increasing order. first, note that if we want to fulfill all $n$ orders, it is both necessary and sufficient that $t_i >= i$ for all $i$. from this, it follows that the maximum number of orders we can fulfill is $n + min(t_i - i)$. 

in general, baker $k$ can fulfill 
$$
n + floor(min(t_i - k i) / k)
$$
orders. we can see this problem as finding the minimum of lines $t_i - i x$  at $x = k$. for general queries, note that the active set of indices for a given query is always a contiguous range. therefore the problem reduces to the following:
> we are given a collection of lines where line $i$ has slope $i$. for $q$ queries $(l, r, k)$, find the minimum of $f(k)$ among lines $[l, r]$. 

this can be solved with divide and conquer in $cal(O)((q + m) log m)$ time by noting that the lines are already sorted by slope, and therefore convex hull can be run in linear time.

https://qoj.ac/submission/2189261
