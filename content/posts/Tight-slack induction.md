---
description: A constructive induction technique for proving sufficiency of certain inequality conditions.
---
## Introduction

```problem
There are $2n$ candies, each with a potentially different color. Determine whether it's possible to split them into $n$ pairs such that no pair contains two candies of the same color.
```

We first note that it's **necessary** for the most frequent candy to appear at most $n$ times, i.e. $max c_i <= n$. To show that this condition is also **sufficient**, we induct on $n$ and split into two cases:
1. *Tight* ($max c_i = n$): We can pair the $n$ same-color candies with all the others.
2. *Loose* ($max c_i < n$): We can pair any two different-color candies, and the condition $max c'_i <= n' = n - 1$ will still hold.
---
The general flow of tight-slack induction is:
1. Derive several **necessary** inequalities.
2. Prove **sufficiency** by induction. When an inequality is *tight*, we must find a forced move and prove its validity; otherwise, we must show that any move is valid.

## Hall's marriage theorem
```problem
When does a bipartite graph have a perfect matching?
```
To first derive some **necessary** conditions, it may help to consider some examples. Draw some graphs that have perfect matchings and some that don't, and think about what makes/breaks them.

> [!note]- The necessary condition
> Consider some subset of nodes on the left side $S$, and denote its **neighborhood** $N(S)$ as the set of right-side nodes that connect to at least one node in $S$. Then, it's necessary that for all $S$, $|S| <= |N(S)|$.

We can now prove sufficiency (by the way, $n$ denotes the number of nodes on each side, so there are there $2n$ nodes in total):

> [!note]- The tight case
> If there exists a subset $S$ of left-side nodes such that $|S| < n$ and $|S| = |N(S)|$, we can perfectly match $S$ to $N(S)$ by induction, then delete both $S$ and $N(S)$ from the graph. Note that the Hall condition still holds for all remaining subsets. In particular, consider a remaining subset $T$. We knew that prior to deletion, $|T union S| = |T| + |S| <= |N(T union S)| = |N'(T)| + |N(S)|$. Since $|S| = |N(S)|$, we can subtract from both sides to see that afterward, $|T| <= |N'(T)|$ still, as desired. 

> [!note]- The slack case
> When all subsets $S$ of left-side nodes with $|S| < n$ satisfy $|S| < |N(S)|$, we can pair any two nodes together and delete both from the graph. This decreases the RHS of each inequality by at most 1, so they all still hold.





