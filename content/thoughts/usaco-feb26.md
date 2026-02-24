---
title: "USACO 2026: Third Contest"
tags:
  - cs
---
## Problem 2

Let's relax the problem constraints a bit: in one operation, we may decrement any subarray of length 1, 2, or 3, provided that all elements in that subarray are positive. Evidently, this is a superset of the configurations allowed by the original problem. However, the nice thing about this rephrasing is that order of operations no longer matters. 

We will first find an optimal solution under these conditions, then show that it's still a valid solution under the original conditions.

### Relaxed Setting (Solution 1)

First, consider the leftmost element $a_0$. If $a_0 > a_1$, we have to decrement the subarray $[0, 0]$ at least $a_0 - a_1$ times, so let's just do these operations first. We now have $a_0 <= a_1$.

Next, observe that we should never decrement subarray $[0, 0]$ again. This is due to the following lemma:

> [!note] Lemma 1
> Decreasing $a_0$ can never increase the required number of operations.

**Proof:** First, note that this is not generally true for any $a_i$. For instance, if $a = [3, 3, 3]$, decrementing $a_1$ would result in more operations.

However, $a_0$ is special because it is at the border of the array. Consider an optimal solution for the original array, and run the same sequence of operations on the new array. If a previously-valid operation containing $a_0$ now operates in a state with $a_0 = 0$, there are two cases:
1. This operation is $[0, 0]$. Then, we can just discard it.
2. This operation is $[0, 1]$ or $[0, 2]$. Then, we can replace it with $[1, 2]$ or $[2, 2]$ respectively.

Therefore, the new number of required operations is less than or equal to the original number.

---

Therefore, we will now only decrement subarrays $[0, 1]$ and $[0, 2]$. This also means that the final value of $a_1$ is fixed at $a_1 - a_0$, while $a_2$ could be any value in the range $[a_2 - a_0, a_2] union NN_0$. 
Here is the crucial lemma:

> [!note] Lemma 2
> - If $a_0 < a_1$, decreasing $a_1$ can never increase the number of operations.
> - If $a_0 > a_1$, increasing $a_1$  can never increase the number of operations.

**Proof**: First, consider $a_0 <= a_1$. Because order of operations doesn't matter, rearrange operations such that all that apply to $a_0$ are executed first. Each of these operations maintains the condition that $a_0 <= a_1$, therefore they will always be valid. Afterward, we have $a = [0, a_1 - a_0, ...]$, and by Lemma 1 we get our desired result.

On the flip side, consider $a_0 >= a_1$. Note that we will have to decrement $[0, 0]$ $a_0 - a_1$ times. Therefore, we can always repurpose some of these to $[0, 1]$ while maintaining the same number of operations.

---
In other words, $a_0 = a_1$ is a kind of "global minimum" that we should be aiming toward.

Therefore, our strategy is the following:
```
while a[0] > 0:
	if a[0] > a[1]: decrement [0, 0]
	else if a[1] > a[2]: decrement [0, 1]
	else decrement [0, 2]

proceed with a[1..n]
```

We will now show how we can achieve this lower-bound strategy in the original setting.

### Relaxed Setting (Solution 2)

This idea is thanks to Benjamin Qi.

The key idea is to maintain a list of extendable intervals at each index, then greedily process from left to right. When we pop intervals, we should pop the longer ones before the shorter ones.

### Original Setting

We can operate all subarrays of length 3, then subarrays of length 2 from left to right, then subarrays of length 1. This works because there should never be adjacent subarrays of length 1 and 2 or of length 1 and 1, otherwise our assumption of optimality would be contradicted.

In itself, this approach doesn't guarantee $n$ operations. However, we can show that if we shift all operations on a given index to the last time it's ever operated, the solution will still be valid. Therefore, any valid solution can be transformed into one which requires $<= n$ runs.

## Problem 3

First, we find that each index is constrained to be within some interval based on the min and max constraints. If it is only constrained from one side, we may as well set this value to that constraint in order to satisfy it. Else, we have two choices per index for which constraint to satisfy. If these two constraints are $u$ and $v$, we can draw an undirected edge from $u$ to $v$. Then, our problem reduces to the following:

> [!note] Main Problem
> Given an undirected graph, direct the edges such that each node has an in-degree of at least 1.

Moreover, it turns out the the following algorithm always works:
```
while there exists a node with 0 in-degree:
	select one such node with minimal undirected-degree
	if undirected-degree = 0: matching impossible
	else: direct any incident undirected edge toward this node
```

**Proof:** Evidently, it is necessary that within each connected component, there are at least as many edges and vertices. We will now show that our above algorithm will always maintain this property.

There are two cases:
1. The edge we direct toward node $u$ is not a bridge. Then, we have decreased both edge and vertex count by 1, so the property still holds.
2. The edge we direct toward node $u$ is a bridge. If $u$ was a leaf, this is clearly fine. Otherwise, $u$ has at least degree 2, which means all other nodes also have at least degree 2. Therefore, after deleting this edge, at most one node has degree 1. Any CC that consists only of degree 2 nodes must satisfy $2("# of edges") = sum "deg"_i >= 2n => "# of edges" >= n$. Therefore, we only need to care about the CC containing the degree 1 node. $sum deg_i$ is definitely at least $2n - 1$, but since it has to be even, it must be at least $2n$. Therefore, our desired inequality still holds.