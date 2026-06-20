---
title: Economic One-Way Roads
tags:
  - graphs
---
[link](https://qoj.ac/problem/3301)

a digraph is a SCC iff it has an ear decomposition

proof:
forward direction (ear decomposition $=>$ scc) is trivial
to show scc $=>$ ear decomposition, we can start with any cycle (this can be a single node)
WLOG, assume this cycle is just node $1$.
then, at each step:
let $v$ be a node not currently in our component.
Let the path $1---v---"shortest path back to CC"--- "CC"$    be the next ear.

after all nodes are added, join all remaining single edges
