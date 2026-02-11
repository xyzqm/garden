---
title: Segment tree
tags:
  - segment-tree
---
## Iterative Segment Tree

Here is what the structure looks like for $n = 7$:

![[Pasted image 20260208131423.png | 600]]

The blue nodes shown are those which are relevant to the query $[7, 11)$. Also note that some nodes, in this case $1$ and $3$, will never be accessed. In particular:
- If a node has an odd index $i$ *and* its corresponding range can be doubled to the left,  its parent $floor(i / 2)$ will represent that doubled range.
- If a node has an even index $i$ *and* its corresponding range can be doubled to the right, its parent $floor(i / 2)$ will represent that doubled range.
- Otherwise, $floor(i / 2)$ is useless.

For instance, node $7$ corresponds to the range $[0, 1)$, which cannot be doubled to the left as it would result in the range $[-1, 1)$. Therefore, its parent, node $3$, is useless.

Similarly, node $6$ corresponds to the range $[5, 7)$ which also cannot be doubled to the right as it would result in the range $[5, 9)$, which is out of bounds of our array.

### Walking

Consider the following problem: given a range $[l, r)$ and a predicate $f$, find the smallest $m in [l, r)$ such that 
$$
f(product_(i in [l, m]) a_i) = 1
$$

where $f$ is either 0 or 1 and also *monotonically increasing* in $m$. If no such $m$ exists, return $r$. 

Consider the following algorithm:
1. Initialize $v = 1$. This is the accumulator for our partial product.
2. Let $u = l + n$. While $u$ is a left child and its parent's range does not contain $r$, set $u$ to its parent. 
3. If $f(v dot.op s_u) = 0$, where $s_u$ denotes the accumulation of $u$'s range $[l_u, r_u)$, set $l = r_u$.  
4. Otherwise, set $r = r_u - 1$.
5. If $l = r$, return $r$. Otherwise, repeat from step 2.

Note that step 2 can be done in $cal(O(1))$ time by the following snippet:
```cpp
int u = l + n, x = __lg(min(u & -u, r - l));
u >>= x;
```

Therefore, the overall runtime of this algorithm is $cal(O)(log n)$.

[Here](https://github.com/programming-team-code/programming_team_code/blob/f89d019368f9cddb0b6468b241dfcd853931f130/data_structures_%5Bl%2Cr%29/seg_tree.hpp) is a clean implementation.
