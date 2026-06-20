---
title: Contracts
tags:
  - econ
  - cs
---
## Preliminaries
$[k]$: the set {0...k - 1}
$Delta^k$:  set of all probability distributions over $[k]$

agent chooses from $[n]$ actions, and there are $[m]$ possible outcomes
- each action associated w/ distribution of outcomes $f in Delta^m$ as well as cost $c$
- $(f, c)$ is privately known only to the agent
- also assume $c_0$ = $r_0$

reward for each outcome $r_i$ is known to _both_ agent and principal (person giving the contract)
- also assume $r_0 = 0$

## Contract Classes
a contract $t$ is linear if $t = alpha r$ (that is, agent is rewarded with constant fraction of reward produced)

> [!note] Lemma
> Expected reward only changes at most $n - 1$ times as $alpha$ increases from $0$ to $1$. Moreover, expected reward is non-decreasing.

Recall that utility = expected reward - expected payment.

![[Pasted image 20251223213847.png]]

![[Pasted image 20251223213855.png]]

For instance, if for any agent, the best linear contract were only 0.25 worse than the best bounded contract, $C_"linear"$ would be a 0.25 approximation of $C_"bounded"$.

![[Pasted image 20251223214749.png]]

![[Pasted image 20251223214858.png]]

![[Pasted image 20251223215916.png]]
visualization of this condition (solid is sampled distribution, solid is true distribution). x-axis is $p$-axis, and for all $p$ there is at most $epsilon$ error.

visual proof:
![[Pasted image 20251223215736.png]]

if we pick our strategy at the red dot, we can incur at worst $2 epsilon$ error from the true answer.
