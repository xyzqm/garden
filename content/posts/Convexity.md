---
title: Convexity
tags:
  - cs
  - math
  - greedy
  - convex
description: How to go about proving certain functions are convex.
---
Convexity often arises naturally in many "intuitively" greedy problems. We'll first give some examples, then go over typical strategies for proving convexity, as well as how to take advantage of it.
## Examples

> You are given an array $a$ of $n$ integers. Select $k$ distinct indices such that the sum of $a_i$ at those indices is minimized.

It's not difficult to see that the answer is convex in $k$.

>  You are given an array of length $n$. If you place exactly $k$ tiles of length $l$ without overlap, what's the maximum sum of values that can be covered? ([AtCoder](https://atcoder.jp/contests/abc383/tasks/abc383_g))

(note that the first example is just this problem with $l = 1$)
Convexity is a little harder to prove here, but it still makes intuitive sense: with each new tile we add, the total sum gained should be less.

> You are given a weighted tree, and some edges are labelled. Find the total weight of an MST that uses exactly $k$ edges. ([QOJ](https://qoj.ac/problem/10706))

Again, we may suspect that $f(k)$ will look something like a parabola, but this will be the hardest proof of the three example listed.

## Proof Strategies
### Interpolation

The idea of this strategy is to show that if we have solutions of size $k - 1$ and $k + 1$ with costs $f(k - 1)$ and $f(k + 1)$ respectively, we can construct a solution of size $k$ with cost $<= (f(k - 1) + f(k + 1))/2$ (or $>=$, depending on the problem).

Let's apply this approach to the second example. First, consider $l = 1$. Let's draw two valid solutions, one for $k - 1$ and one for $k + 1$, as follows:
![[Pasted image 20260620140759-1.png|500]]
*Green tiles are tiles common to both solutions.*

Note that if we move the larger of the red and blue tiles over to the $k - 1$ solution, the resultant solution will have size $k$ and sum $>= (f(k - 1) + f(k + 1))/2$. 

For $l = 1$, we have to be a bit more clever. Consider the following:
![[Pasted image 20260620140759-2.png|500]]
*Edges are drawn between overlapping tiles. Note that each component forms a zig-zag pattern.*

Our claim is that there exists two optimal solutions for $k - 1$ and $k + 1$ such that all components are either green (equal # of tiles on left and right) or red (one more tile on right). Assuming this is true, there will be exactly **two** red components, and we can toggle the one with larger net gain to achieve $f(k) >= (f(k - 1) + f(k + 1))/2$.

**Proof of assumption:** If there exists a black component $B$, consider any other red component $R$. Toggle both $B$ and $R$ in the $k - 1$ solution (that is, replace the tiles in the left sides of $B$ and $R$ with the tiles on the right sides of $B$ and $R$). This cannot change the cost of the $k - 1$ solution, otherwise one of the two solutions would not be optimal. Thus $f(k - 1)$ and $f(k + 1)$ remain the same while one black component is removed; repeat until no black components remaining.