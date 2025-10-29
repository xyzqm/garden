---
title: Bernoulli/Poisson processes
tags:
  - probability
---
## Bernoulli Processes
Flip $n$ coins, each of which comes up heads with probability $p$: this is a Bernoulli process (so named because each coin is just a Bernoulli random variable).

Regarding this process, we can ask several interesting questions:
1. What's the chance that we get exactly $k$ heads?
2. What's the chance that the index of the first coin which comes up heads is $i$ (one-indexed)?
3. If $n$ is infinite, what is the expected value of $i$ (first index w/ heads)?
> [!note]- Answers
> 1.  $binom(n, k) p^k (1-p)^(n - k)$
> 2. $(1 - p)^(i - 1)p$
> 3. $1/p$. One simple way to obtain this result is to notice that $bb(E)[i] = 1 + (1 - p)bb(E)[i]$.

Currently, events are _discrete_, since they are in chunks of one coin flip at a time. How can we make them _continuous_ instead?

## Poisson Processes
Instead of a process parameterized by $p$, we now use $lambda$ to denote the _expected_ # of successes (heads) within each one-second interval. In other words, the chance of a success in an interval of size $dif t$ is $lambda space dif t$. 

First off, what is $P(0, tau)$, the chance that there are no successes at all in a $tau$-second interval? 
Note that 
$$
P(0, tau + dif t) = P(0, tau) (1 - lambda space dif t) = P(0, tau) - lambda P(0, tau) dif t
$$
This differential equation is precisely the definition of the exponential function! That is:
$$
P(0, tau) = e^(-lambda tau)
$$

What about $P(1, tau)$ the chance of _one_ success in a $tau$-second interval?
Integrating over all possible times for this single success, we get that:
$$
P(1, tau) = e^(-lambda tau) integral_0^tau (lambda space dif t)/(1 - (lambda space dif t)) = e^(-lambda tau) integral_0^tau lambda space dif t = e^(-lambda tau) lambda tau
$$

Essentially, we start assuming that all trials failed, then choose one failure to "toggle" to a success. Notice that the denominator vanishes because $1 - lambda space dif t = 1$. 

Now, in general, what is $P(k, tau)$, the chance of $k$ successes in a $tau$-second interval?
Applying the same logic, we get that
$$
P(k, tau) = e^(-lambda tau) ((lambda tau)^k)/(k!)
$$

Another derived random variable to consider is $T$, the time of first success.
Note that $1 - "cdf"(T) = P[T >= tau] = P(0, tau) = e^(-lambda tau)$.
From this, we can derive the PDF:
$$
"pdf"(T) = -dif/(dif tau) P[T >= tau] = lambda e^(-lambda tau) 
$$

Note that $bb(E)[T]$ is still $1/lambda$, since $bb(E)[T] = dif t + (1 - lambda space dif t) bb(E)[T]$.

A more interesting problem: what's $bb(E)[T^n]$?  We can use a similar argument as we did for expected value (taking advantage of the fact that the Poisson process is _memoryless_) to get that
$$
bb(E)[T^n] = (1 - lambda dif t) (bb(E)[T^n] + dif t space bb(E)[T^(n - 1)])
$$
Rearranging, we get:
$$
lambda dif t space bb(E)[T ^n] = dif t space bb(E)[T^(n - 1)]
$$ 
Here, we use the fact that $(1 - lambda dif t) dif t = dif t$ since $(dif t) ^2 = 0$. From here, we can show that
$$
E[T^n] = (n!)/(lambda ^n)
$$
As a direct consequence, $"Var"(T) = 1/(lambda^2)$. 

