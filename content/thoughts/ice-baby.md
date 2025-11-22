---
title: Ice Baby
tags:
  - orders
---
Define a partial order on the ranges by the comparator $i < j and l_i > r_j$. Then, we want to find the size of the maximum _antichain_ in this partial order. By Dilworth's theorem, this is equivalent to the size of the minimum chain cover. For instance, if our ranges are $[(4, 6), (3, 5), (1, 2)]$, the maximum antichain is $[(4, 6), (3, 5)]$, and the minimum chain cover is ${[(4, 6), (1, 2)], [(3, 5)]}$. 

We can find the minimum chain cover via a simple greedy algorithm. Let's say we've found a covering $C$ of the first $i$ elements. Then, the $(i + 1)$-th element can either be added to the end of an existing chain or placed into a new one. Simulating this process with a set corresponds exactly to the solution described in [the editorial](https://codeforces.com/blog/entry/143822).