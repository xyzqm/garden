---
title: P vs NP
draft: true
---
If you've ever studied CS, you're probably familiar with the infamous [P versus NP problem](https://en.wikipedia.org/wiki/P_versus_NP_problem). In this post, I'll try to explain why we even care about this problem, what it means to be NP-hard and NP-complete, and lastly some techniques to show whether a given problem belongs in these categories or not.

## Why P?

Why should we draw the divide between "efficient" and "inefficient" as between P and NP in the first place? After all, an algorithm that runs in $n^100$ time is surely worse than one that runs in $2^(n/1000)$, right? One may make the argument that the former is *asymptotically better* than the latter, but this never felt super compelling to me. 

I think a less subjective argument than "efficient vs inefficient" that justifies our special treatment of the P class is the fact that polynomials are closed under addition and multiplication. This means that even if fundamental operations started to run in $O(n^2)$ rather than $O(1)$, a polynomial algorithm in the latter circumstance would remain polynomial in the former. In a way, this makes the notion of P *machine-invariant*, as long as both machines can run fundamental operations in polynomial time.

This invariance means that although P and NP were originally defined relative to the operations required by a Turing machine, we may instead replace the Turing machine—which is rather unwieldy to reason about—with a more "efficient" machine that can perform basic operations like addition, multiplication, and memory access in $cal(O)(1)$ time, while leaving the classes P and NP undisturbed.

## What is NP?

Contrary to somewhat popular belief, NP does not mean non-polynomial but rather *nondeterministic polynomial*, which refers to any program that a *nondeterministic Turing machine* may run in polynomial time.

### NTMs

As such, I should probably elaborate a bit on the difference between a deterministic and non-deterministic machine. Loosely speaking, a deterministic machine 

## Additional resources

![](https://www.youtube.com/watch?v=6OPsH8PK7xM)