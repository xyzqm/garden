---
title: A tree problem
tags:
  - trees
  - probability
---
 ![[Pasted image 20251130100319.png]]
 Let $s_i$ be the number of steps taken starting from node $v_i$. It is sufficient to show that $s_u = s_v$ for any two adjacent nodes $u$ and $v$.
![[Untitled-2025-11-30-1019.svg|invert|300]]

What happens when we change our root from $u$ to $v$? First, consider the second step: the shortest path to all nodes in $V$ decreases, while the shortest path to all nodes in $U$ increases (here, $X$ denotes the subtree rooted at $x$). Therefore, the contribution of the second step increases by $S_U - S_V$, where $S_X$ denotes the size of subtree $X$. 

What about the first step? Let $E_X$ be the expected time to leave subtree $X$ given that you start at node $x$.

> [!note] Lemma
> For every subtree $X$, $E_X = 2S_X - 1$.

**Proof:** We induct. If $S_X = 1$, this claim is obvious.

Otherwise, let $d$ be the degree of node $x$. Then, we expect to visit $x$ $d$ times before finally leaving, which means we will start from $x$ and come back $d - 1$ times. In each trip, we move to each of our children with equal probability. Therefore, we have
$$
E_X &= (d - 1) [1/(d - 1) sum (E_C + 1)] + 1 \
	&= [sum (E_C + 1)] + 1 \
	&= [sum 2S_C] + 1 \
	&= 2S_x - 1
$$
where $C$ denotes a child subtree of $X$.

---
To finish, notice that when moving our root from $u$ to $v$, the contribution from the first step increases by $E_V S_U$  and decreases by $E_U S_V$. Expanding this out, the net change to this contribution is
$$
E_V S_U - E_U S_V &= (2S_V - 1) S_U - (2S_U - 1)S_V \
&= -S_U + S_V
$$
which exactly cancels out the change in contribution from the second step!
