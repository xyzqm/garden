---
title: M(IT)^2 2024
---
## Combined Round

## Advanced Round

### Monitoring Beavers

fix the set of flips

if each vertex is connected by these edges to a node with initial in-degree > 1, then it's possible

proof by induction: select any edge $u ->v$ such that $v$ has in-degree > 1. what happens when we flip $u -> v$:
- if there are any edges going into $u$, $u$ has in-degree at least 2 which means all vertices that relied on edge $u -> v$ can instead use $u$ instead.
- if in-degree of $v$ is still > 1 and/or there are no other edges $w -> v$ that must be flipped, everything is fine. otherwise, there must be an edge $v -> z$ that must be flipped. therefore, paths that rely on $v$ can instead go to $z$. **how to prove that $z$ didn't depend on $v$ previously?**  i guess we have to flip all cycles first