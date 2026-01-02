---
title: Tree MEX (树的价值）
tags:
  - trees
  - dp
---
## Statement
You are given a rooted tree with $n <= 8000$ nodes and height $m <= 800$. Assign integer $w_i$ to every node such that the *value* of the tree is maximized, where value is defined as  
$$
sum_u limits(op("mex"))_(v in S_u) space w_v 
$$
and $S_u$ denotes the nodes in the subtree of $u$. (https://qoj.ac/contest/2669/problem/15459)

## Solution
### $cal(O)(n^3)$

The simplest DP state is to let `dp[u][m][f]` denote the maximum value of subtree $u$ given that the MEX of this subtree is $m$ and there are $f$ "free" values that don't contribute to any mex.

```tikz
\begin{document}
\begin{tikzpicture}[
  every node/.style = {circle, draw, minimum size=1cm, align=center},
  level 1/.style={sibling distance=3cm, level distance=2.5cm}
]

% Root node
\node {1 \\ (w=3)}
  child { node {2 \\ (w=0)} }
  child { node {3 \\ (w=1)} }
  child { node {4 \\ (w=2)} };

\end{tikzpicture}
\end{document}
```

For instance, consider the above tree. The $(m, f)$ states of subtrees 2, 3, and 4 are $(1, 0)$, $(0, 1)$, and $(0, 1)$ respectively. When we combine these three states along with the $(0, 1)$ state of our root, the new resultant state is $(max(1, 0, 0, 0), 0 + 1 + 1 + 1) = (1, 3)$. Then, we can use the $3$ free values $w_1, w_3, w_4$ to increase the mex of our subtree, leading to a final state of $(4, 0)$. 

Therefore, the most naive method of transitioning is essentially a convolution where $(m_1, f_1) + (m_2, f_2) = (max(m_1, m_2), f_1 + f_2)$. Then, we can use some of our free values to increase our mex: that is, $(m, f)$ transitions to $(m + k, f - k)$.  

Naively implementing this is very slow, but we can actually speed this DP up to $O(n^3)$ by simply transitioning $(m_1, f_1) + (m_2, f_2)$ to both $(m_1, f_1 + f_2)$ and $(m_2, f_1 + f_2)$. This corresponds to fixing one subtree to provide the maximum MEX and ignoring the MEX of the rest, which allows for our transitions to be optimized via pre-computation. For more details, see my implementation [here](https://qoj.ac/submission/1879632).

### $cal(O)(n m^2)$

It seems like the most difficult decision to make in our DP is picking which subtree to provide the maximum MEX. Let's consider fixing our choices for every node first, then optimizing based on that. For each node, we will draw a *red edge* to the child subtree with the maximum MEX.

![[Pasted image 20260101225300.png|bg-white]]

As described in our $cal(O)(n^3)$ DP, if $v$ is the red child of $u$, $"mex"_u = "mex"_v + |F_u|$, where $F_u$ is the set of nodes consumed by $u$ to increase its MEX. For instance, in the first tree shown, $F_1 = {1, 3, 4}$, $F_2 = {2}$, and $F_3 = F_4 = {}$.  If $v$ is in $F_u$, we will refer to node $v$ as a *stepping stone* for node $u$.

Since we've fixed the red edges, our job is now to decide the $F$ sets. To do this, we analyze the contribution of each individual node. Consider node 16. It can used as a stepping stone for any of its ancestors (including itself), so which one should we pick? 

Note that if we choose to use node 16 as a stepping stone for node 10, it will not only increment $"mex"_10$, but also $"mex"_9$, $"mex"_8$, and $"mex"_7$, since they connect to node 10 via red edges. Therefore, if 16 is placed in $F_10$, it will have a contribution of $+4$. In comparison, placing it in $F_3$ only contributes $+3$, and placing it in $F_11$ or $F_16$ only contributes $+1$.

We can thus define a new DP state: `dp[u][mx][len]` denotes the maximum possible value of subtree $u$ given that node $u$ can contribute a maximum of $+"mx"$ and is at the end of a red chain with $"len"$ nodes. For instance, node $8$ in the above diagram would be in the state `dp[8][3][2]`. The 3 represents that node $8$ can have contribution $+3$ by becoming a stepping stone for node $3$, and the $2$ represents the current length of node $8$'s chain (consisting of nodes $7$ and $8$). Transitions are left as an exercise to the reader.

### $cal(O)(n m)$

A good thing about reformulating our DP in this way is that it admits an important greedy observation. Let $u$ be a blue child (e.g. node 7 or 15 in above diagram), and `mx` be its maximum possible contribution (same as our DP above). Then, one of the following two conditions must be true:
1. *All* red chains in the subtree of $u$ have no more than `mx` nodes.
2. The red chain rooted at $u$ has more than `mx` nodes.

To prove this, consider the case where the red chain rooted at $u$ has fewer than `mx` nodes, but one of its children starts a chain with more than `mx` nodes. Then, it's never less optimal to simply connect this child to node $u$ instead.
