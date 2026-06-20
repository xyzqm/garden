---
title: "AGC 076: Slime eat Slime"
tags:
  - cs
  - ad-hoc
---
First, observe that for two slimes $u$ and $v$ with distinct $C_u$ and $C_v$, exactly one of them can eat the other (if $C_u = C_v$, neither can eat the other). In particular, $u$ can eat $v$ if $C_v - C_u <= K med (mod 2K + 1)$. Also note that we can consider each component in $G \\ {1}$ independently, since no slimes can eat through $1$. In particular, for each component, we care about whether $1$ can eventually eat it or not.

To build some intuition, here are some visuals for cases with $K = 3$:
![[Pasted image 20260317222319.png]]
*WLOG, we will assume $C_1 = 0$.

The first case is impossible because $0$ cannot eat any of $4$, $5$, or $6$.

However, this is remedied with the presence of the $1$ in the second case, which can be eaten by $0$ but can also eat $4$, which in turn can eat $5$ and $6$. A possible sequence of events is shown above.

Still, in the third case, we see that the presence of an intermediate such as $1$ does not necessarily guarantee success. Indeed, this case is impossible because $5$ and $6$ can only be eaten if $1$ is *eaten through* first. Therefore, the remaining value will be $> 3$, making it yet again impossible for $0$ to continue eating. However, if the middle value were $3$, or if all the outer values were changed to $4$, this would again be possible.

To formalize this a little bit, let $r$ be the node in the component with the largest $C_r$ satisfying $1 <= C_r <= k$: this is the largest possible "intermediate", which we will try to use to eat larger values.

For a concrete example, if $C_r = k$, we can actually always win by the following procedure:
1. While there exists $u$ with $C_u > k$, find one such $u$ adjacent to $v$ with $C_v != C_u$. Since there exists $C_r = k$, such a $(u, v)$ pair is guaranteed to exist. Then, have one of $(u, v)$ eat the other. Importantly, note that $r$ itself can never be eaten by this procedure.
2. Now, there exists only $C_i <= k$, which can all be eaten by node $1$ which has $C_1 = 0$.

So in this example, there are only two categories of slimes: $C_i <= k$, which we'll refer to as P-type, and $C_i > k$, which we'll refer to as Q-type (in order to be consistent with the official editorial). However, if $C_r < k$, we must introduce an additional R-type, which satisfies $C_r + k < C_i$. 
