---
title: Auctions
tags:
  - econ
  - cs
---

## 1
want to maximize surplus (sum of benefit for both seller **and** buyer)

first-price auction: difficult to analyze, will do so in ch 2/6

ascending-price auction strategy:
- increase price from 0 until all but one person drops out, then give that last person the current price
- assume that agents act to maximize their own benefit, then clearly there is no benefit to dropping out when price < WTP
- therefore agent $i$ will drop out at price $v_i$, so agent $1$ will gain $v_1 - v_2$ and seller will gain $v_2$, thus achieving the maximum possible benefit of $v_1$

second-highest bid strategy:
- have everyone bid, offer second-highest price to highest bidder
- importantly, this encourages everyone to bid truthfully
- prove sketch: fix x to be the max of everyone else's bids. if x < v_i, any bid >= x is optimal. and if v_i < x, any bid <= x is optimal. therefore, v_i is always an optimal bid (and the only bid that is optimal in all scenarios)

maximizing consumer surplus rather than surplus is difficult, as if $v_i$ is constant, lottery is best: but if $v_1 = 1$ and all other $v_i = 0$, second-highest bid is better. In general, no single mechanism works, whereas when maximizing surplus, second-highest bid is clearly optimal.

## 2
let $x$ and $p$ denote whether an agent receives a good and their payment, respectively

in order to be in equilibrium:

$x$ must be monotone as bid increases

intuitively, this makes sense: why would you bid higher only to get less chance of getting the item?

## RSOP
b/c price given to each person doesn't depend on what they bid, it's clearly optimal for them to always tell the truth

1/4 lower bound:
consider 2 bidders with $v_1 > v_2$. With probability $1/2$ they are in different sets, and therefore seller gains revenue of $v_2$ with probability $1/2$, so expected revenue is $v_2/2$, which is $1/4$ of maximum revenue $2v_2$.

4.68 bound paper:
$S_j$ = how many of the first $j$ bidders are in the sample
$Z_j$ = fraction of first $j$ bidders in market to sample
$Z$ = $min Z_j$ 
- 1/15 proof considers scenarios where $Z >= 1/3$, and shows that this occurs with high probability 

$E_alpha$ => probability that the maximum ratio of $S_j / j$ does not exceed $alpha$

$E^T_alpha$ and $E^(T prime)_alpha$ are positively correlated for any $T$, $T prime$ 


