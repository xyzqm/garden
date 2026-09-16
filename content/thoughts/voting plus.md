---
draft: true
---
(https://www.alphaxiv.org/pdf/2306.17838)
## biased metrics

once we designate an *optimal* candidate (call it candidate $0$) + the distances of all candidates to this optimal, all voters can be greedily placed
- we first want each voter to "agree" as much as possible with $0$ as possible. however, the disagreement grows larger if $i < j$ but $x_i >> x_j$ .
- we also want each voter to hate other candidates as much as possible in comparison to $0$. however, a candidate close to $0$ cannot be hated by much more, and if $i < j$, $i$ must be hated less than $j$

in turns out that these two bounds may be simultaneously achieved, and therefore biased metrics are the most "adversarial" metrics we can construct.

## reduction to subsets

we can rewrite the biased metric condition as
![[Pasted image 20260829103406.png]]

but preferably we'd like to write both sides in terms of $I_t$ so that we can [[Decomposing inequalities|decompose the inequality]] into a discrete union of subset conditions. to do this, we can replace disagreement with *direct disagreement*, where we only consider $j = 0$. this makes the bound more strict and yields

![[Pasted image 20260829103616.png]]

which we can decompose to get

![[Pasted image 20260829103631.png]]

## integrated veto

![[Pasted image 20260829112400.png|414]]

each candidate gets votes = $2 dot ("area under its curve")$. since the starting points sum to $1$ and the total sum decreases at a constant rate of $1$ per second, the entire process will finish in $1$ second and the total area will come out to $1/2$. therefore, doubling all areas provides the desired normalization. 

## matching + plurality veto

let $0$ be the optimal candidate and $c$ be the elected one. if we want to prove that the distortion of electing $c$ doesn't exceed $3$, the core idea is pair high $Delta_c$ voters with sufficiently high $C_0$ voters. a simple starting idea is to pair voters with $0 succ c$  with voters with $c succ 0$. 
![[Pasted image 20260912111733.png]]

here $Delta_c <= 2 C_0$, and summing both sides leads to the inequality that guarantees $D <= 3$. 

the problem with this, though, is that such a pairing has to exist over all possible choices of $0$, and this is only possible if $c$ wins all pairwise comparisons, i.e. $c$ must be a *Condorcet winner*. the problem is that condorcet winners don't exist in all elections, so we need to revise our pairing to be a bit more robust.

actually, we can squeeze a bit more out of the pairing above because it guarantees low cost not just for $c$, but also for all $c' pref_1 c$. actually, it guarantees low cost for all pairs $(0, c')$ where $c' wpref_1 c$ and $c wpref_2 0$. 

we can use this to help reduce our per-$0$ pairings into a single one: if we want to prove the optimality of candidate $c$ we exploit the fact that if $c wpref_1 t$ and $t = "top"_2$, then $c$ is cheap enough for all choices of $0$. 

![[Pasted image 20260912112600.png|468]]

thus, the advantage of this new pairing algorithm is that it doesn't change depending on $0$; however, it's still not obvious that such a matching always exists.

plurality veto provides a stupidly elegant proof by construction. 

## k = 2 deterministic

let the elected candidate be $w$; we want to find his distortion. additionally, $t_w$ denotes the fraction of voters that rank $w$.

when the core $T$ has size greater than 1, it repels anyone who ranks $w$ at all; therefore, $Delta = 1 - t_w$, independent of $T$. since $Delta$ is fixed, we can then minimize $C$ by collapsing all candidates inward aside from $w$, yielding $C = 1/2 t_w$.  therefore, the distortion in this case is
$$
1 + (Delta)/(C) = 1 + 2 dot (1 - t_w)/t_w
$$

this corresponds exactly to the plurality case, with $nu_w$ replaced by $t_w$.

the only remaining case is a singular core $T = {c}$. this case is slightly different because it still attracts voters who prefer $c$ to $w$; however, this comes at the cost of repelling all voters outside of $nu_c$. therefore, this case has distortion
$$
max_(c != w) space  1 + 2 dot (1 - P(w pref c))/(1 - nu_c)
$$

therefore, the distortion of electing candidate $w$ is
$$
1 + 2 dot max((1 - t_w)/t_w, max_(c != w) (1 - P(w pref c))/(1 - nu_c))
$$


### lower bound 

if we just consider the first argument to $max$, we can derive an easy lower bound on distortion of 
$$
1 + 2 dot (1 - 2/m)/(2/m) = 1 + 2 dot (m/2 - 1)  = m - 1.
$$

### upper bound

we also define a simple mechanism that is tight for this lower bound for $m >= 6$, majority-or-approval. if any candidate satisfies $nu_w >= 1/2$, we elect them; otherwise, we elect the candidate with maximum $t_w$. 

in the first case, distortion is bounded by $max(3, 2) = 3$. 

in the second case, distortion is bounded by $max(m - 1, 5)$, which equals $m - 1$ as long as $m >= 6$. the intuition: the fact that no candidate has majority means that the central candidate will always have "sufficiently high" cost, therefore bringing down that second term.

