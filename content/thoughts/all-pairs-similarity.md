---
title: All Pairs Similarity
tags:
  - bitmasks
  - sos
---
This is a pretty traditional SOS problem. We only care about two values, intersection and union.
We can have one of these as a DP dimension, and sum the other value over it. In my code, I have union as the DP dimension, and sum intersection over it.

[Implementation](https://github.com/xyzqm/cp/tree/main/USACO/12-24)

[Problem Source](https://usaco.org/index.php?page=viewproblem2&cpid=1452)