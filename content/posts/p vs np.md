---
description: An introduction to P vs NP, NP-hard, and NP-complete + some illustrative proofs.
---
If you've ever studied CS, you're probably familiar with the infamous [P versus NP problem](https://en.wikipedia.org/wiki/P_versus_NP_problem). In this post, I'll try to explain why we even care about this problem, what it means to be NP-hard and NP-complete, and lastly how to show whether a given problem belongs in these categories or not.

## Preliminaries

A basic understanding of [[models of computation]] would be helpful!
## Why P?

Why should we draw the divide between "efficient" and "inefficient" as between P and NP in the first place? After all, an algorithm that runs in $n^100$ time is surely worse than one that runs in $2^(n/1000)$, right? One may make the argument that the former is *asymptotically better* than the latter, but this never felt super compelling to me. 

I think a less subjective argument than "efficient vs inefficient" that justifies our special treatment of the P class is the fact that polynomials are closed under addition and multiplication. This means that even if fundamental operations started to run in $O(n^2)$ rather than $O(1)$, a polynomial algorithm in the latter circumstance would remain polynomial in the former. In a way, this makes the notion of P *machine-invariant*, as long as both machines can run fundamental operations in polynomial time.

This invariance means that although P and NP were originally defined relative to the operations required by a Turing machine, we may instead replace the Turing machine—which is rather unwieldy to reason about—with a more "efficient" machine that can perform basic operations like addition, multiplication, and memory access in $cal(O)(1)$ time, while leaving the classes P and NP undisturbed.

## What is NP?

Contrary to somewhat popular belief, NP does not mean non-polynomial but rather *nondeterministic polynomial*, which refers to any program that a *nondeterministic Turing machine* (as described in [[models of computation]]) may run in polynomial time. A nice way of rephrasing this it that a problem is in NP if it can be *verified* in polynomial time. For instance, consider the classic NP-complete [subset sum problem](https://en.wikipedia.org/wiki/Subset_sum_problem):
> Given a list of $n$ integers and a target $T$, determine whether there exists a subset of the $n$ integers that sums to $T$.

To solve this, we can write a simple non-deterministic program that runs in $cal(O)(n)$:
1. Initialize a variable `sum` to 0.
2. Every time we read a new number `x` from the input, split the program into two branches: one where `sum` is incremented by `x`, and another where its not.
3. After processing all $n$ numbers in this fashion, our computation tree has $2^x$ leaves. Check if `sum` in any of these is equal to `T`.

Alternatively, if we specify a specific leaf among the $2^x$ possibilities to evaluate—which basically corresponds to you giving me a subset of numbers and asking me whether they sum to $T$—this can be done in $cal(O)(n)$ time. This is what it means to be *verifiable* in polynomial time.

## NP-hard

We call a problem NP-hard if any other problem in NP can be reduced to this one in polynomial time. Consequently, if *any* NP-hard problem can be solved in polynomial time, we have proven that P = NP. We proceed to offer some classic examples of NP-hard problems and also sketch proofs of their NP-hardness.
### Boolean satisfiability (SAT)

This problem is perhaps one of the most famous NP-complete problems, and the Cook-Levin theorem that proved its completeness is a landmark result in CS (for a formal proof, [the stanford notes](https://people.csail.mit.edu/rrw/6.045-2020/notenp.pdf) are a great resource).

The SAT problem essentially asks: given an acyclic Boolean circuit composed of AND, OR, and NOT gates that inputs $n$ bits and outputs 1 single bit, does there exist a way to set the $n$ input bits such that the output bit is $1$?

The intuitive reason why this is NP-complete is because if you look inside a computer, it's also basically just composed of logic gates. Therefore, any verifier program that works in polynomial time can be rewritten as a Boolean circuit in polynomial time. Then, we can run SAT on this circuit to determine whether any input is accepted by the verifier program.

Before we move on, we should probably clarify how exactly to represent SAT problems. The typical form used is **conjunctive normal form** (CNF) which write the output bit as a conjunction of disjunctions like so:
$$
(x_1 or not x_2 or x_3) and (x_2 or not x_3) 
$$

$and$ denotes logical and, $or$ denotes logical or, and $not$ denotes negation. The problem is then to find whether there exists some $x_1, x_2, x_3$ such that the above expression evaluates to 1.

The cousin of CNF is **disjunctive normal form** (DNF) which swaps $and$ and $or$. However, we prefer CNF since any boolean formula may be converted into an *equisatisfiable* CNF formula in polynomial time. The same is not true for DNF; for instance, the DNF expansion of 
$$
(x_1 or x_2) and (x_3 or x_4) and (x_5 or x_6) and ... and (x_(2n - 1) or x_(2n))
$$

would have $2^n$ terms.

> [!note] Exercise
> We say a Boolean formula has a solution if its variables can be set such that the expression evaluates to $1$ (i.e. true).
> 
>  We then say that two boolean formulas $A$ and $B$ are *equisatisfiable* when $A$ has a solution $arrow.l.r.double$ $B$ has a solution. How can we convert any boolean formula of length $n$ into an equisatisfiable Boolean formula with length $cal(O)(n)$?
### Subset sum

As described earlier, the subset sum problem asks the following:
> Given a list of $n$ integers and a target $T$, determine whether there exists a subset of the $n$ integers that sums to $T$. 

The following sketch of NP-hardness is based on notes from [Cornell](https://www.cs.cornell.edu/courses/cs4820/2018fa/lectures/subset_sum.pdf). 

To prove NP-hardness, it's sufficient to prove that any instance of SAT can be reduced to subset sum in polynomial time. For convenience, we will assume the SAT problem is written in CNF.

Also for convenience, we assume numbers are written in a sufficiently large base $B$ such that no carries occur during addition. We will later place a concrete upper bound on $B$ and show that the total length of the list remains polynomial in the size of the SAT instance.

First, we will create two variables $t_i$, $f_i$ for each Boolean variable $x_i$. If we include $t_i$ in our subset, this will correspond to setting $x_i$ to true; similarly, $f_i$ corresponds to $not x_i$.  

Therefore, we will have to enforce the condition that for all $i$, exactly one of $t_i$ and $f_i$ is included in our subset. This can be done by setting the $i$th digit of each of $t_i$, $f_i$, and $T$ to be $1$. 

For instance, if we have three variables $x_1, x_2, x_3$, we transform them into

$$
t_1 &= 100..._B \
f_1 &= 100..._B \
t_2 &= 010..._B \
f_2 &= 010..._B \
t_3 &= 001..._B \
f_3 &= 001..._B \
T &= 111..._B 
$$

> [!note]
> Here we write exponents of $B$ in increasing order from left to right, so $10100_B$ denotes $B^0 + B^2$.

Then, we add an additional bit for each clause in CNF. In particular, if variable $x_i$ is in clause $j$, we set the $n + j$th digit of $t_i$ to 1; resp. $not x_i$ and $f_i$. For instance, if our expression is
$$
(x_1 or x_2) and (x_1 or not x_2 or not x_3)
$$

our $t_i, f_i$ become

$$
t_1 &= 10011_B \
f_1 &= 10000_B \
t_2 &= 01010_B \
f_2 &= 01001_B \
t_3 &= 00100_B \
f_3 &= 00101_B \
$$

Then, our condition for finding a solution is that the 4th and 5th digits of our subset sum are both at least 1. To convert this condition back into hitting an exact target sum, let $k_j$ denote the number of variables in clause $j$. Then, we can just add $k_j - 1$ copies of $B^(n - 1 + j)$ into our list and set our target to 
$$
T = (111...1 k_1 k_2 k_3...k_m)_B
$$

> [!note] Exercise
> Verify that a solution to this subset sum problem exists iff a solution exists to the original SAT instance.

It remains to show that the length of this list of numbers is polynomial in the size of the SAT instance. In order for no overflow to occur, we can choose $B = 2 max_i k_i <= 2n$. 
Note that each number in the list has length $(n + m) log B <= (n + m) log n$, and therefore the total length of the list is bounded by $(2n + sum (k_i - 1)) (n + m) log n in cal(O)("poly"("length of SAT"))$. 

## NP-complete

We call a problem NP-complete if it is both NP and NP-hard.

> [!note] Exercise
> Are all the NP-hard problems listed above NP-complete?

Note that there are problem which are NP-hard but not NP, such as the halting problem.

## Additional resources

The following video provides a really great alternative perspective on P vs NP, framing it instead as "can you efficiently invert an efficient function?" In the [companion blog post](https://vasekrozhon.wordpress.com/2024/08/18/what-p-vs-np-is-actually-about/), Polylog also draws a nice connection to backpropagation.

![](https://www.youtube.com/watch?v=6OPsH8PK7xM)