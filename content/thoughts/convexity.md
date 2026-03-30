---
title: Convexity
tags:
  - cs
  - math
  - greedy
  - convex
---
Convexity often arises naturally in many "intuitively" greedy problems. We'll first give some examples, then go over typical strategies for proving convexity, as well as how to take advantage of it.
## Examples

> You are given an array $a$ of $n$ integers. Select $k$ distinct indices such that the sum of $a_i$ at those indices is minimized.

It's not difficult to see that the answer is convex in $k$.

>  You are given an array of length $n$. If you place exactly $i$ tiles of length $k$ without overlap, what's the maximum sum of values that can be covered? ([AtCoder](https://atcoder.jp/contests/abc383/tasks/abc383_g))


