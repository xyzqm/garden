---
title: "CEOI 2025: Theseus"
tags:
  - graphs
  - bounds
---
You can find the problem statement [here](https://qoj.ac/problem/14056).

First, observe that assigning a bit to every edge, in conjunction with knowing the node labels, allows us to essentially direct every edge. Now, after assigning all directions, Theseus will employ the strategy of always moving to the smallest-labeled node he can.

Our strategy for assigning directions is best illustrated by example. For this graph:
![[graph1764733312909.svg|invert]]
We want to assign directions like so:
![[graph1764733367307.svg|invert]]
First, notice that all edges between distance layers $d$ and $d + 1$ should be directed from $d + 1$ to $d$.  Thus, we only need to worry about how to orient edges within each distance layer.

Assume that all the directions for the last layer (nodes 2 and 5) have been decided as shown above. Now, we need to decide in which direction to orient the edge between $1$ and $3$. Intuitively, we should direct the edge from $1$ to $3$ because $3 -> 1$ would add an extra step to the paths of 3 nodes (3, 2, and 5) while $1 -> 3$ would only add an extra step to one node (node 1).

To formalize this intuition, consider the following graph:
![[graph1764733770969.svg|invert]]

The highlighted edges are the ones Theseus will end up taking: note that they form a **tree**, and our goal is to get the **depth** of this tree $<= C$.  Note that we will consider inter-layer edges to have length 0, and thus the above tree only has depth 1 since $2 -> 3$ and $3 -> 4$ are ignored.

This problem should sound very familiar. Indeed, the above argument for why we should choose $1 -> 3$ rather than $3 -> 1$ is actually just small-to-large DSU merging in disguise!

Before I get into the details, let me give a loose overview of what the final solution will look like.

Process the layers from furthest to closest. Within each layer, process the edges in some order (we will detail the exact order later), and direct each edge from the smaller component to the larger component. Since this is basically small-to-large DSU merging, we expect the final depth to bounded by $log n$. 

Of course, this runs into a couple issues:
1. Some edges must be "ignored" in order to maintain our tree structure, like $5 -> 3$ in the above graph. How can we guarantee that an edge will be ignored after we process it?
2. On the other hand, what if we wanted $5 -> 3$ to end up in the final tree? How do we ensure it's not overridden by some smaller edge like $5 -> 2$?
3. In order for small-to-large merging to work, edges must only be added between roots of components. This means we have to figure out a way to ignore edges containing non-roots as well.

Therefore, we must process our edges in an order such that we can safely ignore any edge that breaks the tree structure, as well as any edge that contains a non-root.

Since our strategy is always going to the smallest node, a natural choice is to order the edges in lexicographic order of $(u, v)$ where $u < v$. 

Now, let's say we are currently processing edge $(u, v)$. There are two cases to consider:
1. $u$ and $v$ are the respective roots of their components. In this case, simply direct the edge from smaller to larger component as described above. Whether this edge is $u -> v$ or $v -> u$, it is guaranteed to end up in the final tree because neither nodes $u$ nor $v$ have any outgoing edges so far (since they are both roots), and because $(u, v)$ is the lexicographically smallest unprocessed edge, it can't be overridden by any subsequent edge.
2. Either $u$ or $v$ is not a root. If $u$ is not a root, there must exist a tree-edge $u -> w$ where $w < u$. Therefore, if we orient the edge from $u$ to $v$, $u -> v$ will be safely ignored. The case where $v$ is not a root is symmetric: we simply orient the edge from $v -> u$. 

The key takeaway here is that, by introducing a priority order to the nodes based on their labels, we are able to safely ignore non-DSU edges. This strategy thus forces Theseus to use at most $log n$ extra moves, as desired.


