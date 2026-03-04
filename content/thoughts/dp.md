---
title: Dynamic programming
tags:
  - dp
---
At its core, **dynamic programming** (DP) is about *information compression.* Consider a classic DP problem:
> [!note] Problem: Shortest Paths
> Given a weighted undirected graph with non-negative edge weights, find the shortest path from node $1$ to node $n$.

A simple naive algorithm for this problem would be to enumerate all possible paths in the graph and take the minimum length among these. Clearly, this is intractable. However, note that we only care about the *lengths* of the paths and not which specific edges are taken. This means that in the end, we only care about $n$ pieces of information: what the closest node is, what the second closest node is...what the $n$-th closest node is. When weights are non-negative, these can computed via Djikstra's in $cal(O)(n^2)$.

To illustrate further, consider another example:
> [!note] Problem: Palindrome Paths
> Given an undirected graph in which each edge is labelled by a character, determine whether there exists a palindromic path between nodes $1$ and $n$. 

We can try a similar information compression strategy and let `works[s][t]` denote whether there exists a palindromic path between nodes `s` and `t`. Then,  

