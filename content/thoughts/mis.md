---
title: MIS (最大权独立集问题)
tags:
  - trees
  - dp
---
You are given a binary tree with weighted nodes. Operating on edge $(u, v)$ swaps $w_u$ and $w_v$ for cost $w_u + w_v$. You must operate on every edge exactly once, but you can freely determine the order. Find the minimum achievable cost. (https://qoj.ac/problem/4054)

First, observe that the left and right subtrees of a node are *almost* independent. Any configuration in which edges from the two subtrees are interleaved can be shown to be equivalent to one of two cases:
1. All edges in the left subtree are operated before any edge in the right subtree.
2. All edges in the right subtree are operated before any edge in the left subtree.

Assume WLOG that we operate the left subtree first, and let our root node be $u$. Then, for the left subtree, we only care about two things:
1. which node $x$ node $u$ ends up in
2. which node $v$ from the left subtree ends up in position $u$

Then, we can plug $v$ into the right subtree and minimize. This yields a pretty simple $cal(O)(n^3)$ solution, where `dp[u][x][y]` represents the minimum cost to delete all edges in the subtree of $u$, while moving $"fa"(u)$ to $x$ and moving $y$ to $"fa"(u)$.  

An important observation from here is to notice that $x$ and $y$ must satisfy $"lca"(x, y) = u$, otherwise it's surely impossible. This immediately reduces our number of states to only $cal(O)(n^2)$.  To optimize our runtime to also be $cal(O)(n^2)$, note that we can optimize dimensions incrementally, rather than all at once.

For instance, consider the case where our operation order is $("fa"(u), u)$, then left subtree, then right subtree.

![[Pasted image 20251229221554.png]]

In step 2 (out of 3), since we don't care about where $"fa"(u)$ settles, we can precompute `from_l[x]` as the minimum cost to freely place $u$ in the left while moving $x$ (the green node) to $u$. We can show that in total over all $u$, this step takes only $O(n^2)$ time. Similar pre-computation can be applied in other cases, leading to a overall runtime of $cal(O)(n^2)$.

My submission: https://qoj.ac/submission/1878265
