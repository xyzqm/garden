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