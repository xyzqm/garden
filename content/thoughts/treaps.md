---
title: Treaps
tags:
  - ds
---
proof of complexity (let all values be $1...n$):
$y$ is an ancestor of $x$ iff $y$ is the lowest among all values in the range $[min(x, y), max(x, y)]$. This is with probability $1/(|y - x + 1|)$. Summing this over all $y$ for a fixed $x$ means the expected number of ancestors is just $2  (1 / 2 + 1 / 3 + 1/4 + 1/5...1/n)$,  which is $2 log n + cal(O)(1)$ 