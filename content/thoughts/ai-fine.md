---
title: "2187F: AI Fine (Maximize)"
tags:
  - trees
---
first, reshuffle indices so $a = 1...n$

for each $b_i$, want to find largest subarray such that it's some prefix of indices

for instance $b = [5, 1, 4, 2, 3]$

segments $[1...3]$, $[2...3]$, $[3...3]$ (this is the maximum)

can be done by querying smallest empty value