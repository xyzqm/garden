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

As it turns out, if we want to maximize this quantity, we should always do tasks in order of high to low duration! There are several ways to show this, but one particularly nice way is the _exchange argument_.
### Exchange Argument
This idea is an example of [[local-analysis|local analysis]]. Here's the idea:

Suppose we've found an optimal ordering. Then, swapping any two adjacent elements in this ordering certainly _cannot_ be better, otherwise our assumption of optimality would be contradicted. This simple, local condition can often help us greatly reduce the complexity of ordering problems.

Let's apply this idea to the CSES problem above. Say we've ordered the tasks in a way such that the $i$th task has duration $d_i$ and is completed at time $f_i$. Then, how does our exchange condition constrain the relationship between $d_1$ and $d_2$?

Consider swapping the 1st and 2nd tasks. Then, the first observation we should make is that $f_2, f_3,..., f_n$  will all remain unchanged. Therefore, we only need to consider how $f_1$ changes! This is why considering adjacent swaps in particular is so useful: in many cases, it will leave the suffix unchanged, leading to a much simpler analysis.

Going back to our problem, if our order is optimal, then the following must hold:
$$
sum f >= sum f prime &=> f_1 >= f_1 prime \
&=> d_1 >= d_2
$$
If we repeat this argument for other indices, we can indeed show that in an optimal order, $d_i >= d_(i + 1)$ for all $i$, as desired.

Note that in this problem, this condition ends up being both necessary and _sufficient_: since there's only one way for this condition to be satisfied, there's no need to worry about finding a suboptimal local minimum.
However, [this blog](https://codeforces.com/blog/entry/72525) has some educational examples of situations in which we need to be slightly more careful. In particular, it considers the following problem:

> [!info] Task Scheduling
>There are 𝑛 jobs, and each job consists of two parts. The first part must be done in center A, the second part must be done in center B, each center can do at most one job in one time, and the second part of the 𝑖-th job can be started only if the first part of the 𝑖-th job is already done. Find the minimum amount of time required to complete all the tasks assuming you can arrange them in any order.

```tikz
\begin{document}
\begin{tikzpicture}
	\draw[fill=blue!50] (0,0)-- node[midway, left] {A} (0, 1)--(2, 1)--(2,0)--cycle;
	\draw[fill=blue!50](2, 0)--(5, 0)--(5,-1)--(2, -1)--node[midway, left]{B} cycle;
	\draw[fill=red!50](2, 0)--(2, 1)--(6, 1)--(6, 0)--cycle;
	\draw[fill=red!50](6, 0)--(9, 0)--(9,-1)--(6, -1)--cycle;
	\draw[dashed] (9, -2) node[right]{t}--(9, 2);
\end{tikzpicture}
\end{document}
```

_An illustration of the scheduling procedure described above. The two parts of each job are assigned the same color. Notice how the second red part can only begin once the first red part has finished._

If we try applying the same exchange argument as above, we'll end up with the condition that
$$
min(a_(i + 1), b_i) >= min(a_i, b_(i + 1))
$$
for all $i$.
The exchange argument guarantees that this condition is *necessary*, but it ultimately turns out not to be sufficient (for more details, consult the blog). In order for this comparator to work, we have to make it slightly less "relaxed" by tie-breaking with $a_i$. 

### Johnson's Rule
However, I'd like to present a cleaner line of thinking. Actually, at first glance, it's not at all obvious that a total order will even exist. Couldn't it be possible that $a < b$ and $b < c$, but $c < a$ (here, $x < y$ means it's better to perform task $x$ before task $y$)?

Let's change our perspective and instead analyze $t_A$, the amount of time for which _only_ center $A$ is operating. Then, the total time taken, $t$, will simply be $t_A + sum b_i$, and since $sum b_i$ is constant, we can turn our attention to minimizing $t_A$ instead.

Now, there turns out to be a very nice way of visualizing $t_A$.  Let me illustrate with an example where $a_1 = 1$, $b_1 = 3$, $a_2  = 4$, $b_2 = 2$:
```tikz
\usepackage{pgfplots}
\pgfplotsset{compat=1.16}
\begin{document}
\begin{tikzpicture}
	\begin{axis}[axis lines = middle,
	xmin=0, xmax=5, 
	ymin=-2, ymax=3,
	]
	\draw (axis cs:0,0)--node[midway, left]{$a_1$} (axis cs:1,1);
	\draw (axis cs:1,1)--node[midway, right]{$b_1$}(axis cs:2,-2);
	\draw (axis cs:2,-2)--node[midway, left]{$a_2$}(axis cs:3,2);
	\draw (axis cs:3,2)--node[midway,right]{$b_2$}(axis cs:4,0);
	\draw[dashed] (axis cs:0, 2)--node[midway, above]{$t_A$}(axis cs:5, 2);
	\end{axis}
\end{tikzpicture}
\end{document}
```
$t_A$ is just the maximum height reached! Algebraically:
$$
t_A = max_i (sum_1^i a_i - sum_1^(i - 1) b_i)
$$
Take a moment to make sure you understand why.

Hopefully, from this perspective, it's slightly clearer why a total order emerges. The first observation we should make is that we should put all tasks with $a_i < b_i$ before tasks with $a_i > b_i$: visually, that means we want to build as deep a valley as possible before climbing back up.

So, we can now consider the subproblem where $a_i < b_i$ holds for all $i$. In this case, how should we arrange our tasks? 

> [!note]- Solution
> It turns out that it is always optimal to sort in increasing order of $a_i$. 

Now, how should we arrange tasks when $a_i > b_i$?

> [!note]- Solution
> By symmetry, we should sort in decreasing order of $b_i$.

Putting it all together, we've just discovered [Johnson's rule](https://en.wikipedia.org/wiki/Johnson%27s_rule)!
### Problems
[[posts/flint-and-steel|D2F: Flint and Steel]]
[[festivals|IOI 2025: Festivals]]

