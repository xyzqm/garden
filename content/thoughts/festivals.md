---
title: "IOI 2025: Festivals"
---
[Problem](https://qoj.ac/problem/13905)

> [!info]- Hint
> Try finding a total order for the coupons.

> [!note]- Solution
> A natural starting point is to try to find a total order for the coupons. This way, we can easily solve the subproblem of checking whether a given subset of coupons is valid by sorting the coupons according to our total order, then simulating.
> 
> Define the break-even value of coupon $i$ as the unique number $F_i$ such that $F_i = (F_i - P_i) dot T_i$. 
> If $T_i = 1$, we set $F_i = infinity$.
> 
> Then, we note that if there exists a total ordering, all coupons with the same break-even price should be considered equivalent. For instance, consider several coupons with the same break-even price of $0$: they will all then be of the form $X prime = X dot T_i$, and therefore will always compose into the transformation $X prime = X product T_i$, no matter how they are ordered. A similar argument holds for other values of $F_i$.
> 
> This motivates a comparator based on $F_i$, and 
> we can actually show that it's always optimal to sort in increasing order of $F_i$. Consider two coupons $1$ and $2$ with $F_1 < F_2$, and a starting value of $X = F_1$: 
> 
> - If we put 1 before 2, we effectively only apply 2 (since by definition, 1 leaves an input of $X = F_1$ unchanged).
> 
> - However, if we put 2 before 1,
>   we first apply 2, which is guaranteed to decrease $X$ since $X = F_1 < F_2$,
>   and then apply 1, which decreases $X$ again since now $X < F_1$.
> 
> Since the slope of the resultant composed coupon is always the same, showing that $1 < 2$ for a single value of $X$ is sufficient to show that $1 < 2$ holds for _all_ values of $X$.
> 
> Now, as long as there exists an $i$ with $F_i <= X$, we can always greedily include it in our subset, 
> so, we now only need to solve the case where all $F_i > X$. We can also assume for now that all $T_i > 1$, since handling $T_i = 1$ is relatively simple.
> 
> Under these constraints, we see that the best case (that allows us to take the most coupons) is when all $F_i = X + 1$ and all $T_i = 2$. However, even in this best case, it turns out we can only take at most $log X$ coupons. To see this, we can again consider "shifting our coordinates" such that $F_i = 0$, like we did when proving that coupons with the same $F_i$ are equivalent. In these shifted coordinates, $X$ starts at $-1$ and becomes $-2^k$ after applying $k$ coupons.
> 
> This allows us to run a simple knapsack #dp in $cal(O) (n log n)$. 
> 
> [Implementation](https://qoj.ac/submission/1417041)
