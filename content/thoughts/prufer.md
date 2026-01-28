---
title: Prüfer code
tags:
  - trees
  - combo
---
might be easier to consider that the sequence actually has length $n - 1$, but it's just that the last value is always guaranteed to be $n$ so it's typically just discarded

note while constructing: a leaf always exists by pigeon-hole principle because there are $n - 1$ elements and $n$ possible values so at least one value must not appear

*Fun exercise:* you have $k$ trees in a labeled forest, each tree with size $s_i$. how many ways are there to join this forest into a single tree by adding $k - 1$ edges?

Note that in this variation, the information stored in our Prufer sequence is insufficient to reconstruct the entire tree. In particular, when we select a leaf, we only know which *component* to select but not necessarily which vertex to pick. Now note that each component is selected as a leaf exactly once, so our final answer is just
$$
product s_i dot.op n^(k - 2)
$$
