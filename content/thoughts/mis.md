---
title: MIS (最大权独立集问题)
tags:
  - trees
  - dp
---
## Statement
You are given a binary tree with weighted nodes. Operating on edge $(u, v)$ swaps $w_u$ and $w_v$ for cost $w_u + w_v$. Find the minimum total cost to operate on every edge exactly once, in any order. (https://qoj.ac/problem/4054)
## Solution
First, observe that the left and right subtrees of a node are *almost* independent. Any configuration in which edges from the two subtrees are interleaved can be shown to be equivalent to one of two cases:
1. All edges in the left subtree are operated before any edge in the right subtree.
2. All edges in the right subtree are operated before any edge in the left subtree.

Assume WLOG that we operate the left subtree first, and let our root node be $u$. Then, for the left subtree, we only care about two things:
1. which node $x$ node $u$ ends up in
2. which node $v$ from the left subtree ends up in position $u$

Then, we can plug $v$ into the right subtree and minimize. This yields a pretty simple $cal(O)(n^3)$ solution, where `dp[u][x][y]` represents the minimum cost to delete all edges in the subtree of $u$, while moving $"fa"(u)$ to $x$ and moving $y$ to $"fa"(u)$.  

An important observation from here is to notice that $x$ and $y$ must satisfy $"lca"(x, y) = u$, otherwise it's surely impossible. This immediately reduces the number of states to only $cal(O)(n^2)$.  To optimize our runtime to also be $cal(O)(n^2)$, note that we can optimize dimensions incrementally, rather than all at once.

For instance, consider the case where our operation order is $("fa"(u), u)$, then left subtree, then right subtree.

![[Pasted image 20251229221554.png]]

In the last step, since we care about neither where the green node ultimately settles nor what the red node is, we can precompute `into_r[x]` as the minimum cost to move $x$ (the green node) anywhere into the right subtree and get any node out. We can show that in total over all $u$, this step takes only $O(n^2)$ time. Similar pre-computation can be applied in other cases, leading to a overall runtime of $cal(O)(n^2)$.

My submission: https://qoj.ac/submission/1878265
