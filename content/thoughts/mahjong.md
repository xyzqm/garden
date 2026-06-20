---
title: "M(IT)^2 2025: Mahjong"
tags:
  - constructive
  - graphs
  - trees
---
We will define a procedure to pair the nodes of a rooted tree such that every node is paired if the tree size is even, and otherwise exactly one node is left unpaired, whose orientation relative to the root we can freely choose.

Root the tree at node $x$ and recursively apply this procedure to the subtrees of $x$. For an odd subtree rooted at $u$, we choose to keep the node $v$ in that subtree such that $v$, $u$, and $x$ lie on the same line (which, by our induction, is always possible).

From here, we can pair as many $0$ edges with each other as possible, and also as many $1$s as possible. In the end, we are left with at most one of each edge. If we only have one edge, we can just delete both nodes. Otherwise, we have one of each, so we can freely choose direction. Thus, our induction hypothesis is satisfied.