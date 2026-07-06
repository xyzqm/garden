---
title: Metric spaces
---
notes from #napkin

## Convergence

![[Pasted image 20260705232203.png]]

2.2.4: The convergent sequences in a discrete metric space (where different points have distance 1 and all others have distance 0) are precisely those which eventually become constant.

## Continuity

![[Pasted image 20260705232346.png]]

![[Pasted image 20260705232505.png]]

2.3.4: Given $epsilon-delta$ continuity and a sequence $x_i$ converging to $p$, our goal is to find, for all $epsilon > 0$, some $N$ such that $forall n >= N, d_N (f(x_n), f(p)) < epsilon$. By $epsilon-delta$ continuity, there must be some $delta$ such that $d_M (x_n, p) < delta => d_N (f(x_n), f_p) < epsilon$; therefore, it suffices to find some $N$ such that $forall n >= N, d_M (x_n, p) < delta$. Such an $N$ must exist by the convergence of $x_i$. $qed$ 

To reiterate the converse proof shown above, if $epsilon-delta$ continuity does not hold, we can explicitly construct a sequence $x_i$ such that $x_i$ converges to $p$, but $f(x_i)$ does not converge to $f(p)$. 

---
![[Pasted image 20260705235202.png]]

$f$ is always continuous. As noted before, any convergent sequence $x_i$ in $D$ must become some constant $p$ after some $N$. Therefore, $f(x_i)$ always converges to $f(p)$. Intuitively, this is because no two points in $D$ are "next" to each other, and therefore they are all independent. $qed$

## Homeomorphisms

![[Pasted image 20260705235946.png]]

Why must we require the inverse also to be continuous?

![[Pasted image 20260706000019.png]]

![[Pasted image 20260706000155.png]]

## Open sets

![[Pasted image 20260706000944.png]]

![[Pasted image 20260706000935.png]]

$(0, 1)$ is open in $RR$ (but not in $RR^2$), while $[0, 1]$ is open in neither.

**Question 2.6.7**. What are the open sets of the discrete space?

All subsets are open, since we can always select $r = 0.01$. $qed$

![[Pasted image 20260706002130.png]]

For a), just set $r$ for each point equal to the minimum viable $r$ among all the intersected sets. The same choice of $r$ suffices for $b$.

An infinite collection of open sets in $RR$ whose intersection is ${0}$ are the sets $S_n = (-1/n, 1/n)$. $qed$

![[Pasted image 20260706100854.png]]

## Closed sets

![[Pasted image 20260706100941.png]]

![[Pasted image 20260706101058.png]]

First, we show that if $S$ is closed, $M \\ S$ must be open. Assume for contradiction that there exists some $p in.not S$ such that for every $epsilon > 0$, there exists some $p' in S$ such that $d(p, p') < epsilon$. Then, we can write a sequence $x_n$ containing these values of $p'$ for $epsilon = 1/n$, which thus converges to $p$. This means $p in "lim" S$, a contradiction. 

A similar contradiction argument works in the reverse direction. Suppose $S$ is open, and there exists a sequence of elements $x_i in.not S$ that converges to an element $p$ in $S$. Then $p$ has no $epsilon$-neighborhood in $S$ for any $epsilon > 0$, contradicting the openness of $S$. $qed$

