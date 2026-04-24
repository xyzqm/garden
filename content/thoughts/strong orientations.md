---
title: Strong orientations
---
Per [Wikipedia](https://en.wikipedia.org/wiki/Strong_orientation):
> In [[graph theory]], a **strong orientation** of an undirected graph is an assignment of a direction to each edge (an [orientation](https://en.wikipedia.org/wiki/Orientation_\(graph_theory\) "Orientation (graph theory)")) that makes it into a [strongly connected graph](https://en.wikipedia.org/wiki/Strongly_connected_graph "Strongly connected graph"). 

A natural question that follows: *which undirected graphs have a strong orientation?*

## Robbins' theorem

Robbins' theorem states that the set of graphs with strong orientations is precisely the set of *bridgeless* graphs.

*Lemma.* This condition is necessary (i.e. any graph with a bridge cannot have a strong orientation).

*Proof.* This picture should make the argument clear:
![[Pasted image 20260422090305.png|500]]

If the edge is directed from $S -> T$, then no node in $T$ can reach any node in $S$. Symmetric for $T -> S$.

---
We now prove the more difficult half of the theorem:

*Lemma.* This condition is sufficient (i.e. any bridgeless graph has a strong orientation).

*Proof.* Robbins' original proof of his theorem introduces a tool called [ear decomposition](https://en.wikipedia.org/wiki/Ear_decomposition) : for more on that, you can check out [this Codeforces blog](https://codeforces.com/blog/entry/80932).

Today, I'll present another approach which Wikipedia cites as [Boesch and Tindell's](https://en.wikipedia.org/wiki/Robbins%27_theorem#CITEREFBoeschTindell1980). The core claim is as follows:
> Consider a mixed graph $G$ (i.e. with both directed and undirected edges) such that every pair of nodes in $G$ can reach one another. If there exists an undirected edge $(u, v)$ in $G$ that is not a bridge, we always assign a direction to this edge such that all-pairs connectivity is preserved.

If this is true, we can direct all the edges of a bridgeless graph in any order until the entire graph is an SCC.

![[Pasted image 20260423213527.png]]

*Two examples of such mixed graphs, and the corresponding orientation (shown in blue) assigned to the edge $(u, v)$*.

*Proof of claim.* Consider the graph $G \\ {(u, v)}$ (i.e. $G$ with edge $(u, v)$ removed). We wish to show that in this graph, there always exists a path either from $u -> v$ or from $v -> u$. If the former is true, we can direct this edge from $v -> u$; otherwise, we can direct this edge from $u -> v$.

Our all-pairs connectivity condition means that all nodes $w in G$ must be reachable from $u$. This means that in $G \\ {(u, v)}$, all nodes $w$ must be reachable from *either* $u$ or $v$. By a similar line of reasoning, all nodes in $G \\ {(u, v)}$ must be able to reach either $u$ or $v$ as well. 

Therefore, all nodes $w in G \\ {(u, v)}$ fall under four categories:
1. $u => w => u$ (reachable from $u$, can reach $u$)
2. $u => w => v$ (reachable from $u$, can reach $v$)
3. $v => w => u$
4. $v => w => v$

![[Pasted image 20260422091800.png|600]]
*The four categories of nodes. Note that one node could potentially fall under multiple categories.*

Observe that if any nodes of type $2$ or $3$ exist, our claim is clearly true. Otherwise, all nodes are of either type $1$ or type $4$, but then $(u, v)$ would be a bridge which contradicts our assumption. Thus, we have proved the desired claim.

![[Pasted image 20260422092512.png|500]]
*If only type 1 and type 4 nodes exist, the graph looks something like this. The red edge cannot exist in either direction because then a type 2/3 node would exist, which contradicts our assumption.*