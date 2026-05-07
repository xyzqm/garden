---
title: "IOI 2020: Stations"
---
You can find the problem [here](https://qoj.ac/problem/1139).
## Statement

This is a two-pass problem. 

In the first pass, you are given an undirected tree with $n$ nodes, and you may relabel these nodes however you like; the only constraint is that all labels must be distinct. 

In the second pass, you must implement a procedure that takes the following inputs:
- $s$, a source node
- $L$, the labels of the nodes directly adjacent to $s$
- $t$, a destination node
And returns the unique label $l$ in $L$ such that $l$ lies on the path from $s$ to $t$. In words, you must be able to route $s$ to $t$ with only the knowledge of adjacent labels at each step.

In order to earn full points, we must only use labels $0...n - 1$. 

## Solution

This essentially means that for an edge $(s, l)$, using only the numbers $s$, $l$, and $L$, we must be able to determine which nodes lie on the other side of this edge (i.e. closer to $l$). A natural way to do so is by assigning each subtree to a *range* of values. 

#fragment

You can find my code [here](https://qoj.ac/submission/2293059).