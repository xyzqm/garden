---
title: Minimum spanning trees
---
## Finding common MSTs
> Given two weighted, undirected graphs on $n$ nodes $G_1$ and $G_2$, is it possible to efficiently find a tree on these $n$ nodes that is an MST of both $G_1$ and $G_2$?

It turns out that we can simply construct a new graph $G$ where the weight of each edge is the sum of that edge's weights in $G_1$ and $G_2$, and find the MST on this graph. If a common MST exists, we can guarantee that this algorithm will always find it.

_Proof._ Let $W_1$, $W_2$, and $W$ denote the total weight of MSTs for $G_1$, $G_2$, and $G$ respectively. 
- Note that $W_1 + W_2 <= W$. 
- Also note that the weight of any spanning tree in $G_1$ is at least $W_1$, and similarly for $G_2$. Therefore, if we find a spanning tree $T$ with exactly $W = W_1 + W_2$, it must follow that $T$ has exactly weight $W_1$ in $G_1$ and exactly weight $W_2$ in $G_2$, since these are the minimum possible.

Here's a problem that uses this idea: [1054G - New Road Network](https://codeforces.com/contest/1054/problem/G "Mail.Ru Cup 2018 Round 1")

> [!tip]- Hint
> How can we reframe the problem as finding a simultaneous MST for $m$ graphs?

> [!note]- Solution
> For convenience we will use MST = maximum spanning tree, but all the same principles still apply.
> 
> For the $i$th community, let $G_i$ be the weighted complete graph in which edge $(u, v)$ has weight 1 if both $u$ and $v$ are in the $i$th community, and weight $0$ otherwise. Then, it is necessary and sufficient that the final tree be a MST (**maximum** spanning tree) of $G_i$. Therefore, we want to find a simultaneous MST over all $G_i$.
> 
> From here, we easily arrive at the MST solution given in the [official editorial](https://codeforces.com/blog/entry/62563) by creating a new graph that sums edge weights across all $G_i$ and finding its MST.


