---
title: Flow
tags:
  - flows
  - cs
---
Under construction, check back soon!

https://theory.stanford.edu/~trevisan/cs261/lecture15.pdf (MCMF LP duality)
- first, note that we can prove by duality that any fractional flow <= any fractional cut
- so now it remains to show that the minimum fractional cut is precisely the minimum integer cut

interpret $y_(u, v)$ as edge-weights and find shortest path from $s$ to node $v$ as $d(v)$.

first, note that $d(t) >= 1$ by min-cut assumption (and this is equivalent).

now, consider all possible cuts $A(T) := {v : d(v) <= T}$. we will show that there exists some value of T in [0, 1\)$ such that $"capacity"(A) <= sum c(u,v) y_(u,v)$. 

consider $EE_T "capacity"(A(T))$. by linearity, the contribution of each edge to this expectation is precisely $c_(u, v) y_(u, v)$. therefore $EE = "desired quantity"$, which means there must exist some $T$ such that $A(T) <= "desired quantity"$.  

Karger's randomized algorithm for min-cut:
https://theory.stanford.edu/~trevisan/cs261/lecture13.pdf
https://en.wikipedia.org/wiki/Karger%27s_algorithm
