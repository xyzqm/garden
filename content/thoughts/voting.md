---
title: Voting
---
## The setup

Consider an election in which there are $n$ candidates and $m$ voters. Each voter associates a *cost* with each candidate, and we want to elect a candidate such that the total cost imposed by that candidate upon all voters is minimized. How can we do this?

Well, if we know the exact cost table for all (voter, candidate) pairs, all is well; we just need to do some arithmetic.

![[Pasted image 20260617000037.png|500]]

*Summing costs for each candidate across all voters, we determine that we should elect the third candidate because he minimizes total cost.*

## Losing information

However, what if we don't know the exact costs each voter associates with each candidate? In practice, even the voters themselves often cannot quantify their exact cost profiles: instead, they are typically asked to *rank* the candidates from most to least favorite. Therefore, instead of full **cardinal** information, we now receive only **ordinal** information.

![[Pasted image 20260617001346.png|500]]

How can we decide which candidate to elect in this new scenario?

Before we proceed, some terminology: a voting **mechanism** is any algorithm that takes in ordinal rankings as input, then outputs which candidate should be elected. For instance, a simple mechanism in the 2-candidate ($n = 2$) case illustrated above could be:
> Elect whichever candidate is preferred by more voters. In case of a tie, pick an arbitrary one.

For instance, in the above illustration, two voters prefer the first candidate, and two voters prefer the second. This is a tie, so we arbitrarily elect the second candidate.

## Distortion

Now, can we evaluate how good this mechanism is?

Well, in the above example, the optimal total cost was 10, but we picked a candidate whose total cost was 115; therefore, we've missed the optimal cost by a factor of 11.5. However, we can construct an even worse case:

![[Pasted image 20260617002200.png|300]]

We're now off by a factor of...infinity???

Formally, the existence of this case means that the **distortion** of our mechanism is infinite, since there exists a construction of costs that causes our mechanism to incur cost worse than the optimal cost by a factor of $oo$.  

## Metric social choice

To prevent distortion from blowing up, we can try placing reasonable constraints on the underlying costs of each voter. The constraint we will consider today is the *metric constraint*, in which costs must be determined according to a metric embedding of voters and candidates.

![[Pasted image 20260618221754.png|500]]

In this illustration, the voters and candidate are placed along a single number line, and the costs equal the distances between each (voter, candidate) pair. For instance, the left voter associates 0 cost with the first candidate and 1 cost with the second candidate. On the other hand, the right voter associates $0.5 + epsilon$ cost with the first candidate and $0.5 - epsilon$ cost with the second candidate.

However, recall that we don't know these exact distances: instead, we only know that one voter prefers candidate 1 to candidate 2, and the other prefers candidate 2 to candidate 1. Both candidates are thus symmetric, so WLOG assume our mechanism elects the second candidate. What is the resultant distortion?

Well, the first candidate induces a total cost of $0 + 0.5 = 0.5$, while the second candidate induces a total cost of $1 + 0.5 = 1.5$. Therefore, our distortion is $1.5/0.5 = 3$. 

### Metric constraints

Before we move on, we should formally define what it means for an arrangement to be a valid metric embedding. Formally, a metric embedding $d(i, j)$ is a function which returns the distance between points $i$ and $j$, which must satisfy the following four conditions:
1. $d(i, i) = 0 quad "for all " i$
2. $d(i, j) > 0 quad "for all" i != j$
3. $d(i, j) = d(j, i) quad "for all" i != j$
4.  $d(i, j) <= d(i, k) + d(k, j) quad "for all" i, j, k$

The first three are fairly intuitive, and the 4th condition is just the triangle inequality.

Note that this means our distance function is NOT constrained to only Euclidean geometry; in fact, it will turn out to be more convenient to use L1 distance (Manhattan distance) rather than L2 distance (Euclidean) later on.

### Deriving upper bounds

This counter-case above shows that the distortion of any $n = 2$ deterministic mechanism must be at least $3$. However, using the metric constraints, we can actually show there exists a mechanism whose distortion is *at most* $3$, thereby proving that $3$ is the optimum distortion of any $n = 2$ deterministic mechanism.

Some preliminary notes:
- Let $nu_1$ and $nu_2$ denote the fraction of voters that prefer candidates $1$ and $2$, respectively. For instance, in our above case, we have $nu = (0.5, 0.5)$.
- WLOG assume $nu_1 <= nu_2$; since our mechanism has no other information, it follows that we should then always elect candidate $2$.
- Since we want to maximize distortion, we should then also configure our distances such that candidate 1 is optimal.

A helpful way to rewrite distortion here, henceforth denoted as $cal(D)$, is as
$$
cal(D) = 1 + (C(2) - C(1))/C(1)
$$

where $C(i)$ denotes the cost of electing candidate $i$. Therefore, to maximize distortion, we want to minimize $C(1)$ (the optimal cost) and maximize $C(2) - C(1)$ (the overhead created by our mechanism).

To minimize $C(1)$:
- Note that $nu_1$ voters can be placed exactly on top of candidate $1$, therefore contributing $0$ cost.
- However, the $nu_2$ remaining voters must satisfy $d(1, v) >= d(2, v)$. Combining this with the triangle inequality which requires $d(1, 2) <= d(1, v) + d(2, v)$, we have that $d(1, v) >= d(1, 2) / 2$. Therefore, each of these voters contributes at least $d(1, 2)/2$ to $C(1)$.
- From here, it follows that the minimum value of $C(1)$ is $nu_1 dot 0 + nu_2 dot d(1, 2) / 2$.

To maximize $C(2) - C(1)$:
- The $nu_1$ voters placed on top of candidate $1$ contribute $d(1, 2)$, which can be shown by the triangle inequality to be the maximum.
- The remaining $nu_2$ voters must satisfy $d(1, v) >= d(2, v)$, so the maximum value of $d(2, v) - d(1, v)$ they can contribute is $0$.
- Therefore, the maximum value of $C(2) - C(1)$ is $nu_1 dot d(1, 2) + nu_2 dot 0$. 

In other words, we have shown that no construction can be worse than the one we showed above, in which $nu_1$ voters are placed on top of candidate $1$, and $nu_2$ voters are placed halfway, since this simultaneously maximizes the numerator $C(2) - C(1)$ and minimizes the denominator $C(1)$.

Plugging these values back into our distortion expression, we have
$$
cal(D) &= 1 + (C(2) - C(1))/C(1) \ 
&<= 1 + (nu_1 dot d(1, 2))/(nu_2 dot d(1, 2) / 2) \
&= 1 + 2 nu_1/nu_2 \
&<= 3
$$

where the last inequality arises from the requirement that $nu_1 <= nu_2$. 
