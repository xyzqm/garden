---
title: A fun random walk problem
tags:
  - probability
  - ev
---
An orangutan starts at position $(0, 0)$, and in every second moves either up or to the right, both with probability $1/2$. What's the expected number of seconds until the orangutan hits either $x = n$ or $y = n$?

Let's let the process continue for infinite time, and let $t_x$ and $t_y$ denote the times at which the orangutan hits the lines $x = n$ and $y = n$ respectively. Then, we wish to find $EE[min(t_x, t_y)]$.

However, let's instead rewrite $min(t_x, t_y)$ as $t_x + t_y - max(t_x, t_y)$. Why? We want to take advantage of the nice fact that after $2n$ seconds, we're guaranteed to have already hit either $x = n$ or $y = n$. However, we also know that we can't have already hit both prior to these $2n$ seconds: that is, $max(t_x, t_y) >= 2n$. So, if we let $(x, y)$ denote our coordinates after $2n$ seconds, we have that $EE[max(t_x, t_y)] = 2n + 2(n - min(x, y))$.

Plugging that back in, we get that
$$
EE[min(t_x, t_y)] &= EE[t_x] + EE[t_y] - EE[max(t_x, t_y)] \ &= 2n + 2n - (2n + 2(n - EE[min(x, y)])) \ &= 2 EE[min(x, y)]
$$
Isn't that quite an incredible result?

To finish from here, notice that $EE[min(x, y)]$ is equivalent to randomly dividing $2n$ elements into 2 subsets, then finding the expected number of elements in the smaller subset. If both subsets have size $n$, we define the smaller one to be the one containing $1$ (although any method of tie-breaking works). For instance, if $n = 2$, here are some possible splits and their corresponding contributions, with the smaller subset listed first in each split:
- ${{3}, {1, 2, 4}} => 1$
- ${{1, 2}, {3, 4}} => 2$

To elegantly evaluate this expected value, we can switch order of summation. That is, for each of the $2n$ elements, sum the probability that it is in the smaller subset. Actually, this is not very nice since our current definition of "smaller" lacks symmetry when both subsets have size $n$, so instead, we will sum the probability that each element is in a subset with size $<= n$, then subtract off the $= n$ case afterward.

This is now much cleaner, since
$$
P("size" <= n) = P("# of elements"!= i < n) = 1/2
$$

Therefore, our overall expectation is:
$$
EE[min(x, y)] &= sum_(i=1)^(2n) P(i "in smaller subset") \
&= [sum_(i=1)^(2n) P(i "in subset w/ size" <= n)] - n P("size" = n) \
&= 2n (1/2) - n binom(2n, n)/2^(2n) \
&= n(1 - binom(2n, n)/2^(2n))
$$

Our final answer is then simply twice this quantity, i.e.
$$
2n(1 - binom(2n, n)/2^(2n))
$$
