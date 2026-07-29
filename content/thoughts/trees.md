---
title: Trees
tags:
  - trees
  - cs
  - math
draft: true
---
Trees have many special properties that make them ubiquitous in competitive programming. Here are a few of those special properties, along with examples of how each can be exploited.

## Unique (simple) paths
- tree queries?
- also every edge is a bridge -> admits DP

## Minimum connectivity
- talk about mahjong
## 1-orientability

An undirected graph is $1$-orientable if it is possible to direct the edges such that each node has an out-degree of at most $1$. This is the class of all pseudo-forests, which also includes trees. For a tree, an easy way to construct such an orientation is to simply direct all edges toward an arbitrary root.

Here's a problem for which this property is useful:

> You are given a tree on $n$ nodes, and each node initially has $1$ person. For every day $i$, each person can choose to either stay in their current position or move to an adjacent node. Then, $k_i$ nodes will be bombarded, meaning everyone currently on those nodes will die.
> Find the maximum number of survivors after all $m$ days have passed.
> 
> You must solve the problem in $cal(O)(n + m + sum k_i)$.  

Let's consider running the process in reverse. It turns out to be equivalent to the following:
1. Initialize all nodes to be white.
2. In step $i$, mark $k_(m - i)$ nodes red. Then, for each red node with at least one adjacent white node, mark it white.
3. Repeat `2` for $m$ steps.

The final answer is the total number of white nodes.

Let's refer to the recoloring of any node as a *toggle*. Note that the total number of toggles is bounded by $sum k_i$. Therefore, our goal is to do a constant amount of processing per toggle.

We need to support the following two operations:
1. Toggle a node to red.
2. Simultaneously toggle all red nodes with an adjacent white node to white.

For the second case, note that we can split each toggled red node into two cases:
1. Its parent was white.
2. One of its children was white.

Maintaining the number of white children for each node is easy and only requires $cal(O)(1)$ time per toggle. For the first type, whenever a node becomes red, we can consider "hooking in" (to use React terminology) to the event that the parent becomes white. Because each node has only one parent, we only need to hook into one event per toggle to red.

Actually, this idea can be generalized to arbitrary graphs. For a $K$-orientable graph, we can apply the same idea to get a final complexity of $cal(O)(K dot.op sum k_i)$. In particular, graphs with only $m$ edges are $sqrt(m)$-orientable (e.g. by orienting all edges from lower to higher degree), therefore we can always achieve a complexity of $cal(O)(sqrt(m) dot sum k_i)$.

## Misc.

These are some fun tree problems that don't necessarily fit into the categories described above.

> Alice and Bob are playing a game on a tree.
> 
> The tree has $n$ nodes.  
> Each edge is assigned a distinct integer from $1$ to $n - 1$.
> 
> Initially, Alice is at node $k$, and Bob is at node $1$.  
> Alice moves first.
> 
> - In each round, **Alice** chooses the edge with the largest number among all edges incident to her current node and moves along that edge.
>     
> - If Bob is located at the node Alice is about to move to, then Alice instead chooses the edge with the **second largest** number among the incident edges.
>     
> - If such an edge does not exist, the game ends.
>     
> - After Alice moves, **Bob** may either:
>     
>     - move along one of the edges incident to his current node, or
>     - stay at his current node (he is allowed to move onto Alice’s node).
> 
> Bob wants to minimize the total number of steps taken by Alice.
> 
> Your task is to determine, assuming Bob plays optimally at every step, the **minimum total number of steps** Alice will take.

Let's call an *important state* one in which Alice and Bob are exactly one edge apart. Evidently, the game must end in an important state. We will now show that between two important states, the shortest path will never have Alice and Bob more than *two edges apart*.

Let the first important state be $(a, b)$, where $a$ and $b$ are Alice's and Bob's positions respectively. Let's root the tree at $b$, and let the next important state be $(c, d)$. Then, there are two cases to consider:
- $d$ is the parent of $c$. Evidently, the shortest path between these two states is just to move $d$ down as $c$ moves down.