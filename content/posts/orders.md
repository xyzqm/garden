---
title: Orders
tags:
  - cs
---
A common problem archetype is the following: "given $n$ tasks, order them in some optimal way" or "find an order of $n$ tasks satisfying a certain condition". I will outline some common methods to solve these problems below.
## Total Orders

In many cases, it will be possible to define a *total order* on the tasks; that is, it's possible to assign each task a "priority" such that it's always optimal to do high-priority tasks before 
low-priority ones.

An example of a non-total order is rock-paper-scissors, because the three moves can't be
placed into a total order (e.g. rock > paper > scissors) due to their cyclic nature.

> [!info] Tasks and Deadlines
> ([CSES](https://cses.fi/problemset/task/1630)) You have to process $n$ tasks. Each task has a duration and a deadline, and you will process the tasks in some order one after another. Your reward for a task is $d−f$ where $d$ is its deadline and $f$ is your finishing time. (The starting time is $0$, and you have to process all tasks even if a task would yield negative reward.)

The first sneaky observation is that the $+d$ term doesn't actually matter, since we can rewrite the total reward as $sum (d - f)$ = $sum d - sum f$, and note that since we have to complete all the tasks, $sum d$ is constant over all possible orderings. Therefore, we can reduce this problem to maximizing $sum f$ instead.

As it turns out, if we want to maximize this quantity, we should always do tasks in order of high to low duration! There are several ways to do this, but one particularly nice way is the _exchange argument_.
#### Exchange Argument
This idea is an example of [[content/thoughts/local-analysis|local analysis]]. Here's the idea:

Suppose we've found an optimal ordering. Then, swapping any two adjacent elements in this ordering certainly _cannot_ be better, otherwise our assumption of optimality would be contradicted. This simple, local condition can often help us greatly reduce the complexity of ordering problems.

Let's apply this idea to the CSES problem above. Say we've ordered the tasks in a way such that the $i$th task has duration $d_i$ and is completed at time $f_i$. Then, how does our exchange condition constrain the relationship between $d_1$ and $d_2$?

Consider swapping the 1st and 2nd tasks. Then, the first observation we should make is that $f_2, f_3,..., f_n$  all remain unchanged. Therefore, we only need to consider how $f_1$ changes! This is why considering adjacent swaps in particular is so useful: in many cases, it will leave the suffix unchanged, leading to a much simpler analysis

Going back to our problem, if our order is optimal, then the following must hold:
$$
sum f >= sum f prime &=> f_1 >= f_1 prime \
&=> d_1 >= d_2
$$
If we repeat this argument for other indices, we can indeed show that in an optimal order, $d_i >= d_(i + 1)$ for all $i$, as desired.

Note that in this problem, this condition ends up being both necessary and _sufficient_: since there's only one way for this condition to be satisfied, there's no need to worry about finding a suboptimal local minimum.

## Problems
[[posts/flint-and-steel|D2F: Flint and Steel]]
